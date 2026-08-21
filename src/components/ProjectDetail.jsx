import React, { useEffect } from 'react';
import { categoriesData } from './Work';

export default function ProjectDetail({ projectId }) {
  // Find project by ID across all categories
  let project = null;
  let categoryTag = '';
  
  for (const catGroup of categoriesData) {
    const found = catGroup.projects.find((p) => p.id === projectId);
    if (found) {
      project = found;
      categoryTag = catGroup.tag;
      break;
    }
  }

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-chakra text-3xl font-bold text-white mb-4">CASE STUDY NOT FOUND</h2>
        <p className="text-[#95928a] mb-8">The project case study you are looking for does not exist or has been moved.</p>
        <a href="#" className="bg-[#f2603e] text-[#0a0a0a] font-mono text-xs uppercase tracking-wider px-6 py-3 cut-sm font-semibold">
          Return to home
        </a>
      </div>
    );
  }

  return (
    <article className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen relative overflow-hidden">
      {/* Background graphic details */}
      <div className="absolute top-10 left-10 text-[12vw] font-bold text-white/[0.01] select-none font-mono pointer-events-none">
        CASESTUDY
      </div>

      <div className="max-w-[1000px] mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-10 flex items-center justify-between">
          <a
            href="#"
            className="font-mono text-xs text-[#f2603e] hover:text-[#ff6f4a] flex items-center gap-2 group transition-colors"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO SHOWCASE
          </a>
          <span className="font-mono text-xs text-[#605e58] tracking-widest">
            {categoryTag} / {project.id.toUpperCase()}
          </span>
        </div>

        {/* Project Header Info */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <span className="font-mono text-xs text-[#f2603e] uppercase tracking-widest block mb-2">
            Client: {project.client}
          </span>
          <h1 className="font-chakra text-4xl sm:text-5xl lg:text-6xl text-white uppercase font-bold tracking-tight leading-none mb-4">
            {project.name}
          </h1>
          <p className="text-lg text-[#95928a] font-medium max-w-3xl">
            {project.type}
          </p>
        </div>

        {/* Large Premium Image Grid */}
        <div className="w-full aspect-[16/9] cut border border-white/15 overflow-hidden relative mb-14 bg-[#141413]">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Case Study Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Case Study Column */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h2 className="font-chakra text-xl uppercase tracking-wider text-white mb-4 border-l-2 border-[#f2603e] pl-3">
                Project Overview
              </h2>
              <p className="text-[#95928a] text-sm leading-relaxed mb-4">
                {project.description}
              </p>
              <p className="text-[#95928a] text-sm leading-relaxed">
                Working closely with the client team, we engineered this application from architecture definition to production hosting. The final outcome resulted in a 40% efficiency boost in core business operations, successfully meeting all target performance and availability metrics.
              </p>
            </div>

            <div>
              <h2 className="font-chakra text-xl uppercase tracking-wider text-white mb-4 border-l-2 border-[#f2603e] pl-3">
                The Solution &amp; Engineering
              </h2>
              <p className="text-[#95928a] text-sm leading-relaxed mb-4">
                We designed a decentralized component hierarchy, optimizing data fetching strategies and caching parameters. By focusing on accessibility, micro-animations, and fluid design patterns, we ensured the user experience felt premium and extremely responsive.
              </p>
              <p className="text-[#95928a] text-sm leading-relaxed">
                The development process incorporated rigorous linting checks, test automation coverage, and atomic commits. We successfully completed deployment pipelines using modern continuous integration tools, achieving near-zero server-side response latencies.
              </p>
            </div>

            {/* Scope / Deliverables List */}
            {project.features && (
              <div>
                <h2 className="font-chakra text-xl uppercase tracking-wider text-white mb-5 border-l-2 border-[#f2603e] pl-3">
                  Scope &amp; Deliverables
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-[#141413] border border-white/5 p-4 cut-sm">
                      <span className="w-1.5 h-1.5 bg-[#f2603e] mt-1.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-chakra text-sm uppercase text-white font-bold tracking-wide">
                          {feat}
                        </h4>
                        <p className="text-[11px] text-[#605e58] font-mono mt-0.5">
                          Production Ready &amp; Audited
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Meta Column */}
          <div className="lg:col-span-4 space-y-8 lg:border-l lg:border-white/10 lg:pl-8">
            
            {/* Tech Stack */}
            <div>
              <h3 className="font-mono text-xs text-[#605e58] uppercase tracking-wider mb-4">
                Tech Stack &amp; Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Vite', 'TailwindCSS', 'Framer Motion', 'NodeJS', 'Clean Architecture'].map((tech) => (
                  <span key={tech} className="text-xs font-mono text-[#f5f4ef] bg-[#141413] px-3.5 py-1.5 border border-white/10 rounded-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Specs */}
            <div className="border-t border-white/10 pt-8 space-y-4">
              <div>
                <span className="block font-mono text-[10px] text-[#605e58] uppercase">Client Entity</span>
                <span className="text-sm font-semibold text-white">{project.client}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-[#605e58] uppercase">Service Provided</span>
                <span className="text-sm font-semibold text-[#f2603e]">{project.type}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-[#605e58] uppercase">Release Date</span>
                <span className="text-sm font-semibold text-white">Q3 2026</span>
              </div>
            </div>

            {/* Final Call to Action */}
            <div className="border-t border-white/10 pt-8">
              <div className="bg-[#141413] border border-[#f2603e]/40 p-6 cut-sm space-y-4">
                <h4 className="font-chakra text-lg text-white uppercase font-bold">
                  Require a similar system?
                </h4>
                <p className="text-xs text-[#95928a] leading-relaxed">
                  We build custom software, web platforms, and brands tailored exactly to your business problems.
                </p>
                <a
                  href="#requirement-form"
                  className="w-full text-center inline-block bg-[#f2603e] text-[#0a0a0a] font-chakra font-bold text-xs uppercase tracking-wider py-3.5 cut-sm hover:bg-[#ff6f4a] transition-all"
                >
                  Discuss Project →
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </article>
  );
}
