import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { AuthTokenError } from '../errors/AuthTokenErro';
import { signOut } from './hooks/useAuth';

let failedRequestsQueue = [];
let isRefreshing = false;

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);
  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['zaytech.token']}`,
    },
  });

  api.interceptors.response.use(
    response => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        if (error.response.data?.message === 'Invalid JWT token') {
          cookies = parseCookies(ctx);
          console.log(cookies);

          const { 'zaytech.refreshToken': refreshToken } = cookies;

          const originalConfig = error.config;
          if (!isRefreshing) {
            isRefreshing = true;
            api
              .post('/sessions/refresh-token', { refreshToken })
              .then(response => {
                const { token } = response.data;

                setCookie(ctx, 'zaytech.token', token, {
                  maxAge: 60 * 60 * 24 * 30,
                  path: '/',
                });

                setCookie(
                  ctx,
                  'zaytech.refreshToken',
                  response.data.refreshToken,
                  {
                    maxAge: 60 * 60 * 24 * 30,
                    path: '/',
                  },
                );

                api.defaults.headers['Authorization'] = `Bearer ${token}`;

                failedRequestsQueue.forEach(request =>
                  request.onSuccess(token),
                );
                failedRequestsQueue = [];
              })
              .catch(err => {
                failedRequestsQueue.forEach(request => request.onFailure(err));
                failedRequestsQueue = [];

                if (process.browser) {
                  signOut();
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers['Authorization'] = `Bearer ${token}`;
                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        }
      } else if (process.browser) {
        signOut();
      } else {
        return Promise.reject(new AuthTokenError());
      }

      return Promise.reject(error);
    },
  );
  return api;
}
