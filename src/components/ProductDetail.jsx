import React, { useState, useEffect } from 'react';
import { getStoreData } from '../data/store';
import confetti from 'canvas-confetti';

export default function ProductDetail({ productId }) {
  const [storeData, setStoreData] = useState(getStoreData());
  const [downloadState, setDownloadState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    const handleUpdate = () => {
      setStoreData(getStoreData());
    };
    window.addEventListener('bizpark_store_updated', handleUpdate);
    return () => window.removeEventListener('bizpark_store_updated', handleUpdate);
  }, []);

  const softwareCat = (storeData.categories || []).find((c) => c.key === 'software-solutions');
  const softwareList = (softwareCat && softwareCat.projects && softwareCat.projects.length > 0)
    ? softwareCat.projects
    : storeData.softwareProducts || [];

  let product = softwareList.find((p) => p.id === productId);

  if (!product && storeData.softwareProducts) {
    product = storeData.softwareProducts.find((p) => p.id === productId);
  }

  if (!product && storeData.categories) {
    for (const cat of storeData.categories) {
      const found = cat.projects.find((p) => p.id === productId);
      if (found) { product = found; break; }
    }
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-chakra text-3xl font-bold text-white mb-4">SOFTWARE SOLUTION NOT FOUND</h2>
        <p className="text-[#95928a] mb-8">The product you are looking for does not exist or has been moved.</p>
        <a href="#products" className="bg-[#f2603e] text-[#0a0a0a] font-mono text-xs uppercase tracking-wider px-6 py-3 cut-sm font-semibold">
          Return to Products
        </a>
      </div>
    );
  }

  // Direct Download Handler
  const startDownload = () => {
    if (downloadState !== 'idle') return;

    setDownloadState('connecting');
    setProgress(0);
    setLogs(['[SYSTEM] Initializing software download request...', '[SYSTEM] Resolving CDN / Download server node...']);

    setTimeout(() => {
      setDownloadState('downloading');
      setLogs((prev) => [
        ...prev,
        '[CDN] Connected to download target endpoint',
        `[SYSTEM] Downloading ${product.name} package (${product.fileSize || '50 MB'})...`
      ]);

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 14) + 8;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          
          setLogs((prev) => [...prev, '[SYSTEM] Download 100% complete.', '[CRYPT] Validating cryptographic signature (SHA-256)...']);
          
          setTimeout(() => {
            setDownloadState('extracting');
            setLogs((prev) => [...prev, '[CRYPT] Signature OK. Verified publisher: bizparkstudio', '[SYSTEM] Triggering software installer dispatch...']);
            
            setTimeout(() => {
              setDownloadState('completed');
              setLogs((prev) => [...prev, '[SYSTEM] Software ready.', '[SUCCESS] Download started!']);
              
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#f2603e', '#f5f4ef', '#ff6f4a']
              });

              // Check if custom download URL is specified
              const targetUrl = product.downloadUrl && product.downloadUrl !== '#' ? product.downloadUrl : '';

              if (targetUrl) {
                // Open direct download link in new tab or trigger download
                window.open(targetUrl, '_blank');
              } else {
                // Generate demo installer package
                const fileContent = `=====================================================
THANK YOU FOR DOWNLOADING ${product.name.toUpperCase()}
=====================================================
Product: ${product.name}
Version: ${product.version || 'v1.0.0'}
Release: ${product.releaseDate || '2026'}
Developer: bizparkstudio

To configure the real production environment or request custom changes,
please submit your requirements at:
Web: http://localhost:5173/#requirement-form
Contact: bizparkstudio@gmail.com

=====================================================
Copyright (c) 2026 bizparkstudio. All rights reserved.
=====================================================`;
                
                const blob = new Blob([fileContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${product.id}-installer.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }

            }, 1000);

          }, 800);
        }
        
        setProgress(currentProgress);
        
        if (currentProgress > 35 && currentProgress <= 45) {
          setLogs((prev) => {
            if (prev.some(l => l.includes('35%'))) return prev;
            return [...prev, '[DOWNLOAD] Received core application payload (35%)...'];
          });
        }

      }, 180);

    }, 1000);
  };

  const socials = product.socials || {};

  return (
    <article className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen relative overflow-hidden">
      {/* Background Graphic details */}
      <div className="absolute top-10 right-10 text-[12vw] font-bold text-white/[0.01] select-none font-mono pointer-events-none uppercase">
        SOFTWARE
      </div>

      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-10 flex items-center justify-between">
          <a
            href="#products"
            className="font-mono text-xs text-[#f2603e] hover:text-[#ff6f4a] flex items-center gap-2 group transition-colors font-bold uppercase tracking-wider"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO SOFTWARE PRODUCTS
          </a>
          <span className="font-mono text-xs text-[#605e58] tracking-widest uppercase">
            SOFTWARE / {product.id.toUpperCase()}
          </span>
        </div>

        {/* Header Title Block */}
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs text-[#f2603e] uppercase tracking-widest block mb-2 font-bold">
              {product.tag}
            </span>
            <h1 className="font-chakra text-4xl sm:text-5xl lg:text-6xl text-white uppercase font-bold tracking-tight leading-none mb-3">
              {product.name}
            </h1>
            <p className="text-base sm:text-lg text-[#95928a] max-w-2xl font-medium">
              {product.shortDescription || product.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#141413] border border-white/10 px-6 py-4 cut-sm">
            <div className="text-right">
              <span className="block font-mono text-[9px] text-[#605e58] uppercase">VERSION</span>
              <span className="text-sm font-bold font-mono text-white">{product.version || 'v1.0'}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <span className="block font-mono text-[9px] text-[#605e58] uppercase">FILE SIZE</span>
              <span className="text-sm font-bold font-mono text-[#f2603e]">{product.fileSize || '45 MB'}</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Mock Dashboard Preview */}
            <div className="w-full aspect-[16/10] bg-[#141413] border border-white/10 p-[1px] cut relative overflow-hidden">
              <div className="w-full h-full bg-[#0a0a0a] cut flex flex-col p-4 font-mono text-xs text-[#605e58]">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    <span className="ml-2 text-[10px] text-white/40">{product.name} interface.exe</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded-sm">Status: Operational</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 flex-grow">
                  <div className="col-span-1 border border-white/5 p-3 cut-sm flex flex-col justify-between">
                    <div>
                      <div className="text-white/30 text-[9px] mb-2 uppercase">System Health</div>
                      <div className="text-base font-bold text-white font-chakra">99.9% UPTIME</div>
                    </div>
                    <div className="h-20 flex items-end gap-1">
                      {[40, 65, 80, 55, 90, 100, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-[#f2603e]/40 hover:bg-[#f2603e] transition-colors" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 border border-white/5 p-3 cut-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                      <div className="text-white/30 text-[9px] uppercase">Execution Logs</div>
                      <div className="text-[9px] text-[#f2603e]">ACTIVE</div>
                    </div>
                    <div className="space-y-1.5 flex-grow font-mono text-[10px] text-[#95928a]">
                      <div>&gt; initializing {product.name} client process... <span className="text-emerald-500 font-bold">OK</span></div>
                      <div>&gt; local sqlite offline storage mounted</div>
                      <div>&gt; real-time cloud data sync operational</div>
                      <div>&gt; security layer AES-256 authenticated</div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Description */}
            <div>
              <h2 className="font-chakra text-xl uppercase tracking-wider text-white mb-4 border-l-2 border-[#f2603e] pl-3 font-bold">
                Software Architecture &amp; Overview
              </h2>
              <p className="text-[#95928a] text-sm leading-relaxed mb-4">
                {product.description}
              </p>
              <p className="text-[#95928a] text-sm leading-relaxed">
                By deploying {product.name} from Bizpark Studio, you cut software implementation timelines by up to 80%. We provide continuous software updates, hardware peripheral integrations, and direct technical support.
              </p>
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h2 className="font-chakra text-xl uppercase tracking-wider text-white mb-5 border-l-2 border-[#f2603e] pl-3 font-bold">
                  Key Module Features
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#95928a]">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3 bg-[#141413] border border-white/5 p-4 cut-sm">
                      <span className="w-1.5 h-1.5 bg-[#f2603e] rounded-full flex-shrink-0" />
                      <span className="font-chakra text-sm uppercase text-white font-bold tracking-wide">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CONNECTED SOCIAL MEDIA PAGES FOR THIS SOFTWARE */}
            <div className="pt-6 border-t border-white/10">
              <span className="font-mono text-xs text-[#f2603e] uppercase tracking-widest block font-bold mb-1">
                OFFICIAL CHANNELS &amp; COMMUNITY
              </span>
              <h2 className="font-chakra text-2xl text-white uppercase font-bold mb-4">
                {product.name} Social Media Links
              </h2>
              <p className="text-xs text-[#95928a] font-mono mb-6">
                Follow our dedicated social channels for user guides, feature update announcements, and video tutorials.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {socials.facebook && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#141413] hover:bg-[#f2603e] text-[#95928a] hover:text-black border border-white/10 hover:border-transparent p-3.5 cut-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all"
                  >
                    <span>Facebook</span>
                    <span>↗</span>
                  </a>
                )}
                {socials.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#141413] hover:bg-[#f2603e] text-[#95928a] hover:text-black border border-white/10 hover:border-transparent p-3.5 cut-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all"
                  >
                    <span>Instagram</span>
                    <span>↗</span>
                  </a>
                )}
                {socials.twitter && (
                  <a
                    href={socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#141413] hover:bg-[#f2603e] text-[#95928a] hover:text-black border border-white/10 hover:border-transparent p-3.5 cut-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all"
                  >
                    <span>Twitter / X</span>
                    <span>↗</span>
                  </a>
                )}
                {socials.linkedin && (
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#141413] hover:bg-[#f2603e] text-[#95928a] hover:text-black border border-white/10 hover:border-transparent p-3.5 cut-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all"
                  >
                    <span>LinkedIn</span>
                    <span>↗</span>
                  </a>
                )}
                {socials.github && (
                  <a
                    href={socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#141413] hover:bg-[#f2603e] text-[#95928a] hover:text-black border border-white/10 hover:border-transparent p-3.5 cut-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all"
                  >
                    <span>GitHub</span>
                    <span>↗</span>
                  </a>
                )}
                {socials.youtube && (
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#141413] hover:bg-[#f2603e] text-[#95928a] hover:text-black border border-white/10 hover:border-transparent p-3.5 cut-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all"
                  >
                    <span>YouTube</span>
                    <span>↗</span>
                  </a>
                )}
                {socials.whatsapp && (
                  <a
                    href={socials.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#141413] hover:bg-[#f2603e] text-[#95928a] hover:text-black border border-white/10 hover:border-transparent p-3.5 cut-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all"
                  >
                    <span>WhatsApp</span>
                    <span>↗</span>
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Download & Specifications Column */}
          <div className="lg:col-span-4 space-y-8 lg:border-l lg:border-white/10 lg:pl-8">
            
            {/* Download Simulation Block */}
            <div className="bg-[#141413] border border-[#f2603e]/40 p-6 cut-sm space-y-6 shadow-2xl">
              <div>
                <h3 className="font-chakra text-lg text-white uppercase font-bold mb-1">
                  Download {product.name}
                </h3>
                <p className="text-xs text-[#95928a] leading-relaxed">
                  Download the application installer package or access direct software download endpoint.
                </p>
              </div>

              {/* Main CTA or Progress bar */}
              {downloadState === 'idle' ? (
                <button
                  onClick={startDownload}
                  className="w-full bg-[#f2603e] text-[#0a0a0a] font-chakra font-bold text-xs uppercase tracking-wider py-4 cut-sm hover:bg-[#ff6f4a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f2603e]/10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Software ({product.fileSize || '50 MB'})
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#f2603e] uppercase font-bold tracking-wide animate-pulse">
                      {downloadState === 'connecting' && 'Connecting...'}
                      {downloadState === 'downloading' && `Downloading...`}
                      {downloadState === 'extracting' && 'Triggering Download...'}
                      {downloadState === 'completed' && 'Completed!'}
                    </span>
                    <span className="text-white font-bold">{progress}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-[#f2603e] transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="bg-black/90 border border-white/10 p-3 h-28 overflow-y-auto font-mono text-[9px] leading-relaxed text-[#95928a] space-y-1 rounded scrollbar-none">
                    {logs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>

                  {downloadState === 'completed' && (
                    <button
                      onClick={() => setDownloadState('idle')}
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-mono text-[10px] uppercase tracking-wider py-2 transition-all"
                    >
                      Download Again
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Requirements */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="font-mono text-xs text-[#605e58] uppercase tracking-wider mb-4 font-bold">
                System Requirements
              </h3>
              <ul className="space-y-3 font-mono text-[11px] text-[#95928a]">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#605e58]">OS</span>
                  <span className="text-white">Windows 10+, macOS, Linux</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#605e58]">RAM</span>
                  <span className="text-white">4GB RAM (8GB Rec)</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#605e58]">STORAGE</span>
                  <span className="text-white">200 MB Free Space</span>
                </li>
              </ul>
            </div>

            {/* Customization Request */}
            <div className="border-t border-white/10 pt-8">
              <div className="bg-[#141413] border border-white/10 p-6 cut-sm space-y-4">
                <h4 className="font-chakra text-base text-white uppercase font-bold">
                  Custom ERP / POS Needed?
                </h4>
                <p className="text-xs text-[#95928a] leading-relaxed">
                  We customize features, database schemas, and billing workflows tailored specifically to your business operations.
                </p>
                <a
                  href="#requirement-form"
                  className="w-full text-center inline-block bg-transparent border border-[#f2603e]/40 hover:border-[#f2603e] text-[#f2603e] font-chakra font-bold text-xs uppercase tracking-wider py-3 cut-sm transition-all"
                >
                  Request Custom Build →
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </article>
  );
}
