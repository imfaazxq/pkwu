import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface TestimonialItem {
  id: string;
  name: string;
  position: string;
  text: string;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected';
}

interface MediaModalProps {
  isOpen: boolean;
  testimonial: TestimonialItem | null;
  onClose: () => void;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ isOpen, testimonial, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && testimonial?.media_type === 'video' && videoRef.current) {
      videoRef.current.play();
    }
  }, [isOpen, testimonial]);

  if (!isOpen || !testimonial) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
          >
            ×
          </button>

          {/* Media content */}
          <div className="relative">
            {testimonial.media_type === 'image' ? (
              <img
                src={testimonial.media_url.replace('http://localhost/', 'http://localhost:8000/')}
                alt={testimonial.name}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                src={testimonial.media_url.replace('http://localhost/', 'http://localhost:8000/')}
                controls
                className="w-full h-auto max-h-[70vh] object-contain"
                autoPlay
              />
            )}
          </div>

          {/* Testimonial info */}
          <div className="p-6">
            <p className="text-lg text-gray-700 italic mb-4">
              "{testimonial.text}"
            </p>
            <h3 className="text-xl font-bold mb-1">
              {testimonial.name}
            </h3>
            <p className="text-gray-600">
              {testimonial.position}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative max-w-md w-full bg-white rounded-lg overflow-hidden shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            {/* Success Message */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Testimoni Berhasil Dikirim!
            </h3>
            <p className="text-gray-600 mb-6">
              Terima kasih telah berbagi pengalaman Anda. Testimoni Anda akan ditinjau oleh admin dan akan ditampilkan setelah disetujui.
            </p>
            
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm text-blue-800">
                    <strong>Proses Persetujuan:</strong>
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Admin akan meninjau testimoni Anda dalam beberapa waktu. Tunggu sampai Testimoni mu di setujui
                  </p>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-[#1D5024] text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Testimoni: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    position: '',
    text: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      // Menggunakan endpoint public yang hanya mengembalikan testimoni yang sudah approved
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/public`);
      
      // Pastikan hanya testimoni yang approved yang ditampilkan
      const approvedTestimonials = response.data.filter((testimonial: TestimonialItem) => 
        testimonial.status === 'approved'
      );
      setTestimonials(approvedTestimonials);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (testimonials.length === 0) return;
    
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result as string);
        setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaClick = (testimonial: TestimonialItem) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.[0]) {
      alert('Please select an image or video');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', newTestimonial.name);
      formData.append('position', newTestimonial.position);
      formData.append('text', newTestimonial.text);
      formData.append('media', fileInputRef.current.files[0]);
      // Pastikan status diset sebagai 'pending' untuk review admin
      formData.append('status', 'pending');
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('Testimonial submitted successfully:', response.data);
      
      // TIDAK menambahkan ke testimonials list karena masih pending approval
      // Hanya testimoni yang sudah approved yang akan ditampilkan di halaman public
      
      // Reset form
      setNewTestimonial({ name: '', position: '', text: '' });
      setMediaPreview(null);
      setShowForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      alert('Failed to submit testimonial. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewTestimonial({ name: '', position: '', text: '' });
    setMediaPreview(null);
    setShowForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="py-16 px-4 min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D5024] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-4 min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchTestimonials}
            className="mt-4 px-4 py-2 bg-[#1D5024] text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentTestimonial = testimonials.length > 0 ? testimonials[currentIndex] : null;

  return (
    <div className="py-8 md:py-16 px-4 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12">Testimoni Client</h1>
        
        {/* View Mode Toggle - Only show if there are approved testimonials */}
        {testimonials.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-[#1D5024] text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Carousel View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#1D5024] text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                All Testimonials
              </button>
            </div>
          </div>
        )}

        {/* Carousel View */}
        {viewMode === 'carousel' && (
          <>
            {currentTestimonial ? (
              <div className="relative w-full max-w-xl md:max-w-3xl mx-auto flex flex-col items-center justify-center">
                {/* Navigation buttons */}
                <button 
                  onClick={() => handleNavigation('prev')}
                  className="absolute top-1/2 -left-5 -translate-y-1/2 rounded-full w-10 h-10 flex items-center justify-center bg-gray-500 text-white hover:opacity-90 z-10"
                >
                  ←
                </button>
                
                <button 
                  onClick={() => handleNavigation('next')}
                  className="absolute top-1/2 -right-5 -translate-y-1/2 rounded-full w-10 h-10 flex items-center justify-center bg-[#1D5024] text-white hover:opacity-90 z-10"
                >
                  →
                </button>

                {/* Testimonial content */}
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Media content */}
                  <div 
                    className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden mb-4 md:mb-6 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleMediaClick(currentTestimonial)}
                  >
                    {currentTestimonial.media_type === 'image' ? (
                      currentTestimonial.media_url.includes('localhost') || currentTestimonial.media_url.includes('127.0.0.1') ? (
                        <img
                          src={currentTestimonial.media_url.replace('http://localhost/', 'http://localhost:8000/')}
                          alt={currentTestimonial.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/150x150?text=No+Image';
                          }}
                        />
                      ) : (
                        <Image
                          src={currentTestimonial.media_url}
                          alt={currentTestimonial.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      )
                    ) : (
                      <video 
                        src={currentTestimonial.media_url.replace('http://localhost/', 'http://localhost:8000/')}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    )}
                    {/* Play icon for videos */}
                    {currentTestimonial.media_type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="w-6 h-6 text-white">▶</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Testimonial text */}
                  <p className="text-base md:text-lg text-gray-700 italic mb-3 md:mb-4 max-w-xl md:max-w-2xl px-4">
                    "{currentTestimonial.text}"
                  </p>
                  
                  {/* Name */}
                  <h3 className="text-lg md:text-xl font-bold mb-1">
                    {currentTestimonial.name}
                  </h3>
                  
                  {/* Position */}
                  <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
                    {currentTestimonial.position}
                  </p>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Belum ada testimoni yang disetujui. Jadilah yang pertama menambahkan testimoni!</p>
              </div>
            )}
            
            {/* Pagination dots */}
            {testimonials.length > 0 && (
              <div className="flex justify-center mt-4 gap-1">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-[#1D5024]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {testimonials.length > 0 ? testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Media */}
                <div 
                  className="w-20 h-20 relative rounded-full overflow-hidden mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleMediaClick(testimonial)}
                >
                  {testimonial.media_type === 'image' ? (
                    testimonial.media_url.includes('localhost') || testimonial.media_url.includes('127.0.0.1') ? (
                      <img
                        src={testimonial.media_url.replace('http://localhost/', 'http://localhost:8000/')}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150x150?text=No+Image';
                        }}
                      />
                    ) : (
                      <Image
                        src={testimonial.media_url}
                        alt={testimonial.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    )
                  ) : (
                    <video 
                      src={testimonial.media_url.replace('http://localhost/', 'http://localhost:8000/')}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  )}
                  {/* Play icon for videos */}
                  {testimonial.media_type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="w-4 h-4 text-white">▶</div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <p className="text-gray-700 italic mb-3 text-sm line-clamp-3">
                    "{testimonial.text}"
                  </p>
                  <h3 className="font-bold mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {testimonial.position}
                  </p>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">Belum ada testimoni yang disetujui. Jadilah yang pertama menambahkan testimoni!</p>
              </div>
            )}
          </div>
        )}
        
        {/* Add testimonial button */}
        <div className="flex justify-center mt-4 md:mt-6">
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="px-3 py-2 md:px-4 md:py-2 bg-[#1D5024] text-white text-sm rounded-lg hover:bg-opacity-90 transition-all"
          >
            {showForm ? 'Batal' : 'Tambahkan Testimoni Anda'}
          </button>
        </div>
        
        {/* Add testimonial form */}
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 md:mt-8 w-full max-w-xl md:max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8"
          >
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Bagikan Pengalaman Anda</h3>
            
            <form onSubmit={handleSubmit}>
              {/* Media Upload */}
              <div className="mb-4 md:mb-6 flex flex-col items-center">
                <label className="block text-gray-700 mb-2">Foto atau Video Anda</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#1D5024] transition-colors"
                >
                  {mediaPreview ? (
                    mediaType === 'image' ? (
                      <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <video src={mediaPreview} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="text-center p-2 md:p-4">
                      <div className="w-6 h-6 md:w-10 md:h-10 mx-auto text-gray-400">+</div>
                      <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-500">Klik untuk upload</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  ref={fileInputRef}
                  onChange={handleMediaChange}
                  className="hidden"
                />
              </div>
              
              <div className="mb-3 md:mb-4">
                <label className="block text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={newTestimonial.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D5024]"
                />
              </div>
              
              <div className="mb-3 md:mb-4">
                <label className="block text-gray-700 mb-2">Posisi / Asal</label>
                <input
                  type="text"
                  name="position"
                  value={newTestimonial.position}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D5024]"
                />
              </div>
              
              <div className="mb-4 md:mb-6">
                <label className="block text-gray-700 mb-2">Testimoni Anda</label>
                <textarea
                  name="text"
                  value={newTestimonial.text}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D5024]"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 md:px-4 md:py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-3 py-2 md:px-4 md:py-2 bg-[#1D5024] text-white text-sm rounded-lg hover:bg-opacity-90 transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Mengirim...' : 'Kirim Testimoni'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Media Modal */}
      <MediaModal
        isOpen={isModalOpen}
        testimonial={selectedTestimonial}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default Testimoni;