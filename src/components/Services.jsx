import React from 'react';

export default function Services() {
  const services = [
    {
      num: '01 / DEV',
      title: 'Software Development',
      description: 'Websites, web apps, and internal tools built to run without drama — from first commit to production.',
      icon: (
        <svg className="w-11 h-11 mb-7" viewBox="0 0 46 46" fill="none">
          <path d="M14 12 L4 23 L14 34" stroke="#F2603E" strokeWidth="2.5" strokeLinecap="square" />
          <path d="M32 12 L42 23 L32 34" stroke="#F2603E" strokeWidth="2.5" strokeLinecap="square" />
          <path d="M27 8 L19 38" stroke="#F5F4EF" strokeWidth="2" strokeLinecap="square" />
        </svg>
      ),
      list: [
        'Websites & web apps',
        'E-commerce platforms',
        'Custom tools & integrations',
        'Ongoing maintenance',
      ],
    },
    {
      num: '02 / MKT',
      title: 'Social Media Marketing',
      description: 'Content, strategy, and paid campaigns that turn a feed into a pipeline, with numbers to show for it.',
      icon: (
        <svg className="w-11 h-11 mb-7" viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="23" r="15" stroke="#F2603E" strokeWidth="2.5" />
          <path d="M23 14 L23 23 L30 27" stroke="#F5F4EF" strokeWidth="2.5" strokeLinecap="square" />
        </svg>
      ),
      list: [
        'Content strategy & calendars',
        'Paid ad campaigns',
        'Community management',
        'Monthly performance reports',
      ],
    },
    {
      num: '03 / BRND',
      title: 'Branding',
      description: 'Brand identity and the visual system that ties your product, feed, and print together.',
      icon: (
        <svg className="w-11 h-11 mb-7" viewBox="0 0 46 46" fill="none">
          <path d="M8 38 L20 26 L26 32 L38 20" stroke="#F2603E" strokeWidth="2.5" strokeLinecap="square" />
          <path d="M30 20 L38 20 L38 28" stroke="#F5F4EF" strokeWidth="2.5" strokeLinecap="square" />
        </svg>
      ),
      list: [
        'Brand identity & logos',
        'Social & print collateral',
        'UI/UX design',
        'Packaging & merch',
      ],
    },
  ];

  return (
    <section id="services" className="py-28 bg-[#0a0a0a] relative">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Head */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2.5 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-3">
            <span className="w-4 h-[1px] bg-[#f2603e]" />
            What we do
          </div>
          <h2 className="font-chakra font-semibold text-3xl sm:text-4xl lg:text-5xl uppercase text-[#f5f4ef] leading-tight">
            Three disciplines.<br />
            One accountable team.
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#f5f4f0]/10 border border-[#f5f4f0]/10">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="bg-[#0a0a0a] hover:bg-[#141413] p-8 sm:p-10 transition-colors duration-300 flex flex-col justify-between group"
            >
              <div>
                <span className="font-mono text-xs text-[#f2603e] tracking-widest block mb-4">
                  {srv.num}
                </span>

                <div className="transform group-hover:scale-105 transition-transform duration-300 origin-left">
                  {srv.icon}
                </div>

                <h3 className="font-chakra font-semibold text-xl text-[#f5f4ef] uppercase mb-3.5">
                  {srv.title}
                </h3>

                <p className="text-[#95928a] text-sm leading-relaxed mb-6">
                  {srv.description}
                </p>
              </div>

              <ul className="space-y-2 pt-4 border-t border-[#f5f4f0]/10">
                {srv.list.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-xs sm:text-sm text-[#95928a] flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-[#f2603e] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
