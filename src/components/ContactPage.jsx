import React, { useState, useEffect } from 'react';
import { getStoreData, addInquiry } from '../data/store';

export default function ContactPage() {
  const [storeData, setStoreData] = useState(getStoreData());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Software Solutions',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const update = () => setStoreData(getStoreData());
    window.addEventListener('bizpark_store_updated', update);
    return () => window.removeEventListener('bizpark_store_updated', update);
  }, []);

  const settings = storeData.settings || {};
  const whatsappNum = settings.whatsappNumber || '0783157736';
  const phoneNum = settings.phone || '0783157736';
  const emailAddr = settings.adminEmail || 'bizparkstudio@gmail.com';
  const studioAddress = settings.address || 'Colombo, Sri Lanka';

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

  const cleanWa = formatWaNumber(whatsappNum);
  const waDirectUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent('Hello Bizpark Studio, I would like to inquire about your services!')}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const newInquiry = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || 'Not specified',
      services: [formData.service],
      budget: 'Flexible',
      timeline: 'Standard',
      details: formData.message,
      source: 'Contact Page Direct Form'
    };

    // Save to local store and backend
    addInquiry(newInquiry);

    // Optional: Web3Forms relay
    if (settings.web3formsKey) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: settings.web3formsKey,
            subject: `⚡ New Contact Form Message from ${formData.name}`,
            ...newInquiry
          })
        });
      } catch {
        // Fallback gracefully: inquiry is saved locally and in MongoDB
      }
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="pt-32 md:pt-40 pb-24 bg-[#0a0a0a] min-h-screen text-[#f5f4ef]">
      {/* Background glow lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#f2603e]/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-8">
          <a
            href="#top"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#95928a] hover:text-[#f2603e] transition-colors uppercase tracking-wider"
          >
            <span>←</span> Back to Overview
          </a>
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs text-[#f2603e] font-mono uppercase tracking-widest bg-[#141413] px-3 py-1.5 border border-[#f2603e]/30 cut-sm font-bold mb-4">
            <span className="w-3 h-[1px] bg-[#f2603e]" />
            Direct Communication
          </div>
          <h1 className="font-chakra font-bold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-none">
            Get in touch with <span className="text-[#f2603e]">our studio.</span>
          </h1>
          <p className="text-[#95928a] text-base sm:text-lg mt-4 leading-relaxed">
            Have a project in mind, need a consultation, or looking for custom software and branding? Reach out directly via WhatsApp, phone, email, or send us a message below.
          </p>
        </div>

        {/* 4 Contact Channels Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          
          {/* Card 1: WhatsApp */}
          <div className="bg-[#141413] border border-[#25D366]/30 hover:border-[#25D366] p-7 cut transition-all duration-300 group flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 0C5.395 0 0 5.395 0 12.031c0 2.115.549 4.179 1.594 5.996L.062 24l6.155-1.615a11.968 11.968 0 0 0 5.814 1.488h.005c6.632 0 12.026-5.395 12.026-12.031 0-3.213-1.252-6.233-3.527-8.508C18.264 1.259 15.244 0 12.031 0zm0 22.008h-.004c-1.815 0-3.593-.487-5.143-1.408l-.368-.218-3.824 1.003 1.022-3.727-.24-.382a10.009 10.009 0 0 1-1.536-5.245c0-5.542 4.509-10.051 10.055-10.051 2.684 0 5.208 1.046 7.106 2.945a10.003 10.003 0 0 1 2.946 7.106c0 5.543-4.51 10.052-10.056 10.052zm5.513-7.525c-.302-.151-1.787-.882-2.064-.983-.277-.101-.478-.151-.68.151-.202.302-.782.983-.958 1.185-.176.202-.353.226-.655.075-.302-.151-1.275-.47-2.428-1.499-.898-.801-1.504-1.79-1.68-2.093-.176-.302-.019-.465.132-.616.136-.135.302-.352.453-.529.151-.176.202-.302.302-.503.101-.202.05-.377-.025-.529-.075-.151-.68-1.639-.932-2.245-.245-.589-.494-.509-.68-.519-.176-.01-.377-.01-.579-.01-.202 0-.529.075-.806.377-.277.302-1.058 1.034-1.058 2.522s1.083 2.924 1.234 3.125c.151.202 2.133 3.256 5.166 4.567.721.312 1.284.499 1.723.639.724.23 1.383.197 1.904.12.581-.087 1.787-.73 2.039-1.434.252-.704.252-1.308.176-1.434-.075-.126-.277-.202-.579-.353z"/>
                </svg>
              </div>
              <div className="font-mono text-xs text-[#25D366] uppercase tracking-wider mb-1 font-bold">
                Instant Chat
              </div>
              <h3 className="font-chakra text-xl font-bold text-white mb-2">
                WhatsApp
              </h3>
              <p className="font-mono text-sm text-[#f5f4ef] font-semibold mb-3">
                {whatsappNum}
              </p>
              <p className="text-xs text-[#95928a] leading-relaxed mb-6">
                Fastest response channel. Chat with our solutions engineers directly.
              </p>
            </div>
            <a
              href={waDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] text-black font-chakra font-bold text-xs uppercase py-3 cut-sm hover:bg-[#20bd5a] transition-all"
            >
              <span>Chat on WhatsApp</span>
              <span>↗</span>
            </a>
          </div>

          {/* Card 2: Phone Call */}
          <div className="bg-[#141413] border border-white/10 hover:border-[#f2603e] p-7 cut transition-all duration-300 group flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#f2603e]/10 border border-[#f2603e]/30 flex items-center justify-center text-[#f2603e] mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="font-mono text-xs text-[#f2603e] uppercase tracking-wider mb-1 font-bold">
                Voice Call
              </div>
              <h3 className="font-chakra text-xl font-bold text-white mb-2">
                Mobile Hotline
              </h3>
              <p className="font-mono text-sm text-[#f5f4ef] font-semibold mb-3">
                {phoneNum}
              </p>
              <p className="text-xs text-[#95928a] leading-relaxed mb-6">
                Available Mon – Sat, 9:00 AM – 7:00 PM for urgent inquiries.
              </p>
            </div>
            <a
              href={`tel:${phoneNum.replace(/\s+/g, '')}`}
              className="inline-flex items-center justify-center gap-2 w-full bg-white/10 text-white font-chakra font-bold text-xs uppercase py-3 cut-sm hover:bg-[#f2603e] hover:text-black transition-all"
            >
              <span>Call Now</span>
              <span>📞</span>
            </a>
          </div>

          {/* Card 3: Official Email */}
          <div className="bg-[#141413] border border-white/10 hover:border-[#f2603e] p-7 cut transition-all duration-300 group flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#f2603e]/10 border border-[#f2603e]/30 flex items-center justify-center text-[#f2603e] mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="font-mono text-xs text-[#f2603e] uppercase tracking-wider mb-1 font-bold">
                Official Inquiries
              </div>
              <h3 className="font-chakra text-xl font-bold text-white mb-2">
                Studio Email
              </h3>
              <p className="font-mono text-xs text-[#f5f4ef] font-semibold mb-3 break-all">
                {emailAddr}
              </p>
              <p className="text-xs text-[#95928a] leading-relaxed mb-6">
                For detailed proposals, enterprise RFPs, and corporate partnership briefs.
              </p>
            </div>
            <a
              href={`mailto:${emailAddr}?subject=Project%20Inquiry%20-%20Bizpark%20Studio`}
              className="inline-flex items-center justify-center gap-2 w-full bg-white/10 text-white font-chakra font-bold text-xs uppercase py-3 cut-sm hover:bg-[#f2603e] hover:text-black transition-all"
            >
              <span>Send Email</span>
              <span>✉</span>
            </a>
          </div>

          {/* Card 4: Location / Studio */}
          <div className="bg-[#141413] border border-white/10 hover:border-[#f2603e] p-7 cut transition-all duration-300 group flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#f2603e]/10 border border-[#f2603e]/30 flex items-center justify-center text-[#f2603e] mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="font-mono text-xs text-[#f2603e] uppercase tracking-wider mb-1 font-bold">
                Location Base
              </div>
              <h3 className="font-chakra text-xl font-bold text-white mb-2">
                Studio Address
              </h3>
              <p className="font-mono text-sm text-[#f5f4ef] font-semibold mb-3">
                {studioAddress}
              </p>
              <p className="text-xs text-[#95928a] leading-relaxed mb-6">
                Serving clients islandwide in Sri Lanka & internationally across GMT+5:30.
              </p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(studioAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-white/10 text-white font-chakra font-bold text-xs uppercase py-3 cut-sm hover:bg-white/20 transition-all"
            >
              <span>View Map</span>
              <span>📍</span>
            </a>
          </div>

        </div>

        {/* Form and Quick FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Direct Contact Form */}
          <div className="lg:col-span-7 bg-[#141413] border border-white/10 p-8 sm:p-10 cut shadow-2xl relative">
            <div className="mb-6 pb-4 border-b border-white/10">
              <span className="font-mono text-xs text-[#f2603e] uppercase tracking-widest font-bold">
                // QUICK MESSAGE DISPATCH
              </span>
              <h2 className="font-chakra font-bold text-2xl sm:text-3xl text-white uppercase mt-1">
                Send Us a Direct Message
              </h2>
              <p className="text-xs text-[#95928a] font-mono mt-1">
                Fill out the form below. Inquiries are instantly logged and delivered to our team.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#0a0a0a] border border-[#25D366]/40 p-8 cut text-center space-y-4 animate-fadeIn">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#25D366]/20 border border-[#25D366] text-[#25D366] flex items-center justify-center text-2xl">
                  ✓
                </div>
                <h3 className="font-chakra text-2xl font-bold text-white uppercase">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-[#95928a] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Your inquiry has been received. Our team will review your requirements and get back to you shortly.
                </p>
                <div className="pt-3 flex flex-wrap gap-4 justify-center">
                  <a
                    href={waDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-black font-chakra font-bold text-xs uppercase px-6 py-3 cut-sm hover:bg-[#20bd5a] transition-all"
                  >
                    <span>Instant Follow-up on WhatsApp</span>
                    <span>→</span>
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', company: '', service: 'Software Solutions', message: '' });
                    }}
                    className="inline-flex items-center gap-2 bg-white/10 text-white font-chakra font-bold text-xs uppercase px-6 py-3 cut-sm hover:bg-white/20 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                      Your Name <span className="text-[#f2603e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#f2603e] p-3 text-sm text-white font-sans outline-none cut-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                      Email Address <span className="text-[#f2603e]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#f2603e] p-3 text-sm text-white font-sans outline-none cut-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 078 315 7736"
                      className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#f2603e] p-3 text-sm text-white font-sans outline-none cut-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                      Company / Business
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Nexus Tech"
                      className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#f2603e] p-3 text-sm text-white font-sans outline-none cut-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                    Primary Service of Interest
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#f2603e] p-3 text-sm text-white font-sans outline-none cut-sm transition-colors"
                  >
                    <option value="Software Solutions">Software Solutions (POS, ERP, Custom App)</option>
                    <option value="Web Solutions">Web Solutions (Headless Web, SaaS, Storefront)</option>
                    <option value="Branding">Branding &amp; Identity Architecture</option>
                    <option value="Social Media Marketing">Social Media &amp; Performance Growth</option>
                    <option value="Full-Stack Package">Full-Stack All-in-One Retainer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                    Project Details / Message <span className="text-[#f2603e]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your requirements, key features needed, or current business bottleneck..."
                    className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#f2603e] p-3 text-sm text-white font-sans outline-none cut-sm transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f2603e] hover:bg-[#ff6f4a] text-black font-chakra font-bold text-sm uppercase tracking-wider px-8 py-4 cut-sm transition-all shadow-lg shadow-[#f2603e]/20 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Message...' : 'Send Message Now →'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Studio Info & Assurance */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141413] border border-white/10 p-8 cut space-y-4">
              <span className="font-mono text-xs text-[#f2603e] uppercase tracking-widest font-bold">
                // RESPONSE GUARANTEE
              </span>
              <h3 className="font-chakra text-2xl font-bold text-white uppercase">
                What happens next?
              </h3>
              <ul className="space-y-3 font-mono text-xs text-[#95928a]">
                <li className="flex items-start gap-3">
                  <span className="text-[#f2603e] font-bold">01.</span>
                  <span><strong>1-Hour Triage:</strong> A dedicated solutions architect reviews your inquiry and scopes requirements.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#f2603e] font-bold">02.</span>
                  <span><strong>Direct Consultation:</strong> We schedule a rapid 15-minute alignment call or WhatsApp briefing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#f2603e] font-bold">03.</span>
                  <span><strong>Actionable Plan:</strong> You receive a clear, fixed-scope proposal with milestones and pricing.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#141413] border border-white/10 p-8 cut space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  Studio Systems Operational
                </span>
              </div>
              <h4 className="font-chakra text-lg font-bold text-white uppercase">
                Direct WhatsApp Hotline
              </h4>
              <p className="text-xs text-[#95928a] leading-relaxed">
                Need urgent software support or immediate project onboarding? Contact us directly:
              </p>
              <div className="pt-2">
                <a
                  href={waDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-mono text-[#25D366] hover:underline font-bold"
                >
                  <span>💬 Chat with {whatsappNum}</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
