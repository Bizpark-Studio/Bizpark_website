import React from 'react';
const logoImg = '/images/logo.png';

export default function Footer({ currentPage }) {
  const scrollTo = (id) => {
    if (currentPage !== 'home') {
      window.location.hash = `#${id}`;
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
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
      <footer id="footer" className="pt-20 pb-8 bg-[#0a0a0a] text-[#f5f4ef] border-t border-white/10">
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

              {/* Social Media Links directly under brand summary */}
              <div className="pt-3 flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="p-2.5 bg-[#141413] border border-white/10 hover:border-[#f2603e] hover:text-[#f2603e] text-[#95928a] transition-all duration-200 cut-sm hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="p-2.5 bg-[#141413] border border-white/10 hover:border-[#f2603e] hover:text-[#f2603e] text-[#95928a] transition-all duration-200 cut-sm hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="p-2.5 bg-[#141413] border border-white/10 hover:border-[#f2603e] hover:text-[#f2603e] text-[#95928a] transition-all duration-200 cut-sm hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/94783157736"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="p-2.5 bg-[#141413] border border-white/10 hover:border-[#25D366] hover:text-[#25D366] text-[#95928a] transition-all duration-200 cut-sm hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.233-1.371a9.936 9.936 0 0 0 4.779 1.218h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.927-7.067C17.186 3.037 14.683 2 12.012 2zm5.728 13.578c-.315.885-1.56 1.628-2.146 1.701-.587.073-1.127.324-3.771-.722-3.185-1.261-5.215-4.521-5.375-4.733-.16-.213-1.282-1.704-1.282-3.251 0-1.547.8-2.31 1.084-2.62.285-.31.62-.387.828-.387.208 0 .415.002.597.01.187.009.437-.07.683.528.252.613.86 2.096.935 2.247.075.15.126.326.025.528-.101.201-.152.326-.302.503-.151.176-.317.392-.453.528-.151.151-.31.315-.133.62.177.304.787 1.298 1.688 2.099.9.8 1.657 1.047 1.958 1.198.301.15.478.126.654-.075.177-.201.754-.877.955-1.178.201-.301.402-.251.679-.151.277.1.1.754 1.76 1.579c1.658.825 2.766 1.375 2.841 1.5.075.126.075.727-.24 1.612z" />
                  </svg>
                </a>
              </div>

            </div>

            {/* Studio links */}
            <div className="lg:col-span-2 space-y-3">
              <h5 className="font-mono text-xs text-[#605e58] uppercase tracking-wider mb-4">
                Studio
              </h5>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#about';
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
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
              <a
                href="#category-software-solutions"
                onClick={(e) => { e.preventDefault(); window.location.hash = '#category-software-solutions'; }}
                className="block text-sm text-[#95928a] hover:text-[#f2603e] transition-colors"
              >
                Products
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
                href="mailto:bizparkstudio@gmail.com"
                className="block text-sm text-[#95928a] hover:text-[#f2603e] transition-colors"
              >
                bizparkstudio@gmail.com
              </a>
              <a
                href="tel:0783157736"
                className="block text-sm text-[#95928a] hover:text-[#f2603e] transition-colors"
              >
                0783157736
              </a>
              <p className="text-sm text-[#95928a]">
                Colombo, Sri Lanka
              </p>
              <div className="pt-2">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#contact';
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2603e] hover:underline uppercase font-bold"
                >
                  <span>Open Contact Page</span>
                  <span>→</span>
                </a>
              </div>
            </div>

          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-7 text-xs text-[#605e58]">
            <div className="flex items-center gap-3">
              <span>© 2026 bizparkstudio. All rights reserved.</span>
              <span>·</span>
              <a href="#admin" className="text-[#605e58] hover:text-[#95928a] transition-colors font-mono text-[11px]">
                Portal Login
              </a>
            </div>
            <div className="flex items-center gap-4 text-[#95928a]">
              <a href="#" aria-label="Instagram" className="hover:text-[#f2603e] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-[#f2603e] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-[#f2603e] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" aria-label="WhatsApp" className="hover:text-[#f2603e] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.233-1.371a9.936 9.936 0 0 0 4.779 1.218h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.927-7.067C17.186 3.037 14.683 2 12.012 2zm5.728 13.578c-.315.885-1.56 1.628-2.146 1.701-.587.073-1.127.324-3.771-.722-3.185-1.261-5.215-4.521-5.375-4.733-.16-.213-1.282-1.704-1.282-3.251 0-1.547.8-2.31 1.084-2.62.285-.31.62-.387.828-.387.208 0 .415.002.597.01.187.009.437-.07.683.528.252.613.86 2.096.935 2.247.075.15.126.326.025.528-.101.201-.152.326-.302.503-.151.176-.317.392-.453.528-.151.151-.31.315-.133.62.177.304.787 1.298 1.688 2.099.9.8 1.657 1.047 1.958 1.198.301.15.478.126.654-.075.177-.201.754-.877.955-1.178.201-.301.402-.251.679-.151.277.1.1.754 1.76 1.579c1.658.825 2.766 1.375 2.841 1.5.075.126.075.727-.24 1.612z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
