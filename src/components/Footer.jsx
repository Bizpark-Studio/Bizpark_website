import React from 'react';
const logoImg = '/images/logo.png';

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* CTA BANNER */}
      <section className="bg-[#f2603e] text-[#0a0a0a] py-20 relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <h2 className="font-chakra font-semibold text-3xl sm:text-4xl lg:text-5xl uppercase leading-tight max-w-2xl">
            Got a project in mind?<br />
            Let's build the plan together.
          </h2>
          <button
            onClick={() => scrollTo('requirement-form')}
            className="bg-[#0a0a0a] text-white hover:bg-[#1c1c1a] font-semibold text-sm px-8 py-4 cut-sm transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
          >
            Start a project →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="pt-20 pb-8 bg-[#0a0a0a] text-[#f5f4ef] border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
            
            {/* Brand column */}
            <div className="lg:col-span-5 space-y-4">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('top');
                }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 flex-shrink-0 relative overflow-hidden rounded">
                  <img
                    src={logoImg}
                    alt="bizparkstudio logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <svg className="w-8 h-8 hidden" viewBox="0 0 100 100" fill="none">
                    <path d="M50 6 L94 44 L60 74 L60 44 L36 64 L36 90 L6 64 Z" fill="#F2603E" />
                    <path d="M50 26 L74 44 L36 90 L36 64 L60 44 Z" fill="#F5F4EF" />
                    <path d="M50 62 L60 74 L60 90 L50 82 Z" fill="#0a0a0a" />
                  </svg>
                </div>
                <span className="font-chakra font-semibold text-xl tracking-wider text-white lowercase">
                  bizpark<span className="text-[#f2603e]">s</span>tudio
                </span>
              </a>

              <p className="text-[#95928a] text-sm leading-relaxed max-w-sm">
                A studio that builds the software, marketing, and design your business needs to grow — under one roof, on one plan.
              </p>
            </div>

            {/* Studio links */}
            <div className="lg:col-span-2 space-y-3">
              <h5 className="font-mono text-xs text-[#605e58] uppercase tracking-wider mb-4">
                Studio
              </h5>
              <a
                href="#top"
                onClick={(e) => { e.preventDefault(); scrollTo('top'); }}
                className="block text-sm text-[#95928a] hover:text-[#f2603e] transition-colors"
              >
                About
              </a>
              <a
                href="#work"
                onClick={(e) => { e.preventDefault(); scrollTo('work'); }}
                className="block text-sm text-[#95928a] hover:text-[#f2603e] transition-colors"
              >
                Work
              </a>
              <a
                href="#process"
                onClick={(e) => { e.preventDefault(); scrollTo('process'); }}
                className="block text-sm text-[#95928a] hover:text-[#f2603e] transition-colors"
              >
                Process
              </a>
            </div>

            {/* Services links */}
            <div className="lg:col-span-2 space-y-3">
              <h5 className="font-mono text-xs text-[#605e58] uppercase tracking-wider mb-4">
                Services
              </h5>
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); scrollTo('services'); }}
                className="block text-sm text-[#95928a] hover:text-[#f2603e] transition-colors"
              >
                Development
              </a>
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); scrollTo('services'); }}
                className="block text-sm text-[#95928a] hover:text-[#f2603e] transition-colors"
              >
                Marketing
              </a>
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); scrollTo('services'); }}
                className="block text-sm text-[#95928a] hover:text-[#f2603e] transition-colors"
              >
                Design
              </a>
            </div>

            {/* Contact links */}
            <div className="lg:col-span-3 space-y-3">
              <h5 className="font-mono text-xs text-[#605e58] uppercase tracking-wider mb-4">
                Contact
              </h5>
              <a
                href="mailto:hello@bizparkstudio.com"
                className="block text-sm text-[#95928a] hover:text-[#f2603e] transition-colors"
              >
                hello@bizparkstudio.com
              </a>
              <a
                href="tel:+94000000000"
                className="block text-sm text-[#95928a] hover:text-[#f2603e] transition-colors"
              >
                +94 00 000 0000
              </a>
              <p className="text-sm text-[#95928a]">
                Colombo, Sri Lanka
              </p>
            </div>

          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-7 text-xs text-[#605e58]">
            <span>© 2026 bizparkstudio. All rights reserved.</span>
            <div className="flex items-center gap-6 font-mono">
              <a href="#" className="hover:text-[#f2603e] transition-colors">IG</a>
              <a href="#" className="hover:text-[#f2603e] transition-colors">FB</a>
              <a href="#" className="hover:text-[#f2603e] transition-colors">LI</a>
              <a href="#" className="hover:text-[#f2603e] transition-colors">WA</a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
