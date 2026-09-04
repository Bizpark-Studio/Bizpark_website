// Central Data Store for Bizpark Studio with LocalStorage persistence

const STORAGE_KEY = 'bizpark_studio_data_v1';

export const initialCategories = [
  {
    key: 'branding',
    category: 'Branding',
    tag: 'Branding',
    description: 'Distinctive visual identities, logo architecture, packaging design, and brand guideline handbooks for emerging startups and established enterprises.',
    projects: [
      {
        id: 'brand-1',
        name: 'Vortex Financial',
        client: 'Fintech Startup',
        subTag: 'Software Brand',
        image: '/images/hero.png',
        websiteUrl: 'https://vortexfinancial.example.com',
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        description: 'Designed an authoritative brand identity, modern typography system, dark-mode design tokens, stationary suite, and digital asset guidelines.',
        features: ['Primary Logomark & Monogram', 'Comprehensive Brand Guidelines', 'UI Component Design System', 'Digital & Print Assets'],
        tech: ['Figma', 'Illustrator', '3D Blender', 'Design Tokens'],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Initial Concept & Grid Sketches',
            note: 'Exploring geometric letterform alignments for the custom logomark emblem.'
          },
          {
            url: '/images/hero.png',
            title: 'Color Palette & Typography Selection',
            note: 'Finalizing dark cyber theme color tokens and custom sans-serif typography.'
          }
        ],
        featuredOnHome: true
      },
      {
        id: 'brand-2',
        name: 'Aura Label Studio',
        client: 'Luxury Apparel Brand',
        subTag: 'Clothing Brand',
        image: '/images/hero.png',
        websiteUrl: 'https://auralabel.example.com',
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        description: 'Crafted a sleek, modern visual identity for a high-end streetwear label, including custom garment tags, embossed box packaging, and lookbook design.',
        features: ['Bespoke Logotype', 'Custom Garment Packaging', 'Social Media Templates', 'E-commerce Brand Assets'],
        tech: ['Adobe Photoshop', 'Illustrator', 'Print Production'],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Garment Tag Mockup & Embossing Test',
            note: 'Testing foil print stamp finishes on matte black cardstock for physical garment labels.'
          }
        ],
        featuredOnHome: true
      },
      {
        id: 'brand-3',
        name: 'Lumina Software Studio',
        client: 'Tech Collective',
        subTag: 'Software Brand',
        image: '/images/hero.png',
        websiteUrl: 'https://luminastudios.example.com',
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        description: 'Created a futuristic dark-mode identity featuring neon orange accents, responsive icon sets, and investor deck pitch design.',
        features: ['Responsive App Icons', 'Pitch Deck Architecture', 'Brand Guidelines Handbook', 'Physical Collateral Suite'],
        tech: ['Figma', 'Blender', 'After Effects'],
        processImages: [
          {
            url: '/images/hero.png',
            title: '3D Render & Icon Exploration',
            note: 'Modeling metallic 3D emblem variants for digital software badges.'
          }
        ],
        featuredOnHome: true
      },
      {
        id: 'brand-4',
        name: 'Kuro Artisan Ramen',
        client: 'Gourmet Restaurant Group',
        subTag: 'Restaurant',
        image: '/images/hero.png',
        websiteUrl: 'https://kuroramen.example.com',
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        description: 'Crafted authentic Japanese minimalism brand packaging, wooden menu bindings, staff aprons, and digital signage assets.',
        features: ['Custom Calligraphy Monogram', 'Wooden Laser-Cut Menus', 'Packaging & Takeout Bags', 'Interior Wall Mural Design'],
        tech: ['Custom Vector Ink', 'Illustrator', 'Material Sourcing'],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Calligraphy Brushwork Drafts',
            note: 'Hand-drawn brushstroke vectorizations for restaurant logo mark.'
          }
        ],
        featuredOnHome: false
      }
    ]
  },
  {
    key: 'web-solutions',
    category: 'Web Solutions',
    tag: 'Web Solutions',
    description: 'High-converting custom web applications, SaaS platforms, headless e-commerce storefronts, and internal operational dashboards built for speed.',
    projects: [
      {
        id: 'web-1',
        name: 'OmniDesk SaaS Platform',
        client: 'Enterprise Client',
        subTag: 'SaaS Platform',
        image: '/images/hero.png',
        websiteUrl: 'https://omnidesk-demo.example.com',
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        description: 'Built a high-performance web dashboard handling real-time data streaming, automated user onboarding, role-based OAuth permissions, and microservice API integrations.',
        features: ['React & Next.js Architecture', 'Real-time Telemetry Dashboard', 'Role-Based Access Control', 'Automated Workflow Pipelines'],
        tech: ['React', 'Next.js', 'Node.js', 'TailwindCSS', 'WebSocket'],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Wireframe & Architecture Blueprint',
            note: 'Mapping real-time data socket connections and user flow state logic.'
          },
          {
            url: '/images/hero.png',
            title: 'UI Component Library Construction',
            note: 'Building accessible dark-mode UI components in React.'
          }
        ],
        featuredOnHome: true
      },
      {
        id: 'web-2',
        name: 'CloudDash Logistics',
        client: 'Global Logistics Corp',
        subTag: 'Corporate Web',
        image: '/images/hero.png',
        websiteUrl: 'https://clouddash.example.com',
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        description: 'Engineered an interactive cloud infrastructure monitoring platform with automated server metrics, predictive usage graphs, and real-time incident alerting.',
        features: ['Interactive Analytics Charts', 'Automated Incident Alerts', 'Custom Billing Integrations', 'Multi-tenant Support'],
        tech: ['React', 'Vite', 'Recharts', 'TailwindCSS'],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Dashboard Widget Layouting',
            note: 'Testing chart responsiveness across mobile and ultra-wide monitor screens.'
          }
        ],
        featuredOnHome: true
      },
      {
        id: 'web-3',
        name: 'PortalX ERP Management',
        client: 'Fintech Operations',
        subTag: 'Custom Web App',
        image: '/images/hero.png',
        websiteUrl: 'https://portalx-erp.example.com',
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        description: 'Designed and deployed an internal operational workflow tool that streamlined team document approvals, task management pipelines, and audit logs.',
        features: ['Approval Automation', 'Audit Logging System', 'Slack & Email Webhooks', 'Secure Data Vault'],
        tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Database Schema & Pipeline Wireframes',
            note: 'Configuring audit log streaming to PostgreSQL database.'
          }
        ],
        featuredOnHome: true
      },
      {
        id: 'web-4',
        name: 'Zenith Apparel E-Commerce',
        client: 'Direct-to-Consumer Fashion',
        subTag: 'E-Commerce',
        image: '/images/hero.png',
        websiteUrl: 'https://zenithapparel.example.com',
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        description: 'Headless e-commerce storefront with custom product configurators, localized payment gateways, instant size calculators, and slide-out cart drawers.',
        features: ['Headless Shopify Architecture', 'Interactive Product Configurator', 'Instant Size Recommendation Tool', 'Multi-currency Checkout'],
        tech: ['Next.js', 'Shopify Storefront API', 'TailwindCSS'],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Lookbook & Cart Drawer Prototyping',
            note: 'Refining smooth 60fps animations for slide-out cart and instant filter.'
          }
        ],
        featuredOnHome: false
      }
    ]
  },
  {
    key: 'digital-marketing',
    category: 'Digital Marketing',
    tag: 'Digital Marketing',
    description: 'Data-driven omnichannel marketing campaigns, paid ad funnels, search engine optimization (SEO), and conversion-focused social media strategy.',
    projects: [
      {
        id: 'mkt-1',
        name: 'Apex Growth Ads',
        client: 'E-commerce Brand',
        subTag: 'Social Media Campaign',
        image: '/images/hero.png',
        websiteUrl: '',
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        description: 'Scaled social media reach by 340% through targeted Meta & TikTok creative ad campaigns, short-form video motion design, and high-converting funnel strategy.',
        features: ['Meta & TikTok Paid Ads', 'Short-form Video Motion Creatives', 'Funnel Conversion Optimization', 'Monthly Analytics Reporting'],
        tech: ['Meta Ads Manager', 'TikTok Ads Center', 'After Effects', 'Google Analytics 4'],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Ad Storyboard & Motion Graphics',
            note: 'Drafting high-hook video ad concepts for TikTok and Meta feeds.'
          }
        ],
        featuredOnHome: true
      },
      {
        id: 'mkt-2',
        name: 'Momentum Omnichannel Launch',
        client: 'Consumer Tech Brand',
        subTag: 'Brand Growth',
        image: '/images/hero.png',
        websiteUrl: '',
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        description: 'Executed an omnichannel product launch strategy combining influencer partnerships, paid ad funnels, and email sequence automation resulting in 4.2x ROAS.',
        features: ['Omnichannel Ad Funnels', 'Influencer Partner Management', 'Automated Email Sequences', '4.2x ROAS Achievement'],
        tech: ['Klaviyo', 'Google Ads', 'Influencer CRM', 'Framer'],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Campaign Funnel Flowchart',
            note: 'Mapping retargeting triggers and automated email drip sequences.'
          }
        ],
        featuredOnHome: true
      },
      {
        id: 'mkt-3',
        name: 'Elevate Lead Generation',
        client: 'B2B SaaS Firm',
        subTag: 'SEO & Lead Gen',
        image: '/images/hero.png',
        websiteUrl: '',
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        description: 'Developed an organic & paid LinkedIn growth strategy that doubled inbound qualified leads in 90 days with thought-leadership content graphics.',
        features: ['LinkedIn Lead Generation', 'Executive Thought-Leadership', 'Custom Infographic Graphics', 'Retargeting Funnel'],
        tech: ['LinkedIn Campaign Manager', 'SEMrush', 'Canva Pro', 'HubSpot'],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Infographic & Carousel Templates',
            note: 'Creating branded slide deck carousels for viral B2B LinkedIn posts.'
          }
        ],
        featuredOnHome: true
      }
    ]
  },
  {
    key: 'software-solutions',
    category: 'Software Solutions',
    tag: 'Software Solutions',
    description: 'Ready-to-deploy, robust software desktop and cloud solutions engineered for retail POS, restaurant ERPs, education management, and custom business tools.',
    projects: [
      {
        id: 'pos-system',
        name: 'DineBuddy POS',
        client: 'Retail & Restaurant Chains',
        subTag: 'Restaurant Management System',
        tag: 'Restaurant Management System',
        num: 'PROD / 01',
        downloadUrl: 'https://aztra-software.github.io/downloads/dine-buddy/windows/dine-buddy-desktop-7.2.5-windows',
        fileSize: '16 MB',
        version: 'v7.2.5',
        releaseDate: 'August 2026',
        image: '/images/hero.png',
        websiteUrl: '',
        shortDescription: 'Enterprise-grade retail billing and management software featuring seamless offline operation, inventory synchronization, and custom receipt layouts.',
        description: 'DineBuddy POS is an offline-first point-of-sale solution optimized for modern retail and restaurant outlets. It allows you to run your checkout lines continuously even during network outages, automatically synchronizing with central cloud databases.',
        features: ['Offline-First Checkout Database', 'Real-Time Multi-Branch Inventory Sync', 'Detailed Daily Sales Analytics Reports', 'Barcode Scanning & Custom Receipt Templates', 'Supplier & Purchase Order Management'],
        tech: ['React', 'Electron.js', 'Node.js', 'SQLite'],
        socials: {
          facebook: 'https://facebook.com/bizparkstudio',
          instagram: 'https://instagram.com/bizparkstudio',
          twitter: 'https://twitter.com/bizparkstudio',
          linkedin: 'https://linkedin.com/company/bizparkstudio',
          github: 'https://github.com/bizparkstudio',
          whatsapp: 'https://wa.me/94770000000'
        },
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Thermal Receipt & Scanner Integration Test',
            note: 'Testing offline hardware communication with ESC/POS printers.'
          }
        ],
        featuredOnHome: true
      },
      {
        id: 'restaurant-management',
        name: 'DineFlow ERP',
        client: 'Fine Dining & Quick Service',
        subTag: 'Restaurant ERP',
        tag: 'Restaurant ERP',
        num: 'PROD / 02',
        downloadUrl: '#',
        fileSize: '62.1 MB',
        version: 'v3.1.0',
        releaseDate: 'July 2026',
        image: '/images/hero.png',
        websiteUrl: '',
        shortDescription: 'Comprehensive dining workflow engine including a waiter ordering app, a visual kitchen display screen (KDS), and dynamic QR code digital menus.',
        description: 'DineFlow ERP streamlines operations for fine dining restaurants, cafes, and bars. It connects tables, front-of-house staff, and kitchen workflows into a single unified platform.',
        features: ['Interactive Table Mapping & Reservation System', 'Waiter Tablet Companion Mobile App', 'Kitchen Display System (KDS) Workflow Board', 'Bespoke QR Code Digital Menu & Ordering', 'Automated Ingredient Depletion'],
        tech: ['React Native', 'React', 'Node.js', 'MongoDB'],
        socials: {
          facebook: 'https://facebook.com/bizparkstudio',
          instagram: 'https://instagram.com/bizparkstudio',
          twitter: 'https://twitter.com/bizparkstudio',
          linkedin: 'https://linkedin.com/company/bizparkstudio',
          github: 'https://github.com/bizparkstudio',
          whatsapp: 'https://wa.me/94770000000'
        },
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Kitchen Display Screen (KDS) Simulation',
            note: 'Optimizing real-time order dispatch notifications between waiters and chefs.'
          }
        ],
        featuredOnHome: true
      },
      {
        id: 'school-management',
        name: 'EduLink Manager',
        client: 'Schools & Educational Institutes',
        subTag: 'Education Portal & LMS',
        tag: 'Education Portal & LMS',
        num: 'PROD / 03',
        downloadUrl: '#',
        fileSize: '54.7 MB',
        version: 'v1.8.5',
        releaseDate: 'June 2026',
        image: '/images/hero.png',
        websiteUrl: '',
        shortDescription: 'All-in-one educational ERP offering unified parent-teacher portals, gradebook management, online payments, and attendance trackers.',
        description: 'EduLink Manager is a premium educational administration framework designed to coordinate classes, collect online tuition fees, compile report cards, and track daily student attendance.',
        features: ['Secure Student, Parent & Teacher Portals', 'Gradebook Compiler & Digital Report Cards', 'Tuition Fee Invoicing & Stripe Payment Gateways', 'LMS Virtual Classroom & Class Assignments', 'Bulk SMS & Email Broadcast System'],
        tech: ['Next.js', 'React.js', 'PostgreSQL', 'Express.js'],
        socials: {
          facebook: 'https://facebook.com/bizparkstudio',
          instagram: 'https://instagram.com/bizparkstudio',
          twitter: 'https://twitter.com/bizparkstudio',
          linkedin: 'https://linkedin.com/company/bizparkstudio',
          github: 'https://github.com/bizparkstudio',
          whatsapp: 'https://wa.me/94770000000'
        },
        showcaseMedia: [
          { type: 'image', url: '/images/hero.png' }
        ],
        processImages: [
          {
            url: '/images/hero.png',
            title: 'Parent Portal Interface Prototyping',
            note: 'Designing mobile responsive student grade tracking cards.'
          }
        ],
        featuredOnHome: true
      }
    ]
  }
];

