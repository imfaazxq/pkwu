import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Wanita: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header section with aligned elements */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-[#0D4715] font-2xl">Perawatan Khusus Wanita</p>
          <h1 className="text-3xl font-bold text-[#0D4715]">Pilihan Perawatan Wajah</h1>
        </div>
        
        {/* Kembali button aligned with the heading */}
        <Link href="/" className="inline-flex items-center px-4 py-2 bg-[#0D4715] text-white rounded-md hover:bg-opacity-90 transition-colors h-10">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M19 12H5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19L5 12L12 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Kembali 
        </Link>
      </div>
      
      {/* Small navigation buttons */}
      <div className="flex justify-end mb-10">
        <div className="flex gap-2">
          <Link href="/Umum" className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-500 text-white transition-all hover:opacity-90">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link href="/Paket" className="rounded-full w-10 h-10 flex items-center justify-center bg-[#1D5024] text-white transition-all hover:opacity-90">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5L16 12L9 19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Totok Aura Wajah */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/wanita/totok_wajah.png" 
              alt="Totok Aura Wajah" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Totok Aura Wajah </h2>
            <p className="text-gray-700 mb-4">
            Dapatkan wajah yang segar dan cerah dengan Totok Wajah Aura!
Perawatan ini mencakup pemijatan menyeluruh pada wajah, pijat ringan, serta totok akupresur di titik-titik tertentu. 
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Menghilangkan Sirkulasi Darah</li>
              <li className="mb-2">Mengurangi Kekenduran Dan Garis Halus</li>
              <li className="mb-2">Mencerahkan Kulit Wajah</li>
              <li className="mb-2">Menghilangkan Stres Dan Ketegangan</li>
            </ul>
            <p className="text-gray-600 italic">Rasakan wajah glowing/bercahaya sekarang!</p>
          </div>
        </div>

        {/* Akupunktur Estetika */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/wanita/akupuntur.png" 
              alt="Akupunktur Estetika" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Akupunktur Estetika</h2>
            <p className="text-gray-700 mb-4">
            Dapatkan wajah yang lebih segar dan cerah dengan mudah melalui Akupunktur Estetika!
            Teknik ini melibatkan pemasukan jarum halus pada titik-titik tertentu di wajah.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Mengurangi Kerutan Dan Garis Halus</li>
              <li className="mb-2">Mencerahkan Kulit Wajah</li>
              <li className="mb-2">Meningkatkan Elastisitas Kulit</li>
              <li className="mb-2">Mengurangi Stres Dan Ketegangan</li>
              <li className="mb-2">Membantu Wajah Terlihat Lebih Segar Dan Awet Muda</li>
            </ul>
            <p className="text-gray-600 italic">Rasakan wajah glowing dan segar sekarang!</p>
          </div>
        </div>
      </div>


      {/* Body treatments section */}
      <h1 className="text-3xl font-bold text-[#0D4715] text-left mb-10">Pilihan Perawatan Tubuh</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Perawatan Pasca Melahirkan */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/wanita/1.png" 
              alt="Perawatan Pasca Melahirkan" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Perawatan Pasca Melahirkan</h2>
            <p className="text-gray-700 mb-4">
              Pulihkan tubuh dan pikiran setelah melahirkan dengan perawatan khusus
              untuk ibu baru. Anda akan menemukan perawatan menyeluruh yang
              membantu mengembalikan vitalitas dan kenyamanan tubuh.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Mengurangi Stres Dan Kecemasan Pasca Melahirkan</li>
              <li className="mb-2">Mempercepat Pemulihan Tubuh Pasca Persalinan</li>
              <li className="mb-2">Melancarkan Produksi ASI</li>
              <li className="mb-2">Mengembalikan Energi Dan Keseimbangan Tubuh</li>
            </ul>
          </div>
        </div>

        {/* Perawatan Sebelum Melahirkan */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/wanita/2.png" 
              alt="Perawatan Sebelum Melahirkan" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Perawatan Sebelum Melahirkan</h2>
            <p className="text-gray-700 mb-4">
              Perawatan tubuh dan pikiran menunjang kesehatan dengan perawatan khusus
              untuk ibu hamil terbaik sehingga terlahir bayi yang membantu menghilangkan
              kenyamanan juga menstimulasi sejahtera persalinan.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Mengurangi Stres Dan Kecemasan Menjelang Persalinan</li>
              <li className="mb-2">Membantu Melancarkan Sirkulasi Darah Dan Mengurangi Nyeri</li>
              <li className="mb-2">Meningkatkan Kualitas Tidur Dan Keseimbangan Ibu</li>
              <li className="mb-2">Mengembalikan Energi Dan Keseimbangan Tubuh</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Perawatan Turun Perut */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/wanita/3.png" 
              alt="Perawatan Turun Perut" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Perawatan Turun Perut</h2>
            <p className="text-gray-700 mb-4">
              Atasi perut kendur, lembung, dan tidak nyaman dengan Perawatan Turun
              Perut. Perawatan ini cocok bagi siapa saja yang ingin memiliki bentuk tubuh
              yang menakjubkan memesona.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Membantu Mengecilkan Perut Dan Menghilangkan Obat</li>
              <li className="mb-2">Melancarkan Pencernaan Dan Mengurangi Perut Kembung</li>
              <li className="mb-2">Membantu Meningkatkan Metabolisme Tubuh</li>
              <li className="mb-2">Mengecilkan Batas Pinggi Dan Memperlancar Kenyamanan Tubuh</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wanita;