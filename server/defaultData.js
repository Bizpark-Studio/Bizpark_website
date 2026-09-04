export const defaultSeedData = {
  key: 'main_site_data',
  categories: [
    {
      key: 'branding',
      category: 'Branding',
      projects: [
        {
          id: 'brand-1',
          name: 'AURA LUXURY APPAREL',
          client: 'Aura Colombo',
          subTag: 'Clothing Brand',
          tag: 'Clothing Brand',
          num: '01',
          websiteUrl: 'https://auracolombo.com',
          shortDescription: 'High-end minimalist apparel brand identity with typography, packaging, and lookbook art direction.',
          description: 'Aura Luxury Apparel required a sophisticated visual identity designed to convey elegance and minimalist precision across both physical boutique outlets and digital retail channels. Our studio spearheaded brand identity, typography design, eco-luxe packaging, and visual guidelines.',
          features: ['Visual Identity & Logo System', 'Custom Monogram & Typography', 'Eco-Luxe Box & Hangtag Packaging', 'Boutique Interior Signage Guidelines'],
          tech: ['Adobe Illustrator', 'Figma', 'Cinema 4D', 'Blender'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: 'Concept Sketching', note: 'Drafting monogram geometry and proportions' },
            { url: '/images/hero.png', title: 'Color Palette Calibration', note: 'Selecting tactile paper swatches and metallic foil hues' },
            { url: '/images/hero.png', title: 'Packaging Prototyping', note: 'Die-cut templates and physical carton print proofs' }
          ]
        },
        {
          id: 'brand-2',
          name: 'ZENITH CYBERNETICS',
          client: 'Zenith Labs',
          subTag: 'Software Brand',
          tag: 'Software Brand',
          num: '02',
          websiteUrl: '',
          shortDescription: 'Futuristic visual system and digital design language for next-gen cybersecurity platform.',
          description: 'Zenith Cybernetics needed a bold, high-trust visual language to establish market authority in AI-driven defensive cybersecurity. We constructed a dark-mode first design system, complete with geometric logo marks, cyber grid assets, and comprehensive brand guidebooks.',
          features: ['Brand Identity & Iconography', 'Dark-Mode Design Language', 'Conference Exhibition Booth Art', 'Pitch Deck & Whitepaper Collateral'],
          tech: ['Figma', 'Adobe After Effects', 'Cinema 4D'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: 'Wireframe Logic', note: 'Testing dynamic cyber grid layouts' },
            { url: '/images/hero.png', title: 'Symbol Iteration', note: 'Synthesizing defensive shield with data nodes' }
          ]
        },
        {
          id: 'brand-3',
          name: 'VELOCE MOTORSPORTS',
          client: 'Veloce Racing',
          subTag: 'Automotive Brand',
          tag: 'Automotive Brand',
          num: '03',
          websiteUrl: '',
          shortDescription: 'High-octane livery designs, team apparel, and brand architecture for professional racing outfit.',
          description: 'Comprehensive brand overhaul for Veloce Racing, including aerodynamic vehicle livery wraps, driver uniform patterns, digital broadcast overlays, and team merchandise.',
          features: ['Vehicle Livery Design', 'Driver & Crew Team Apparel', 'Broadcast Graphics & Motion Assets', 'Social Content Design Kit'],
          tech: ['Adobe Photoshop', 'Illustrator', 'Keyshot 3D'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: '3D Livery Mapping', note: 'CAD projection of aerodynamic speed stripes' },
            { url: '/images/hero.png', title: 'Uniform Fabric Tests', note: 'Sublimation printing on fire-retardant racing suits' }
          ]
        }
      ]
    },
    {
      key: 'web-solutions',
      category: 'Web Solutions',
      projects: [
        {
          id: 'web-1',
          name: 'NEXUS CLOUD PLATFORM',
          client: 'Nexus Global',
          subTag: 'Cloud Platform',
          tag: 'Web Solutions',
          num: '01',
          websiteUrl: 'https://nexus.io',
          shortDescription: 'Ultra-fast Next.js enterprise landing page with interactive 3D WebGL data center models.',
          description: 'Nexus Global commissioned Bizpark Studio to engineer their flagship enterprise web application. Featuring custom Three.js animations, sub-second global page loads, interactive pricing calculators, and deep HubSpot CRM integration.',
          features: ['Interactive Three.js 3D Server Models', 'Sub-Second Page Load Optimization', 'Full Responsive Mobile Experience', 'Headless CMS Integration'],
          tech: ['Next.js', 'React', 'Three.js', 'Tailwind CSS'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: 'Information Architecture', note: 'UX wireframing for user onboarding flow' },
            { url: '/images/hero.png', title: 'Three.js Shader Tuning', note: 'Optimizing 60fps WebGL particle performance' }
          ]
        },
        {
          id: 'web-2',
          name: 'LUMINA FASHION STORE',
          client: 'Lumina Group',
          subTag: 'E-Commerce Store',
          tag: 'E-Commerce',
          num: '02',
          websiteUrl: 'https://luminafashion.store',
          shortDescription: 'High-conversion headless Shopify e-commerce platform with AR product preview capabilities.',
          description: 'A custom luxury fashion e-commerce storefront with augmented reality garment previews, one-click checkout, dynamic multi-currency handling, and personalized recommendation feeds.',
          features: ['Headless Shopify Architecture', 'Augmented Reality (AR) Previews', 'Multi-Currency & Regional Taxes', 'Personalized Product Carousel'],
          tech: ['Shopify Storefront API', 'React', 'Tailwind CSS', 'Vercel'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: 'Cart Flow Optimization', note: 'Checkout funnel A/B test layout' },
            { url: '/images/hero.png', title: 'Mobile UX Refinement', note: 'Thumb-friendly sticky bottom buy bar' }
          ]
        },
        {
          id: 'web-3',
          name: 'SOLARIS ENERGY PORTAL',
          client: 'Solaris Power',
          subTag: 'Corporate Portal',
          tag: 'Web Portal',
          num: '03',
          websiteUrl: '',
          shortDescription: 'Customer self-service portal with live solar telemetry metrics and online bill pay.',
          description: 'Solaris Energy required a modern customer dashboard allowing homeowners to inspect daily photovoltaic kilowatt-hour generation, view battery storage levels, and schedule maintenance technician visits.',
          features: ['Real-Time Telemetry Graphs', 'Automated PDF Invoicing', 'Role-Based Access Control', 'Progressive Web App (PWA)'],
          tech: ['Vue.js', 'Node.js', 'PostgreSQL', 'Chart.js'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: 'Dashboard Wireframing', note: 'Graph card hierarchy and alert states' },
            { url: '/images/hero.png', title: 'Mobile Telemetry Testing', note: 'Live websocket latency stress tests' }
          ]
        }
      ]
    },
    {
      key: 'digital-marketing',
      category: 'Digital Marketing',
      projects: [
        {
          id: 'mkt-1',
          name: 'HYPERGROWTH TECH CAMPAIGN',
          client: 'SaaS Pulse',
          subTag: 'SaaS Growth',
          tag: 'Growth Campaign',
          num: '01',
          websiteUrl: '',
          shortDescription: 'Multi-channel acquisition funnel delivering 420% increase in qualified pipeline demo bookings.',
          description: 'Executed high-precision performance marketing across LinkedIn Ads, Google Search, and retargeting channels, coupled with dedicated conversion-optimized landing pages.',
          features: ['Full-Funnel Paid Advertising', 'Creative Ad Copy & Motion Video Assets', 'Custom Multi-Touch Attribution Tracking', 'Weekly Performance Analytics'],
          tech: ['Google Ads', 'Meta Ads', 'LinkedIn Campaign Manager', 'HubSpot'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: 'Audience Persona Mapping', note: 'B2B enterprise buyer segment analysis' },
            { url: '/images/hero.png', title: 'Creative Hook Testing', note: 'Testing video thumbnails and value propositions' }
          ]
        },
        {
          id: 'mkt-2',
          name: 'ORBIT BEVERAGES LAUNCH',
          client: 'Orbit Drinks',
          subTag: 'FMCG Brand Launch',
          tag: 'Product Launch',
          num: '02',
          websiteUrl: '',
          shortDescription: 'Viral TikTok & Instagram influencer campaign generating 3.4M organic impressions in 30 days.',
          description: 'National launch campaign for zero-sugar sparkling botanical beverages, coordinating 50+ micro-influencers and dynamic UGC creator contests across Colombo and regional hubs.',
          features: ['Influencer Campaign Management', 'High-Engagement Short-Form Video', 'Hashtag Challenge Architecture', 'Retail Out-of-Home Promo Sync'],
          tech: ['TikTok Ads', 'Meta Business Suite', 'CapCut', 'Sprout Social'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: 'Creator Briefs', note: 'Moodboard guidelines for influencer shoots' },
            { url: '/images/hero.png', title: 'Viral Trend Analysis', note: 'Tracking sound wave spikes and watch time' }
          ]
        },
        {
          id: 'mkt-3',
          name: 'FINTECH APP ACQUISITION',
          client: 'PaySwift',
          subTag: 'Mobile App Marketing',
          tag: 'App Installs',
          num: '03',
          websiteUrl: '',
          shortDescription: 'App Store Optimization (ASO) and paid install sprint lowering CAC by 58%.',
          description: 'Targeted install sprint across Apple Search Ads and Meta, driving PaySwift to top 3 in financial utility downloads within 60 days of launch.',
          features: ['App Store & Play Store Optimization', 'Direct-Response Motion Creatives', 'Branch.io Deep-Link Routing', 'LTV & Cohort Retention Tracking'],
          tech: ['Apple Search Ads', 'AppsFlyer', 'Google App Campaigns', 'Figma'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: 'App Screenshot Experiments', note: 'Testing copy typography variations on App Store' },
            { url: '/images/hero.png', title: 'Cohort Retention Review', note: 'Evaluating D7 and D30 active user cohorts' }
          ]
        }
      ]
    },
    {
      key: 'software-solutions',
      category: 'Software Solutions',
      projects: [
        {
          id: 'pos-system',
          name: 'DineBuddy POS',
          client: 'Fine Dining & Quick Service',
          subTag: 'Restaurant Management System',
          tag: 'Restaurant Management System',
          num: 'PROD / 01',
          downloadUrl: 'https://aztra-software.github.io/downloads/dine-buddy/windows/dine-buddy-desktop-7.2.5-windows',
          fileSize: '16 MB',
          version: 'v7.2.5',
          socials: {
            facebook: 'https://facebook.com/bizparkstudio',
            instagram: 'https://instagram.com/bizparkstudio',
            twitter: 'https://twitter.com/bizparkstudio',
            linkedin: 'https://linkedin.com/company/bizparkstudio',
            github: 'https://github.com/bizparkstudio',
            whatsapp: 'https://wa.me/94770000000'
          },
          websiteUrl: '',
          shortDescription: 'Cloud & offline-first point of sale built for high-turnover dining outlets.',
          description: 'Comprehensive dining workflow engine including a waiter ordering app, visual kitchen display screen (KDS), and dynamic QR code digital menus.',
          features: ['Multi-Counter Quick Billing', 'Kitchen Display System (KDS)', 'Real-Time Inventory Tracking', 'Cloud & Offline Sync Engine'],
          tech: ['React', 'Electron', 'Node.js', 'SQLite'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: 'Thermal Printer Driver Testing', note: 'Testing ESC/POS receipt baud rates' },
            { url: '/images/hero.png', title: 'KDS Touch Interface Stress Test', note: 'Simulating 120 concurrent table tickets' }
          ]
        },
        {
          id: 'restaurant-management',
          name: 'DineFlow RMS Solution',
          client: 'Multi-Outlet Chains & Hospitality',
          subTag: 'RMS Solution',
          tag: 'RMS Solution',
          num: 'PROD / 02',
          downloadUrl: '#',
          fileSize: '24 MB',
          version: 'v4.1.0',
          socials: {
            facebook: 'https://facebook.com/bizparkstudio',
            instagram: 'https://instagram.com/bizparkstudio',
            twitter: 'https://twitter.com/bizparkstudio',
            linkedin: 'https://linkedin.com/company/bizparkstudio',
            github: 'https://github.com/bizparkstudio',
            whatsapp: 'https://wa.me/94770000000'
          },
          websiteUrl: '',
          shortDescription: 'Enterprise back-office solution for ingredient recipes, inventory variance, and supplier POs.',
          description: 'Centralized recipe costing, automated food wastage variance alerts, and multi-branch warehouse procurement replenishment.',
          features: ['Central Kitchen Distribution', 'Automated Recipe Costing', 'Supplier Purchase Orders', 'Daily Gross Margin Analytics'],
          tech: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: 'Database Schema Modeling', note: 'Multi-tenant branch inventory mapping' },
            { url: '/images/hero.png', title: 'Recipe Batch Math Engine', note: 'Automated yield loss calculation formulas' }
          ]
        },
        {
          id: 'school-management',
          name: 'EduLink Academy LMS',
          client: 'Schools & Educational Institutes',
          subTag: 'LMS Education',
          tag: 'LMS Education',
          num: 'PROD / 03',
          downloadUrl: '#',
          fileSize: '32 MB',
          version: 'v5.3.2',
          socials: {
            facebook: 'https://facebook.com/bizparkstudio',
            instagram: 'https://instagram.com/bizparkstudio',
            twitter: 'https://twitter.com/bizparkstudio',
            linkedin: 'https://linkedin.com/company/bizparkstudio',
            github: 'https://github.com/bizparkstudio',
            whatsapp: 'https://wa.me/94770000000'
          },
          websiteUrl: '',
          shortDescription: 'Student enrollment, online fees payment gateway, and SMS attendance notifications.',
          description: 'All-in-one educational ERP with parent portal mobile apps, automated gradebook report card generation, and exam timetable schedulers.',
          features: ['Student & Teacher Portals', 'Automated Fee Invoicing & SMS Alerts', 'Gradebook & Transcript Generation', 'Online Quiz & Homework Vault'],
          tech: ['React Native', 'Express', 'MongoDB', 'AWS S3'],
          image: '/images/hero.png',
          showcaseMedia: [{ type: 'image', url: '/images/hero.png' }],
          processImages: [
            { url: '/images/hero.png', title: 'Parent Portal App Wireframes', note: 'Testing rapid fee payment gateway flows' },
            { url: '/images/hero.png', title: 'Automated Report Card PDF Engine', note: 'Rendering high-resolution vector transcripts' }
          ]
        }
      ]
    }
  ],
  homepageHeroBanners: [
    {
      id: 'h-banner-1',
      badge: 'CREATIVE STUDIO',
      title: 'CRAFTING TIMELESS DIGITAL EXPERIENCES',
      subtitle: 'From brand identity to custom software, we build transformative digital platforms for ambitious modern enterprises.',
      image: '/images/hero.png',
      ctaText: 'Explore Our Work',
      ctaLink: '#work'
    },
    {
      id: 'h-banner-2',
      badge: 'ENTERPRISE TECH',
      title: 'ENTERPRISE POS & AUTOMATION SOFTWARE',
      subtitle: 'Ready-to-deploy POS systems, inventory management, and school ERPs built for scale and seamless offline performance.',
      image: '/images/hero.png',
      ctaText: 'Discover Software Solutions',
      ctaLink: '#category-software-solutions'
    },
    {
      id: 'h-banner-3',
      badge: 'FULL-STACK DELIVERY',
      title: 'BESPOKE WEB SOLUTIONS & DIGITAL GROWTH',
      subtitle: 'Modern headless web applications, e-commerce storefronts, and performance marketing designed to scale your pipeline.',
      image: '/images/hero.png',
      ctaText: 'Start a Project',
      ctaLink: '#requirement-form'
    }
  ],
  softwareBanners: [
    {
      id: 'banner-1',
      title: 'Next-Gen DineBuddy Cloud & Offline POS',
      subtitle: 'Ultra-fast order punch-in, visual kitchen display system (KDS), and live table management.',
      badge: 'TOP SELLING POS',
      image: '/images/hero.png',
      productId: 'pos-system',
      ctaText: 'Explore DineBuddy POS →'
    },
    {
      id: 'banner-2',
      title: 'DineFlow Food & Beverage ERP',
      subtitle: 'Automated recipe costing, multi-branch supplier purchase orders, and daily inventory variance control.',
      badge: 'ENTERPRISE SUITE',
      image: '/images/hero.png',
      productId: 'restaurant-management',
      ctaText: 'Explore DineFlow RMS →'
    },
    {
      id: 'banner-3',
      title: 'EduLink School Management Portal',
      subtitle: 'Complete online tuition payments, gradebook reports, and parent notifications.',
      badge: 'FEATURED ERP',
      image: '/images/hero.png',
      productId: 'school-management',
      ctaText: 'Discover EduLink →'
    }
  ],
  settings: {
    adminEmail: 'bizparkstudio@gmail.com',
    whatsappNumber: '+94770000000',
    web3formsKey: ''
  }
};
