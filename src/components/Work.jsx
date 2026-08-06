import React, { useState, useEffect } from 'react';
import heroBannerImg from '../assets/hero-banner.jpg';

export default function Work() {
  const [selectedProject, setSelectedProject] = useState(null);

  // Category-wise Projects Data
  const categoriesData = [
    {
      category: 'Web App',
      tag: 'Web App',
      projects: [
        {
          id: 'web-1',
          name: 'OmniDesk Platform',
          client: 'Enterprise SaaS Client',
          type: 'Custom SaaS platform build',
          image: '/images/hero.png',
          description: 'Built a high-performance web dashboard handling real-time data streaming, automated user onboarding, role-based OAuth permissions, and microservice API integrations.',
          features: ['React & Next.js Architecture', 'Real-time Telemetry Dashboard', 'Role-Based Access Control', 'Automated Workflow Pipelines'],
        },
        {
          id: 'web-2',
          name: 'CloudDash Enterprise',
          client: 'Cloud Logistics Corp',
          type: 'Resource Monitoring System',
          image: heroBannerImg,
          description: 'Engineered an interactive cloud infrastructure monitoring platform with automated server metrics, predictive usage graphs, and real-time incident alerting.',
          features: ['Interactive Analytics Charts', 'Automated Incident Alerts', 'Custom Billing Integrations', 'Multi-tenant Support'],
        },
        {
          id: 'web-3',
          name: 'PortalX Management',
          client: 'Fintech Operations',
          type: 'Internal ERP & Workflow Tool',
          image: '/images/hero.png',
          description: 'Designed and deployed an internal operational workflow tool that streamlined team document approvals, task management pipelines, and audit logs.',
          features: ['Approval Automation', 'Audit Logging System', 'Slack & Email Webhooks', 'Secure Data Vault'],
        },
      ],
    },
    {
      category: 'Brand Identity',
      tag: 'Brand Identity',
      projects: [
        {
          id: 'brand-1',
          name: 'Vortex Capital',
          client: 'Fintech Startup',
          type: 'Logo & visual system',
          image: heroBannerImg,
          description: 'Designed an authoritative brand identity, modern typography system, dark-mode design tokens, stationary suite, and digital asset guidelines.',
          features: ['Primary Logomark & Monogram', 'Comprehensive Brand Guidelines', 'UI Component Design System', 'Digital & Print Assets'],
        },
        {
          id: 'brand-2',
          name: 'Helix BioBrand',
          client: 'HealthTech Company',
          type: 'Rebrand & Visual Architecture',
          image: '/images/hero.png',
          description: 'Crafted a clean futuristic visual identity for a biotechnology firm, including custom iconography, pitch deck assets, and 3D brand collateral.',
          features: ['Futuristic Logotype', 'Custom Iconography Set', 'Investor Deck Template', 'Social Media Templates'],
        },
        {
          id: 'brand-3',
          name: 'Lumina Studios',
          client: 'Creative Collective',
          type: 'Brand Identity & Packaging',
          image: heroBannerImg,
          description: 'Created a luxury dark-mode brand system featuring embossed foil stationery, bespoke typography, and premium merchandise packaging.',
          features: ['Premium Packaging System', 'Custom Serif Typography', 'Brand Guidelines Handbook', 'Physical Collateral Suite'],
        },
      ],
    },
    {
      category: 'Campaign',
      tag: 'Campaign',
      projects: [
        {
          id: 'mkt-1',
          name: 'Apex Growth',
          client: 'E-commerce Brand',
          type: 'Social media & paid ads',
          image: '/images/hero.png',
          description: 'Scaled social media reach by 340% through targeted Meta & TikTok creative ad campaigns, short-form video motion design, and high-converting funnel strategy.',
          features: ['Meta & TikTok Paid Ads', 'Short-form Video Motion Creatives', 'Funnel Conversion Optimization', 'Monthly Analytics Reporting'],
        },
        {
          id: 'mkt-2',
          name: 'Momentum Product Launch',
          client: 'Consumer Tech Brand',
          type: 'Omnichannel Launch Campaign',
          image: heroBannerImg,
          description: 'Executed an omnichannel product launch strategy combining influencer partnerships, paid ad funnels, and email sequence automation resulting in 4.2x ROAS.',
          features: ['Omnichannel Ad Funnels', 'Influencer Partner Management', 'Automated Email Sequences', '4.2x ROAS Achievement'],
        },
        {
          id: 'mkt-3',
          name: 'Elevate Brand Growth',
          client: 'B2B SaaS Firm',
          type: 'Social Content & Lead Generation',
          image: '/images/hero.png',
          description: 'Developed an organic & paid LinkedIn growth strategy that doubled inbound qualified leads in 90 days with thought-leadership content graphics.',
          features: ['LinkedIn Lead Generation', 'Executive Thought-Leadership', 'Custom Infographic Graphics', 'Retargeting Funnel'],
        },
      ],
    },
    {
      category: 'E-commerce',
      tag: 'E-commerce',
      projects: [
        {
          id: 'ecom-1',
          name: 'Aura Lifestyle',
          client: 'Retail Lifestyle Brand',
          type: 'Store build & launch',
          image: heroBannerImg,
          description: 'Engineered a lightning-fast custom headless Shopify store with bespoke product configurators, localized payment gateways, and optimized checkout flows.',
          features: ['Headless Shopify Storefront', 'Custom Product Configurator', 'Localized Payment Integration', '99.8 Lighthouse Score'],
        },
        {
          id: 'ecom-2',
          name: 'Zenith Apparel',
          client: 'Direct-to-Consumer Fashion',
          type: 'Custom Fashion Store',
          image: '/images/hero.png',
          description: 'Built a visually immersive apparel store featuring interactive lookbooks, instant size recommendations, and seamless slide-out cart drawers.',
          features: ['Interactive Lookbook View', 'Size Recommendation Tool', 'Slide-Out Cart Drawer', 'Multi-currency Checkout'],
        },
        {
          id: 'ecom-3',
          name: 'Nova Luxe Goods',
          client: 'Luxury Accessories',
          type: 'Storefront & Post-Purchase Funnel',
          image: heroBannerImg,
          description: 'Designed a high-converting luxury store with post-purchase upsell offers, automated SMS shipping updates, and VIP membership perks.',
          features: ['Post-Purchase Upsell Integration', 'VIP Membership System', 'Automated SMS Updates', 'High Conversion Checkout'],
        },
      ],
    },
  ];

  // State to track current slide index for each category card
  const [slideIndices, setSlideIndices] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });

  // Auto-play slides inside each category card independently
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndices((prev) => {
        const next = { ...prev };
        categoriesData.forEach((cat, catIdx) => {
          next[catIdx] = (prev[catIdx] + 1) % cat.projects.length;
        });
        return next;
      });
    }, 3800);

    return () => clearInterval(timer);
  }, []);

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

        {/* Work Cards Grid with Auto-Sliding Project Carousels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-10">
          {categoriesData.map((catGroup, catIdx) => {
            const currentProjIndex = slideIndices[catIdx];
            const currentProject = catGroup.projects[currentProjIndex];

            return (
              <div
                key={catIdx}
                onClick={() => setSelectedProject(currentProject)}
                className="group cursor-pointer relative aspect-[4/3] bg-[#141413] border border-white/10 overflow-hidden flex items-end p-7 sm:p-8 cut transition-all duration-300 hover:border-[#f2603e]/60 shadow-xl"
              >
                {/* Auto Sliding Background Images Track */}
                <div
                  className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{ transform: `translateX(-${currentProjIndex * 100}%)` }}
                >
                  {catGroup.projects.map((proj) => (
                    <div key={proj.id} className="w-full h-full flex-shrink-0 relative">
                      <img
                        src={proj.image}
                        alt={proj.name}
                        className="w-full h-full object-cover object-center block transform group-hover:scale-105 transition-transform duration-700 opacity-60"
                      />
                    </div>
                  ))}
                </div>

                {/* Category Tag */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[#f2603e] bg-[#0a0a0a]/85 backdrop-blur-md px-3 py-1 border border-[#f2603e]/30 tracking-wider">
                    {catGroup.tag} ({currentProjIndex + 1}/{catGroup.projects.length})
                  </span>
                </div>

                {/* Card Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10 opacity-90 group-hover:opacity-95 transition-opacity" />

                {/* Content details for active project slide */}
                <div className="relative z-20 w-full flex items-end justify-between">
                  <div className="space-y-1">
                    <h3 className="font-chakra text-xl sm:text-2xl text-[#f5f4ef] uppercase tracking-wide group-hover:text-[#f2603e] transition-colors duration-200">
                      {currentProject.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#95928a]">
                      {currentProject.type}
                    </p>
                  </div>

                  <span className="text-xs font-mono text-[#f2603e] flex items-center gap-1 bg-black/80 px-2.5 py-1 border border-[#f2603e]/30 cut-sm group-hover:bg-[#f2603e] group-hover:text-black transition-all duration-200">
                    View Details →
                  </span>
                </div>

                {/* Slide indicator dots at bottom */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                  {catGroup.projects.map((_, pIdx) => (
                    <span
                      key={pIdx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        currentProjIndex === pIdx ? 'w-5 bg-[#f2603e]' : 'w-1.5 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Subtext */}
        <p className="text-xs sm:text-sm text-[#95928a] font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f2603e] animate-pulse" />
          Explore our featured client partnerships and digital transformation case studies. Click any project card above to view detailed technical scope and outcomes.
        </p>

      </div>

      {/* Interactive Detailed Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141413] border border-[#f2603e]/50 p-6 sm:p-8 max-w-xl w-full cut relative shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-[#95928a] hover:text-white font-mono text-xs px-2.5 py-1 bg-black/60 border border-white/10"
            >
              ✕ CLOSE
            </button>

            <div>
              <span className="font-mono text-xs text-[#f2603e] uppercase tracking-widest block mb-1">
                {selectedProject.client}
              </span>
              <h3 className="font-chakra text-2xl sm:text-3xl text-white uppercase font-bold">
                {selectedProject.name}
              </h3>
              <p className="text-sm font-semibold text-[#f2603e] mt-1">
                {selectedProject.type}
              </p>
            </div>

            {/* Project Image Preview */}
            <div className="w-full h-48 cut border border-white/10 overflow-hidden relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-transparent to-transparent opacity-60" />
            </div>

            <p className="text-sm text-[#95928a] leading-relaxed">
              {selectedProject.description}
            </p>

            {/* Key Deliverables / Features */}
            {selectedProject.features && (
              <div>
                <h4 className="font-mono text-xs text-[#f5f4ef] uppercase tracking-wider mb-2">
                  Key Scope &amp; Deliverables:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#95928a]">
                  {selectedProject.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#f2603e]" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#requirement-form"
                onClick={() => setSelectedProject(null)}
                className="bg-[#f2603e] text-[#0a0a0a] font-semibold text-xs uppercase tracking-wider px-6 py-3.5 cut-sm hover:bg-[#ff6f4a] transition-all"
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
