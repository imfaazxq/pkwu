import React from 'react';

const About = () => {
  return (
<div className="relative min-h-screen w-full top-16">

      {/* Background Image with Wave Pattern */}
      <div 
  className="absolute top-30 left-0 right-0 z-0" 
  style={{
    backgroundImage: "url('/images/bg-about.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh' // Pastikan background tetap penuh
  }}
/>


      
      {/* Content overlay - No white container */}
      <div className="relative z-10 p-8 md:p-12 pt-32">
        {/* Name with Montaga Font */}
        <h1 
className="text-3xl md:text-4xl mb-2 mt-[-50px]" 
          style={{ 
            fontFamily: 'Montaga, serif', 
            color: '#0D4715' 
          }}
        >
          Ibu Siti Halijah
        </h1>
        
        {/* Title with Lora Font */}
        <h2 
          className="text-5xl md:text-6xl mb-8 font-bold" 
          style={{ 
            fontFamily: 'Lora, serif', 
            color: '#0D4715'
          }}
        >
          Therapis
        </h2>
        
        {/* Text content in two paragraphs - Width restricted for better readability */}
        <div className="max-w-2xl">
          {/* First Paragraph */}
          <p 
            className="mb-6 text-sm leading-relaxed" 
            style={{ 
              fontFamily: 'Lora, serif', 
              color: '#535353' 
            }}
          >
            Selamat datang! Saya Ibu Halijah, Terapis Berlisensi dengan Pengalaman Lebih dari 20 
            Tahun. Dengan lebih dari dua dekade pengalaman, saya berkomitmen untuk memberikan 
            perawatan terapi yang disesuaikan dengan kebutuhan setiap individu. Pendekatan saya 
            yang penuh empati bertujuan membantu Anda meredakan stres, menemukan 
            keseimbangan hidup, dan mengatasi tantangan emosional.
          </p>
          
          {/* Second Paragraph */}
          <p 
            className="text-sm leading-relaxed " 
            style={{ 
              fontFamily: 'Lora, serif', 
              color: '#535353' 
            }}
          >
            Sebagai seorang terapis, saya percaya setiap orang memiliki potensi untuk sembuh dan 
            mencapai keseimbangan. Terapi adalah ruang aman di mana Anda dapat merasa 
            didengarkan dan mendapatkan dukungan untuk perubahan positif dalam hidup Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;