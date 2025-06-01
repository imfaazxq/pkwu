"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type TherapyType = "Umum" | "Wanita" | "Paket";

interface TherapyOption {
  id: TherapyType;
  title: string;
  image: string;
  subtitle?: string;
}

const Jenis = () => {
  const router = useRouter();
  const [selectedTherapy, setSelectedTherapy] = useState<TherapyType>("Umum");

  const therapyOptions: TherapyOption[] = [
    {
      id: "Umum",
      title: "TERAPHI UMUM",
      subtitle: "BUIJA TOTOK",
      image: "/images/umum.jpg",
    },
    {
      id: "Wanita",
      title: "PERAWATAN KHUSUS WANITA",
      subtitle: "BUIJA TOTOK",
      image: "/images/wanita.png",
    },
    {
      id: "Paket",
      title: "PAKET",
      subtitle: "BUIJA TOTOK",
      image: "/images/paket.png",
    },
  ];

  const handleTherapySelect = (therapy: TherapyType) => {
    setSelectedTherapy(therapy);
    
    // Navigate to the corresponding page based on therapy type
    if (therapy === "Umum") {
      router.push("/Umum");
    } else if (therapy === "Wanita") {
      router.push("/Wanita");
    } else if (therapy === "Paket") {
      router.push("/Paket");
    }
  };

  const handleNavigation = (direction: "prev" | "next") => {
    const currentIndex = therapyOptions.findIndex(
      (option) => option.id === selectedTherapy
    );
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % therapyOptions.length;
    } else {
      newIndex = (currentIndex - 1 + therapyOptions.length) % therapyOptions.length;
    }

    setSelectedTherapy(therapyOptions[newIndex].id);
  };

  const getCardWidth = (id: TherapyType) => {
    return id === selectedTherapy ? "w-64 md:w-80" : "w-16 md:w-24";
  };

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <h1 className="montserrat text-4xl font-bold text-center mb-12">
        Lihat Pilihan Therapi
      </h1>

      <div className="relative">
        {/* Tombol Navigasi */}
        <div className="absolute top-1/2 left-2 sm:left-0 -translate-y-1/2 -translate-x-1/2 z-10">
          <button
            onClick={() => handleNavigation("prev")}
            className="rounded-full w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center bg-gray-500 text-white transition-all hover:opacity-90"
            aria-label="Previous"
          >
            <svg
              width="24"
              height="24"
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
          </button>
        </div>

        <div className="absolute top-1/2 right-2 sm:right-0 -translate-y-1/2 translate-x-1/2 z-10">
          <button
            onClick={() => handleNavigation("next")}
            className="rounded-full w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center bg-[#1D5024] text-white transition-all hover:opacity-90"
            aria-label="Next"
          >
            <svg
              width="24"
              height="24"
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
          </button>
        </div>

        {/* List Therapy */}
        <div className="flex justify-center items-stretch gap-1 h-96 overflow-hidden">
          {therapyOptions.map((option) => (
            <motion.div
              key={option.id}
              className={`relative rounded-lg overflow-hidden cursor-pointer bg-gray-900 transition-all hover:bg-gray-700 ${getCardWidth(
                option.id
              )}`}
              onClick={() => handleTherapySelect(option.id)}
              layout
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={option.image}
                  alt={option.title}
                  fill
                  className={`object-cover transition-transform duration-500 ${
                    option.id === selectedTherapy ? "scale-105 opacity-80" : "opacity-50"
                  }`}
                />

                {option.id === selectedTherapy && (
                  <div className="absolute top-4 left-4 flex flex-col items-start p-2">
                    {option.subtitle && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white text-lg md:text-xl font-medium mb-1 text-left"
                      >
                        {option.subtitle}
                      </motion.div>
                    )}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="rozha-one text-white text-xl md:text-2xl font-bold text-left"
                    >
                      {option.title}
                    </motion.h2>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jenis;