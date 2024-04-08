// _app.js

import { SessionProvider } from 'next-auth/react';
import { ThemeLayout } from '../components/layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeLayout>
        <Component {...pageProps} />
      </ThemeLayout>
    </SessionProvider>
  );
}

export default MyApp;
