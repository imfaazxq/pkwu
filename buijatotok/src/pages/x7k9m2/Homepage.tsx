import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import Navbar from './Navbar';

// Interfaces
interface Booking {
  id: number;
  name: string;
  phone: string;
  address: string;
  complaint: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  age: number;
  gender: string;
  profileImage: string;
  bookingsCount: number;
}

const Homepage: React.FC = () => {
  const { admin, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('Selamat Datang');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/Admin/Login');
    }
  }, [isAuthenticated, loading, router]);

  // Update greeting based on time of day
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 11) {
      setGreeting('Selamat Pagi');
    } else if (hour < 15) {
      setGreeting('Selamat Siang');
    } else if (hour < 18) {
      setGreeting('Selamat Sore');
    } else {
      setGreeting('Selamat Malam');
    }
  }, [currentTime]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch initial data (simulated)
  useEffect(() => {
    // Simulated data fetch
    setRecentBookings([
      { 
        id: 1, 
        name: 'John Doe', 
        phone: '08123456789', 
        address: 'Jakarta', 
        complaint: 'Stress', 
        date: '2023-06-15', 
        time: '10:00', 
        status: 'pending' 
      }
    ]);

    setClients([
      {
        id: 1,
        name: 'John Doe',
        phone: '08123456789',
        email: 'john@example.com',
        address: 'Jakarta',
        age: 35,
        gender: 'Male',
        profileImage: '',
        bookingsCount: 3
      }
    ]);

    setStats({
      totalBookings: 10,
      pendingBookings: 3,
      completedBookings: 7
    });
  }, []);

  // Show loading or redirect if not authenticated
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Return null to prevent flash of content before redirect
  }

  return (
    <Navbar activeMenu="dashboard" pageTitle="Dashboard">
      <main className="p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-[#3A5645] to-[#5d8a70] flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 text-center p-4 md:p-8">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{greeting}, Admin!</h2>
              <p className="text-white text-sm md:text-lg opacity-90">Siap menyebarkan kebaikan melalui kesehatan dan pemulihan?</p>
            </div>
          </div>
          
          <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6 md:mb-10">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Perjalanan Pemulihan Dimulai di Sini</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Setiap langkah yang Anda ambil di panel admin ini adalah bagian dari perjalanan pemulihan klien. 
                  Dengan tangan penyembuh dan hati yang penuh empati, Anda membawa perubahan bagi mereka yang membutuhkan.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
                <div className="bg-[#f8f9fa] p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl md:text-3xl mr-3">📅</span>
                    <h4 className="text-base md:text-xl font-medium text-gray-800">Jadwal Terapi</h4>
                  </div>
                  <p className="text-xs md:text-base text-gray-600">
                    Kelola jadwal terapi dengan mudah dan temukan waktu yang tepat untuk setiap klien.
                  </p>
                </div>
                
                <div className="bg-[#f8f9fa] p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl md:text-3xl mr-3">👥</span>
                    <h4 className="text-base md:text-xl font-medium text-gray-800">Profil Klien</h4>
                  </div>
                  <p className="text-xs md:text-base text-gray-600">
                    Pahami kebutuhan unik setiap klien untuk memberikan perawatan yang personal.
                  </p>
                </div>
                
                <div className="bg-[#f8f9fa] p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl md:text-3xl mr-3">📈</span>
                    <h4 className="text-base md:text-xl font-medium text-gray-800">Kemajuan</h4>
                  </div>
                  <p className="text-xs md:text-base text-gray-600">
                    Pantau dan rayakan setiap kemajuan dalam perjalanan pemulihan klien.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <blockquote className="italic text-gray-700 text-sm md:text-lg border-l-4 border-[#3A5645] pl-4 py-2 mb-4 md:mb-6">
                  "Kesembuhan sejati terjadi ketika hati, jiwa, dan tubuh menemukan harmoni."
                </blockquote>
                <p className="text-xs md:text-base text-gray-600">
                  Setiap hari adalah kesempatan baru untuk membawa perubahan positif bagi klien Anda.
                  <br />Mari mulai hari ini dengan energi dan empati.
                </p>
                <button 
                  className="mt-6 md:mt-8 bg-[#3A5645] hover:bg-[#4d705b] text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1" 
                  onClick={() => router.push("/Admin/Bookings")}
                >
                  Lihat Jadwal Hari Ini
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Navbar>
  );
};

export default Homepage;