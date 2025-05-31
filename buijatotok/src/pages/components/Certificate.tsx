import React, { useState } from 'react';

interface CertificateItemProps {
  image: string;
  title: string;
  description: string;
  onClick: () => void;
}

const CertificateItem: React.FC<CertificateItemProps> = ({ image, title, description, onClick }) => {
  return (
    <div className="flex flex-col items-center min-w-[200px] mx-3 bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="mb-2 h-32 w-full overflow-hidden cursor-pointer" 
        onClick={onClick}
      >
        <img src={image} alt={title} className="h-full w-full object-cover hover:opacity-90 transition-opacity" />
      </div>
      <div className="px-2 pb-4 w-full flex flex-col h-40">
        <h3 className="text-sm font-bold text-center mb-2">{title}</h3>
        <p className="text-xs text-[#58595B] text-center flex-grow mb-3">{description}</p>
        <div className="flex justify-center mt-auto mb-2">

        </div>
      </div>
    </div>
  );
};

interface ImageModalProps {
  isOpen: boolean;
  image: string;
  title: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, image, title, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto p-2" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-2xl font-bold hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        <div className="max-h-[80vh] overflow-hidden">
          <img src={image} alt={title} className="max-w-full max-h-[75vh] object-contain mx-auto" />
        </div>
      </div>
    </div>
  );
};

const Certificate: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{ image: string; title: string } | null>(null);

  const certificates = [
    {
      image: "/sertifikat/phi_hypno.jpg",
      title: "Sertifikat Profesional Hypnotherapi",
      description: "Sertifikat ini menunjukkan pengalaman sebagai profesional hypnotherapi yang sertifikasi dari Lembaga PHI."
    },
    {
      image: "/sertifikat/motiva.jpg",
      title: "Sertifikat Training For Trainer & Motivator",
      description: "Sertifikat ini membuktikan kemampuan dalam memberikan pelatihan dan motivasi dengan teknik profesional."
    },
    {
      image: "/sertifikat/paz.jpg",
      title: "Sertifikat Pelatihan Paz",
      description: "Sertifikat ini menunjukkan bukti kompetensi dalam bidang Paz yang diterbitkan pada tahun 2022."
    },
    {
      image: "/sertifikat/ijazah.jpg",
      title: "Ijazah Nasional Kursus",
      description: "Sertifikat Ijazah Nasional Akupuntur dengan tingkat tertentu."
    },
    {
      image: "/sertifikat/pemateri.jpg",
      title: "Sertifikat Sebagai Pemateri Dalam Pelatihan",
      description: "Sertifikat ini bukti bahwa saya pernah mengikuti pelatihan profesional."
    },
    {
      image: "/sertifikat/postnatal.jpg",
      title: "Sertifikat Postnatal",
      description: "Sertifikat pelatihan postnatal untuk perawatan ibu setelah melahirkan."
    },
    {
      image: "/sertifikat/mom_baby.jpg",
      title: "Sertifikat Mom & Baby",
      description: "Sertifikat pelatihan khusus untuk perawatan ibu dan bayi."
    }
  ];

  const handleImageClick = (image: string, title: string) => {
    setSelectedImage({ image, title });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen w-full py-6" style={{ 
      backgroundImage: "url('/images/bg-sertifikat.png')", 
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }}>
      <div className="max-w-5xl mx-auto px-2">
        <div className="py-4 px-2 rounded-lg mb-6">
          <h2 className="text-3xl md:text-4xl montserrat font-bold text-center mb-5">CERTIFICATE</h2>
          <p className="text-[#58595B] text-center mb-12 font-bold">Berikut beberapa sertifikat yang bisa kalian lihat</p>
        </div>
        
        <div className="relative">
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-2 px-1">
              {certificates.map((cert, index) => (
                <CertificateItem
                  key={index}
                  image={cert.image}
                  title={cert.title}
                  description={cert.description}
                  onClick={() => handleImageClick(cert.image, cert.title)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal 
        isOpen={selectedImage !== null}
        image={selectedImage?.image || ''}
        title={selectedImage?.title || ''}
        onClose={closeModal}
      />

      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        body.modal-open {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Certificate;