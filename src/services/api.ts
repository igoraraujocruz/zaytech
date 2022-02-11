import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from './hooks/useAuth';

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    authorization: `Bearer ${cookies['zaytech.token']}`,
  },
});

api.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.message === 'Invalid JWT token') {
        cookies = parseCookies();

        const { 'zaytech.token': teste } = cookies;

        console.log(teste);

        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post('/sessions/refresh-token', { teste })
            .then(response => {
              const { token } = response.data;

              setCookie(undefined, 'zaytech.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
              });

              setCookie(
                undefined,
                'zaytech.refreshToken',
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30,
                  path: '/',
                },
              );

              api.defaults.headers.common.authorization = `Bearer ${token}`;

              failedRequestsQueue.forEach(request => request.onSuccess(token));
              failedRequestsQueue = [];
            })
            .catch(err => {
              failedRequestsQueue.forEach(request => request.onFailure(err));
              failedRequestsQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers.authorization = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      }
      signOut();
    }

    return Promise.reject(error);
  },
);
