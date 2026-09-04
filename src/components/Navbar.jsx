import React, { useState, useEffect } from 'react';
const logoImg = '/images/logo.png';

export default function Navbar({ currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (id === 'contact') {
      window.location.hash = '#contact';
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    if (id === 'about') {
      window.location.hash = '#about';
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    if (currentPage !== 'home') {
      window.location.hash = `#${id}`;
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-md py-3.5 border-white/10 shadow-lg shadow-black/50'
          : 'bg-transparent py-5 border-transparent'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        <nav className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('top');
            }}
            className="flex items-center gap-3 group"
          >
            <div className="w-11 sm:w-12 h-11 sm:h-12 flex-shrink-0 relative overflow-hidden rounded">
              <img
                src={logoImg}
                alt="bizparkstudio logo"
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback vector SVG if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
              <svg className="w-11 sm:w-12 h-11 sm:h-12 hidden" viewBox="0 0 100 100" fill="none">
                <path d="M50 6 L94 44 L60 74 L60 44 L36 64 L36 90 L6 64 Z" fill="#F2603E" />
                <path d="M50 26 L74 44 L36 90 L36 64 L60 44 Z" fill="#F5F4EF" />
                <path d="M50 62 L60 74 L60 90 L50 82 Z" fill="#0a0a0a" />
              </svg>
            </div>
            <span className="font-chakra font-semibold text-lg tracking-wider text-white lowercase">
              bizpark<span className="text-[#f2603e]">s</span>tudio
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-9 text-sm font-medium text-[#95928a]">
            <a
              href="#services"
              onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
              className="hover:text-white transition-colors duration-200"
            >
              Services
            </a>
            <a
              href="#process"
              onClick={(e) => { e.preventDefault(); scrollToSection('process'); }}
              className="hover:text-white transition-colors duration-200"
            >
              Process
            </a>
            <a
              href="#work"
              onClick={(e) => { e.preventDefault(); scrollToSection('work'); }}
              className="hover:text-white transition-colors duration-200"
            >
              Work
            </a>
            <a
              href="#category-software-solutions"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                window.location.hash = '#category-software-solutions';
              }}
              className="hover:text-white transition-colors duration-200"
            >
              Products
            </a>
            <a
              href="#requirement-form"
              onClick={(e) => { e.preventDefault(); scrollToSection('requirement-form'); }}
              className="hover:text-[#f2603e] transition-colors duration-200"
            >
              Submit Requirement
            </a>
            <a
              href="#about"
              onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              className={`transition-colors duration-200 ${currentPage === 'about' ? 'text-[#f2603e] font-bold' : 'hover:text-white'}`}
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              className={`transition-colors duration-200 ${currentPage === 'contact' ? 'text-[#f2603e] font-bold' : 'hover:text-white'}`}
            >
              Contact
            </a>
          </div>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => scrollToSection('requirement-form')}
              className="nav-cta inline-flex items-center gap-2 bg-[#f2603e] text-[#0a0a0a] font-semibold text-xs uppercase tracking-wider px-5 py-2.5 transition-all duration-200 hover:bg-[#ff6f4a] hover:-translate-y-0.5 active:translate-y-0 cut-sm"
            >
              Start a project
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#f5f4ef] p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 pb-6 border-t border-white/10 flex flex-col gap-4 animate-fadeIn">
            <a
              href="#services"
              onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
              className="text-[#95928a] hover:text-white py-1 font-medium"
            >
              Services
            </a>
            <a
              href="#process"
              onClick={(e) => { e.preventDefault(); scrollToSection('process'); }}
              className="text-[#95928a] hover:text-white py-1 font-medium"
            >
              Process
            </a>
            <a
              href="#work"
              onClick={(e) => { e.preventDefault(); scrollToSection('work'); }}
              className="text-[#95928a] hover:text-white py-1 font-medium"
            >
              Work
            </a>
            <a
              href="#category-software-solutions"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                window.location.hash = '#category-software-solutions';
              }}
              className="text-[#95928a] hover:text-white py-1 font-medium"
            >
              Products
            </a>
            <a
              href="#requirement-form"
              onClick={(e) => { e.preventDefault(); scrollToSection('requirement-form'); }}
              className="text-[#f2603e] hover:text-[#ff6f4a] py-1 font-medium font-semibold"
            >
              Submit Requirement
            </a>
            <a
              href="#about"
              onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              className={`py-1 font-medium ${currentPage === 'about' ? 'text-[#f2603e] font-bold' : 'text-[#95928a] hover:text-white'}`}
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              className={`py-1 font-medium ${currentPage === 'contact' ? 'text-[#f2603e] font-bold' : 'text-[#95928a] hover:text-white'}`}
            >
              Contact
            </a>
            <button
              onClick={() => scrollToSection('requirement-form')}
              className="mt-2 w-full bg-[#f2603e] text-[#0a0a0a] font-semibold text-xs uppercase tracking-wider py-3 cut-sm"
            >
              Start a project →
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
