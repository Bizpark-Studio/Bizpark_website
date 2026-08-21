import React, { useState, useEffect } from 'react';
import { productsData } from './Products';
import confetti from 'canvas-confetti';

export default function ProductDetail({ productId }) {
  const product = productsData.find((p) => p.id === productId);

  // Download Simulation State
  const [downloadState, setDownloadState] = useState('idle'); // 'idle' | 'connecting' | 'downloading' | 'extracting' | 'completed'
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-chakra text-3xl font-bold text-white mb-4">PRODUCT NOT FOUND</h2>
        <p className="text-[#95928a] mb-8">The product you are looking for does not exist or has been moved.</p>
        <a href="#" className="bg-[#f2603e] text-[#0a0a0a] font-mono text-xs uppercase tracking-wider px-6 py-3 cut-sm font-semibold">
          Return to home
        </a>
      </div>
    );
  }

  // Simulated download handler
  const startDownload = () => {
    if (downloadState !== 'idle') return;

    setDownloadState('connecting');
    setProgress(0);
    setLogs(['[SYSTEM] Initializing download request...', '[SYSTEM] Resolving CDN nodes for geographic proximity...']);

    // Connection phase
    setTimeout(() => {
      setDownloadState('downloading');
      setLogs((prev) => [...prev, '[CDN] Connected to primary node Colombo-S1', `[SYSTEM] Downloading ${product.name} package (${product.fileSize})...`]);

      // Download progress phase
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 12) + 5;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          
          setLogs((prev) => [...prev, '[SYSTEM] Download 100% complete.', '[CRYPT] Validating cryptographic signature (SHA-256)...']);
          
          // Decryption / Extraction phase
          setTimeout(() => {
            setDownloadState('extracting');
            setLogs((prev) => [...prev, '[CRYPT] Signature OK. Verified publisher: bizparkstudio', '[SYSTEM] Preparing local installation archive...']);
            
            setTimeout(() => {
              setDownloadState('completed');
              setLogs((prev) => [...prev, '[SYSTEM] Installation package ready.', '[SUCCESS] Installer downloaded successfully to your local machine!']);
              
              // Trigger Confetti Celebration
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#f2603e', '#f5f4ef', '#ff6f4a']
              });

              // Create and download a physical mock text file
              const fileContent = `=====================================================
THANK YOU FOR DOWNLOADING ${product.name.toUpperCase()} TRIAL
=====================================================
Product: ${product.name}
Version: ${product.version}
Release: ${product.releaseDate}
Developer: bizparkstudio

This is a demonstration installer package.
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
              link.download = `${product.id}-installer-demo.txt`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }, 1200);

          }, 1000);
        }
        
        setProgress(currentProgress);
        
        // Log checkpoints
        if (currentProgress > 25 && currentProgress <= 35) {
          setLogs((prev) => {
            if (prev.some(l => l.includes('25%'))) return prev;
            return [...prev, '[DOWNLOAD] Received core assets (25%)...'];
          });
        }
        if (currentProgress > 60 && currentProgress <= 70) {
          setLogs((prev) => {
            if (prev.some(l => l.includes('60%'))) return prev;
            return [...prev, '[DOWNLOAD] Extracting application libraries (60%)...'];
          });
        }
        if (currentProgress > 85 && currentProgress <= 90) {
          setLogs((prev) => {
            if (prev.some(l => l.includes('85%'))) return prev;
            return [...prev, '[DOWNLOAD] Buffering user configuration module (85%)...'];
          });
        }

      }, 200);

    }, 1200);
  };

  return (
    <article className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen relative overflow-hidden">
      {/* Background Graphic details */}
      <div className="absolute top-10 right-10 text-[12vw] font-bold text-white/[0.01] select-none font-mono pointer-events-none">
        PRODUCT
      </div>

      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-10 flex items-center justify-between">
          <a
            href="#products"
            className="font-mono text-xs text-[#f2603e] hover:text-[#ff6f4a] flex items-center gap-2 group transition-colors"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO PRODUCTS
          </a>
          <span className="font-mono text-xs text-[#605e58] tracking-widest">
            SOLUTIONS / {product.id.toUpperCase()}
          </span>
        </div>

        {/* Header Title Block */}
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs text-[#f2603e] uppercase tracking-widest block mb-2">
              {product.tag}
            </span>
            <h1 className="font-chakra text-4xl sm:text-5xl lg:text-6xl text-white uppercase font-bold tracking-tight leading-none mb-3">
              {product.name}
            </h1>
            <p className="text-lg text-[#95928a] max-w-2xl">
              {product.shortDescription}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#141413] border border-white/5 px-6 py-4 cut-sm">
            <div className="text-right">
              <span className="block font-mono text-[9px] text-[#605e58]">VERSION</span>
              <span className="text-sm font-bold font-mono text-white">{product.version}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <span className="block font-mono text-[9px] text-[#605e58]">FILE SIZE</span>
              <span className="text-sm font-bold font-mono text-[#f2603e]">{product.fileSize}</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Mock screenshot placeholder with premium styling */}
            <div className="w-full aspect-[16/10] bg-[#141413] border border-white/10 p-[1px] cut relative overflow-hidden">
              <div className="w-full h-full bg-[#0a0a0a] cut flex flex-col p-4 font-mono text-xs text-[#605e58]">
                {/* Interface Title bar */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    <span className="ml-2 text-[10px] text-white/40">{product.name} dashboard.json</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded-sm">Connected</span>
                </div>
                
                {/* Mock Software Dashboard Layout */}
                <div className="grid grid-cols-3 gap-4 flex-grow">
                  <div className="col-span-1 border border-white/5 p-3 cut-sm flex flex-col justify-between">
                    <div>
                      <div className="text-white/30 text-[9px] mb-2 uppercase">Core Stats</div>
                      <div className="text-base font-bold text-white font-chakra">99.8% UPTIME</div>
                    </div>
                    <div className="h-20 flex items-end gap-1">
                      {[30, 45, 60, 50, 75, 90, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-[#f2603e]/40 hover:bg-[#f2603e] transition-colors" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 border border-white/5 p-3 cut-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                      <div className="text-white/30 text-[9px] uppercase">Telemetry Logs</div>
                      <div className="text-[9px] text-[#f2603e]">LIVE</div>
                    </div>
                    <div className="space-y-1.5 flex-grow font-mono text-[10px] text-[#95928a]">
                      <div>&gt; initialize client database... <span className="text-emerald-500">done</span></div>
                      <div>&gt; local sqlite storage bound on port 4902</div>
                      <div>&gt; synchronizing cache buffers to cloud API</div>
                      <div>&gt; 23 files updated · telemetry status nominal</div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Product description */}
            <div>
              <h2 className="font-chakra text-xl uppercase tracking-wider text-white mb-4 border-l-2 border-[#f2603e] pl-3">
                Product Details &amp; Architecture
              </h2>
              <p className="text-[#95928a] text-sm leading-relaxed mb-4">
                {product.description}
              </p>
              <p className="text-[#95928a] text-sm leading-relaxed">
                By investing in a pre-built solution from Bizpark Studio, you cut down software engineering timelines by up to 80%. We provide full deployment templates, installer updates, and direct support integration to help you focus entirely on your operations.
              </p>
            </div>

            {/* Core features */}
            <div>
              <h2 className="font-chakra text-xl uppercase tracking-wider text-white mb-5 border-l-2 border-[#f2603e] pl-3">
                Key Features Included
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

          </div>

          {/* Download & Specifications Column */}
          <div className="lg:col-span-4 space-y-8 lg:border-l lg:border-white/10 lg:pl-8">
            
            {/* Download Simulation Block */}
            <div className="bg-[#141413] border border-[#f2603e]/40 p-6 cut-sm space-y-6">
              <div>
                <h3 className="font-chakra text-lg text-white uppercase font-bold mb-1">
                  Get Free Trial
                </h3>
                <p className="text-xs text-[#95928a] leading-relaxed">
                  Download the local installer to evaluate client interface and database performance.
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
                  Download Free Trial
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Progress info */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#f2603e] uppercase font-bold tracking-wide animate-pulse">
                      {downloadState === 'connecting' && 'Connecting...'}
                      {downloadState === 'downloading' && `Downloading...`}
                      {downloadState === 'extracting' && 'Extracting packages...'}
                      {downloadState === 'completed' && 'Completed!'}
                    </span>
                    <span className="text-white font-bold">{progress}%</span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-[#f2603e] transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Cyber Term logs */}
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

            {/* Software requirements */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="font-mono text-xs text-[#605e58] uppercase tracking-wider mb-4">
                System Requirements
              </h3>
              <ul className="space-y-3 font-mono text-[11px] text-[#95928a]">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#605e58]">OS</span>
                  <span className="text-white">Windows 10+, macOS 11+, Linux</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#605e58]">RAM</span>
                  <span className="text-white">Minimum 4GB (8GB Recommended)</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#605e58]">STORAGE</span>
                  <span className="text-white">200 MB Free Space</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#605e58]">ARCH</span>
                  <span className="text-white">x64 / ARM64</span>
                </li>
              </ul>
            </div>

            {/* Custom order form trigger */}
            <div className="border-t border-white/10 pt-8">
              <div className="bg-[#141413] border border-white/10 p-6 cut-sm space-y-4">
                <h4 className="font-chakra text-base text-white uppercase font-bold">
                  Customization Needed?
                </h4>
                <p className="text-xs text-[#95928a] leading-relaxed">
                  We customize POS features, database triggers, and UI layout designs to match your specific restaurant or retail requirements.
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
