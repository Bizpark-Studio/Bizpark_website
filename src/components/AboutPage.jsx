import React, { useState, useEffect, useRef } from 'react';
import { getStoreData, syncFromBackend } from '../data/store';

export default function AboutPage() {
  const [storeData, setStoreData] = useState(getStoreData());
  const [activeMemberId, setActiveMemberId] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleUpdate = () => setStoreData(getStoreData());
    window.addEventListener('bizpark_store_updated', handleUpdate);

    // Live sync from cloud / local storage
    syncFromBackend().then((res) => {
      if (res && res.success && res.data) {
        setStoreData(res.data);
      }
    });

    return () => window.removeEventListener('bizpark_store_updated', handleUpdate);
  }, []);

  const teamMembers = storeData.teamMembers || [];
  const settings = storeData.settings || {};
  const whatsappNum = settings.whatsappNumber || '+94 72 954 5538';

  // Mobile scroll focus: dynamically reveal colors on the team card currently in viewport center
  useEffect(() => {
    let ticking = false;

    const checkActiveCard = () => {
      // On desktop (width >= 768px), keep standard mouse hover interactions
      if (typeof window === 'undefined' || window.innerWidth >= 768) {
        setActiveMemberId(null);
        ticking = false;
        return;
      }

      const viewportHeight = window.innerHeight;
      const focalPoint = viewportHeight * 0.48; // Screen focal zone
      let closestKey = null;
      let minDistance = Infinity;

      Object.entries(cardRefs.current).forEach(([key, el]) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Eligible when card is within active reading zone of viewport
        const isInZone = rect.top < viewportHeight * 0.82 && rect.bottom > viewportHeight * 0.18;
        if (isInZone) {
          const cardCenter = rect.top + rect.height / 2;
          const distance = Math.abs(cardCenter - focalPoint);
          if (distance < minDistance) {
            minDistance = distance;
            closestKey = key;
          }
        }
      });

      setActiveMemberId(closestKey);
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkActiveCard);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Initial check
    checkActiveCard();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [teamMembers]);

  const formatWaNumber = (num) => {
    if (!num) return '94729545538';
    const digitsOnly = num.replace(/\D/g, '');
    if (digitsOnly.startsWith('0')) return `94${digitsOnly.slice(1)}`;
    if (digitsOnly.startsWith('94')) return digitsOnly;
    return `94${digitsOnly}`;
  };

  const cleanWa = formatWaNumber(whatsappNum);

  return (
    <div className="pt-32 md:pt-40 pb-24 bg-[#0a0a0a] min-h-screen text-[#f5f4ef]">
      {/* Background ambient lighting */}
      <div className="absolute top-28 left-1/4 -translate-x-1/2 w-[600px] h-[350px] bg-[#f2603e]/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[450px] h-[300px] bg-[#f2603e]/8 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1480px] 2xl:max-w-[1640px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <a
            href="#top"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#95928a] hover:text-[#f2603e] transition-colors uppercase tracking-wider"
          >
            <span>←</span> Back to Overview
          </a>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 text-xs text-[#f2603e] font-mono uppercase tracking-widest bg-[#141413] px-3.5 py-1.5 border border-[#f2603e]/30 cut-sm font-bold mb-5">
            <span className="w-3 h-[1px] bg-[#f2603e]" />
            About Bizpark Studio
          </div>
          <h1 className="font-chakra font-bold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-none">
            Architecting the <span className="text-[#f2603e]">digital future</span> of business.
          </h1>
          <p className="text-[#95928a] text-base sm:text-lg mt-6 leading-relaxed">
            Bizpark Studio is a multidisciplinary engineering and brand collective. We unify software architecture, high-converting digital branding, and data-driven performance marketing under one roof — executing from a single strategic plan so nothing gets lost between fragmented teams.
          </p>
        </div>

        {/* Studio Statistics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#141413] border border-white/10 cut mb-24 shadow-2xl">
          <div className="border-r border-white/10 last:border-r-0 pr-4">
            <div className="font-chakra font-bold text-3xl sm:text-4xl text-[#f2603e]">
              50+
            </div>
            <div className="font-mono text-xs text-[#95928a] uppercase tracking-wider mt-1">
              Projects Shipped
            </div>
          </div>
          <div className="border-r border-white/10 last:border-r-0 px-4">
            <div className="font-chakra font-bold text-3xl sm:text-4xl text-white">
              99.9%
            </div>
            <div className="font-mono text-xs text-[#95928a] uppercase tracking-wider mt-1">
              Software Uptime
            </div>
          </div>
          <div className="border-r border-white/10 last:border-r-0 px-4">
            <div className="font-chakra font-bold text-3xl sm:text-4xl text-[#f2603e]">
              03
            </div>
            <div className="font-mono text-xs text-[#95928a] uppercase tracking-wider mt-1">
              Core Disciplines
            </div>
          </div>
          <div className="pl-4">
            <div className="font-chakra font-bold text-3xl sm:text-4xl text-white">
              100%
            </div>
            <div className="font-mono text-xs text-[#95928a] uppercase tracking-wider mt-1">
              In-House Execution
            </div>
          </div>
        </div>

        {/* The 3 Core Disciplines */}
        <div className="mb-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs text-[#f2603e] uppercase tracking-widest font-bold">
              // HOW WE DELIVER VALUE
            </span>
            <h2 className="font-chakra font-bold text-3xl sm:text-4xl text-white uppercase mt-2">
              Three Disciplines. One Single Engine.
            </h2>
            <p className="text-sm text-[#95928a] mt-3">
              Traditional businesses hire three separate agencies: developers who don't understand branding, designers who don't write code, and marketers who don't understand the product. We solved this.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-[#141413] border border-white/10 hover:border-[#f2603e] p-8 cut transition-all duration-300 group">
              <div className="text-[#f2603e] font-mono text-sm font-bold mb-4">
                01 / ENGINEERING
              </div>
              <h3 className="font-chakra text-2xl font-bold text-white uppercase mb-3">
                Software &amp; Web Systems
              </h3>
              <p className="text-sm text-[#95928a] leading-relaxed">
                Cloud-native POS platforms, restaurant management ERPs, school administration portals, and high-performance headless web apps engineered for speed, offline reliability, and scalability.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#141413] border border-white/10 hover:border-[#f2603e] p-8 cut transition-all duration-300 group">
              <div className="text-[#f2603e] font-mono text-sm font-bold mb-4">
                02 / ARCHITECTURE
              </div>
              <h3 className="font-chakra text-2xl font-bold text-white uppercase mb-3">
                Brand &amp; Visual Identity
              </h3>
              <p className="text-sm text-[#95928a] leading-relaxed">
                Authoritative brand guidelines, custom logo typography, product packaging design, stationery suites, and design tokens that establish undeniable market presence.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#141413] border border-white/10 hover:border-[#f2603e] p-8 cut transition-all duration-300 group">
              <div className="text-[#f2603e] font-mono text-sm font-bold mb-4">
                03 / ACQUISITION
              </div>
              <h3 className="font-chakra text-2xl font-bold text-white uppercase mb-3">
                Digital Performance &amp; Growth
              </h3>
              <p className="text-sm text-[#95928a] leading-relaxed">
                Data-backed social media campaigns, paid acquisition ad funnels, content production pipelines, and automated lead capture systems that convert visitors into paying clients.
              </p>
            </div>

          </div>
        </div>

        {/* TEAM MEMBERS SECTION */}
        <div id="team" className="mb-24 pt-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-b border-white/10 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-[#f2603e] font-mono uppercase tracking-widest bg-[#141413] px-3 py-1.5 border border-[#f2603e]/30 cut-sm font-bold mb-3">
                <span className="w-2.5 h-[1px] bg-[#f2603e]" />
                The Core Collective
              </div>
              <h2 className="font-chakra font-bold text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
                Meet Our <span className="text-[#f2603e]">Team</span>
              </h2>
              <p className="text-sm text-[#95928a] max-w-xl mt-2 leading-relaxed">
                Experienced software engineers, creative brand architects, and performance marketers driving digital excellence.
              </p>
            </div>

            <div className="text-right font-mono text-xs text-[#605e58]">
              // ACTIVE SPECIALISTS: <strong className="text-white">{teamMembers.length}</strong>
            </div>
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => {
              const memberKey = String(member.id || idx);
              const isActive = activeMemberId === memberKey;

              return (
                <div
                  key={memberKey}
                  ref={(el) => {
                    if (el) {
                      cardRefs.current[memberKey] = el;
                    } else {
                      delete cardRefs.current[memberKey];
                    }
                  }}
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      setActiveMemberId(memberKey);
                    }
                  }}
                  className={`bg-[#141413] border cut transition-all duration-500 group flex flex-col overflow-hidden shadow-xl cursor-pointer md:cursor-default ${
                    isActive
                      ? 'border-[#f2603e] shadow-[0_14px_45px_rgba(242,96,62,0.22)] -translate-y-1.5 ring-1 ring-[#f2603e]/40'
                      : 'border-white/10 hover:border-[#f2603e]'
                  }`}
                >
                  {/* Member Profile Photo Frame */}
                  <div className="aspect-[4/3] w-full relative bg-[#0a0a0a] overflow-hidden border-b border-white/10">
                    <img
                      src={member.image || '/images/hero.png'}
                      alt={member.name}
                      className={`w-full h-full object-cover object-top filter transition-all duration-700 ease-out ${
                        isActive
                          ? 'grayscale-0 scale-105'
                          : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
                      }`}
                      onError={(e) => {
                        e.target.src = '/images/hero.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-transparent to-transparent pointer-events-none" />
                    
                    {/* Badge */}
                    <div
                      className={`absolute top-3 right-3 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 cut-sm border transition-all duration-300 ${
                        isActive
                          ? 'bg-[#f2603e] text-black font-bold border-[#f2603e] shadow-[0_0_15px_rgba(242,96,62,0.5)]'
                          : 'bg-black/80 backdrop-blur-md text-[#f2603e] border-white/15'
                      }`}
                    >
                      {member.role ? member.role.split(' ')[0] : 'LEAD'}
                    </div>
                  </div>

                  {/* Member Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="font-mono text-xs text-[#f2603e] font-bold uppercase tracking-wider mb-1">
                        {member.role || 'Digital Specialist'}
                      </div>
                      <h3
                        className={`font-chakra font-bold text-2xl uppercase transition-colors duration-300 ${
                          isActive
                            ? 'text-[#f2603e]'
                            : 'text-white group-hover:text-[#f2603e]'
                        }`}
                      >
                        {member.name}
                      </h3>
                      <p className="text-xs text-[#95928a] leading-relaxed mt-2.5">
                        {member.bio || 'Directing technical and design execution across client projects.'}
                      </p>
                    </div>

                    {/* Contact Links */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-[#95928a] hover:text-white transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>✉</span> Contact
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`https://wa.me/${formatWaNumber(member.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#25D366] hover:underline inline-flex items-center gap-1 font-bold"
                        >
                          <span>💬</span> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="bg-[#141413] border border-[#f2603e]/40 p-8 sm:p-12 cut shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs text-[#f2603e] uppercase tracking-widest font-bold">
              // READY TO COLLABORATE?
            </span>
            <h3 className="font-chakra font-bold text-2xl sm:text-3xl lg:text-4xl text-white uppercase">
              Let's Build Your Digital Advantage.
            </h3>
            <p className="text-xs sm:text-sm text-[#95928a] leading-relaxed">
              Whether starting from scratch or scaling an existing operation, our collective is ready to design and engineer your solution.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="#requirement-form"
              className="inline-flex items-center gap-2 bg-[#f2603e] text-black font-chakra font-bold text-xs uppercase px-7 py-3.5 cut-sm hover:bg-[#ff6f4a] transition-all shadow-lg"
            >
              <span>Start a Project</span>
              <span>→</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-chakra font-bold text-xs uppercase px-7 py-3.5 cut-sm hover:bg-white/20 transition-all"
            >
              <span>Contact Studio</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
