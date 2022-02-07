import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { theme } from '../styles/theme';
import { makeServer } from '../services/mirage';
import { queryClient } from '../services/queryClient';
import { CurrentOrderProvider } from '../services/hooks/useCurrentOrder';

if (process.env.NODE_ENV === 'development') {
  makeServer();
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <CurrentOrderProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </CurrentOrderProvider>
  );
};

export default MyApp;
