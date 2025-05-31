import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Umum: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header section with aligned elements */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-[#0D4715] font-2xl">Perawatan Umum</p>
          <h1 className="text-3xl font-bold text-[#0D4715]">Pilihan Perawatan Umum</h1>
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
      
      {/* Small navigation buttons - Modified to match the comments */}
      <div className="flex justify-end mb-10">
        <div className="flex gap-2">
          <Link href="/Paket" className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-500 text-white transition-all hover:opacity-90">
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
          <Link href="/Wanita" className="rounded-full w-10 h-10 flex items-center justify-center bg-[#1D5024] text-white transition-all hover:opacity-90">
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
        {/* Therapi Syaraf Terjepit */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/umum/1.png" 
              alt="Therapi Syaraf Terjepit" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Therapi Syaraf Terjepit</h2>
            <p className="text-gray-700 mb-4">
              Atasi nyeri dan keterbatasan pergerakan dengan Therapi Syaraf Terjepit. 
              Metode kami mengatasi tekanan pada saraf, memulihkan fungsi normal, dan 
              mengurangi rasa sakit secara efektif.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Mengurangi Rasa Sakit Dan Kebas</li>
              <li className="mb-2">Meningkatkan Sirkulasi Darah</li>
              <li className="mb-2">Melemaskan Otot Yang Tegang</li>
              <li className="mb-2">Memperbaiki Postur Tubuh</li>
            </ul>
          </div>
        </div>

        {/* Bekam */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/umum/2.png" 
              alt="Bekam" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Bekam</h2>
            <p className="text-gray-700 mb-4">
              Dapatkan tubuh sehat dan bugar dengan Terapi Bekam. Prosesnya meliputi 
              penerapan tekanan, pengisapan dengan cup, serta pengeluaran darah kotor 
              untuk membantu detoksifikasi tubuh.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Melancarkan Peredaran Darah</li>
              <li className="mb-2">Membuang Racun Dan Darah Kotor</li>
              <li className="mb-2">Meredakan Pegal Dan Nyeri Otot</li>
              <li className="mb-2">Meningkatkan Daya Tahan Tubuh</li>
              <li className="mb-2">Mengurangi Stres Dan Ketegangan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Second row of treatments */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Asma Tehnik Paz Alkasau */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/umum/3.png" 
              alt="Asma Tehnik Paz Alkasau" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Asma Tehnik Paz Alkasau</h2>
            <p className="text-gray-700 mb-4">
              Atasi masalah pernapasan dengan metode khusus Tehnik PAZ Al-Kasau, meredakan 
              gejala asma dan membantu pengendalian nafas yang lebih baik untuk kualitas 
              hidup yang meningkat.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Meredakan Gejala Asma</li>
              <li className="mb-2">Memperbaiki Pola Pernapasan</li>
              <li className="mb-2">Memperkuat Otot Pernapasan</li>
              <li className="mb-2">Meningkatkan Kapasitas Paru-paru</li>
            </ul>
          </div>
        </div>

        {/* Pijat Bayi */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/umum/4.png" 
              alt="Pijat Bayi" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Pijat Bayi</h2>
            <p className="text-gray-700 mb-4">
              Berikan yang terbaik untuk si kecil dengan Pijat Bayi. Teknik pijat khusus ini 
              membantu perkembangan fisik dan mental bayi, serta memperkuat ikatan 
              orangtua dan anak.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Meningkatkan Perkembangan Motorik Dan Saraf</li>
              <li className="mb-2">Meredakan Kolik Dan Masalah Pencernaan</li>
              <li className="mb-2">Meningkatkan Kualitas Tidur Bayi</li>
              <li className="mb-2">Memperkuat Sistem Kekebalan Tubuh</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Third row of treatments */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Therapi Cedera Olahraga */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/umum/5.png" 
              alt="Therapi Cedera Olahraga" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Therapi Cedera Olahraga</h2>
            <p className="text-gray-700 mb-4">
              Pulihkan kondisi fisik Anda setelah cedera olahraga dengan Therapi Cedera Olahraga. 
              Pendekatan komprehensif untuk mengurangi nyeri dan membantu tubuh Anda 
              kembali aktif.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Meredakan Nyeri Dan Pembengkakan</li>
              <li className="mb-2">Memperbaiki Jangkauan Gerak</li>
              <li className="mb-2">Mempercepat Proses Pemulihan</li>
              <li className="mb-2">Mencegah Cedera Berulang</li>
            </ul>
          </div>
        </div>

        {/* Therapi Paz (reposisi tulang belakang) */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/umum/6.png" 
              alt="Therapi Paz (reposisi tulang belakang)" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Therapi Paz (Reposisi Tulang Belakang)</h2>
            <p className="text-gray-700 mb-4">
              Atasi masalah tulang belakang dengan Therapi Paz yang berfokus pada reposisi 
              tulang belakang. Metode khusus untuk mengembalikan keselarasan struktur tulang 
              belakang dan mengurangi nyeri.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Memperbaiki Postur Tubuh</li>
              <li className="mb-2">Mengurangi Nyeri Punggung Kronis</li>
              <li className="mb-2">Meningkatkan Fungsi Saraf</li>
              <li className="mb-2">Meningkatkan Mobilitas Dan Fleksibilitas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fourth row of treatments */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Totok Aura Wajah */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/umum/7.png" 
              alt="Totok Aura Wajah" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Totok Aura Wajah</h2>
            <p className="text-gray-700 mb-4">
              Dapatkan wajah segar dan cerah dengan Totok Aura Wajah yang melakukan pemijatan 
              menyeluruh pada wajah, merelaksasi otot dan memperbaiki struktur wajah sehingga 
              terlihat lebih menarik.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Menghilangkan Ketegangan Wajah</li>
              <li className="mb-2">Mengurangi Kekenduran Dan Garis Halus</li>
              <li className="mb-2">Mencerahkan Kulit Wajah</li>
              <li className="mb-2">Menghilangkan Stres Dan Ketegangan</li>
            </ul>
          </div>
        </div>

        {/* Hypnotherapi */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="relative w-full h-48">
            <Image 
              src="/umum/8.png" 
              alt="Hypnotherapi" 
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#0D4715] mb-3">Hypnotherapi</h2>
            <p className="text-gray-700 mb-4">
              Atasi masalah psikologis dan perubahan kebiasaan dengan Hypnotherapi. Metode 
              terapi yang menggunakan sugesti positif dalam kondisi relaksasi mendalam untuk 
              mengatasi berbagai masalah mental dan emosional.
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Mengatasi Kecemasan Dan Stres</li>
              <li className="mb-2">Membantu Mengatasi Fobia Dan Trauma</li>
              <li className="mb-2">Mengatasi Kebiasaan Buruk</li>
              <li className="mb-2">Meningkatkan Kepercayaan Diri</li>
              <li className="mb-2">Membantu Mengatasi Gangguan Tidur</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Umum;