// HOMEPAGE HERO BANNERS
export const initialHomepageHeroBanners = [
  {
    id: 'hero-slide-1',
    badge: 'SYSTEMS // 2026 ARCHITECTURE',
    title: 'Where Businesses Grow Smarter.',
    subtitle: 'From branding to software development, we help businesses build, launch, and grow with creative and technology-driven solutions.',
    ctaPrimaryText: 'Explore Work →',
    ctaPrimaryLink: '#work',
    ctaSecondaryText: 'Submit Requirement',
    ctaSecondaryLink: '#requirement-form',
    image: '/images/hero.png'
  },
  {
    id: 'hero-slide-2',
    badge: 'ENTERPRISE SOFTWARE SOLUTIONS',
    title: 'Custom POS & ERP Engineering.',
    subtitle: 'Deploy ready-built retail billing, kitchen workflow engines, and educational LMS portals cut for speed and offline stability.',
    ctaPrimaryText: 'Browse Software →',
    ctaPrimaryLink: '#category-software-solutions',
    ctaSecondaryText: 'Request Demo',
    ctaSecondaryLink: '#requirement-form',
    image: '/images/hero.png'
  },
  {
    id: 'hero-slide-3',
    badge: 'FULL-STACK BRAND & DIGITAL MARKETING',
    title: 'High-Converting Brand Identities.',
    subtitle: 'We craft authoritative visual systems, packaging, and data-driven ad funnels that scale your revenue and market reach.',
    ctaPrimaryText: 'View Branding →',
    ctaPrimaryLink: '#category-branding',
    ctaSecondaryText: 'Start a Project',
    ctaSecondaryLink: '#requirement-form',
    image: '/images/hero.png'
  }
];

