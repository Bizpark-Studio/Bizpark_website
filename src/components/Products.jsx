import React from 'react';

// Shared products data to be imported elsewhere
export const productsData = [
  {
    id: 'pos-system',
    name: 'RetailPulse POS',
    tag: 'Point of Sale',
    num: 'PROD / 01',
    shortDescription: 'Enterprise-grade retail billing and management software featuring seamless offline operation, inventory synchronization, and custom receipt layouts.',
    description: 'RetailPulse POS is an offline-first point-of-sale solution optimized for modern retail businesses. It allows you to run your checkout lines continuously even during network outages, automatically synchronizing with the central cloud database once connectivity is restored. Highly scalable and compatible with standard barcode scanners, thermal printers, and weight scales.',
    image: '/images/hero.png',
    features: [
      'Offline-First Checkout Database',
      'Real-Time Multi-Branch Inventory Sync',
      'Detailed Daily Sales Analytics Reports',
      'Barcode Scanning & Custom Receipt Templates',
      'Supplier & Purchase Order Management'
    ],
    tech: ['React', 'Electron.js', 'Node.js', 'SQLite'],
    fileSize: '48.5 MB',
    version: 'v2.4.1',
    releaseDate: 'August 2026',
    downloadUrl: '#'
  },
  {
    id: 'restaurant-management',
    name: 'DineFlow ERP',
    tag: 'Restaurant ERP',
    num: 'PROD / 02',
    shortDescription: 'Comprehensive dining workflow engine including a waiter ordering app, a visual kitchen display screen (KDS), and dynamic QR code digital menus.',
    description: 'DineFlow ERP streamlines operations for fine dining restaurants, cafes, and bars. It connects tables, front-of-house staff, and kitchen workflows into a single system. Waiters can instantly dispatch orders to kitchen displays (KDS) via mobile app, reducing errors and table turnaround times by up to 35%. Includes detailed recipe-level inventory tracking.',
    image: '/images/hero.png',
    features: [
      'Interactive Table Mapping & Reservation System',
      'Waiter Tablet Companion Mobile App',
      'Kitchen Display System (KDS) Workflow Board',
      'Bespoke QR Code Digital Menu & Ordering',
      'Automated Ingredient & Recipe Inventory Depletion'
    ],
    tech: ['React Native', 'React', 'Node.js', 'MongoDB'],
    fileSize: '62.1 MB',
    version: 'v3.1.0',
    releaseDate: 'July 2026',
    downloadUrl: '#'
  },
  {
    id: 'school-management',
    name: 'EduLink Manager',
    tag: 'Education Portal & LMS',
    num: 'PROD / 03',
    shortDescription: 'All-in-one educational ERP offering unified parent-teacher portals, gradebook management, online payments, and attendance trackers.',
    description: 'EduLink Manager is a premium educational administration framework designed to coordinate classes, collect online tuition fees, compile report cards, and track daily student attendance. Features unified web portals for school management, teachers, students, and parents to keep everyone aligned. Includes direct SMS and email integration for parent alerts.',
    image: '/images/hero.png',
    features: [
      'Secure Student, Parent & Teacher Portals',
      'Gradebook Compiler & Digital Report Cards',
      'Tuition Fee Invoicing & Stripe Payment Gateways',
      'LMS Virtual Classroom & Class Assignments',
      'Bulk SMS & Email Broadcast System'
    ],
    tech: ['Next.js', 'React.js', 'PostgreSQL', 'Express.js'],
    fileSize: '54.7 MB',
    version: 'v1.8.5',
    releaseDate: 'June 2026',
    downloadUrl: '#'
  }
];

export default function Products() {
  return (
    <section id="products" className="py-28 bg-[#0a0a0a] relative border-t border-white/5">
      {/* Background Cyber Details */}
      <div className="absolute top-0 right-10 text-[10vw] font-bold text-white/[0.01] select-none font-mono pointer-events-none">
        SOLUTIONS
      </div>

      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Head */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2.5 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-3">
            <span className="w-4 h-[1px] bg-[#f2603e]" />
            OUR PRODUCTS
          </div>
          <h2 className="font-chakra font-semibold text-3xl sm:text-4xl lg:text-5xl uppercase text-[#f5f4ef] leading-tight">
            Ready-to-Deploy<br />
            Software Solutions.
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {productsData.map((prod) => (
            <div
              key={prod.id}
              className="group relative bg-[#141413] border border-white/10 p-8 cut transition-all duration-300 hover:border-[#f2603e]/60 shadow-xl flex flex-col justify-between min-h-[440px]"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs text-[#f2603e] font-bold uppercase tracking-wider bg-black/40 px-2.5 py-1 border border-[#f2603e]/20 cut-sm">
                    {prod.tag}
                  </span>
                  <span className="font-mono text-[10px] text-[#605e58]">
                    {prod.num}
                  </span>
                </div>

                {/* Product Icon */}
                <div className="mb-6 text-[#f2603e]">
                  {prod.id === 'pos-system' && (
                    <svg className="w-12 h-12" viewBox="0 0 46 46" fill="none">
                      <rect x="4" y="6" width="38" height="24" rx="2" stroke="currentColor" strokeWidth="2.5" />
                      <line x1="4" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="2.5" />
                      <rect x="15" y="30" width="16" height="10" rx="1" stroke="#f5f4ef" strokeWidth="2" />
                      <line x1="8" y1="40" x2="38" y2="40" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                  {prod.id === 'restaurant-management' && (
                    <svg className="w-12 h-12" viewBox="0 0 46 46" fill="none">
                      <path d="M7 16 C7 8, 39 8, 39 16 L39 30 C39 32, 35 36, 23 36 C11 36, 7 32, 7 30 Z" stroke="currentColor" strokeWidth="2.5" />
                      <line x1="11" y1="23" x2="35" y2="23" stroke="#f5f4ef" strokeWidth="2" strokeDasharray="2 2" />
                      <circle cx="23" cy="15" r="3" fill="#f2603e" />
                      <path d="M23 36 L23 42 M16 42 L30 42" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                  {prod.id === 'school-management' && (
                    <svg className="w-12 h-12" viewBox="0 0 46 46" fill="none">
                      <path d="M23 6 L4 15 L23 24 L42 15 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
                      <path d="M10 21 L10 32 C10 36, 23 40, 23 40 C23 40, 36 36, 36 32 L36 21" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M38 17.5 L38 31" stroke="#f5f4ef" strokeWidth="2" />
                      <circle cx="38" cy="32" r="2.5" fill="#f2603e" />
                    </svg>
                  )}
                </div>

                {/* Product Title */}
                <h3 className="font-chakra font-semibold text-2xl uppercase tracking-wide text-[#f5f4ef] group-hover:text-[#f2603e] transition-colors duration-200 mb-3">
                  {prod.name}
                </h3>

                {/* Product Description */}
                <p className="text-[#95928a] text-sm leading-relaxed mb-6">
                  {prod.shortDescription}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="space-y-5 pt-4 border-t border-white/5">
                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {prod.tech.map((t) => (
                    <span key={t} className="text-[10px] font-mono text-[#605e58] bg-[#0a0a0a] px-2 py-0.5 border border-white/5 rounded-sm">
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={`#product-${prod.id}`}
                  className="w-full inline-flex items-center justify-between font-mono text-xs text-[#f2603e] bg-black/40 hover:bg-[#f2603e] hover:text-black border border-[#f2603e]/40 hover:border-transparent px-4 py-3 transition-all duration-200 cut-sm"
                >
                  <span>Explore Product &amp; Get Trial</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
