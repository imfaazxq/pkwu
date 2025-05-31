import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// Create the auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Konfigurasi axios global
  axios.defaults.baseURL = 'http://localhost:8000';
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['Accept'] = 'application/json';

  // Cek status login
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('admin_token');

        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/api/admin/me');

          if (response.data) {
            setAdmin(response.data);
          } else {
            throw new Error('Invalid token');
          }
        }
      } catch (error) {
        console.warn('Authentication check failed.');
        localStorage.removeItem('admin_token');
        delete axios.defaults.headers.common['Authorization'];
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Fungsi Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/admin/login', { email, password });

      if (!response.data || !response.data.token) {
        throw new Error('Invalid login response');
      }

      // Simpan token ke localStorage
      const { admin, token } = response.data;
      localStorage.setItem('admin_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setAdmin(admin);
      router.push('/x7k9m2/Homepage'); // Redirect setelah login
      return { success: true };
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 422) {
          setError('Email atau password salah. Silakan coba lagi.');
        } else if (error.response.status === 429) {
          setError('Terlalu banyak percobaan login. Silakan coba lagi nanti.');
        } else {
          setError('Terjadi kesalahan. Silakan coba lagi.');
        }
      } else {
        setError('Tidak dapat terhubung ke server.');
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Logout
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/admin/logout');
    } catch (error) {
      console.warn('Logout failed.');
    } finally {
      localStorage.removeItem('admin_token');
      delete axios.defaults.headers.common['Authorization'];
      setAdmin(null);
      router.push('/x7k9m2/Login');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, error, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