export const initialSoftwareBanners = [
  {
    id: 'banner-1',
    title: 'DineBuddy POS 7.2 Released',
    subtitle: 'Now with multi-branch real-time stock sync & offline database encryption.',
    badge: 'FEATURED POS',
    image: '/images/hero.png',
    productId: 'pos-system',
    ctaText: 'Explore DineBuddy POS →'
  },
  {
    id: 'banner-2',
    title: 'DineFlow ERP for Restaurants',
    subtitle: 'Streamline kitchen tickets, table reservations & waiter orders effortlessly.',
    badge: 'HOT SOLUTION',
    image: '/images/hero.png',
    productId: 'restaurant-management',
    ctaText: 'View DineFlow Features →'
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
];

export const initialTeamMembers = [
  {
    id: 'team-1',
    name: 'Anuruddha Jayasanke',
    role: 'Founder & Lead Architect',
    image: '/images/hero.png',
    bio: 'Directing digital strategy, robust web architecture, and full-stack software development for modern enterprises.',
    email: 'bizparkstudio@gmail.com',
    phone: '0783157736'
  },
  {
    id: 'team-2',
    name: 'Kasun Bandara',
    role: 'Head of Brand Identity & Art Direction',
    image: '/images/hero.png',
    bio: 'Crafting authoritative visual brand systems, packaging design, and high-impact typography.',
    email: 'design@bizparkstudio.com',
    phone: '0783157736'
  },
  {
    id: 'team-3',
    name: 'Nimesha Perera',
    role: 'Head of Performance Marketing',
    image: '/images/hero.png',
    bio: 'Building data-backed acquisition funnels, social campaigns, and scalable conversion engines.',
    email: 'marketing@bizparkstudio.com',
    phone: '0783157736'
  }
];

export const initialSettings = {
  adminEmail: 'bizparkstudio@gmail.com',
  whatsappNumber: '0783157736',
  phone: '0783157736',
  address: 'Colombo, Sri Lanka',
  web3formsKey: '68a920d3-df9e-456d-84d8-feb25b489cd5'
};

export const initialInquiries = [
  {
    id: 'inq-sample-1',
    name: 'Sample Client (Demo)',
    email: 'client@example.com',
    phone: '+94 77 123 4567',
    company: 'Nexus Innovations',
    services: ['Software Solutions', 'Web Solutions'],
    budget: '$3,000 - $7,000',
    timeline: '1 - 2 Months',
    details: 'Looking for a custom POS and restaurant inventory management system with offline sync.',
    source: 'Homepage Form',
    date: new Date().toLocaleString()
  }
];

export function getStoreData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.categories) {
        if (!parsed.homepageHeroBanners) {
          parsed.homepageHeroBanners = initialHomepageHeroBanners;
        }
        if (!parsed.teamMembers || parsed.teamMembers.length === 0) {
          parsed.teamMembers = initialTeamMembers;
        }
        if (!parsed.settings) {
          parsed.settings = initialSettings;
        } else {
          if (!parsed.settings.whatsappNumber || parsed.settings.whatsappNumber === '+94770000000' || parsed.settings.whatsappNumber.includes('4986658')) {
            parsed.settings.whatsappNumber = '0783157736';
          }
          if (!parsed.settings.phone) {
            parsed.settings.phone = '0783157736';
          }
          if (!parsed.settings.address) {
            parsed.settings.address = 'Colombo, Sri Lanka';
          }
        }
        if (!parsed.inquiries) {
          parsed.inquiries = initialInquiries;
        }
        // Always sync softwareProducts to be 100% identical to software-solutions projects!
        const softwareCat = parsed.categories.find((c) => c.key === 'software-solutions');
        if (softwareCat && softwareCat.projects) {
          parsed.softwareProducts = softwareCat.projects;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading store data from localStorage', e);
  }

  const defaultSoftware = initialCategories.find((c) => c.key === 'software-solutions').projects;
  return {
    categories: initialCategories,
    homepageHeroBanners: initialHomepageHeroBanners,
    softwareBanners: initialSoftwareBanners,
    softwareProducts: defaultSoftware,
    teamMembers: initialTeamMembers,
    settings: initialSettings,
    inquiries: initialInquiries
  };
}

