import React, { useState, useEffect } from 'react';
import { getStoreData } from '../data/store';

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState('0783157736');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const updateNumber = () => {
      const data = getStoreData();
      if (data?.settings?.whatsappNumber) {
        setWhatsappNumber(data.settings.whatsappNumber);
      }
    };
    updateNumber();
    window.addEventListener('bizpark_store_updated', updateNumber);
    return () => window.removeEventListener('bizpark_store_updated', updateNumber);
  }, []);

  // Format clean international WhatsApp phone number
  const formatWaNumber = (num) => {
    if (!num) return '94783157736';
    const digitsOnly = num.replace(/\D/g, '');
    if (digitsOnly.startsWith('0')) {
      return `94${digitsOnly.slice(1)}`;
    }
    if (digitsOnly.startsWith('94')) {
      return digitsOnly;
    }
    return `94${digitsOnly}`;
  };

  const cleanNumber = formatWaNumber(whatsappNumber);
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hello Bizpark Studio, I would like to inquire about your software and design services!')}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip */}
      <div
        className={`mr-3 px-3.5 py-1.5 bg-[#141413] border border-[#25D366]/40 text-white text-xs font-mono rounded shadow-2xl transition-all duration-300 pointer-events-none hidden sm:flex items-center gap-2 ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span>Chat on WhatsApp: <strong className="text-[#25D366]">{whatsappNumber}</strong></span>
      </div>

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Bizpark Studio on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 hover:bg-[#20bd5a] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      >
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping -z-10" />

        {/* Official WhatsApp Vector Icon */}
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 fill-current transition-transform duration-300 group-hover:rotate-12"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 0C5.395 0 0 5.395 0 12.031c0 2.115.549 4.179 1.594 5.996L.062 24l6.155-1.615a11.968 11.968 0 0 0 5.814 1.488h.005c6.632 0 12.026-5.395 12.026-12.031 0-3.213-1.252-6.233-3.527-8.508C18.264 1.259 15.244 0 12.031 0zm0 22.008h-.004c-1.815 0-3.593-.487-5.143-1.408l-.368-.218-3.824 1.003 1.022-3.727-.24-.382a10.009 10.009 0 0 1-1.536-5.245c0-5.542 4.509-10.051 10.055-10.051 2.684 0 5.208 1.046 7.106 2.945a10.003 10.003 0 0 1 2.946 7.106c0 5.543-4.51 10.052-10.056 10.052zm5.513-7.525c-.302-.151-1.787-.882-2.064-.983-.277-.101-.478-.151-.68.151-.202.302-.782.983-.958 1.185-.176.202-.353.226-.655.075-.302-.151-1.275-.47-2.428-1.499-.898-.801-1.504-1.79-1.68-2.093-.176-.302-.019-.465.132-.616.136-.135.302-.352.453-.529.151-.176.202-.302.302-.503.101-.202.05-.377-.025-.529-.075-.151-.68-1.639-.932-2.245-.245-.589-.494-.509-.68-.519-.176-.01-.377-.01-.579-.01-.202 0-.529.075-.806.377-.277.302-1.058 1.034-1.058 2.522s1.083 2.924 1.234 3.125c.151.202 2.133 3.256 5.166 4.567.721.312 1.284.499 1.723.639.724.23 1.383.197 1.904.12.581-.087 1.787-.73 2.039-1.434.252-.704.252-1.308.176-1.434-.075-.126-.277-.202-.579-.353z"/>
        </svg>
      </a>
    </div>
  );
}
