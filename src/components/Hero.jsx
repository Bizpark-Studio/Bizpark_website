import React, { useRef, useState, useEffect } from 'react';
import { getStoreData } from '../data/store';

export default function Hero() {
  const visualRef = useRef(null);
  const [storeData, setStoreData] = useState(getStoreData());
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [transformStyle, setTransformStyle] = useState('rotate3d(0, 0, 0, 0deg) translate(0px, 0px)');

  useEffect(() => {
    const handleUpdate = () => {
      setStoreData(getStoreData());
    };
    window.addEventListener('bizpark_store_updated', handleUpdate);
    return () => window.removeEventListener('bizpark_store_updated', handleUpdate);
  }, []);

  const heroBanners = storeData.homepageHeroBanners || [];
  const bannerCount = heroBanners.length;

  // Auto-play sliding hero banners if > 1 banner
  useEffect(() => {
    if (bannerCount <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % bannerCount);
    }, 5500);
    return () => clearInterval(timer);
  }, [bannerCount]);

  const currentBanner = heroBanners[activeSlideIndex] || heroBanners[0] || {};

  const handleMouseMove = (e) => {
    if (!visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setTransformStyle(`rotate3d(${y}, ${-x}, 0, ${Math.sqrt(x * x + y * y) * 10}deg) translate(${x * 10}px, ${y * 10}px)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('rotate3d(0, 0, 0, 0deg) translate(0px, 0px)');
  };

  const handleCtaClick = (link) => {
    if (!link) return;
    if (link.startsWith('#')) {
      window.location.hash = link;
      const id = link.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(link, '_blank');
    }
  };

  const isVideo = (url) => {
    if (!url) return false;
    return url.includes('data:video') || /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  return (
    <section id="top" className="relative pt-36 md:pt-48 pb-24 md:pb-32 overflow-hidden bg-[#0a0a0a]">
      {/* Ambient background glow lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[550px] h-[350px] bg-[#f2603e]/15 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-[#f2603e]/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 text-xs text-[#f2603e] font-mono uppercase tracking-widest bg-[#141413] px-3.5 py-1.5 border border-[#f2603e]/30 cut-sm font-bold">
              <span className="w-4 h-[1px] bg-[#f2603e]" />
              {currentBanner.badge || 'NUMBER ONE. DIGITAL STUDIO'}
            </div>

            <h1 className="font-chakra font-bold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#f5f4ef] leading-[1.08]">
              {currentBanner.title || 'We build the digital side of your business.'}
            </h1>

            <p className="text-[#95928a] text-base sm:text-lg max-w-xl leading-relaxed">
              {currentBanner.subtitle || 'One studio, three disciplines — software development, social media marketing, and graphic design — run from a single plan, so nothing gets lost between teams.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleCtaClick(currentBanner.ctaPrimaryLink || '#requirement-form')}
                className="btn-primary cut-sm inline-flex items-center gap-2.5 bg-[#f2603e] text-[#0a0a0a] font-semibold text-sm sm:text-base px-7 py-4 hover:bg-[#ff6f4a] transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-[#f2603e]/25 font-chakra uppercase font-bold"
              >
                {currentBanner.ctaPrimaryText || 'Start a project →'}
              </button>

              <button
                onClick={() => handleCtaClick(currentBanner.ctaSecondaryLink || '#work')}
                className="btn-ghost cut-sm inline-flex items-center gap-2.5 bg-transparent border border-white/20 text-[#f5f4ef] font-semibold text-sm sm:text-base px-7 py-4 hover:border-[#f2603e] hover:text-[#f2603e] transition-all duration-200 hover:-translate-y-0.5 font-chakra uppercase"
              >
                {currentBanner.ctaSecondaryText || 'See our work'}
              </button>
            </div>

            {/* Banner Slide Controls & Indicators */}
            {bannerCount > 1 && (
              <div className="pt-4 flex items-center gap-4 border-t border-white/10 font-mono text-xs text-[#95928a]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSlideIndex((prev) => (prev === 0 ? bannerCount - 1 : prev - 1))}
                    className="w-8 h-8 rounded-full bg-[#141413] border border-white/20 text-white hover:border-[#f2603e] hover:text-[#f2603e] flex items-center justify-center transition-colors"
                  >
                    ‹
                  </button>
                  <span className="text-[#f2603e] font-bold">
                    0{activeSlideIndex + 1} / 0{bannerCount}
                  </span>
                  <button
                    onClick={() => setActiveSlideIndex((prev) => (prev + 1) % bannerCount)}
                    className="w-8 h-8 rounded-full bg-[#141413] border border-white/20 text-white hover:border-[#f2603e] hover:text-[#f2603e] flex items-center justify-center transition-colors"
                  >
                    ›
                  </button>
                </div>

                <div className="flex gap-1.5">
                  {heroBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeSlideIndex === idx ? 'w-6 bg-[#f2603e]' : 'w-2 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Hero Banner Image Showcase */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div
              ref={visualRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[620px] cursor-pointer perspective-1000 group"
            >
              {/* Corner Plus Markers */}
              <span className="absolute -top-6 left-0 font-mono text-[11px] text-[#605e58] tracking-widest uppercase">
                // HOMEPAGE HERO
              </span>
              <span className="absolute -bottom-6 right-0 font-mono text-[11px] text-[#f2603e] tracking-widest uppercase">
                BIZPARKSTUDIO
              </span>

              {/* Glowing Framed Container */}
              <div
                style={{ transform: transformStyle, transition: 'transform 0.15s ease-out' }}
                className="bg-[#141413] border border-[#f2603e]/40 p-2 cut shadow-2xl shadow-[#f2603e]/10 group-hover:border-[#f2603e] transition-all duration-300 relative overflow-hidden"
              >
                <div className="aspect-[16/10] w-full cut border border-white/10 overflow-hidden relative bg-black">
                  {isVideo(currentBanner.image) ? (
                    <video
                      src={currentBanner.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={currentBanner.image || '/images/hero.png'}
                      alt={currentBanner.title || 'Hero showcase'}
                      className="w-full h-full object-cover object-center block"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