// Background MongoDB sync helper
const BACKEND_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) || 'http://localhost:5001';

export async function syncFromBackend() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/data`);
    if (res.ok) {
      const remoteData = await res.json();
      if (remoteData && remoteData.categories && remoteData.categories.length > 0) {
        const local = getStoreData();

        // Only overwrite if remote data is newer OR there's no local data stored yet
        const hasLocalData = !!localStorage.getItem(STORAGE_KEY);
        const remoteTs = remoteData.updatedAt ? new Date(remoteData.updatedAt).getTime() : 0;
        const localTs = local._savedAt ? new Date(local._savedAt).getTime() : 0;

        // Use remote only if: no local data, or remote is definitively newer
        if (!hasLocalData || (remoteTs > 0 && remoteTs > localTs)) {
          const merged = {
            ...local,
            categories: remoteData.categories,
            homepageHeroBanners: remoteData.homepageHeroBanners || local.homepageHeroBanners,
            softwareBanners: remoteData.softwareBanners || local.softwareBanners,
            softwareProducts: remoteData.softwareProducts || local.softwareProducts,
            teamMembers: remoteData.teamMembers || local.teamMembers || initialTeamMembers,
            settings: remoteData.settings || local.settings
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          window.dispatchEvent(new Event('bizpark_store_updated'));
        }
      }
    }
  } catch {
    // Graceful offline fallback: continue with local cache
  }
}

// Automatically initiate background sync on module load
if (typeof window !== 'undefined') {
  syncFromBackend();
}

export function saveStoreData(data) {
  try {
    // ALWAYS force softwareProducts array to be identical to software-solutions category projects!
    const softwareCat = data.categories && data.categories.find((c) => c.key === 'software-solutions');
    if (softwareCat && softwareCat.projects) {
      data.softwareProducts = softwareCat.projects;
    }
    // Stamp save time for sync comparison
    data._savedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('bizpark_store_updated'));

    // Asynchronously dispatch update to Express MongoDB Backend
    fetch(`${BACKEND_URL}/api/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {
      // Offline fallback: data is already safely stored in local browser cache
    });
  } catch (e) {
    console.error('Error saving store data to localStorage', e);
  }
}

