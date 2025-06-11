import React, { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Jenis';
import Operasional from './components/Operasional';
import Keunggulan from './components/Keunggulan';
import Sertificate from './components/Certificate';
import Testimoni from './components/Testimoni';

const Home: NextPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'BERANDA', path: '#home' },
    { name: 'TENTANG', path: '#about' },
    { name: 'SERVIS', path: '#service' },
    { name: 'SERTIFIKAT', path: '#certificate' },
    { name: 'TESTIMONI', path: '#testimoni' },
  ];
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Head>
        <title>Buija Totok - Layanan Terapi</title>
        <meta name="description" content="Layanan terapi profesional dengan pendekatan yang dipersonalisasi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar integrated directly in index.tsx */}
      <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl md:px-6">
          {/* Logo */}
          <Link href="/">
            <span className="rozha-one text-3xl text-black pl-10">buijatotok</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <a 
                key={item.name}
                href={item.path}
                className="montserrat text-sm font-medium text-gray-700 transition-colors hover:text-green-800"
                onClick={(e) => scrollToSection(e, item.path.substring(1))}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="px-4 pt-2 pb-4 bg-white md:hidden">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="montserrat block py-2 text-sm font-medium text-gray-700 transition-colors hover:text-green-800"
                onClick={(e) => scrollToSection(e, item.path.substring(1))}
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </nav>
      
      <main>
        <div id="home" className="mb-16"> 
          <Hero />
        </div>

        <div id="about" className="mb-32"> 
          <About/>
        </div>

        <div id="service" className="mb-32"> 
          <Services />
        </div>

        <div className="mb-16"> 
          <Operasional/>
        </div>

        <div className="mb-16"> 
          <Keunggulan/>
        </div>

        <div id="certificate" className="mb-8"> 
          <Sertificate/>
        </div>

        <div id="testimoni"> 
          <Testimoni/>
        </div>
      </main>

<footer className="bg-[#F1F1F1] border-t">
  <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-8">
      {/* Logo and Social Media Links */}
      <div className="flex flex-col items-center md:items-start">
        <div className="mb-4 md:mb-3 lg:mb-6">
          <h2 className="rozha-one text-xl md:text-xl lg:text-3xl font-bold text-[#0A3910]">buijatotok</h2>
        </div>
        <div className="flex space-x-3 md:space-x-2 lg:space-x-4">
          {/* Social Media Icons */}
          {[
            { icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z', href: '#facebook' },
            { icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z', href: '#twitter' },
            { icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', href: '#instagram' },
            { icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 4a2 2 0 110 4 2 2 0 010-4z', href: '#linkedin' },
            { icon: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z M9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02', href: '#youtube' }
          ].map((social, index) => (
            <a 
              key={index} 
              href={social.href} 
              className="rounded-full w-8 h-8 md:w-7 md:h-7 lg:w-10 lg:h-10 bg-[#0A3910] flex items-center justify-center hover:bg-opacity-80 transition-colors duration-200"
            >
              <svg 
                className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5"
                viewBox="0 0 24 24" 
                fill="white" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={social.icon} />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col items-center md:items-start">
        <h3 className="montserrat text-sm md:text-sm lg:text-lg font-semibold mb-3 md:mb-2 lg:mb-4 text-[#0A3910] uppercase">QUICK LINK</h3>
        <ul className="space-y-2 md:space-y-1.5 lg:space-y-2.5 text-center md:text-left">
          {[
            { label: 'Beranda', section: 'home' },
            { label: 'Tentang kami', section: 'about' },
            { label: 'Servis', section: 'service' },
            { label: 'Sertifikat', section: 'certificate' },
            { label: 'Testimoni', section: 'testimoni' }
          ].map((link, index) => (
            <li key={index}>
              <a 
                href={`#${link.section}`} 
                onClick={(e) => scrollToSection(e, link.section)} 
                className="montserrat text-[#0A3910] flex items-center justify-center md:justify-start text-sm md:text-xs lg:text-base hover:text-opacity-70 transition-colors duration-200"
              >
                <span className="mr-2 text-xs">▶</span> {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col items-center md:items-start">
        <h3 className="montserrat text-sm md:text-sm lg:text-lg font-semibold mb-3 md:mb-2 lg:mb-4 text-[#0A3910] uppercase">CONTACT INFO</h3>
        <ul className="space-y-3 md:space-y-2 lg:space-y-4 text-center md:text-left">
          <li className="flex items-start justify-center md:justify-start">
            <svg 
              className="w-5 h-5 md:w-4 md:h-4 lg:w-6 lg:h-6 text-[#0A3910] mt-0.5 mr-3 md:mr-2 lg:mr-3 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            <p className="montserrat text-[#0A3910] text-sm md:text-xs lg:text-base leading-relaxed">
              Btn. Sukma Bumi Gowa<br />Permai, Gowa
            </p>
          </li>
          <li className="flex items-center justify-center md:justify-start">
            <svg 
              className="w-5 h-5 md:w-4 md:h-4 lg:w-6 lg:h-6 text-[#0A3910] mr-3 md:mr-2 lg:mr-3 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
              />
            </svg>
            <a 
              href="tel:+6285399086505" 
              className="montserrat text-[#0A3910] text-sm md:text-xs lg:text-base hover:text-opacity-70 transition-colors duration-200"
            >
              +62 8539 9086 505
            </a>
          </li>
          <li className="flex items-center justify-center md:justify-start">
            <svg 
              className="w-5 h-5 md:w-4 md:h-4 lg:w-6 lg:h-6 text-[#0A3910] mr-3 md:mr-2 lg:mr-3 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <a 
              href="mailto:halijahst14@gmail.com" 
              className="montserrat text-[#0A3910] text-sm md:text-xs lg:text-base hover:text-opacity-70 transition-colors duration-200 break-all md:break-normal"
            >
              halijahst14@gmail.com
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Copyright */}
    <div className="mt-8 md:mt-6 lg:mt-12 pt-6 md:pt-4 lg:pt-8 border-t border-gray-300 text-center">
      <p className="montserrat text-[#0A3910] text-sm md:text-xs lg:text-base">
        © 2025 Copyright: Buijatotok.Com
      </p>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Home;