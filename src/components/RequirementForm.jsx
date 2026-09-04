import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { submitInquiry } from '../utils/mailService';

export default function RequirementForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [],
    budget: '$1,000 - $3,000',
    timeline: 'ASAP',
    details: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [emailDelivered, setEmailDelivered] = useState(false);

  const serviceOptions = [
    { id: 'dev', label: 'Software Development' },
    { id: 'mkt', label: 'Social Media Marketing' },
    { id: 'dsgn', label: 'Graphic Design & Branding' },
    { id: 'full', label: 'All-in-One Studio Plan' },
  ];

  const toggleService = (serviceLabel) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceLabel);
      if (exists) {
        return { ...prev, services: prev.services.filter((s) => s !== serviceLabel) };
      } else {
        return { ...prev, services: [...prev.services, serviceLabel] };
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.details.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields (Name, Email, and Project Details).');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const result = await submitInquiry({
        ...formData,
        source: 'Homepage Requirement Form'
      });

      setEmailDelivered(result.emailSent);
      setWhatsappLink(result.whatsappUrl);
      setStatus('success');

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f2603e', '#f5f4ef', '#ff6f4a'],
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        services: [],
        budget: '$1,000 - $3,000',
        timeline: 'ASAP',
        details: '',
      });
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage('Could not process submission. Please try reaching us directly via WhatsApp.');
    }
  };

  return (
    <section id="requirement-form" className="py-24 bg-[#0d0d0d] border-t border-white/10 relative">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Title */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2.5 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-3">
            <span className="w-4 h-[1px] bg-[#f2603e]" />
            Submit Your Requirement
          </div>
          <h2 className="font-chakra font-semibold text-3xl sm:text-4xl lg:text-5xl uppercase text-[#f5f4ef] leading-tight">
            Tell us about<br />
            your next project.
          </h2>
          <p className="text-[#95928a] text-sm sm:text-base mt-3 max-w-xl">
            Fill out your project specifications below. Our engineering and creative leads review submissions daily and respond within 24 hours.
          </p>
        </div>

        {/* Success Alert */}
        {status === 'success' && (
          <div className="mb-10 p-6 sm:p-8 bg-[#f2603e]/10 border border-[#f2603e] cut text-[#f5f4ef] space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2603e]/30 pb-4">
              <div>
                <h3 className="font-chakra text-2xl font-bold text-[#f2603e] uppercase">
                  ✓ Requirement Received &amp; Logged!
                </h3>
                <p className="text-sm text-[#95928a] mt-1 font-mono">
                  {emailDelivered
                    ? 'Your project requirement was dispatched to bizparkstudio@gmail.com and saved to our Admin Leads Vault.'
                    : 'Your project requirement has been safely logged in our Admin Leads Vault. Our team will review it shortly.'}
                </p>
              </div>
              <button
                onClick={() => setStatus('idle')}
                className="font-mono text-xs text-[#f2603e] underline hover:text-white uppercase tracking-wider whitespace-nowrap"
              >
                Submit Another Inquiry
              </button>
            </div>

            {whatsappLink && (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <span className="text-xs font-mono text-[#95928a]">Want immediate priority response?</span>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-black font-chakra font-bold text-xs uppercase px-5 py-2.5 cut-sm hover:brightness-110 transition-all shadow-md"
                >
                  <span>💬 Chat with Us on WhatsApp Now →</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Requirement Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact & Services */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                  Your Full Name <span className="text-[#f2603e]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kasun Perera"
                  required
                  className="w-full bg-[#141413] border border-white/10 text-white px-4 py-3.5 focus:outline-none focus:border-[#f2603e] transition-colors text-sm rounded-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                  Email Address <span className="text-[#f2603e]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. kasun@company.com"
                  required
                  className="w-full bg-[#141413] border border-white/10 text-white px-4 py-3.5 focus:outline-none focus:border-[#f2603e] transition-colors text-sm rounded-none"
                />
              </div>
            </div>

            {/* Phone & Company Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+94 77 123 4567"
                  className="w-full bg-[#141413] border border-white/10 text-white px-4 py-3.5 focus:outline-none focus:border-[#f2603e] transition-colors text-sm rounded-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Lanka Pvt Ltd"
                  className="w-full bg-[#141413] border border-white/10 text-white px-4 py-3.5 focus:outline-none focus:border-[#f2603e] transition-colors text-sm rounded-none"
                />
              </div>
            </div>

            {/* Services Selection */}
            <div>
              <label className="block font-mono text-xs text-[#95928a] uppercase mb-3">
                Services Required (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map((srv) => {
                  const isSelected = formData.services.includes(srv.label);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => toggleService(srv.label)}
                      className={`px-4 py-3 text-left font-sans text-xs sm:text-sm font-medium border transition-all duration-200 flex items-center justify-between cut-sm ${
                        isSelected
                          ? 'bg-[#f2603e] text-[#0a0a0a] border-[#f2603e] font-semibold'
                          : 'bg-[#141413] text-[#95928a] border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span>{srv.label}</span>
                      <span className="font-mono text-xs">{isSelected ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Project Details, Budget, Timeline */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Budget & Timeline Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                  Estimated Budget
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full bg-[#141413] border border-white/10 text-white px-4 py-3.5 focus:outline-none focus:border-[#f2603e] transition-colors text-sm"
                >
                  <option value="< $1,000">Less than $1,000</option>
                  <option value="$1,000 - $3,000">$1,000 – $3,000</option>
                  <option value="$3,000 - $7,000">$3,000 – $7,000</option>
                  <option value="$7,000+">$7,000+</option>
                  <option value="Flexible">Flexible / Not Sure</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                  Desired Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full bg-[#141413] border border-white/10 text-white px-4 py-3.5 focus:outline-none focus:border-[#f2603e] transition-colors text-sm"
                >
                  <option value="ASAP">ASAP (Immediate)</option>
                  <option value="1 Month">Within 1 Month</option>
                  <option value="2-3 Months">2–3 Months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Requirement Details Textarea */}
            <div>
              <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                Project Requirements &amp; Goals <span className="text-[#f2603e]">*</span>
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows="5"
                placeholder="Describe your project, key features, target audience, and any specific goals..."
                required
                className="w-full bg-[#141413] border border-white/10 text-white px-4 py-3.5 focus:outline-none focus:border-[#f2603e] transition-colors text-sm rounded-none resize-y"
              />
            </div>

            {/* Error Message display */}
            {status === 'error' && (
              <p className="text-xs font-mono text-[#f2603e] bg-[#f2603e]/10 p-3 border border-[#f2603e]/30">
                ⚠️ {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-[#f2603e] hover:bg-[#ff6f4a] text-[#0a0a0a] font-chakra font-bold uppercase text-sm tracking-wider py-4 cut-sm transition-all duration-200 shadow-lg shadow-[#f2603e]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'submitting' ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Sending Requirement...
                </>
              ) : (
                'Send Requirement to Studio →'
              )}
            </button>

            <p className="text-[11px] text-[#605e58] font-mono text-center">
              Direct email delivery to bizparkstudio@gmail.com · Guaranteed confidentiality
            </p>

          </div>

        </form>

      </div>
    </section>
  );
}
