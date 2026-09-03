import React, { useState, useEffect } from 'react';
import { getStoreData } from '../data/store';

export default function Products({ showGrid = true }) {
  const [storeData, setStoreData] = useState(getStoreData());
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setStoreData(getStoreData());
    };
    window.addEventListener('bizpark_store_updated', handleUpdate);
    return () => window.removeEventListener('bizpark_store_updated', handleUpdate);
  }, []);

  const banners = storeData.softwareBanners || [];
  const softwareCat = (storeData.categories || []).find((c) => c.key === 'software-solutions');
  const products = (softwareCat && softwareCat.projects) || storeData.softwareProducts || [];
  const bannerCount = banners.length;

  // Auto-play software banners slider
  useEffect(() => {
    if (bannerCount <= 1) return;
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerCount);
    }, 4500);
    return () => clearInterval(timer);
  }, [bannerCount]);

  return (
    <section id="products" className={`${showGrid ? 'py-28' : 'pt-4 pb-10'} bg-[#0a0a0a] relative ${showGrid ? 'border-t border-white/5' : ''}`}>
      {/* Background Cyber Details */}
      {showGrid && (
        <div className="absolute top-0 right-10 text-[10vw] font-bold text-white/[0.01] select-none font-mono pointer-events-none uppercase">
          SOLUTIONS
        </div>
      )}

      <div className="max-w-[1240px] mx-auto px-0">
        
        {/* Section Head */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2.5 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-3 font-bold">
            <span className="w-4 h-[1px] bg-[#f2603e]" />
            FEATURED SOFTWARE PLATFORMS
          </div>
          <h2 className="font-chakra font-semibold text-3xl sm:text-4xl uppercase text-[#f5f4ef] leading-tight">
            Ready-to-Deploy<br />
            Enterprise Software Products.
          </h2>
        </div>

        {/* HERO SECTION SLIDING SOFTWARE BANNERS */}
        {banners.length > 0 && (
          <div className="relative mb-12 overflow-hidden cut border border-[#f2603e]/40 bg-[#141413] shadow-2xl">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
            >
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="w-full flex-shrink-0 relative min-h-[300px] sm:min-h-[350px] flex items-center p-8 sm:p-12 overflow-hidden"
                >
                  {/* Banner Image Background */}
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10" />

                  {/* Content Overlays */}
                  <div className="relative z-20 max-w-xl space-y-4">
                    {banner.badge && (
                      <span className="font-mono text-xs font-bold text-[#f2603e] bg-black/90 px-3.5 py-1 border border-[#f2603e]/40 cut-sm tracking-wider uppercase inline-block">
                        ⚡ {banner.badge}
                      </span>
                    )}

                    <h3 className="font-chakra text-3xl sm:text-4xl text-white uppercase font-bold tracking-wide leading-tight">
                      {banner.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#95928a] font-medium leading-relaxed">
                      {banner.subtitle}
                    </p>

                    <div className="pt-2">
                      <a
                        href={banner.productId ? `#project-${banner.productId}` : '#software-projects-grid'}
                        className="inline-flex items-center gap-2 bg-[#f2603e] text-black font-chakra font-bold text-xs uppercase tracking-wider px-6 py-3.5 cut-sm hover:bg-[#ff6f4a] transition-all shadow-lg"
                      >
                        {banner.ctaText || 'Explore Solution →'}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Banner Controls & Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-4 right-6 z-30 flex items-center gap-3">
                <button
                  onClick={() => setBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                  className="w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white font-mono text-xs hover:border-[#f2603e] hover:text-[#f2603e] flex items-center justify-center"
                >
                  ‹
                </button>
                <div className="flex gap-1.5">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBannerIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        bannerIndex === idx ? 'w-6 bg-[#f2603e]' : 'w-2 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setBannerIndex((prev) => (prev + 1) % banners.length)}
                  className="w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white font-mono text-xs hover:border-[#f2603e] hover:text-[#f2603e] flex items-center justify-center"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ready-to-Deploy Products Grid (Optional) */}
        {showGrid && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="group relative bg-[#141413] border border-white/10 p-8 cut transition-all duration-300 hover:border-[#f2603e]/60 shadow-xl flex flex-col justify-between min-h-[440px]"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs text-[#f2603e] font-bold uppercase tracking-wider bg-black/40 px-2.5 py-1 border border-[#f2603e]/20 cut-sm">
                    {prod.tag}
                  </span>
                  <span className="font-mono text-[10px] text-[#605e58]">
                    {prod.num || `PROD / ${prod.id}`}
                  </span>
                </div>

                {/* Product Icon */}
                <div className="mb-6 text-[#f2603e]">
                  <svg className="w-12 h-12" viewBox="0 0 46 46" fill="none">
                    <rect x="4" y="6" width="38" height="24" rx="2" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="4" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="2.5" />
                    <rect x="15" y="30" width="16" height="10" rx="1" stroke="#f5f4ef" strokeWidth="2" />
                    <line x1="8" y1="40" x2="38" y2="40" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>

                {/* Product Title */}
                <h3 className="font-chakra font-semibold text-2xl uppercase tracking-wide text-[#f5f4ef] group-hover:text-[#f2603e] transition-colors duration-200 mb-3">
                  {prod.name}
                </h3>

                {/* Product Description */}
                <p className="text-[#95928a] text-sm leading-relaxed mb-6">
                  {prod.shortDescription || prod.description}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="space-y-5 pt-4 border-t border-white/5">
                {/* Tech Badges */}
                {prod.tech && (
                  <div className="flex flex-wrap gap-1.5">
                    {prod.tech.map((t) => (
                      <span key={t} className="text-[10px] font-mono text-[#605e58] bg-[#0a0a0a] px-2 py-0.5 border border-white/5 rounded-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <a
                  href={`#product-${prod.id}`}
                  className="w-full inline-flex items-center justify-between font-mono text-xs text-[#f2603e] bg-black/40 hover:bg-[#f2603e] hover:text-black border border-[#f2603e]/40 hover:border-transparent px-4 py-3 transition-all duration-200 cut-sm font-semibold uppercase tracking-wider"
                >
                  <span>Explore Software &amp; Trial Download</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
