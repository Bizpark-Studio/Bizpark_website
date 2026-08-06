import React from 'react';

export default function Marquee() {
  const items = [
    'SOFTWARE DEVELOPMENT',
    '✦',
    'SOCIAL MEDIA MARKETING',
    '✦',
    'GRAPHIC DESIGN',
    '✦',
  ];

  const fullTrack = [...items, ...items, ...items, ...items, ...items, ...items];

  return (
    <div className="bg-[#f2603e] text-[#0a0a0a] py-3.5 overflow-hidden whitespace-nowrap -rotate-1 scale-[1.02] border-y border-[#0a0a0a] shadow-lg select-none relative z-20">
      <div className="inline-block animate-marquee">
        {fullTrack.map((item, index) => (
          <span key={index} className="font-mono text-xs sm:text-sm font-bold tracking-widest mr-8 sm:mr-10 inline-block">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
