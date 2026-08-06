import React from 'react';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: 'We learn your business, audience, and goals before opening a design tool.',
    },
    {
      num: '02',
      title: 'Design',
      desc: 'Wireframes, visuals, and copy come together into a plan you sign off on.',
    },
    {
      num: '03',
      title: 'Build',
      desc: 'Developers and marketers work in parallel, so your site and campaigns ship together.',
    },
    {
      num: '04',
      title: 'Launch',
      desc: 'You get a live product, a trained team, and 30 days of support after we hand over.',
    },
  ];

  return (
    <section id="process" className="py-28 bg-[#0d0d0d] border-y border-white/10 relative">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Head */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2.5 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-3">
            <span className="w-4 h-[1px] bg-[#f2603e]" />
            How we work
          </div>
          <h2 className="font-chakra font-semibold text-3xl sm:text-4xl lg:text-5xl uppercase text-[#f5f4ef] leading-tight">
            From brief to launch,<br />
            in four moves.
          </h2>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="pt-6 border-t border-white/20 relative group hover:border-[#f2603e] transition-colors duration-300"
            >
              <span className="font-chakra font-bold text-5xl sm:text-6xl text-transparent bg-clip-text [-webkit-text-stroke:1px_rgba(245,244,240,0.25)] group-hover:[-webkit-text-stroke:1px_#f2603e] transition-all duration-300 block mb-4">
                {step.num}
              </span>
              <h4 className="font-chakra font-semibold text-lg text-[#f5f4ef] uppercase mb-3 tracking-wide">
                {step.title}
              </h4>
              <p className="text-[#95928a] text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
