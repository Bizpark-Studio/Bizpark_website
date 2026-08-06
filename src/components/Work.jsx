import React, { useState } from 'react';

export default function Work() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      tag: 'Web App',
      name: 'OmniDesk Platform',
      client: 'Enterprise Client',
      type: 'Custom SaaS platform build',
      description: 'Built a high-performance web dashboard handling real-time data streaming, automated user onboarding, and seamless API integrations.',
    },
    {
      id: 2,
      tag: 'Brand Identity',
      name: 'Vortex Capital',
      client: 'Fintech Startup',
      type: 'Logo & visual system',
      description: 'Designed an authoritative brand identity, modern typography system, dark-mode design system, and multi-channel asset suite.',
    },
    {
      id: 3,
      tag: 'Campaign',
      name: 'Apex Growth',
      client: 'E-commerce Brand',
      type: 'Social media & paid ads',
      description: 'Scaled social media reach by 340% through targeted creative campaigns, short-form motion design, and high-converting funnel strategy.',
    },
    {
      id: 4,
      tag: 'E-commerce',
      name: 'Aura Lifestyle',
      client: 'Retail Brand',
      type: 'Store build & launch',
      description: 'Engineered a lightning-fast custom headless Shopify store with bespoke product configurators and optimized checkout flows.',
    },
  ];

  return (
    <section id="work" className="py-28 bg-[#0a0a0a] relative">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Head */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2.5 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-3">
            <span className="w-4 h-[1px] bg-[#f2603e]" />
            Selected work
          </div>
          <h2 className="font-chakra font-semibold text-3xl sm:text-4xl lg:text-5xl uppercase text-[#f5f4ef] leading-tight">
            A few things we'd<br />
            show a new client.
          </h2>
        </div>

        {/* Work Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-10">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="group cursor-pointer relative aspect-[4/3] bg-[#141413] border border-white/10 overflow-hidden flex items-end p-7 sm:p-8 cut transition-all duration-300 hover:border-[#f2603e]/50"
            >
              {/* Category Tag */}
              <span className="absolute top-6 left-6 font-mono text-[11px] text-[#f2603e] bg-[#0a0a0a]/80 backdrop-blur-sm px-3 py-1 border border-[#f2603e]/30 tracking-wider">
                {proj.tag}
              </span>

              {/* Card Gradient Hover Background */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#f2603e]/5 to-[#f2603e]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Meta details */}
              <div className="relative z-10 w-full flex items-end justify-between">
                <div>
                  <h3 className="font-chakra text-xl sm:text-2xl text-[#f5f4ef] uppercase tracking-wide group-hover:text-[#f2603e] transition-colors duration-200 mb-1">
                    {proj.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#95928a]">
                    {proj.type}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#f2603e] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-[#605e58] font-mono">
          Placeholder cards — swap these for your real case studies, screenshots, and client names once you have 3–4 projects ready to show.
        </p>

      </div>

      {/* Interactive Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141413] border border-[#f2603e]/40 p-8 max-w-lg w-full cut relative shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-[#95928a] hover:text-white font-mono text-sm"
            >
              ✕ CLOSE
            </button>
            <span className="font-mono text-xs text-[#f2603e] uppercase tracking-widest block mb-2">
              {selectedProject.tag} · {selectedProject.client}
            </span>
            <h3 className="font-chakra text-2xl text-white uppercase font-bold mb-2">
              {selectedProject.name}
            </h3>
            <p className="text-sm font-semibold text-[#f2603e] mb-4">
              {selectedProject.type}
            </p>
            <p className="text-sm text-[#95928a] leading-relaxed mb-6">
              {selectedProject.description}
            </p>
            <div className="flex gap-4">
              <a
                href="#requirement-form"
                onClick={() => setSelectedProject(null)}
                className="bg-[#f2603e] text-[#0a0a0a] font-semibold text-xs uppercase px-5 py-3 cut-sm hover:bg-[#ff6f4a]"
              >
                Discuss Similar Project →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
