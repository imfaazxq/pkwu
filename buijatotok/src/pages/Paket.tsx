import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Paket: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header section with aligned elements */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-[#0D4715] font-2xl">Perawatan Paket</p>
          <h1 className="text-3xl font-bold text-[#0D4715]">Pilihan Perawatan Paket</h1>
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
          <Link href="/Wanita" className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-500 text-white transition-all hover:opacity-90">
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
          <Link href="/Umum" className="rounded-full w-10 h-10 flex items-center justify-center bg-[#1D5024] text-white transition-all hover:opacity-90">
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

      {/* First row of treatments */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Totok Lengkap */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/paket/1.png" 
              alt="Totok Lengkap" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Totok Lengkap</h2>
            <p className="text-gray-700 mb-4">
              Dapatkan pengalaman Totok Lengkap yang menyejukkan. Perawatan ini mencakup 
              berbagai teknik totok untuk menghilangkan lelah, mengembalikan 
              keseimbangan energi, serta memberikan efek relaksasi dan kesehatan alami.
            </p>
            <p className="text-gray-700 mb-4">Mencakup:</p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Totok Stimulasi Darah</li>
              <li className="mb-2">Totok Mess V</li>
              <li className="mb-2">Totok Aura Wajah</li>
              <li className="mb-2">Totok Pegel</li>
              <li className="mb-2">Totok Punggung</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Nikmati sensasi rileks dan dapatkan kembali tubuh Anda dengan Paket Totok Lengkap 💕
            </p>
          </div>
        </div>

        {/* Bekam + Totok Punggung */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/paket/2.png" 
              alt="Bekam + Totok Punggung" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Bekam + Totok Punggung</h2>
            <p className="text-gray-700 mb-4">
              Hilangkan pegal, stres, dan tekak dalam tubuh dengan kombinasi Bekam & Totok 
              Punggung. Perawatan ini menggabungkan teknik bekam untuk mengeluarkan 
              racun dalam aliran punggung untuk melancarkan energi dan meredakan 
              ketegangan otot.
            </p>
            <p className="text-gray-700 mb-4">Manfaat:</p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Meredakan Nyeri Punggung Dan Ketegangan Otot</li>
              <li className="mb-2">Membantu Melancarkan Peredaran Darah Dan Energi Tubuh</li>
              <li className="mb-2">Mengurangi Stres Dan Meningkatkan Kualitas Tidur</li>
              <li className="mb-2">Membuang Racun Dalam Tubuh Untuk Kesehatan Yang Lebih Optimal</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Nikmati sensasi ringan dan dapatkan kembali tubuh Anda dengan Paket Bekam + Totok Punggung 💜
            </p>
          </div>
        </div>
      </div>

      {/* Second row of treatments */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Perawatan Lengkap Therapi */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/paket/3.png" 
              alt="Perawatan Lengkap Therapi" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Perawatan Lengkap Therapi</h2>
            <p className="text-gray-700 mb-4">
              Rasakan manfaat terapi holistik dengan Perawatan Lengkap Terapi, kombinasi 
              teknik penyembuhan alami untuk tubuh yang lebih sehat dan bugar. 
              Perawatan ini membantu melancarkan energi, meredakan nyeri, serta 
              meningkatkan keseimbangan tubuh.
            </p>
            <p className="text-gray-700 mb-4">Mencakup:</p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Totok Saraf</li>
              <li className="mb-2">Akupuntur</li>
              <li className="mb-2">Bekam (ngerman)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Dapatkan pengalaman terapi terbaik untuk tubuh yang lebih sehat dan 
              rileks dengan Perawatan Lengkap Terapi 💕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paket;