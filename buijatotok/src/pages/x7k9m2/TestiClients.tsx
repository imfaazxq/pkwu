import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import Navbar from './Navbar';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  text: string;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

const TestiClient: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [updateLoading, setUpdateLoading] = useState<number | null>(null);

  // Check authentication and fetch testimonial data on component mount
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/x7k9m2/Login');
    } else if (isAuthenticated) {
      fetchTestimonials();
    }
  }, [isAuthenticated, loading, router]);

  // Fetch testimonials from API - Get ALL testimonials for admin
  const fetchTestimonials = async () => {
    setIsLoading(true);
    setFetchError(null);
    
    try {
      // Check if API URL is defined
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API URL is not configured. Please check your environment variables.');
      }

      console.log('Fetching from:', `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`);
      
      // Use admin endpoint to get all testimonials regardless of status
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200 && response.data) {
        // Handle different possible response structures
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        // Ensure all testimonials have a status field
        const testimonialsWithStatus = data.map((testimonial: any) => ({
          ...testimonial,
          status: testimonial.status || 'pending' // Default to pending if no status
        }));
        setTestimonials(testimonialsWithStatus);
        console.log('Testimonials loaded:', testimonialsWithStatus.length);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err: any) {
      console.error('Error fetching testimonials:', err);
      
      let errorMessage = 'Failed to load testimonials.';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = `Server error: ${err.response.status} - ${err.response.data?.message || err.message}`;
      } else if (err.request) {
        // Request made but no response received
        errorMessage = 'No response from server. Please check your connection and server status.';
      } else if (err.message) {
        // Error in request setup
        errorMessage = err.message;
      }
      
      setFetchError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to fix media URL
  const getFixedMediaUrl = (url: string) => {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      return url.replace('http://localhost/', 'http://localhost:8000/');
    }
    return url;
  };

  // Filter testimonials based on search term and status
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = searchTerm === '' || 
      Object.values(testimonial).some(value => 
        value && typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesFilter = filter === 'all' || testimonial.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Get counts for each status
  const statusCounts = {
    all: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    rejected: testimonials.filter(t => t.status === 'rejected').length,
  };

  // Handle testimonial status change
  const handleStatusChange = async (id: number, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API URL is not defined');
      }
      
      setUpdateLoading(id);
      console.log('Updating testimonial status:', id, newStatus);
      
      // Use PUT method to update testimonial status
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${id}`,
        { status: newStatus },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        // Update testimonial status in state
        setTestimonials(prev => 
          prev.map(item => 
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
        console.log('Testimonial status updated successfully');
        
        // Show success message
        const statusText = {
          pending: 'dikembalikan ke status menunggu',
          approved: 'disetujui',
          rejected: 'ditolak'
        };
        alert(`Testimoni berhasil ${statusText[newStatus]}!`);
      }
      
    } catch (err: any) {
      console.error('Error updating testimonial status:', err);
      
      let errorMessage = 'Failed to update testimonial status.';
      if (err.response?.data?.message) {
        errorMessage += ` ${err.response.data.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setUpdateLoading(null);
    }
  };

  // Handle testimonial delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus testimonial ini?')) {
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error('API URL is not defined');
        }
        
        setUpdateLoading(id);
        console.log('Deleting testimonial:', id);
        
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${id}`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              // Add authorization header if needed
              // 'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.status === 200 || response.status === 204) {
          // Update local state after successful deletion
          setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
          console.log('Testimonial deleted successfully');
          alert('Testimoni berhasil dihapus!');
        }
        
      } catch (err: any) {
        console.error('Error deleting testimonial:', err);
        
        let errorMessage = 'Gagal menghapus testimonial.';
        if (err.response?.data?.message) {
          errorMessage += ` ${err.response.data.message}`;
        }
        
        alert(errorMessage);
      } finally {
        setUpdateLoading(null);
      }
    }
  };

  // Open media viewer
  const openMediaViewer = (testimonial: Testimonial) => {
    const fixedUrl = getFixedMediaUrl(testimonial.media_url);
    setSelectedMedia({ url: fixedUrl, type: testimonial.media_type });
  };

  // Close media viewer
  const closeMediaViewer = () => {
    setSelectedMedia(null);
  };

  // Show loading state while checking authentication
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A5645] mx-auto"></div>
          <div className="text-xl font-semibold text-[#3A5645] mt-4 mb-2">Loading...</div>
          <div className="text-gray-500">
            {loading ? 'Memeriksa akses' : 'Memuat data testimonial'}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Return null to prevent flash of content before redirect
  }

  return (
    <Navbar activeMenu="testimonial" pageTitle="Testimoni Management">
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

      <main className="p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 md:p-8">
            {/* Display fetch error if any */}
            {fetchError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p className="font-medium">Error:</p>
                <p>{fetchError}</p>
                <button 
                  onClick={fetchTestimonials}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            )}
            
            {/* Header with Status Summary */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Manajemen Testimoni
                </h3>
                <button 
                  onClick={fetchTestimonials}
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#3A5645] text-white rounded-lg text-sm hover:bg-[#4d705b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Loading...' : 'Refresh Data'}
                </button>
              </div>
              
              {/* Status Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
                  <div className="text-sm text-blue-800">Total Testimoni</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
                  <div className="text-sm text-yellow-800">Menunggu Review</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
                  <div className="text-sm text-green-800">Disetujui</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
                  <div className="text-sm text-red-800">Ditolak</div>
                </div>
              </div>
            </div>
            
            {/* Search and Filter Section */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Cari testimoni..." 
                    className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A5645] focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5">🔍</div>
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A5645] focus:border-transparent"
                >
                  <option value="all">Semua Status ({statusCounts.all})</option>
                  <option value="pending">Menunggu ({statusCounts.pending})</option>
                  <option value="approved">Disetujui ({statusCounts.approved})</option>
                  <option value="rejected">Ditolak ({statusCounts.rejected})</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Menampilkan {filteredTestimonials.length} dari {testimonials.length} testimoni
              </div>
            </div>

            {!fetchError && filteredTestimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredTestimonials.map(testimonial => (
                  <div 
                    key={testimonial.id} 
                    className={`bg-[#f8f9fa] p-4 md:p-6 rounded-lg shadow-sm border-2 transform transition-all duration-300 hover:shadow-md ${
                      testimonial.status === 'pending' ? 'border-yellow-300 bg-yellow-50' :
                      testimonial.status === 'approved' ? 'border-green-300 bg-green-50' :
                      testimonial.status === 'rejected' ? 'border-red-300 bg-red-50' :
                      'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="mr-4 cursor-pointer" onClick={() => openMediaViewer(testimonial)}>
                        <div className="w-12 h-12 rounded-full overflow-hidden relative">
                          {testimonial.media_type === 'image' ? (
                            <img 
                              src={getFixedMediaUrl(testimonial.media_url)}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/48x48?text=IMG';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                              <video 
                                src={getFixedMediaUrl(testimonial.media_url)}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                preload="metadata"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                <span className="text-white text-sm">▶</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base md:text-xl font-medium text-gray-800 truncate">{testimonial.name}</h4>
                        <p className="text-xs text-gray-600 truncate">{testimonial.position}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 line-clamp-3">"{testimonial.text}"</p>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex space-x-2">
                        {testimonial.status === 'pending' && (
                          <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                            ⏳ Menunggu
                          </span>
                        )}
                        {testimonial.status === 'approved' && (
                          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            ✅ Disetujui
                          </span>
                        )}
                        {testimonial.status === 'rejected' && (
                          <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                            ❌ Ditolak
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {new Date(testimonial.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex space-x-2">
                        {testimonial.status === 'pending' && (
                          <>
                            <button 
                              className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors duration-200 disabled:opacity-50"
                              onClick={() => handleStatusChange(testimonial.id, 'approved')}
                              disabled={updateLoading === testimonial.id}
                              title="Setujui"
                            >
                              {updateLoading === testimonial.id ? '⏳' : '✓'}
                            </button>
                            <button 
                              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200 disabled:opacity-50"
                              onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                              disabled={updateLoading === testimonial.id}
                              title="Tolak"
                            >
                              {updateLoading === testimonial.id ? '⏳' : '✕'}
                            </button>
                          </>
                        )}
                        {testimonial.status !== 'pending' && (
                          <button 
                            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50"
                            onClick={() => handleStatusChange(testimonial.id, 'pending')}
                            disabled={updateLoading === testimonial.id}
                            title="Kembalikan ke Status Menunggu"
                          >
                            {updateLoading === testimonial.id ? '⏳' : '↻'}
                          </button>
                        )}
                        <button 
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200 disabled:opacity-50"
                          onClick={() => handleDelete(testimonial.id)}
                          disabled={updateLoading === testimonial.id}
                          title="Hapus"
                        >
                          {updateLoading === testimonial.id ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !fetchError ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-500">
                  {searchTerm || filter !== 'all' 
                    ? 'Tidak ada testimoni yang sesuai dengan filter pencarian'
                    : 'Belum ada testimoni yang tersedia'
                  }
                </div>
                {(searchTerm || filter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('all');
                    }}
                    className="mt-2 px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeMediaViewer}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeMediaViewer}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all z-10"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {selectedMedia.type === 'image' ? (
              <img 
                src={selectedMedia.url} 
                alt="Full size preview" 
                className="max-w-full max-h-[85vh] object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                }}
              />
            ) : (
              <video 
                src={selectedMedia.url} 
                controls 
                autoPlay 
                className="max-w-full max-h-[85vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </Navbar>
  );
};

export default TestiClient;