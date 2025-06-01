import React from 'react';
import Image from 'next/image';

const Operasional = () => {
  const operationalHours = [
    { day: 'Senin', hours: '08.00-16.00' },
    { day: 'Selasa', hours: '08.00-16.00' },
    { day: 'Rabu', hours: '08.00-16.00' },
    { day: 'Kamis', hours: '08.00-16.00' },
    { day: 'Jumat', hours: '08.00-16.00' },
    { day: 'Sabtu', hours: '08.00-16.00' },
  ];

  return (
    <div className="relative w-full">
      <div className="relative">
        <Image
          src="/images/bg-operasional.png"
          alt="Background Jam Operasional"
          width={1920}
          height={800}
          className="w-full h-auto object-cover"
        />
        
        <div className="absolute inset-0 flex justify-center items-center px-2 sm:px-4">
          <div className="bg-white/20 rounded-xl sm:rounded-3xl p-2 sm:p-8 w-full max-w-4xl mx-auto">
            <h2 className="text-center text-white text-base sm:text-4xl font-bold mb-2 sm:mb-6 tracking-wide font-montserrat">
              JAM OPERASIONAL
            </h2>
            
            {/* Mobile: Single column, Desktop: Two columns */}
            <div className="block sm:hidden space-y-1.5">
              {/* Mobile Layout - Single Column */}
              {operationalHours.map((item) => (
                <div key={item.day} className="flex justify-between items-center px-1">
                  <span className="text-white text-xs font-montserrat font-medium">{item.day}</span>
                  <span className="text-white text-xs font-montserrat">{item.hours}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-1 pt-1 border-t border-white/30">
                <span className="text-white text-xs font-montserrat font-medium">Minggu</span>
                <span className="text-white text-xs font-montserrat">09.00-16.00</span>
              </div>
            </div>

            {/* Desktop Layout - Two columns */}
            <div className="hidden sm:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {operationalHours.slice(0, 3).map((item) => (
                  <div key={item.day} className="flex items-center">
                    <span className="text-white text-xl font-montserrat font-medium w-28 mr-2">{item.day}</span>
                    <span className="text-white text-xl font-montserrat">{item.hours}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 border-l border-white pl-6">
                {operationalHours.slice(3).map((item) => (
                  <div key={item.day} className="flex items-center">
                    <span className="text-white text-xl font-montserrat font-medium w-28 mr-2">{item.day}</span>
                    <span className="text-white text-xl font-montserrat">{item.hours}</span>
                  </div>
                ))}
              </div>
              
              <div className="col-span-2 mt-4 flex justify-center">
                <div className="flex items-center">
                  <span className="text-white text-xl font-montserrat font-medium w-28 mr-2">Minggu</span>
                  <span className="text-white text-xl font-montserrat">09.00-16.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operasional;