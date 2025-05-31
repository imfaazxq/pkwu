import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Fungsi untuk memeriksa apakah pengguna terautentikasi
    const authCheck = () => {
      // Jika masih loading, tunggu
      if (loading) return;

      // Jika tidak terotentikasi dan bukan di halaman login
      if (!isAuthenticated && router.pathname !== '/Admin/Login') {
        router.push('/Admin/Login');
      } else {
        setAuthorized(true);
      }
    };

    // Jalankan pengecekan autentikasi
    authCheck();

    // Set up listener untuk perubahan rute
    const preventAccess = () => setAuthorized(false);
    router.events.on('routeChangeStart', preventAccess);

    // Re-check auth saat rute berubah (selesai)
    router.events.on('routeChangeComplete', authCheck);

    // Cleanup event listeners
    return () => {
      router.events.off('routeChangeStart', preventAccess);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [isAuthenticated, loading, router]);

  // Tampilkan loading screen saat memeriksa auth atau berpindah halaman
  if (loading || !authorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3A5645] mx-auto"></div>
          <p className="mt-4 text-gray-700">Memuat...</p>
        </div>
      </div>
    );
  }

  // Jika sudah terautentikasi, tampilkan konten halaman
  return <>{children}</>;
};

export default AuthGuard;