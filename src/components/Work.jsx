import React, { useState, useEffect } from 'react';
import { getStoreData } from '../data/store';

export default function Work() {
  const [storeData, setStoreData] = useState(getStoreData());

  // Auto-play state for category cards
  const [slideIndices, setSlideIndices] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });

  useEffect(() => {
    const handleUpdate = () => {
      setStoreData(getStoreData());
    };
    window.addEventListener('bizpark_store_updated', handleUpdate);
    return () => window.removeEventListener('bizpark_store_updated', handleUpdate);
  }, []);

  const categories = storeData.categories || [];

  // Auto-play slides inside each category card independently
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndices((prev) => {
        const next = { ...prev };
        (storeData.categories || []).forEach((cat, catIdx) => {
          const featuredProjs = cat.projects.filter((p) => p.featuredOnHome !== false);
          const count = featuredProjs.length || cat.projects.length || 1;
          next[catIdx] = (prev[catIdx] + 1) % count;
        });
        return next;
      });
    }, 3800);

    return () => clearInterval(timer);
  }, [storeData]);

  return (
    <section id="work" className="py-28 bg-[#0a0a0a] relative">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Head */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-3">
              <span className="w-4 h-[1px] bg-[#f2603e]" />
              Selected work
            </div>
            <h2 className="font-chakra font-semibold text-3xl sm:text-4xl lg:text-5xl uppercase text-[#f5f4ef] leading-tight">
              A FEW THINGS WE'D<br />
              SHOW A NEW CLIENT.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#95928a] font-mono max-w-sm">
            Select any category below to browse our past projects, filter by industry sub-tags, and view in-depth case studies.
          </p>
        </div>

        {/* 4 Category Work Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-10">
          {categories.map((catGroup, catIdx) => {
            const displayProjects = catGroup.projects.filter(p => p.featuredOnHome !== false);
            const activeProjects = displayProjects.length > 0 ? displayProjects : catGroup.projects;
            const currentProjIndex = (slideIndices[catIdx] || 0) % (activeProjects.length || 1);
            const currentProject = activeProjects[currentProjIndex] || catGroup.projects[0];

            return (
              <div
                key={catGroup.key || catIdx}
                className="group relative bg-[#141413] border border-white/10 overflow-hidden flex flex-col justify-between p-7 sm:p-8 cut transition-all duration-300 hover:border-[#f2603e]/60 shadow-xl min-h-[360px]"
              >
                {/* Auto Sliding Background Images Track */}
                <div
                  className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{ transform: `translateX(-${currentProjIndex * 100}%)` }}
                >
                  {activeProjects.map((proj) => (
                    <div key={proj.id} className="w-full h-full flex-shrink-0 relative">
                      <img
                        src={proj.image}
                        alt={proj.name}
                        className="w-full h-full object-cover object-center block transform group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                      />
                    </div>
                  ))}
                </div>

                {/* Top Badge: Category & Sub-tag */}
                <div className="relative z-20 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#f2603e] bg-[#0a0a0a]/95 backdrop-blur-md px-4 py-2 border border-[#f2603e]/45 tracking-wider uppercase shadow-lg">
                    {catGroup.category} ({currentProjIndex + 1}/{activeProjects.length})
                  </span>
                  
                  {currentProject?.subTag && (
                    <span className="font-mono text-[10px] text-[#f5f4ef] bg-black/90 backdrop-blur-md px-3 py-1 border border-white/20 cut-sm font-semibold">
                      {currentProject.subTag}
                    </span>
                  )}
                </div>

                {/* Subtle Card Gradient Overlay strictly for bottom text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Content details for active project slide */}
                <div className="relative z-20 w-full pt-20">
                  <div className="space-y-1 mb-6">
                    <h3 className="font-chakra text-2xl sm:text-3xl text-[#f5f4ef] uppercase tracking-wide group-hover:text-[#f2603e] transition-colors duration-200 font-bold">
                      {currentProject?.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#95928a] font-medium">
                      Client: {currentProject?.client}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                    <a
                      href={`#category-${catGroup.key}`}
                      className="text-xs font-mono text-[#f2603e] hover:text-[#ff6f4a] flex items-center gap-1.5 font-bold uppercase tracking-wider"
                    >
                      Browse {catGroup.category} Projects →
                    </a>

                    <a
                      href={`#project-${currentProject?.id}`}
                      className="text-xs font-mono text-[#0a0a0a] bg-[#f2603e] hover:bg-[#ff6f4a] font-semibold px-3 py-1.5 cut-sm transition-all duration-200"
                    >
                      View Details →
                    </a>
                  </div>
                </div>

                {/* Slide indicator dots at bottom */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                  {activeProjects.map((_, pIdx) => (
                    <span
                      key={pIdx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        currentProjIndex === pIdx ? 'w-5 bg-[#f2603e]' : 'w-1.5 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Subtext */}
        <p className="text-xs sm:text-sm text-[#95928a] font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f2603e] animate-pulse" />
          Explore our featured client partnerships across Branding, Web Solutions, Digital Marketing &amp; Software Solutions. Click any category or project to inspect full case studies and development process photos.
        </p>

      </div>
    </section>
  );
}

