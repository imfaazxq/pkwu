import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface FormData {
  name: string;
  phone: string;
  address: string;
  complaint: string;
}

const Booking: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    complaint: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const therapistNumber: string = '6285399086505';

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    
    // Special handling for phone field
    if (name === 'phone') {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, '');
      
      setFormData(prevState => ({
        ...prevState,
        [name]: numericValue
      }));
      
      // Validate phone number
      if (numericValue.length < 10 && numericValue.length > 0) {
        setPhoneError("Nomor telepon minimal 10 digit");
      } else if (numericValue.length > 15) {
        setPhoneError("Nomor telepon maksimal 15 digit");
      } else {
        setPhoneError(null);
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void>=> {
    e.preventDefault();
    
    // Validate phone before submission
    if (!formData.phone || formData.phone.length < 10) {
      setPhoneError("Mohon masukkan nomor telepon yang valid (minimal 10 digit)");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`, formData);
      
      if (response.data.success) {
        setIsBooked(true);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToWhatsApp = (): void => {
    const message = `Assalamu'alaikum Bu, saya ${formData.name}, ingin booking sesi terapi. Saya mengalami keluhan berikut: "${formData.complaint}". Kira-kira kapan dan jam berapa saya bisa konsultasi? Terima kasih.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${therapistNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleBack = (): void => {
    router.back();
  };

  const AnimationContent = () => (
    <div className="relative w-full h-full flex flex-col justify-center items-center text-center px-4 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 lg:w-32 lg:h-32 rounded-full bg-[#3A5645]/10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-[#3A5645]/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-10 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#3A5645]/10 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="z-10 w-full max-w-md bg-white/90 p-6 lg:p-8 rounded-3xl shadow-lg">
        <h3 className="text-2xl lg:text-3xl font-light text-[#3A5645] mb-4">Temukan Ketenangan</h3>
        <p className="text-base lg:text-lg text-[#3A5645]/80 mb-6">Setiap sesi terapi adalah langkah menuju kesejahteraan jiwa dan pikiran Anda</p>
        
        <div className="space-y-4 lg:space-y-6 text-left">
          {[
            { title: "Lingkungan Nyaman", desc: "Terapi dalam suasana yang tenang dan menenangkan" },
            { title: "Pendekatan Personal", desc: "Setiap sesi disesuaikan dengan kebutuhan unik Anda" },
            { title: "Perjalanan Penyembuhan", desc: "Temukan jalan menuju keseimbangan hidup yang lebih baik" }
          ].map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-[#3A5645]/20 flex items-center justify-center">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-[#3A5645]"></div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-[#3A5645] text-sm lg:text-base">{item.title}</h4>
                <p className="text-[#3A5645]/70 text-xs lg:text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 lg:mt-10 text-center">
          <p className="italic text-[#3A5645]/60 text-sm lg:text-base">"Setiap perjalanan penyembuhan dimulai dengan satu langkah kecil"</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-auto relative">
      {/* Back Button - Always visible in top right */}
      <button 
        onClick={handleBack}
        className="absolute top-4 right-4 lg:top-6 lg:right-6 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full shadow-md transition-all flex items-center justify-center"
        aria-label="Kembali ke halaman sebelumnya"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Left Side - Animation Content */}
      <div className="lg:w-3/5 h-auto lg:h-screen bg-cover bg-center flex items-center justify-center" 
           style={{ backgroundImage: "url('/tree-bark-texture.jpg')" }}>
        <div className="hidden lg:block w-full">
          <AnimationContent />
        </div>
      </div>
      
      {/* Right Side - Booking Form */}
      <div className="flex-1 bg-[#3A5645] text-white flex flex-col justify-center p-6 lg:p-12 lg:rounded-l-3xl">
        <div className="w-full max-w-md mx-auto">
          {!isBooked ? (
            <>
              <h2 className="text-2xl lg:text-3xl mb-6 lg:mb-8 text-center">Isi data diri anda!</h2>
              {error && (
                <div className="bg-red-500/20 text-white p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="name" className="text-sm lg:text-base">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-transparent border-b border-white/70 py-2 lg:py-3 text-white text-sm lg:text-base outline-none placeholder-white/50"
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label htmlFor="phone" className="text-sm lg:text-base">
                    Phone <span className="text-xs">(contoh: 08123456789)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Masukkan nomor telepon"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    required
                    className="bg-transparent border-b border-white/70 py-2 lg:py-3 text-white text-sm lg:text-base outline-none placeholder-white/50"
                  />
                  {phoneError && (
                    <p className="text-red-300 text-xs mt-1">{phoneError}</p>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label htmlFor="address" className="text-sm lg:text-base">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Masukkan alamat"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="bg-transparent border-b border-white/70 py-2 lg:py-3 text-white text-sm lg:text-base outline-none placeholder-white/50"
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label htmlFor="complaint" className="text-sm lg:text-base">Keluhan</label>
                  <textarea
                    id="complaint"
                    name="complaint"
                    placeholder="Masukkan keluhan anda"
                    value={formData.complaint}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="bg-transparent border-b border-white/70 py-2 lg:py-3 text-white text-sm lg:text-base outline-none placeholder-white/50 resize-none"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full mt-6 lg:mt-8 py-3 lg:py-4 bg-white/20 rounded-full text-white text-sm lg:text-base cursor-pointer transition-colors hover:bg-white/30 flex justify-center items-center"
                  disabled={isLoading || !!phoneError}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white/30 rounded-full border-t-white animate-spin"></div>
                  ) : "Booking now"}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-xl lg:text-2xl font-semibold">Booking Successful!</h2>
              <p className="mt-2 text-sm lg:text-base">Thank you for your booking, {formData.name}.</p>
              <button 
                onClick={redirectToWhatsApp}
                className="mt-6 lg:mt-8 px-4 lg:px-6 py-3 lg:py-4 bg-[#25D366] hover:bg-[#128C7E] rounded-full text-white text-sm lg:text-base transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 lg:w-5 lg:h-5 mr-2" fill="white" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
                Contact Therapist via WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;