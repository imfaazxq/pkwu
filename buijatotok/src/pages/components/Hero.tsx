"use client"; 

import { useRouter } from "next/navigation";
import React from "react";

const Hero: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-green-50">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/Hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div 
        className="absolute inset-0 z-5"
        style={{
          backgroundImage: "url('/images/Shadow.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7
        }}
      />
      
      <div className="relative z-30 flex flex-col items-start justify-center h-full px-6 md:px-16 lg:px-24">
        <div className="max-w-lg">
          <h1 className="montserrat mb-6 text-2xl font-bold text-white md:text-4xl leading-loose">
            Selamat Datang di Layanan Terapi Kami
          </h1>
          <p className="lora mb-8 text-md text-white">
            Dengan lebih dari 20 tahun pengalaman, kami menyediakan layanan 
            terapi yang dipersonalisasi untuk membantu Anda mengatasi 
            permasalahan hidup, mencapai tujuan pribadi, dan menemukan 
            kebahagiaan sejati.
          </p>
          
          <button
            onClick={() => router.push("/Booking")}
            className="px-11 py-3 text-white transition-all border-2 border-white rounded-full hover:bg-white hover:text-green-800 relative z-30"
          >
            Booking
          </button>
        </div>
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 z-20 w-full h-auto"
        style={{
          backgroundImage: "url('/images/bayanganPutih.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          height: '17rem',
          transform: 'translateY(10px)' 
        }}
      />
    </div>
  );
};

export default Hero;
