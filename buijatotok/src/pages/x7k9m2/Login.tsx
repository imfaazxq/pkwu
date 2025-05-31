// pages/Admin/Login.tsx
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, error: authError, loading } = useAuth();
  const router = useRouter();

  // Combine errors from context and local state
  const error = authError || localError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Email dan password harus diisi.');
      return;
    }
    
    // Panggil login tanpa async/await
    login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Head>
        <title>Login Admin | Terapi</title>
        <meta name="description" content="Admin login page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Montserrat', sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Lora', serif;
        }
      `}</style>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-[#3A5645] flex items-center justify-center text-white text-4xl">
                T
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Portal</h1>
            <p className="text-gray-600 text-sm">Masuk untuk mengelola terapi dan klien</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3A5645] focus:border-[#3A5645]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3A5645] focus:border-[#3A5645]"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
                loading 
                  ? 'bg-[#5d8a70] cursor-not-allowed' 
                  : 'bg-[#3A5645] hover:bg-[#4d705b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A5645] transform transition-all duration-200 hover:shadow-lg'
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sedang Masuk...
                </>
              ) : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}