export function addInquiry(inquiryData) {
  const data = getStoreData();
  const newInquiry = {
    id: `inq-${Date.now()}`,
    date: new Date().toLocaleString(),
    ...inquiryData
  };
  data.inquiries = [newInquiry, ...(data.inquiries || [])];
  saveStoreData(data);
  // Local store updated with timestamp
  return newInquiry;
}

export function deleteInquiry(id) {
  const data = getStoreData();
  data.inquiries = (data.inquiries || []).filter((inq) => inq.id !== id);
  saveStoreData(data);

  fetch(`${BACKEND_URL}/api/inquiries/${id}`, {
    method: 'DELETE'
  }).catch(() => {});

  return data.inquiries;
}

export function clearAllInquiries() {
  const data = getStoreData();
  data.inquiries = [];
  saveStoreData(data);

  fetch(`${BACKEND_URL}/api/inquiries`, {
    method: 'DELETE'
  }).catch(() => {});

  return [];
}

export function resetStoreData() {
  const defaultSoftware = initialCategories.find((c) => c.key === 'software-solutions').projects;
  const data = {
    categories: initialCategories,
    homepageHeroBanners: initialHomepageHeroBanners,
    softwareBanners: initialSoftwareBanners,
    softwareProducts: defaultSoftware,
    teamMembers: initialTeamMembers,
    settings: initialSettings,
    inquiries: initialInquiries
  };
  saveStoreData(data);
  return data;
}
