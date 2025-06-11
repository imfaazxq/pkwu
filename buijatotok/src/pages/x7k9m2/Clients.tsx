import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import Navbar from './Navbar'; // Import the separate Navbar component
import axios from 'axios';

interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address: string;
  bookingsCount: number;
}

const Clients: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Check authentication and fetch client data on component mount
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/x7k9m2/Login');
    } else {
      fetchClients();
    }
  }, [isAuthenticated, loading, router]);

  // Fetch clients from API and process them
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`);
      if (response.data) {
        // Process clients to count bookings by phone number
        const clientsMap = new Map<string, Client>();
        
        response.data.forEach((client: any) => {
          // Use phone as unique identifier
          const phone = client.phone;
          
          if (clientsMap.has(phone)) {
            // Increment booking count if client exists
            const existingClient = clientsMap.get(phone)!;
            existingClient.bookingsCount += 1;
            clientsMap.set(phone, existingClient);
          } else {
            // Add new client if not exists
            clientsMap.set(phone, {
              id: client.id,
              name: client.name,
              phone: client.phone,
              email: client.email,
              address: client.address,
              bookingsCount: 1
            });
          }
        });
        
        // Convert map to array
        const uniqueClients = Array.from(clientsMap.values());
        setClients(uniqueClients);
        setFetchError(null);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setFetchError('Failed to load client data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    searchTerm === '' || 
    Object.values(client).some(value => 
      value && typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle client delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data klien ini?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/clients/${id}`);
        // Update local state after successful deletion
        const clientToDelete = clients.find(client => client.id === id);
        if (clientToDelete) {
          // Remove the client from the list
          setClients(clients.filter(client => client.id !== id));
        }
      } catch (err) {
        console.error('Error deleting client:', err);
        alert('Gagal menghapus data klien. Silakan coba lagi.');
      }
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-xl font-semibold text-[#3A5645] mb-2">Loading...</div>
          <div className="text-gray-500">Memeriksa akses</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Global Font Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Montserrat', sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Lora', serif;
        }
      `}</style>

      <Navbar activeMenu="clients" pageTitle="Client Management">
        <main className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 md:p-8">
              {/* Action Button */}
              <div className="flex justify-end mb-6">
                <button 
                  onClick={fetchClients}
                  className="px-4 py-2 bg-[#3A5645] text-white rounded-lg text-sm hover:bg-[#4d705b] transition-colors"
                >
                  Refresh Data
                </button>
              </div>

              {/* Display fetch error if any */}
              {fetchError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  <p>{fetchError}</p>
                </div>
              )}
              
              {/* Search and Client List Section */}
              <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Daftar Klien</h3>
                <div className="w-full md:w-auto">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Cari klien..." 
                      className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A5645] focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5">🔍</div>
                  </div>
                </div>
              </div>

              {filteredClients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredClients.map(client => (
                    <div 
                      key={client.id} 
                      className="bg-[#f8f9fa] p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-center mb-4">
                        <div className="mr-4">
                          <div className="w-12 h-12 rounded-full bg-[#3A5645] text-white flex items-center justify-center">
                            {client.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-base md:text-xl font-medium text-gray-800">{client.name}</h4>
                          <p className="text-xs text-gray-600">{client.phone}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-700">
                          <span className="mr-2">📞</span>
                          {client.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <span className="mr-2">📍</span>
                          {client.address}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm bg-[#3A5645] bg-opacity-10 text-[#3A5645] px-3 py-1 rounded-full">
                          {client.bookingsCount} booking{client.bookingsCount !== 1 ? 's' : ''}
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors duration-200"
                            onClick={() => handleDelete(client.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="text-gray-500">Tidak ada klien yang ditemukan</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </Navbar>
    </>
  );
};

export default Clients;