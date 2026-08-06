import React, { useRef, useState } from 'react';

export default function Hero() {
  const visualRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('rotate3d(0, 0, 0, 0deg) translate(0px, 0px)');

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

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="relative pt-36 md:pt-48 pb-24 md:pb-32 overflow-hidden bg-[#0a0a0a]">
      {/* Ambient background glow lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[550px] h-[350px] bg-[#f2603e]/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-[#f2603e]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 text-xs text-[#f2603e] font-mono uppercase tracking-widest bg-[#141413] px-3.5 py-1.5 border border-[#f2603e]/30 cut-sm">
              <span className="w-4 h-[1px] bg-[#f2603e]" />
              // EST. SRI LANKA · DIGITAL STUDIO
            </div>

            <h1 className="font-chakra font-bold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#f5f4ef] leading-[1.08]">
              We build the<br />
              digital side of<br />
              <em className="not-italic text-[#f2603e] drop-shadow-[0_0_20px_rgba(242,96,62,0.4)]">your business.</em>
            </h1>

            <p className="text-[#95928a] text-base sm:text-lg max-w-xl leading-relaxed">
              One studio, three disciplines — software development, social media marketing, and graphic design — run from a single plan, so nothing gets lost between teams.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollTo('requirement-form')}
                className="btn-primary cut-sm inline-flex items-center gap-2.5 bg-[#f2603e] text-[#0a0a0a] font-semibold text-sm sm:text-base px-7 py-4 hover:bg-[#ff6f4a] transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-[#f2603e]/25"
              >
                Start a project →
              </button>

              <button
                onClick={() => scrollTo('work')}
                className="btn-ghost cut-sm inline-flex items-center gap-2.5 bg-transparent border border-white/20 text-[#f5f4ef] font-semibold text-sm sm:text-base px-7 py-4 hover:border-[#f2603e] hover:text-[#f2603e] transition-all duration-200 hover:-translate-y-0.5"
              >
                See our work
              </button>
            </div>

            {/* Sub-tags */}
            <div className="pt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-[#95928a] border-t border-white/10">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2603e]" />
                Branding
              </span>
              <span>•</span>
              <span>Software</span>
              <span>•</span>
              <span>Marketing</span>
              <span>•</span>
              <span>Digital Solutions</span>
            </div>
          </div>

          {/* Right Column: Balanced Hero Banner Image Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              ref={visualRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[540px] cursor-pointer perspective-1000 group"
            >
              {/* Corner Plus Markers */}
              <span className="absolute -top-6 left-0 font-mono text-[11px] text-[#605e58] tracking-widest uppercase">
                // SHOWCASE
              </span>
              <span className="absolute -bottom-6 right-0 font-mono text-[11px] text-[#f2603e] tracking-widest uppercase">
                BIZPARKSTUDIO
              </span>

              {/* Glowing Framed Container displaying the full uncropped image */}
              <div
                style={{ transform: transformStyle, transition: 'transform 0.15s ease-out' }}
                className="relative w-full cut p-[2px] bg-gradient-to-br from-[#f2603e]/60 via-white/15 to-[#f2603e]/30 shadow-2xl shadow-[#f2603e]/20"
              >
                <div className="w-full bg-[#0d0d0d] cut overflow-hidden relative">
                  {/* Hero Banner Image - 100% visible, natural aspect ratio, uncropped */}
                  <img
                    src="/images/hero.png"
                    alt="bizparkstudio - Where Businesses Grow Smarter"
                    className="w-full h-auto object-contain block group-hover:scale-[1.02] transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to hero.jpeg if hero.png is missing
                      e.target.src = '/images/hero.jpeg';
                    }}
                  />

                  {/* Glassmorphism Badge Bar */}
                  <div className="p-3 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#f2603e] font-bold tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#f2603e] animate-ping" />
                      WHERE BUSINESSES GROW SMARTER
                    </span>
                    <span className="text-[#95928a] hidden sm:inline">2026 EDITION</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
