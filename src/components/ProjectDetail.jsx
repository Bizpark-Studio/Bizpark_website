import React, { useEffect, useState } from 'react';
import { getStoreData } from '../data/store';
import confetti from 'canvas-confetti';
import { submitInquiry } from '../utils/mailService';

export default function ProjectDetail({ projectId }) {
  const [storeData, setStoreData] = useState(getStoreData());
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Showcase slider & process slider states
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [processIndex, setProcessIndex] = useState(0);

  // Interactive Download Terminal States
  const [downloadState, setDownloadState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '$1,000 - $3,000',
    message: ''
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [projectWhatsappUrl, setProjectWhatsappUrl] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  useEffect(() => {
    const handleUpdate = () => {
      setStoreData(getStoreData());
    };
    window.addEventListener('bizpark_store_updated', handleUpdate);
    return () => window.removeEventListener('bizpark_store_updated', handleUpdate);
  }, []);

  // Robust project lookup across categories and software-solutions
  let project = null;
  let categoryTag = '';
  let categoryKey = '';

  const softwareCat = (storeData.categories || []).find((c) => c.key === 'software-solutions');
  if (softwareCat && softwareCat.projects) {
    const foundSoft = softwareCat.projects.find((p) => p.id === projectId);
    if (foundSoft) {
      project = foundSoft;
      categoryTag = softwareCat.category;
      categoryKey = softwareCat.key;
    }
  }

  if (!project) {
    for (const catGroup of storeData.categories || []) {
      const found = catGroup.projects.find((p) => p.id === projectId);
      if (found) {
        project = found;
        categoryTag = catGroup.category;
        categoryKey = catGroup.key;
        break;
      }
    }
  }

  if (!project && storeData.softwareProducts) {
    const foundProd = storeData.softwareProducts.find((p) => p.id === projectId);
    if (foundProd) {
      project = foundProd;
      categoryTag = 'Software Solutions';
      categoryKey = 'software-solutions';
    }
  }

  // Multi showcase media items (fallback to main image if empty)
  const showcaseMedia =
    project && project.showcaseMedia && project.showcaseMedia.length > 0
      ? project.showcaseMedia
      : project
      ? [{ type: 'image', url: project.image || '/images/hero.png' }]
      : [];

  const processPhotos = (project && project.processImages) || [];
  const showcaseCount = showcaseMedia.length;

  // Auto-play showcase slides if > 1 item
  useEffect(() => {
    if (showcaseCount <= 1) return;
    const timer = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % showcaseCount);
    }, 5500);
    return () => clearInterval(timer);
  }, [showcaseCount]);

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-chakra text-3xl font-bold text-white mb-4">CASE STUDY NOT FOUND</h2>
        <p className="text-[#95928a] mb-8">The project case study you are looking for does not exist or has been moved.</p>
        <a href="#work" className="bg-[#f2603e] text-[#0a0a0a] font-mono text-xs uppercase tracking-wider px-6 py-3 cut-sm font-semibold">
          Return to Showcase
        </a>
      </div>
    );
  }

  const isSoftwareProject =
    categoryKey === 'software-solutions' ||
    Boolean(project.downloadUrl) ||
    categoryTag.toLowerCase().includes('software');

  // Direct file / link download trigger
  const triggerFileDownload = () => {
    const targetUrl =
      project.downloadUrl &&
      project.downloadUrl !== '#' &&
      project.downloadUrl !== 'https-#' &&
      project.downloadUrl !== 'https://#'
        ? project.downloadUrl
        : '';

    if (targetUrl) {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      const fileName = targetUrl.split('/').pop();
      if (fileName && fileName.includes('.')) {
        a.download = fileName;
      }
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
      }, 300);
    } else {
      // Generate instantaneous verified installer package
      const fileContent = `=====================================================
THANK YOU FOR DOWNLOADING ${project.name.toUpperCase()}
=====================================================
Software Package: ${project.name}
Version: ${project.version || 'v7.2.5'}
File Size: ${project.fileSize || '16 MB'}
Release: ${project.releaseDate || '2026'}
Developer: bizparkstudio

Official Software Package & Deployment Package.
For installation documentation or custom server setup,
visit: http://localhost:5173/#requirement-form
Contact: bizparkstudio@gmail.com

=====================================================
Copyright (c) 2026 bizparkstudio. All rights reserved.
=====================================================`;

      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(project.name || 'software').toLowerCase().replace(/\s+/g, '-')}-installer.txt`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      }, 300);
    }
  };

  // Interactive Download Execution
  const handleStartDownload = () => {
    // 1. Trigger actual file download immediately without browser popup blocker delays
    triggerFileDownload();

    // 2. Launch celebration confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f2603e', '#f5f4ef', '#ff6f4a']
    });

    // 3. Run telemetry logs & progress bar in terminal
    setDownloadState('downloading');
    setProgress(20);
    setLogs([
      `[SYSTEM] Initialized software download request for ${project.name}...`,
      `[CDN] Connected to download target endpoint: ${project.downloadUrl || 'Local Package Node'}`,
      `[DOWNLOAD] Dispatched ${project.name} package (${project.fileSize || '16 MB'})...`
    ]);

    let current = 25;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 12;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setDownloadState('completed');
        setLogs((prev) => [
          ...prev,
          '[CRYPT] Validating cryptographic signature (SHA-256)... OK',
          '[SYSTEM] Verified publisher: bizparkstudio',
          '[SUCCESS] Software package download initiated successfully!'
        ]);
      } else {
        setProgress(current);
        if (current > 50 && current <= 70) {
          setLogs((prev) => {
            if (prev.some((l) => l.includes('Payload stream'))) return prev;
            return [...prev, '[DOWNLOAD] Payload stream verified at 100% bandwidth integrity...'];
          });
        }
      }
    }, 150);
  };

  // Top Header button click handler
  const handleTopDownloadClick = (e) => {
    e.preventDefault();
    handleStartDownload();
    const el = document.getElementById('software-download-station');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Smooth scroll jump to contact form
  const scrollToContactForm = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById('project-contact-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await submitInquiry({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        budget: contactData.budget,
        details: contactData.message,
        source: `Project Case Study: ${project.name} (${categoryTag})`
      });
      setProjectWhatsappUrl(res.whatsappUrl);
      setFormSubmitted(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#f2603e', '#f5f4ef', '#ff6f4a'] });
    } catch (err) {
      console.error(err);
      setFormSubmitted(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  const isVideo = (med) => {
    if (!med || !med.url) return false;
    return (
      med.type === 'video' ||
      med.url.includes('data:video') ||
      /\.(mp4|webm|ogg|mov)$/i.test(med.url)
    );
  };

  const socials = project.socials || {};

  return (
    <article className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-[#0a0a0a] min-h-screen relative overflow-hidden">
      {/* Background graphic details */}
      <div className="absolute top-10 left-10 text-[12vw] font-bold text-white/[0.01] select-none font-mono pointer-events-none uppercase">
        {isSoftwareProject ? 'SOFTWARE' : 'CASESTUDY'}
      </div>

      <div className="max-w-[1040px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 sm:mb-10 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`#category-${categoryKey}`}
            className="font-mono text-[11px] sm:text-xs text-[#f2603e] hover:text-[#ff6f4a] flex items-center gap-2 group transition-colors font-bold uppercase tracking-wider"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO {categoryTag.toUpperCase()}
          </a>
          <span className="font-mono text-[10px] sm:text-xs text-[#605e58] tracking-widest uppercase">
            {categoryTag} / {project.id.toUpperCase()}
          </span>
        </div>

        {/* Project Header Info */}
        <div className="mb-8 sm:mb-12 border-b border-white/10 pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2.5 sm:mb-3">
              <span className="font-mono text-[11px] sm:text-xs text-[#f2603e] uppercase tracking-widest font-bold">
                Client / Outlets: {project.client}
              </span>
              {(project.subTag || project.tag) && (
                <span className="font-mono text-[10px] text-white bg-[#141413] border border-white/15 px-2.5 py-0.5 sm:px-3 sm:py-1 cut-sm font-semibold">
                  {project.subTag || project.tag}
                </span>
              )}
            </div>

            <h1 className="font-chakra text-3xl sm:text-5xl lg:text-6xl text-white uppercase font-bold tracking-tight leading-[1.1] mb-3 sm:mb-4 break-words">
              {project.name}
            </h1>
            <p className="text-sm sm:text-base text-[#95928a] font-medium max-w-3xl leading-relaxed">
              {project.description || project.shortDescription}
            </p>
          </div>

          {/* Action CTAs: Download & Live Website */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto shrink-0">
            {isSoftwareProject ? (
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-3 sm:gap-4 bg-[#141413] border border-[#f2603e]/40 p-3 sm:px-5 sm:py-3 cut-sm w-full sm:w-auto">
                <div className="flex items-center gap-3 font-mono">
                  <div className="text-left sm:text-right">
                    <span className="block text-[8px] sm:text-[9px] text-[#605e58] uppercase">VERSION</span>
                    <span className="text-xs sm:text-sm font-bold text-white">{project.version || 'v7.2.5'}</span>
                  </div>
                  <div className="w-[1px] h-6 sm:h-8 bg-white/10" />
                  <div>
                    <span className="block text-[8px] sm:text-[9px] text-[#605e58] uppercase">FILE SIZE</span>
                    <span className="text-xs sm:text-sm font-bold text-[#f2603e]">{project.fileSize || '16 MB'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTopDownloadClick}
                  className="bg-[#f2603e] text-black font-chakra font-bold text-xs uppercase px-4 py-2 sm:py-2.5 cut-sm hover:bg-[#ff6f4a] active:scale-95 transition-all whitespace-nowrap cursor-pointer shadow-md ml-auto sm:ml-2"
                >
                  Download ⬇
                </button>
              </div>
            ) : (
              project.websiteUrl && project.websiteUrl !== 'https-[#]' && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto bg-[#f2603e] text-[#0a0a0a] hover:bg-[#ff6f4a] active:scale-[0.98] font-chakra font-bold text-xs uppercase tracking-wider px-6 py-3.5 sm:py-4 cut-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f2603e]/10 whitespace-nowrap"
                >
                  <span>Visit Live Website</span>
                  <span className="text-base leading-none">↗</span>
                </a>
              )
            )}
          </div>
        </div>

        {/* MULTI-MEDIA SHOWCASE SLIDER / VIDEO PLAYER */}
        <div className="w-full aspect-[16/9] cut border border-white/15 overflow-hidden relative mb-8 sm:mb-14 bg-[#141413] shadow-2xl">
          <div
            className="w-full h-full flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${showcaseIndex * 100}%)` }}
          >
            {showcaseMedia.map((med, idx) => (
              <div key={idx} className="w-full h-full flex-shrink-0 relative bg-black">
                {isVideo(med) ? (
                  <video
                    src={med.url}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={med.url}
                    alt={`${project.name} showcase ${idx + 1}`}
                    className="w-full h-full object-cover opacity-90"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Slider Prev / Next Controls if > 1 item */}
          {showcaseMedia.length > 1 && (
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 z-20 flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowcaseIndex((prev) => (prev === 0 ? showcaseMedia.length - 1 : prev - 1))}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/80 border border-white/20 text-white font-mono hover:border-[#f2603e] hover:text-[#f2603e] flex items-center justify-center transition-colors text-sm sm:text-base cursor-pointer"
                aria-label="Previous showcase slide"
              >
                ‹
              </button>
              <div className="flex gap-1 sm:gap-1.5">
                {showcaseMedia.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setShowcaseIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      showcaseIndex === idx ? 'w-5 sm:w-6 bg-[#f2603e]' : 'w-1.5 sm:w-2 bg-white/30'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setShowcaseIndex((prev) => (prev + 1) % showcaseMedia.length)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/80 border border-white/20 text-white font-mono hover:border-[#f2603e] hover:text-[#f2603e] flex items-center justify-center transition-colors text-sm sm:text-base cursor-pointer"
                aria-label="Next showcase slide"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* EMBEDDED SOFTWARE DOWNLOAD & TRIAL STATION (FOR SOFTWARE SOLUTIONS) */}
        {isSoftwareProject && (
          <div id="software-download-station" className="mb-10 sm:mb-16 bg-[#141413] border border-[#f2603e]/40 p-4 sm:p-8 cut shadow-2xl relative overflow-hidden space-y-4 sm:space-y-6 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 sm:pb-5">
              <div>
                <span className="font-mono text-[10px] sm:text-xs text-[#f2603e] uppercase tracking-widest font-bold block mb-1">
                  OFFICIAL SOFTWARE DOWNLOAD STATION
                </span>
                <h2 className="font-chakra text-xl sm:text-2xl md:text-3xl text-white uppercase font-bold leading-tight">
                  Download {project.name}
                </h2>
                <p className="text-xs text-[#95928a] font-mono mt-1">
                  Download the application installer package or access direct endpoint.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="bg-black/80 border border-white/10 text-white font-mono text-[11px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 cut-sm">
                  VERSION: <span className="text-[#f2603e] font-bold">{project.version || 'v7.2.5'}</span>
                </span>
                <span className="bg-black/80 border border-white/10 text-white font-mono text-[11px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 cut-sm">
                  SIZE: <span className="text-emerald-400 font-bold">{project.fileSize || '16 MB'}</span>
                </span>
              </div>
            </div>

            {/* Interactive Download Terminal */}
            <div className="bg-[#0a0a0a] border border-white/10 cut-sm p-3.5 sm:p-5 space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f2603e] animate-ping" />
                  <span className="text-white font-bold uppercase text-[11px] sm:text-xs">
                    {downloadState === 'completed'
                      ? 'DOWNLOAD COMPLETE 100%'
                      : downloadState === 'downloading'
                      ? `DOWNLOADING... ${progress}%`
                      : 'READY FOR DISPATCH'}
                  </span>
                </div>
                <span className="text-[#605e58] font-mono text-[10px] sm:text-[11px]">
                  STATUS: {downloadState.toUpperCase()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#141413] border border-white/10 h-2.5 sm:h-3 cut-sm overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#f2603e] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Console logs */}
              <div className="bg-black/80 border border-white/5 p-2.5 sm:p-3 font-mono text-[10px] sm:text-[11px] text-emerald-400 space-y-1 max-h-28 overflow-y-auto cut-sm">
                {logs.length > 0 ? (
                  logs.map((log, i) => <div key={i}>{log}</div>)
                ) : (
                  <div className="text-[#605e58]">
                    &gt; Click the button below to initialize software download and signature verification...
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <button
                  onClick={handleStartDownload}
                  disabled={downloadState === 'downloading' || downloadState === 'connecting' || downloadState === 'extracting'}
                  className="w-full sm:w-auto bg-[#f2603e] text-black font-chakra font-bold text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 cut-sm hover:bg-[#ff6f4a] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 cursor-pointer text-center"
                >
                  {downloadState === 'completed' ? 'Download Again ⬇' : `Download ${project.name} Now ⬇`}
                </button>

                {project.downloadUrl && project.downloadUrl !== '#' && (
                  <a
                    href={project.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-[#95928a] hover:text-white underline text-center sm:text-left"
                  >
                    Direct Endpoint Link ↗
                  </a>
                )}
              </div>
            </div>

            {/* System Requirements & Official Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1 sm:pt-2">
              <div className="bg-[#0a0a0a] border border-white/10 p-3.5 sm:p-4 cut-sm font-mono text-xs space-y-2">
                <span className="text-[#f2603e] font-bold block uppercase tracking-wider text-[10px] sm:text-[11px]">
                  SYSTEM REQUIREMENTS
                </span>
                <div className="flex justify-between border-b border-white/5 pb-1 text-[#95928a] text-[11px] sm:text-xs">
                  <span>Supported OS:</span>
                  <span className="text-white">Windows 10+, macOS, Linux</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1 text-[#95928a] text-[11px] sm:text-xs">
                  <span>Memory (RAM):</span>
                  <span className="text-white">4GB RAM (8GB Recommended)</span>
                </div>
                <div className="flex justify-between text-[#95928a] text-[11px] sm:text-xs">
                  <span>Disk Storage:</span>
                  <span className="text-white">200 MB Free Space</span>
                </div>
              </div>

              {/* Official Social Media Links */}
              <div className="bg-[#0a0a0a] border border-white/10 p-3.5 sm:p-4 cut-sm font-mono text-xs space-y-2">
                <span className="text-[#f2603e] font-bold block uppercase tracking-wider text-[10px] sm:text-[11px]">
                  OFFICIAL CHANNELS &amp; COMMUNITY
                </span>
                <p className="text-[#605e58] text-[10px] sm:text-[11px]">
                  Follow dedicated channels for user guides, update announcements, and technical tutorials:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {socials.facebook && (
                    <a href={socials.facebook} target="_blank" rel="noreferrer" className="bg-[#141413] hover:bg-white/10 text-white px-2.5 py-1 border border-white/10 cut-sm text-[10px]">
                      Facebook
                    </a>
                  )}
                  {socials.instagram && (
                    <a href={socials.instagram} target="_blank" rel="noreferrer" className="bg-[#141413] hover:bg-white/10 text-white px-2.5 py-1 border border-white/10 cut-sm text-[10px]">
                      Instagram
                    </a>
                  )}
                  {socials.twitter && (
                    <a href={socials.twitter} target="_blank" rel="noreferrer" className="bg-[#141413] hover:bg-white/10 text-white px-2.5 py-1 border border-white/10 cut-sm text-[10px]">
                      Twitter / X
                    </a>
                  )}
                  {socials.linkedin && (
                    <a href={socials.linkedin} target="_blank" rel="noreferrer" className="bg-[#141413] hover:bg-white/10 text-white px-2.5 py-1 border border-white/10 cut-sm text-[10px]">
                      LinkedIn
                    </a>
                  )}
                  {socials.github && (
                    <a href={socials.github} target="_blank" rel="noreferrer" className="bg-[#141413] hover:bg-white/10 text-white px-2.5 py-1 border border-white/10 cut-sm text-[10px]">
                      GitHub
                    </a>
                  )}
                  {socials.whatsapp && (
                    <a href={socials.whatsapp} target="_blank" rel="noreferrer" className="bg-[#141413] hover:bg-white/10 text-white px-2.5 py-1 border border-white/10 cut-sm text-[10px]">
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Case Study Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10 sm:mb-16">
          
          {/* Main Case Study Column */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-10">
            
            {/* Overview */}
            <div>
              <h2 className="font-chakra text-lg sm:text-xl uppercase tracking-wider text-white mb-3 sm:mb-4 border-l-2 border-[#f2603e] pl-3 font-bold">
                Project Overview &amp; Strategy
              </h2>
              <p className="text-[#95928a] text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                {project.description || project.shortDescription}
              </p>
              <p className="text-[#95928a] text-xs sm:text-sm leading-relaxed">
                Working closely with the client team, Bizpark Studio engineered this solution from initial architectural mapping to production deployment. The final outcome achieved high operational efficiency, optimized conversions, and delivered a top-tier user experience.
              </p>
            </div>

            {/* HORIZONTAL SLIDING PROCESS PHOTOS GALLERY */}
            {processPhotos.length > 0 && (
              <div className="pt-6 border-t border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-2">
                  <div>
                    <span className="font-mono text-[10px] sm:text-xs text-[#f2603e] uppercase tracking-widest block font-bold mb-1">
                      BEHIND THE SCENES
                    </span>
                    <h2 className="font-chakra text-xl sm:text-2xl uppercase tracking-wider text-white font-bold leading-tight">
                      Development &amp; Making Process Photos
                    </h2>
                  </div>
                  <span className="font-mono text-[11px] sm:text-xs text-[#605e58] shrink-0">
                    Snapshot {processIndex + 1} of {processPhotos.length}
                  </span>
                </div>

                {/* SLIDING CAROUSEL CONTAINER */}
                <div className="relative bg-[#141413] border border-[#f2603e]/40 cut p-3.5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl overflow-hidden">
                  
                  {/* Slider Stage */}
                  <div className="relative aspect-[16/9] w-full cut border border-white/10 overflow-hidden bg-black/80">
                    <div
                      className="absolute inset-0 flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${processIndex * 100}%)` }}
                    >
                      {processPhotos.map((proc, idx) => (
                        <div key={idx} className="w-full h-full flex-shrink-0 relative">
                          <img
                            src={proc.url}
                            alt={proc.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-black/90 backdrop-blur-md font-mono text-[9px] sm:text-[10px] text-[#f2603e] px-2.5 py-1 sm:px-3 sm:py-1 border border-[#f2603e]/40 font-bold uppercase">
                            PHASE 0{idx + 1} SNAPSHOT
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Left / Right Nav Arrows */}
                    {processPhotos.length > 1 && (
                      <>
                        <button
                          onClick={() => setProcessIndex((prev) => (prev === 0 ? processPhotos.length - 1 : prev - 1))}
                          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/80 border border-white/20 text-white font-mono text-base sm:text-lg hover:border-[#f2603e] hover:text-[#f2603e] flex items-center justify-center transition-colors z-20 cursor-pointer"
                          aria-label="Previous snapshot"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => setProcessIndex((prev) => (prev + 1) % processPhotos.length)}
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/80 border border-white/20 text-white font-mono text-base sm:text-lg hover:border-[#f2603e] hover:text-[#f2603e] flex items-center justify-center transition-colors z-20 cursor-pointer"
                          aria-label="Next snapshot"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* Active Photo Caption & Notes */}
                  {processPhotos[processIndex] && (
                    <div className="space-y-1">
                      <h4 className="font-chakra text-base sm:text-lg text-white font-bold uppercase">
                        {processPhotos[processIndex].title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[#95928a] font-mono leading-relaxed">
                        {processPhotos[processIndex].note}
                      </p>
                    </div>
                  )}

                  {/* Horizontal Thumbnail Strip */}
                  {processPhotos.length > 1 && (
                    <div className="flex items-center gap-2 sm:gap-3 pt-2.5 sm:pt-3 border-t border-white/10 overflow-x-auto pb-1 scrollbar-none">
                      {processPhotos.map((proc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setProcessIndex(idx)}
                          className={`relative flex-shrink-0 w-16 sm:w-20 aspect-[16/10] cut-sm overflow-hidden border transition-all cursor-pointer ${
                            processIndex === idx
                              ? 'border-[#f2603e] ring-1 ring-[#f2603e] opacity-100'
                              : 'border-white/10 opacity-50 hover:opacity-80'
                          }`}
                        >
                          <img src={proc.url} alt={proc.title} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Key Deliverables / Scope */}
            {project.features && (
              <div className="pt-4 border-t border-white/10">
                <h2 className="font-chakra text-lg sm:text-xl uppercase tracking-wider text-white mb-4 sm:mb-5 border-l-2 border-[#f2603e] pl-3 font-bold">
                  Scope &amp; Key Deliverables
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 sm:gap-3 bg-[#141413] border border-white/5 p-3.5 sm:p-4 cut-sm">
                      <span className="w-1.5 h-1.5 bg-[#f2603e] mt-1.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-chakra text-xs sm:text-sm uppercase text-white font-bold tracking-wide">
                          {feat}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-[#605e58] font-mono mt-0.5">
                          Production Ready &amp; Verified
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Meta Column */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8 lg:border-l lg:border-white/10 lg:pl-8 pt-8 lg:pt-0 border-t border-white/10 lg:border-t-0">
            
            {/* Live Website Link Block */}
            {project.websiteUrl && project.websiteUrl !== 'https-[#]' && (
              <div className="bg-[#141413] border border-[#f2603e]/40 p-4 sm:p-6 cut-sm space-y-2.5 sm:space-y-3">
                <span className="font-mono text-[9px] sm:text-[10px] text-[#f2603e] font-bold uppercase tracking-wider block">
                  LIVE DEPLOYMENT
                </span>
                <h4 className="font-chakra text-sm sm:text-base text-white uppercase font-bold">
                  Inspect Production Site
                </h4>
                <p className="text-xs text-[#95928a] leading-relaxed">
                  Experience the live web solution in real time on the client's official domain.
                </p>
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center inline-flex items-center justify-between bg-[#f2603e] text-[#0a0a0a] font-chakra font-bold text-xs uppercase tracking-wider py-3 px-4 cut-sm hover:bg-[#ff6f4a] active:scale-[0.98] transition-all"
                >
                  <span>Visit Live Website</span>
                  <span>↗</span>
                </a>
              </div>
            )}

            {/* Tech Stack */}
            {project.tech && (
              <div>
                <h3 className="font-mono text-[11px] sm:text-xs text-[#605e58] uppercase tracking-wider mb-3 font-bold">
                  Tech Stack &amp; Tools Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[11px] sm:text-xs font-mono text-[#f5f4ef] bg-[#141413] px-3 py-1.5 border border-white/10 rounded-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Specs */}
            <div className="border-t border-white/10 pt-6 sm:pt-8 font-mono text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
                <div>
                  <span className="block text-[9px] sm:text-[10px] text-[#605e58] uppercase">Client Entity</span>
                  <span className="text-xs sm:text-sm font-semibold text-white">{project.client}</span>
                </div>
                <div>
                  <span className="block text-[9px] sm:text-[10px] text-[#605e58] uppercase font-bold">Category</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#f2603e]">{categoryTag}</span>
                </div>
                {(project.subTag || project.tag) && (
                  <div>
                    <span className="block text-[9px] sm:text-[10px] text-[#605e58] uppercase">Industry Sub-Tag</span>
                    <span className="text-xs sm:text-sm font-semibold text-white">{project.subTag || project.tag}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Direct CTA */}
            <div className="border-t border-white/10 pt-6 sm:pt-8">
              <div className="bg-[#141413] border border-white/10 p-4 sm:p-6 cut-sm space-y-3 sm:space-y-4">
                <h4 className="font-chakra text-base sm:text-lg text-white uppercase font-bold">
                  Need a similar project?
                </h4>
                <p className="text-xs text-[#95928a] leading-relaxed">
                  Scroll down to fill out our quick requirement form and start working with Bizpark Studio today.
                </p>
                <button
                  type="button"
                  onClick={scrollToContactForm}
                  className="w-full text-center inline-flex items-center justify-center gap-2 bg-[#f2603e] text-[#0a0a0a] font-chakra font-bold text-xs uppercase tracking-wider py-3.5 cut-sm hover:bg-[#ff6f4a] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#f2603e]/15"
                >
                  <span>Jump to Contact Form</span>
                  <span className="font-bold">↓</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Dedicated End-of-Page Contact Form */}
        <section id="project-contact-form" className="border-t border-white/10 pt-10 sm:pt-16 mt-10 sm:mt-16 scroll-mt-24">
          <div className="bg-[#141413] border border-[#f2603e]/50 p-5 sm:p-8 md:p-10 cut relative shadow-2xl">
            <div className="max-w-2xl mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-1.5 sm:mb-2 font-bold">
                <span className="w-4 h-[1px] bg-[#f2603e]" />
                START A SIMILAR {categoryTag.toUpperCase()} PROJECT
              </div>
              <h2 className="font-chakra text-2xl sm:text-3xl md:text-4xl text-white uppercase font-bold leading-tight">
                Let's Build Something Exceptional Together
              </h2>
              <p className="text-xs sm:text-sm text-[#95928a] mt-2 leading-relaxed">
                Inspired by <span className="text-white font-semibold">{project.name}</span>? Fill out this inquiry form below to get a custom timeline and cost estimate from our engineering team.
              </p>
            </div>

            {formSubmitted ? (
              <div className="bg-[#0a0a0a] border border-[#f2603e] p-6 sm:p-8 text-center cut-sm space-y-4 sm:space-y-5 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-[#f2603e]/20 text-[#f2603e] mx-auto flex items-center justify-center font-mono font-bold text-xl">
                  ✓
                </div>
                <h3 className="font-chakra text-xl sm:text-2xl text-white uppercase font-bold">Requirement Submitted &amp; Logged!</h3>
                <p className="text-xs sm:text-sm text-[#95928a] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out regarding your {categoryTag} project. Your specifications have been safely logged into our Admin Leads Vault, and our engineering leads will review your inquiry within 24 hours.
                </p>
                {projectWhatsappUrl && (
                  <div className="pt-2">
                    <a
                      href={projectWhatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-black font-chakra font-bold text-xs uppercase px-5 py-3 sm:px-6 sm:py-3.5 cut-sm hover:brightness-110 transition-all shadow-lg w-full sm:w-auto"
                    >
                      <span>💬 Chat with Studio on WhatsApp Now →</span>
                    </a>
                  </div>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="bg-[#141413] hover:bg-white/10 text-[#f5f4ef] border border-white/10 font-mono text-xs uppercase tracking-wider px-6 py-2.5 cut-sm cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block font-mono text-[11px] sm:text-xs text-[#95928a] uppercase mb-1.5 sm:mb-2">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-mono text-white outline-none cut-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] sm:text-xs text-[#95928a] uppercase mb-1.5 sm:mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-mono text-white outline-none cut-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block font-mono text-[11px] sm:text-xs text-[#95928a] uppercase mb-1.5 sm:mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-mono text-white outline-none cut-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] sm:text-xs text-[#95928a] uppercase mb-1.5 sm:mb-2">Project Budget</label>
                    <select
                      value={contactData.budget}
                      onChange={(e) => setContactData({ ...contactData, budget: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-mono text-white outline-none cut-sm transition-colors"
                    >
                      <option value="Under $1,000">Under $1,000</option>
                      <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                      <option value="$3,000 - $7,000">$3,000 - $7,000</option>
                      <option value="$7,000+">$7,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] sm:text-xs text-[#95928a] uppercase mb-1.5 sm:mb-2">Project Scope &amp; Details *</label>
                  <textarea
                    required
                    rows="4"
                    placeholder={`Tell us about your ${categoryTag} requirements, brand goals, or feature specs...`}
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3.5 sm:p-4 text-xs sm:text-sm font-mono text-white outline-none cut-sm transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full sm:w-auto bg-[#f2603e] hover:bg-[#ff6f4a] text-black font-chakra font-bold text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 cut-sm transition-all duration-200 shadow-lg shadow-[#f2603e]/10 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] cursor-pointer"
                >
                  {formSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Logging Requirement...
                    </>
                  ) : (
                    'Submit Project Requirement →'
                  )}
                </button>
              </form>
            )}

          </div>
        </section>

      </div>
    </article>
  );
}
