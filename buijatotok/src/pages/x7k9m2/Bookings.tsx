import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import { useIncome } from '../../../context/IncomeContext';
import axios from 'axios';
import Navbar from './Navbar';
// Import receipt generator functions
import { generateAndDownloadReceipt, previewReceipt, createTherapyItems } from '../utils/receiptGenerator';

interface TherapyItem {
  type: string;
  quantity: number;
  pricePerSession: number;
  total: number;
}

interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  complaint: string;
  status: 'on progress' | 'selesai';
  completedDate?: string;
  payment?: number;
  therapyItems?: TherapyItem[]; // New: array of therapy items
  therapistName?: string;
  notes?: string;
  receiptNumber?: string;
  // Legacy fields for backward compatibility
  therapyType?: string;
  quantity?: number;
}

const Bookings: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth(); 
  const { refreshIncomeData } = useIncome();
  const [activeTab, setActiveTab] = useState<'all' | 'on progress' | 'selesai'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [completedDate, setCompletedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // New states for multiple therapy items
  const [therapyItems, setTherapyItems] = useState<Array<{type: string, quantity: number, price: number}>>([
    { type: '', quantity: 1, price: 0 }
  ]);
  const [therapistName, setTherapistName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Check authentication and fetch client data on component mount
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/Admin/Login');
    } else if (!loading && isAuthenticated) {
      fetchClients();
    }
  }, [isAuthenticated, loading, router]);

  // Fetch clients from API
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`);
      
      if(response.data) {
        // Map the response data to match our Client interface
        const clientsData = response.data.map((client: any) => ({
          ...client,
          status: client.status || 'on progress', // Default to "on progress" if status is not set
        }));
        setClients(clientsData);
        setFetchError(null);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setFetchError('Failed to load client data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter clients based on active tab and search term
  const filteredClients = clients.filter(client => {
    const matchesTab = 
      activeTab === 'all' || 
      activeTab === client.status;
    
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Status badge styling
  const getStatusBadgeClass = (status: Client['status']) => {
    switch (status) {
      case 'on progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'selesai':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle therapy item changes
  const addTherapyItem = () => {
    setTherapyItems([...therapyItems, { type: '', quantity: 1, price: 0 }]);
  };

  const removeTherapyItem = (index: number) => {
    if (therapyItems.length > 1) {
      setTherapyItems(therapyItems.filter((_, i) => i !== index));
    }
  };

  const updateTherapyItem = (index: number, field: string, value: string | number) => {
    const updatedItems = therapyItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setTherapyItems(updatedItems);
  };

  // Calculate total payment from therapy items
  const calculateTotalPayment = () => {
    return therapyItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  // Handle client edit
  const handleEdit = (client: Client) => {
    setCurrentClient(client);
    setCompletedDate(client.completedDate || new Date().toISOString().split('T')[0]);
    
    // Set therapy items from client data
    if (client.therapyItems && client.therapyItems.length > 0) {
      setTherapyItems(client.therapyItems.map(item => ({
        type: item.type,
        quantity: item.quantity,
        price: item.pricePerSession
      })));
    } else if (client.therapyType) {
      // Handle legacy single therapy
      setTherapyItems([{
        type: client.therapyType,
        quantity: client.quantity || 1,
        price: client.payment ? (client.payment / (client.quantity || 1)) : 0
      }]);
    } else {
      // Reset to default
      setTherapyItems([{ type: '', quantity: 1, price: 0 }]);
    }
    
    setTherapistName(client.therapistName || '');
    setNotes(client.notes || '');
    
    setShowEditModal(true);
  };

  // Handle client delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data klien ini?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/clients/${id}`);
        // Update local state after successful deletion
        setClients(clients.filter(client => client.id !== id));
      } catch (err) {
        console.error('Error deleting client:', err);
        alert('Gagal menghapus data klien. Silakan coba lagi.');
      }
    }
  };

  // Complete client progress
  const handleComplete = async () => {
    if (!currentClient) return;
    
    // Validate therapy items
    const validTherapyItems = therapyItems.filter(item => 
      item.type.trim() !== '' && item.quantity > 0 && item.price > 0
    );
    
    if (validTherapyItems.length === 0) {
      alert('Harap isi minimal satu jenis terapi dengan lengkap');
      return;
    }
    
    try {
      const createdTherapyItems = createTherapyItems(validTherapyItems);
      const totalPayment = calculateTotalPayment();
      
      const updatedClient = {
        ...currentClient,
        status: 'selesai' as const,
        completedDate,
        payment: totalPayment,
        therapyItems: createdTherapyItems,
        therapistName: therapistName || 'Tim Terapis Profesional',
        notes: notes || ''
      };
      
        console.log('Data yang akan dikirim ke API:', updatedClient);
  console.log('TherapyItems yang akan dikirim:', createdTherapyItems);
      // Send update to API
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/clients/${currentClient.id}`, updatedClient);
      
      // Update local state after successful update
      const updatedClients = clients.map(client => {
        if (client.id === currentClient.id) {
          return updatedClient;
        }
        return client;
      });
      
      setClients(updatedClients);
      setShowEditModal(false);
      
      // Reset form
      setTherapyItems([{ type: '', quantity: 1, price: 0 }]);
      setTherapistName('');
      setNotes('');
      
      // Refresh income data in the IncomeContext to include the new payment
      refreshIncomeData();
    } catch (err) {
      console.error('Error updating client:', err);
      alert('Gagal memperbarui status klien. Silakan coba lagi.');
    }
  };

  // Handle receipt generation
  const handleGenerateReceipt = (client: Client) => {
    generateAndDownloadReceipt(client);
  };

  // Handle receipt preview
  const handlePreviewReceipt = (client: Client) => {
    previewReceipt(client);
  };

  // Show loading state while checking authentication
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-xl font-semibold text-[#3A5645] mb-2">Loading...</div>
          <div className="text-gray-500">Memeriksa akses</div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Navbar activeMenu="bookings" pageTitle="Booking Terapi">
      <main className="p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 md:p-8">
            {/* Display fetch error if any */}
            {fetchError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p>{fetchError}</p>
              </div>
            )}
            
            {/* Search and Filter Section */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm ${
                      activeTab === 'all' 
                        ? 'bg-[#3A5645] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semua
                  </button>
                  <button 
                    onClick={() => setActiveTab('on progress')}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm ${
                      activeTab === 'on progress' 
                        ? 'bg-[#3A5645] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    On Progress
                  </button>
                  <button 
                    onClick={() => setActiveTab('selesai')}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm ${
                      activeTab === 'selesai' 
                        ? 'bg-[#3A5645] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Selesai
                  </button>
                </div>

                <button 
                  onClick={() => {
                    fetchClients();
                    refreshIncomeData(); // Also refresh income data when manually refreshing clients
                  }}
                  className="px-4 py-2 bg-[#3A5645] text-white rounded-lg text-sm hover:bg-[#4d705b] transition-colors"
                >
                  Refresh Data
                </button>
              </div>

              <div className="relative w-full md:w-auto">
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

            {/* Mobile Card View for Clients */}
            <div className="block md:hidden">
              {filteredClients.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredClients.map(client => (
                    <div 
                      key={client.id} 
                      className="bg-[#f8f9fa] p-4 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-base font-medium text-gray-800">{client.name}</h4>
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusBadgeClass(client.status)}`}>
                          {client.status === 'on progress' ? 'On Progress' : 'Selesai'}
                        </span>
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
                        {client.complaint && (
                          <div className="flex items-start text-sm text-gray-700">
                            <span className="mr-2 mt-1">📝</span>
                            <span>{client.complaint}</span>
                          </div>
                        )}
                      </div>
                      
                      {client.status === 'selesai' && (
                        <div className="mb-4">
                          <div className="text-xs text-gray-500">Tanggal Selesai:</div>
                          <div className="text-sm text-gray-900">
                            {client.completedDate ? new Date(client.completedDate).toLocaleDateString('id-ID') : '-'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Pembayaran:</div>
                          <div className="text-sm text-gray-900">
                            {client.payment ? `Rp ${client.payment.toLocaleString('id-ID')}` : '-'}
                          </div>
                          {/* Show therapy items summary */}
                          {client.therapyItems && client.therapyItems.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              <div>Jenis Terapi:</div>
                              {client.therapyItems.map((item, index) => (
                                <div key={index} className="text-sm text-gray-700">
                                  {item.type} ({item.quantity} sesi)
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2">
                        {client.status === 'on progress' ? (
                          <>
                            <button 
                              className="p-1 bg-blue-50 text-blue-500 rounded hover:bg-blue-100 transition-colors duration-200"
                              onClick={() => handleEdit(client)}
                              title="Tandai Selesai"
                            >
                              📝
                            </button>
                            <button 
                              className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors duration-200"
                              onClick={() => handleDelete(client.id)}
                              title="Hapus"
                            >
                              ❌
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors duration-200"
                              onClick={() => handlePreviewReceipt(client)}
                              title="Preview Nota"
                            >
                              👁️
                            </button>
                            <button 
                              className="p-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors duration-200"
                              onClick={() => handleGenerateReceipt(client)}
                              title="Download Nota"
                            >
                              📄
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="text-gray-500">Tidak ada data klien yang sesuai dengan kriteria pencarian</div>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Klien
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nomor Telepon
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alamat
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keluhan
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Info Selesai
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{client.address}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {client.complaint || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(client.status)}`}>
                              {client.status === 'on progress' ? 'On Progress' : 'Selesai'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {client.status === 'selesai' ? (
                              <div>
                                <div className="text-xs text-gray-500">Tanggal Selesai:</div>
                                <div className="text-sm text-gray-900">
                                  {client.completedDate ? new Date(client.completedDate).toLocaleDateString('id-ID') : '-'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Pembayaran:</div>
                                <div className="text-sm text-gray-900">
                                  {client.payment ? `Rp ${client.payment.toLocaleString('id-ID')}` : '-'}
                                </div>
                                {/* Show therapy items summary */}
                                {client.therapyItems && client.therapyItems.length > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    <div>Jenis Terapi:</div>
                                    {client.therapyItems.map((item, index) => (
                                      <div key={index} className="text-sm text-gray-700">
                                        {item.type} ({item.quantity} sesi)
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400">-</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {client.status === 'on progress' ? (
                                <>
                                  <button 
                                    className="p-1 bg-blue-50 text-blue-500 rounded hover:bg-blue-100 transition-colors duration-200"
                                    onClick={() => handleEdit(client)}
                                    title="Tandai Selesai"
                                  >
                                    📝
                                  </button>
                                  <button 
                                    className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors duration-200"
                                    onClick={() => handleDelete(client.id)}
                                    title="Hapus"
                                  >
                                    ❌
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors duration-200"
                                    onClick={() => handlePreviewReceipt(client)}
                                    title="Preview Nota"
                                  >
                                    👁️
                                  </button>
                                  <button 
                                    className="p-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors duration-200"
                                    onClick={() => handleGenerateReceipt(client)}
                                    title="Download Nota"
                                  >
                                    📄
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="text-gray-500">Tidak ada data klien yang sesuai dengan kriteria pencarian</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Edit Modal with Multiple Therapy Items */}
      {showEditModal && currentClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Konfirmasi Penyelesaian Terapi</h2>
            <p className="mb-6">Klien: <span className="font-medium">{currentClient.name}</span></p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#3A5645]"
                    value={completedDate}
                    onChange={(e) => setCompletedDate(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Terapis
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#3A5645]"
                    value={therapistName}
                    onChange={(e) => setTherapistName(e.target.value)}
                    placeholder="Masukkan nama terapis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan Khusus
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#3A5645]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Masukkan catatan khusus (opsional)"
                  />
                </div>
              </div>

              {/* Therapy Items Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Jenis Terapi <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addTherapyItem}
                    className="px-3 py-1 bg-[#3A5645] text-white text-sm rounded hover:bg-[#4d705b] transition-colors"
                  >
                    + Tambah Terapi
                  </button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {therapyItems.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Terapi #{index + 1}
                        </span>
                        {therapyItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTherapyItem(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                            title="Hapus terapi ini"
                          >
                            ❌
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <input
                          type="text"
                          placeholder="Jenis terapi (contoh: Pijat Tradisional)"
                          className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#3A5645]"
                          value={item.type}
                          onChange={(e) => updateTherapyItem(index, 'type', e.target.value)}
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-600">Jumlah Sesi</label>
                            <input
                              type="number"
                              min="1"
                              placeholder="1"
                              className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#3A5645]"
                              value={item.quantity}
                              onChange={(e) => updateTherapyItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-600">Harga per Sesi</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="50000"
                              className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#3A5645]"
                              value={item.price}
                              onChange={(e) => updateTherapyItem(index, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        
                        <div className="text-right mt-2">
                          <span className="text-sm font-medium text-gray-700">
                            Total: Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-[#3A5645] bg-opacity-10 rounded-lg">
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#3A5645]">
                      Total Pembayaran: Rp {calculateTotalPayment().toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Actions */}
            <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setTherapyItems([{ type: '', quantity: 1, price: 0 }]);
                  setTherapistName('');
                  setNotes('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleComplete}
                className="px-6 py-2 bg-[#3A5645] text-white rounded hover:bg-[#4d705b] transition-colors"
              >
                Selesaikan Terapi
              </button>
            </div>
          </div>
        </div>
      )}
    </Navbar>
  );
};

export default Bookings;