import React from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import AuthGuard from '../AuthGuard';
import { AuthProvider } from '../../context/AuthContext';
import { IncomeProvider } from '../../context/IncomeContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter(); 
  const isAdminPage = router.pathname.startsWith('/x7k9m2') && router.pathname !== '/x7k9m2/Login';

  return (
    <AuthProvider>
      <IncomeProvider>
        <AnimatePresence mode="wait" initial={false}>
          {isAdminPage ? (
            <AuthGuard>
              <Component {...pageProps} key={router.route} />
            </AuthGuard>
          ) : (
            <Component {...pageProps} />
          )}
        </AnimatePresence>
      </IncomeProvider>
    </AuthProvider>
  );
}

export default MyApp;