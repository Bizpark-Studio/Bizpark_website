import React, { useState, useEffect, useMemo } from 'react';
import { getStoreData } from '../data/store';
import Products from './Products';

export default function CategoryProjects({ categoryKey }) {
  const [storeData, setStoreData] = useState(getStoreData());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubTag, setSelectedSubTag] = useState('ALL');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryKey]);

  useEffect(() => {
    const handleUpdate = () => {
      setStoreData(getStoreData());
    };
    window.addEventListener('bizpark_store_updated', handleUpdate);
    return () => window.removeEventListener('bizpark_store_updated', handleUpdate);
  }, []);

  const category = useMemo(() => {
    const cats = storeData.categories || [];
    return cats.find((c) => c.key === categoryKey) || cats[0];
  }, [storeData, categoryKey]);

  // Extract all unique sub-tags for this category
  const availableSubTags = useMemo(() => {
    if (!category || !category.projects) return ['ALL'];
    const tags = new Set();
    category.projects.forEach((p) => {
      if (p.subTag) tags.add(p.subTag.trim());
    });
    return ['ALL', ...Array.from(tags)];
  }, [category]);

  // Filter projects by search term and selected sub-tag
  const filteredProjects = useMemo(() => {
    if (!category || !category.projects) return [];
    return category.projects.filter((p) => {
      const matchesSubTag =
        selectedSubTag === 'ALL' ||
        (p.subTag && p.subTag.toLowerCase() === selectedSubTag.toLowerCase());

      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (p.client && p.client.toLowerCase().includes(query)) ||
        (p.subTag && p.subTag.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query));

      return matchesSubTag && matchesSearch;
    });
  }, [category, selectedSubTag, searchTerm]);

  if (!category) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-chakra text-3xl font-bold text-white mb-4">CATEGORY NOT FOUND</h2>
        <a href="#" className="bg-[#f2603e] text-[#0a0a0a] font-mono text-xs uppercase tracking-wider px-6 py-3 cut-sm font-semibold">
          Return Home
        </a>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen relative overflow-hidden">
      {/* Background Large Text Detail */}
      <div className="absolute top-10 right-10 text-[12vw] font-bold text-white/[0.01] select-none font-mono pointer-events-none uppercase">
        {category.category}
      </div>

      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-10 flex items-center justify-between">
          <a
            href="#work"
            className="font-mono text-xs text-[#f2603e] hover:text-[#ff6f4a] flex items-center gap-2 group transition-colors font-bold uppercase tracking-wider"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO ALL WORK
          </a>
          <span className="font-mono text-xs text-[#605e58] tracking-widest uppercase">
            CATEGORIES / {category.category}
          </span>
        </div>

        {/* Category Header */}
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs text-[#f2603e] uppercase tracking-widest block mb-2 font-bold">
              WORK CATEGORY SHOWCASE
            </span>
            <h1 className="font-chakra text-4xl sm:text-5xl lg:text-6xl text-white uppercase font-bold tracking-tight leading-none mb-4">
              {category.category}
            </h1>
            <p className="text-sm sm:text-base text-[#95928a] max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#141413] border border-white/10 px-5 py-3 cut-sm font-mono text-xs text-[#95928a]">
            <span className="w-2 h-2 rounded-full bg-[#f2603e] animate-pulse" />
            Total Case Studies: <span className="text-white font-bold">{category.projects.length}</span>
          </div>
        </div>

        {/* READY-TO-DEPLOY SOFTWARE HERO BANNERS (WHEN BROWSING SOFTWARE SOLUTIONS) */}
        {categoryKey === 'software-solutions' && (
          <div className="mb-10">
            <Products showGrid={false} />
          </div>
        )}

        {/* Interactive Search & Sub-Tag Filter Bar */}
        <div id="software-projects-grid" className="bg-[#141413] border border-white/10 p-6 cut mb-12 space-y-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="relative flex-1">
              <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#605e58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={`Search ${category.category} projects (e.g. clothing brand, app, client name)...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] pl-10 pr-4 py-3 text-xs font-mono text-white placeholder-[#605e58] outline-none cut-sm transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#95928a] hover:text-white"
                >
                  Clear ✕
                </button>
              )}
            </div>

            {/* Filter Count Indicator */}
            <div className="font-mono text-xs text-[#95928a] flex items-center gap-2">
              Showing <span className="text-[#f2603e] font-bold">{filteredProjects.length}</span> of {category.projects.length} projects
            </div>

          </div>

          {/* Sub-Tag Filter Pills */}
          {availableSubTags.length > 1 && (
            <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-white/5">
              <span className="font-mono text-[11px] text-[#605e58] uppercase tracking-wider mr-2">
                Industry Filter:
              </span>
              {availableSubTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedSubTag(tag)}
                  className={`font-mono text-xs uppercase px-4 py-1.5 cut-sm transition-all duration-200 ${
                    selectedSubTag.toLowerCase() === tag.toLowerCase()
                      ? 'bg-[#f2603e] text-[#0a0a0a] font-bold shadow-md shadow-[#f2603e]/20'
                      : 'bg-[#0a0a0a] text-[#95928a] hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-[#141413] border border-white/10 p-12 text-center cut">
            <h3 className="font-chakra text-xl text-white uppercase font-bold mb-2">No Matching Projects Found</h3>
            <p className="text-xs font-mono text-[#95928a] mb-6">
              Try adjusting your search keywords or switching the industry filter tag.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedSubTag('ALL'); }}
              className="bg-[#f2603e] text-black font-mono text-xs font-bold uppercase tracking-wider px-6 py-2.5 cut-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="group bg-[#141413] border border-white/10 hover:border-[#f2603e]/60 transition-all duration-300 cut flex flex-col justify-between overflow-hidden shadow-xl"
              >
                <div>
                  {/* Image Preview with Sub-tag badge */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/60 border-b border-white/10">
                    <img
                      src={proj.image}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-transparent to-transparent opacity-60" />
                    
                    {proj.subTag && (
                      <span className="absolute top-4 left-4 font-mono text-[10px] text-[#f2603e] bg-[#0a0a0a]/90 backdrop-blur-md px-3 py-1 border border-[#f2603e]/40 font-bold uppercase tracking-wider">
                        {proj.subTag}
                      </span>
                    )}

                    {proj.processImages && proj.processImages.length > 0 && (
                      <span className="absolute top-4 right-4 font-mono text-[9px] text-[#f5f4ef] bg-black/80 backdrop-blur-md px-2.5 py-1 border border-white/20 cut-sm">
                        📸 {proj.processImages.length} Process Photos
                      </span>
                    )}
                  </div>

                  {/* Card Main Info */}
                  <div className="p-6 space-y-3">
                    <span className="font-mono text-[11px] text-[#95928a] block">
                      Client: <span className="text-[#f5f4ef]">{proj.client}</span>
                    </span>

                    <h3 className="font-chakra text-2xl text-white uppercase font-bold group-hover:text-[#f2603e] transition-colors">
                      {proj.name}
                    </h3>

                    <p className="text-xs text-[#95928a] leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    {/* Features list */}
                    {proj.features && proj.features.length > 0 && (
                      <div className="pt-2">
                        <ul className="space-y-1 text-[11px] font-mono text-[#605e58]">
                          {proj.features.slice(0, 2).map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-[#f2603e]" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="p-6 pt-0">
                  <a
                    href={`#project-${proj.id}`}
                    className="w-full inline-flex items-center justify-between font-mono text-xs text-[#f2603e] bg-black/40 hover:bg-[#f2603e] hover:text-black border border-[#f2603e]/40 hover:border-transparent px-4 py-3 transition-all duration-200 cut-sm font-semibold uppercase tracking-wider"
                  >
                    <span>
                      {categoryKey === 'software-solutions'
                        ? 'Explore Software & Trial Download'
                        : 'View Project & Process Photos'}
                    </span>
                    <span>→</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
