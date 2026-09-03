import React, { useState, useEffect } from 'react';
import { getStoreData, saveStoreData, resetStoreData } from '../data/store';

export default function AdminPanel() {
  const [storeData, setStoreData] = useState(getStoreData());
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('bizpark_admin_authed') === 'true';
  });

  // Login credentials state
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'herobanners' | 'homepage' | 'banners'
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('branding');
  const [editingProject, setEditingProject] = useState(null);
  const [editingHeroBanner, setEditingHeroBanner] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [saveNotification, setSaveNotification] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const triggerSaveNotification = (msg) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(''), 3500);
  };

  const handleSaveAll = (updatedData) => {
    saveStoreData(updatedData);
    setStoreData(updatedData);
    triggerSaveNotification('✓ Content updated successfully & saved live!');
  };

  // LOGIN HANDLER
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginCreds.username.trim() === 'admin' && loginCreds.password === 'bizpark123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('bizpark_admin_authed', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Username or Password. (Default: admin / bizpark123)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bizpark_admin_authed');
  };

  // FILE UPLOAD HELPER FUNCTION (Image / Video file to Data URL)
  const handleFileUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
      triggerSaveNotification('Media file uploaded & converted!');
    };
    reader.readAsDataURL(file);
  };

  // CATEGORY PROJECT FORM HANDLERS (UNIFIED SOFTWARE & PROJECTS)
  const openNewProjectForm = () => {
    setEditingProject({
      id: selectedCategoryKey === 'software-solutions' ? `soft-${Date.now()}` : `proj-${Date.now()}`,
      name: '',
      client: '',
      subTag: selectedCategoryKey === 'software-solutions' ? 'Restaurant Management System' : 'Clothing Brand',
      tag: selectedCategoryKey === 'software-solutions' ? 'Restaurant Management System' : 'Clothing Brand',
      num: selectedCategoryKey === 'software-solutions' ? 'PROD / NEW' : '',
      downloadUrl: selectedCategoryKey === 'software-solutions' ? '#' : '',
      fileSize: selectedCategoryKey === 'software-solutions' ? '16 MB' : '',
      version: selectedCategoryKey === 'software-solutions' ? 'v1.0.0' : '',
      socials: {
        facebook: 'https://facebook.com/bizparkstudio',
        instagram: 'https://instagram.com/bizparkstudio',
        twitter: 'https://twitter.com/bizparkstudio',
        linkedin: 'https://linkedin.com/company/bizparkstudio',
        github: 'https://github.com/bizparkstudio',
        whatsapp: 'https://wa.me/94770000000'
      },
      image: '/images/hero.png',
      websiteUrl: '',
      shortDescription: '',
      description: '',
      featuresStr: '',
      techStr: '',
      showcaseMedia: [
        { type: 'image', url: '/images/hero.png' }
      ],
      processImages: [
        { url: '/images/hero.png', title: 'Phase 1 Concept Draft', note: 'Initial design blueprint sketch' }
      ],
      featuredOnHome: true
    });
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name) return;

    const features = editingProject.featuresStr
      ? editingProject.featuresStr.split(',').map((s) => s.trim()).filter(Boolean)
      : editingProject.features || [];

    const tech = editingProject.techStr
      ? editingProject.techStr.split(',').map((s) => s.trim()).filter(Boolean)
      : editingProject.tech || [];

    // Ensure main image syncs with first showcase media item
    const primaryImage =
      editingProject.showcaseMedia && editingProject.showcaseMedia.length > 0
        ? editingProject.showcaseMedia[0].url
        : editingProject.image || '/images/hero.png';

    const finalProject = {
      ...editingProject,
      image: primaryImage,
      tag: editingProject.subTag || editingProject.tag || 'General',
      features,
      tech
    };

    const newCategories = storeData.categories.map((cat) => {
      if (cat.key === selectedCategoryKey) {
        const exists = cat.projects.some((p) => p.id === finalProject.id);
        const updatedProjects = exists
          ? cat.projects.map((p) => (p.id === finalProject.id ? finalProject : p))
          : [...cat.projects, finalProject];
        return { ...cat, projects: updatedProjects };
      }
      return cat;
    });

    const updatedSoftwareProds = newCategories.find((c) => c.key === 'software-solutions')?.projects || [];

    handleSaveAll({
      ...storeData,
      categories: newCategories,
      softwareProducts: updatedSoftwareProds
    });
    setEditingProject(null);
  };

  const handleDeleteProject = (projId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const newCategories = storeData.categories.map((cat) => {
      if (cat.key === selectedCategoryKey) {
        return { ...cat, projects: cat.projects.filter((p) => p.id !== projId) };
      }
      return cat;
    });
    const updatedSoftwareProds = newCategories.find((c) => c.key === 'software-solutions')?.projects || [];
    handleSaveAll({
      ...storeData,
      categories: newCategories,
      softwareProducts: updatedSoftwareProds
    });
  };

  // HOMEPAGE HERO BANNERS HANDLERS
  const openNewHeroBannerForm = () => {
    setEditingHeroBanner({
      id: `hero-slide-${Date.now()}`,
      badge: 'NEW BROWSER BANNER',
      title: '',
      subtitle: '',
      ctaPrimaryText: 'Explore Work →',
      ctaPrimaryLink: '#work',
      ctaSecondaryText: 'Submit Requirement',
      ctaSecondaryLink: '#requirement-form',
      image: '/images/hero.png'
    });
  };

  const handleSaveHeroBanner = (e) => {
    e.preventDefault();
    if (!editingHeroBanner || !editingHeroBanner.title) return;

    const currentBanners = storeData.homepageHeroBanners || [];
    const exists = currentBanners.some((b) => b.id === editingHeroBanner.id);
    const updatedBanners = exists
      ? currentBanners.map((b) => (b.id === editingHeroBanner.id ? editingHeroBanner : b))
      : [...currentBanners, editingHeroBanner];

    handleSaveAll({ ...storeData, homepageHeroBanners: updatedBanners });
    setEditingHeroBanner(null);
  };

  const handleDeleteHeroBanner = (bannerId) => {
    if (!window.confirm('Delete this Homepage Hero slide?')) return;
    const currentBanners = storeData.homepageHeroBanners || [];
    const updatedBanners = currentBanners.filter((b) => b.id !== bannerId);
    handleSaveAll({ ...storeData, homepageHeroBanners: updatedBanners });
  };

  // HOMEPAGE CAROUSEL FEATURED TOGGLE
  const toggleHomepageFeatured = (catKey, projId) => {
    const newCategories = storeData.categories.map((cat) => {
      if (cat.key === catKey) {
        const updatedProjects = cat.projects.map((p) => {
          if (p.id === projId) {
            return { ...p, featuredOnHome: p.featuredOnHome === false ? true : false };
          }
          return p;
        });
        return { ...cat, projects: updatedProjects };
      }
      return cat;
    });
    handleSaveAll({ ...storeData, categories: newCategories });
  };

  // SOFTWARE BANNER HANDLERS
  const openNewBannerForm = () => {
    setEditingBanner({
      id: `banner-${Date.now()}`,
      title: '',
      subtitle: '',
      badge: 'NEW UPDATE',
      image: '/images/hero.png',
      productId: 'pos-system',
      ctaText: 'Explore Solution →'
    });
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title) return;

    const exists = storeData.softwareBanners.some((b) => b.id === editingBanner.id);
    const updatedBanners = exists
      ? storeData.softwareBanners.map((b) => (b.id === editingBanner.id ? editingBanner : b))
      : [...storeData.softwareBanners, editingBanner];

    handleSaveAll({ ...storeData, softwareBanners: updatedBanners });
    setEditingBanner(null);
  };

  const handleDeleteBanner = (bannerId) => {
    if (!window.confirm('Delete this banner slide?')) return;
    const updatedBanners = storeData.softwareBanners.filter((b) => b.id !== bannerId);
    handleSaveAll({ ...storeData, softwareBanners: updatedBanners });
  };

  // LOGIN GATE IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen flex items-center justify-center px-6">
        <div className="bg-[#141413] border border-[#f2603e]/40 p-8 sm:p-10 max-w-md w-full cut relative shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-[#f2603e] font-bold uppercase tracking-widest block">
              RESTRICTED ACCESS
            </span>
            <h2 className="font-chakra text-3xl font-bold text-white uppercase">
              Admin Gateway Login
            </h2>
            <p className="text-xs text-[#95928a] font-mono">
              Please enter your administrator credentials to access content management.
            </p>
          </div>

          {loginError && (
            <div className="bg-red-950/80 border border-red-500/50 p-3 cut-sm text-red-300 font-mono text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Username</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={loginCreds.username}
                onChange={(e) => setLoginCreds({ ...loginCreds, username: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginCreds.password}
                onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#f2603e] text-black font-chakra font-bold text-sm uppercase tracking-wider py-3.5 cut-sm hover:bg-[#ff6f4a] transition-all shadow-lg"
            >
              Authenticate &amp; Enter Dashboard →
            </button>
          </form>

          <p className="text-[11px] font-mono text-[#605e58] text-center pt-2">
            Default credentials: <span className="text-white">admin</span> / <span className="text-white">bizpark123</span>
          </p>
        </div>
      </div>
    );
  }

  const activeCategory = storeData.categories.find((c) => c.key === selectedCategoryKey) || storeData.categories[0];

  return (
    <div className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen relative">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-2 font-bold">
              <span className="w-3 h-3 bg-[#f2603e] inline-block" />
              AUTHENTICATED ADMIN WORKSPACE
            </div>
            <h1 className="font-chakra text-4xl sm:text-5xl text-white uppercase font-bold">
              Content &amp; Media Manager
            </h1>
            <p className="text-sm text-[#95928a] mt-1 font-mono">
              Manage unified software products, homepage hero banners, showcase sliders, process photos, and download links.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Reset all site data back to original defaults?')) {
                  const restored = resetStoreData();
                  setStoreData(restored);
                  triggerSaveNotification('Restored initial default dataset.');
                }
              }}
              className="bg-black/60 hover:bg-red-950/60 border border-red-500/30 text-red-400 font-mono text-xs uppercase px-4 py-2.5 cut-sm transition-all"
            >
              Reset Data
            </button>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase px-4 py-2.5 cut-sm transition-all"
            >
              Logout 🔒
            </button>
          </div>
        </div>

        {/* Save Banner Alert */}
        {saveNotification && (
          <div className="mb-8 bg-emerald-950/80 border border-emerald-500/50 p-4 cut text-emerald-300 font-mono text-xs flex items-center justify-between animate-fadeIn">
            <span>{saveNotification}</span>
            <span className="font-bold">LIVE SYNC OK</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <button
            onClick={() => { setActiveTab('projects'); setEditingProject(null); }}
            className={`font-mono text-xs uppercase px-5 py-3 cut-sm transition-all font-bold ${
              activeTab === 'projects'
                ? 'bg-[#f2603e] text-black shadow-lg shadow-[#f2603e]/20'
                : 'bg-[#141413] text-[#95928a] hover:text-white border border-white/10'
            }`}
          >
            1. Category Projects &amp; Software Solutions
          </button>
          <button
            onClick={() => { setActiveTab('herobanners'); setEditingHeroBanner(null); }}
            className={`font-mono text-xs uppercase px-5 py-3 cut-sm transition-all font-bold ${
              activeTab === 'herobanners'
                ? 'bg-[#f2603e] text-black shadow-lg shadow-[#f2603e]/20'
                : 'bg-[#141413] text-[#95928a] hover:text-white border border-white/10'
            }`}
          >
            2. Homepage Hero Banners
          </button>
          <button
            onClick={() => { setActiveTab('homepage'); setEditingProject(null); }}
            className={`font-mono text-xs uppercase px-5 py-3 cut-sm transition-all font-bold ${
              activeTab === 'homepage'
                ? 'bg-[#f2603e] text-black shadow-lg shadow-[#f2603e]/20'
                : 'bg-[#141413] text-[#95928a] hover:text-white border border-white/10'
            }`}
          >
            3. Homepage Moving Cards
          </button>
          <button
            onClick={() => { setActiveTab('banners'); setEditingBanner(null); }}
            className={`font-mono text-xs uppercase px-5 py-3 cut-sm transition-all font-bold ${
              activeTab === 'banners'
                ? 'bg-[#f2603e] text-black shadow-lg shadow-[#f2603e]/20'
                : 'bg-[#141413] text-[#95928a] hover:text-white border border-white/10'
            }`}
          >
            4. Software Section Highlights
          </button>
        </div>

        {/* TAB 1: CATEGORY PROJECTS & UNIFIED SOFTWARE SOLUTIONS */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            
            {/* Category Selector Pills */}
            <div className="flex flex-wrap items-center gap-3 bg-[#141413] border border-white/10 p-4 cut">
              <span className="font-mono text-xs text-[#605e58] uppercase font-bold mr-2">
                Select Category:
              </span>
              {storeData.categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => { setSelectedCategoryKey(cat.key); setEditingProject(null); }}
                  className={`font-mono text-xs uppercase px-4 py-2 cut-sm transition-all ${
                    selectedCategoryKey === cat.key
                      ? 'bg-white/20 text-[#f2603e] border border-[#f2603e]/50 font-bold'
                      : 'bg-[#0a0a0a] text-[#95928a] hover:text-white border border-white/5'
                  }`}
                >
                  {cat.category} ({cat.projects.length})
                </button>
              ))}
            </div>

            {/* Editing Form Modal / Inline Form */}
            {editingProject ? (
              <form onSubmit={handleSaveProject} className="bg-[#141413] border border-[#f2603e]/50 p-6 sm:p-8 cut space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-chakra text-2xl text-white uppercase font-bold">
                    {editingProject.name ? `Edit ${selectedCategoryKey === 'software-solutions' ? 'Software' : 'Project'}: ${editingProject.name}` : `Add New ${activeCategory.category} Item`}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="font-mono text-xs text-[#95928a] hover:text-white bg-black/60 px-3 py-1 border border-white/10"
                  >
                    Cancel ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                      {selectedCategoryKey === 'software-solutions' ? 'Software Name *' : 'Project Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={selectedCategoryKey === 'software-solutions' ? "e.g. DineBuddy POS" : "e.g. Aura Clothing Brand"}
                      value={editingProject.name || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                      {selectedCategoryKey === 'software-solutions' ? 'Target Outlets / Client *' : 'Client Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={selectedCategoryKey === 'software-solutions' ? "e.g. Retail & Restaurant Chains" : "e.g. Luxe Streetwear Label"}
                      value={editingProject.client || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                      {selectedCategoryKey === 'software-solutions' ? 'Category Tag (e.g. Restaurant Management System) *' : 'Industry Sub-Tag *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Restaurant Management System, Restaurant ERP, Education Portal & LMS"
                      value={editingProject.subTag || editingProject.tag || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, subTag: e.target.value, tag: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[#f2603e] uppercase font-bold mb-2">
                      🌐 Live Website Redirect URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://your-website.com"
                      value={editingProject.websiteUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, websiteUrl: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-[#f2603e]/40 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                  </div>
                </div>

                {/* SOFTWARE SPECIFIC DOWNLOAD & VERSION FIELDS */}
                {selectedCategoryKey === 'software-solutions' && (
                  <div className="bg-[#0a0a0a] border border-[#f2603e]/40 p-5 cut-sm space-y-4">
                    <h4 className="font-chakra text-lg text-white font-bold uppercase border-b border-white/10 pb-2">
                      Software Download &amp; Version Specifications
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block font-mono text-xs text-[#f2603e] font-bold uppercase mb-2">
                          🔗 Software Download URL / Direct Link *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="https://aztra-software.github.io/downloads/... or direct file link"
                          value={editingProject.downloadUrl || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, downloadUrl: e.target.value })}
                          className="w-full bg-[#141413] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">File Size</label>
                        <input
                          type="text"
                          placeholder="e.g. 16 MB"
                          value={editingProject.fileSize || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, fileSize: e.target.value })}
                          className="w-full bg-[#141413] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Version String</label>
                        <input
                          type="text"
                          placeholder="e.g. v7.2.5"
                          value={editingProject.version || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, version: e.target.value })}
                          className="w-full bg-[#141413] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Product Badge Num</label>
                        <input
                          type="text"
                          placeholder="e.g. PROD / 01"
                          value={editingProject.num || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, num: e.target.value })}
                          className="w-full bg-[#141413] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                        />
                      </div>
                    </div>

                    {/* CONNECTED SOCIAL MEDIA LINKS */}
                    <div className="pt-2">
                      <label className="block font-mono text-xs text-white uppercase font-bold mb-3">
                        Connected Social Media Links for {editingProject.name || 'Software'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Facebook URL"
                          value={(editingProject.socials && editingProject.socials.facebook) || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, socials: { ...(editingProject.socials || {}), facebook: e.target.value } })}
                          className="bg-[#141413] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                        />
                        <input
                          type="text"
                          placeholder="Instagram URL"
                          value={(editingProject.socials && editingProject.socials.instagram) || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, socials: { ...(editingProject.socials || {}), instagram: e.target.value } })}
                          className="bg-[#141413] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                        />
                        <input
                          type="text"
                          placeholder="Twitter / X URL"
                          value={(editingProject.socials && editingProject.socials.twitter) || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, socials: { ...(editingProject.socials || {}), twitter: e.target.value } })}
                          className="bg-[#141413] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                        />
                        <input
                          type="text"
                          placeholder="LinkedIn URL"
                          value={(editingProject.socials && editingProject.socials.linkedin) || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, socials: { ...(editingProject.socials || {}), linkedin: e.target.value } })}
                          className="bg-[#141413] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                        />
                        <input
                          type="text"
                          placeholder="GitHub URL"
                          value={(editingProject.socials && editingProject.socials.github) || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, socials: { ...(editingProject.socials || {}), github: e.target.value } })}
                          className="bg-[#141413] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                        />
                        <input
                          type="text"
                          placeholder="WhatsApp URL"
                          value={(editingProject.socials && editingProject.socials.whatsapp) || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, socials: { ...(editingProject.socials || {}), whatsapp: e.target.value } })}
                          className="bg-[#141413] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* MAIN SHOWCASE MEDIA GALLERY MANAGER */}
                <div className="border-t border-white/10 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <div>
                      <h4 className="font-chakra text-xl text-white uppercase font-bold">
                        Main Showcase Media Gallery (Images &amp; Videos)
                      </h4>
                      <p className="text-xs text-[#95928a] font-mono">
                        Add multiple showcase images or playable video files. They will auto-scroll/slide sequentially!
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const existing = editingProject.showcaseMedia || [{ type: 'image', url: editingProject.image || '/images/hero.png' }];
                          setEditingProject({
                            ...editingProject,
                            showcaseMedia: [...existing, { type: 'image', url: '/images/hero.png' }]
                          });
                        }}
                        className="bg-[#f2603e]/20 text-[#f2603e] border border-[#f2603e]/40 font-mono text-xs uppercase px-3 py-1.5 cut-sm font-bold hover:bg-[#f2603e] hover:text-black"
                      >
                        + Add Image
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const existing = editingProject.showcaseMedia || [{ type: 'image', url: editingProject.image || '/images/hero.png' }];
                          setEditingProject({
                            ...editingProject,
                            showcaseMedia: [...existing, { type: 'video', url: '' }]
                          });
                        }}
                        className="bg-[#f2603e]/20 text-[#f2603e] border border-[#f2603e]/40 font-mono text-xs uppercase px-3 py-1.5 cut-sm font-bold hover:bg-[#f2603e] hover:text-black"
                      >
                        + Add Video
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(editingProject.showcaseMedia || [{ type: 'image', url: editingProject.image || '/images/hero.png' }]).map((med, mIdx) => (
                      <div key={mIdx} className="bg-[#0a0a0a] border border-white/10 p-4 cut-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#f2603e] font-bold uppercase">
                            {med.type === 'video' ? '🎥 Showcase Video' : '🖼️ Showcase Image'} #{mIdx + 1}
                          </span>
                          {(editingProject.showcaseMedia || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = editingProject.showcaseMedia.filter((_, i) => i !== mIdx);
                                setEditingProject({ ...editingProject, showcaseMedia: filtered });
                              }}
                              className="font-mono text-[10px] text-red-400 hover:underline"
                            >
                              Remove Media
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <select
                            value={med.type || 'image'}
                            onChange={(e) => {
                              const updated = [...(editingProject.showcaseMedia || [{ type: 'image', url: editingProject.image || '/images/hero.png' }])];
                              updated[mIdx].type = e.target.value;
                              setEditingProject({ ...editingProject, showcaseMedia: updated });
                            }}
                            className="bg-[#141413] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                          >
                            <option value="image">Image Item</option>
                            <option value="video">Video Item (.mp4, .webm)</option>
                          </select>

                          <div className="sm:col-span-2 flex gap-1.5">
                            <input
                              type="text"
                              required
                              placeholder={med.type === 'video' ? "Video URL (e.g. /video.mp4 or video URL)" : "Image URL"}
                              value={med.url || ''}
                              onChange={(e) => {
                                const updated = [...(editingProject.showcaseMedia || [{ type: 'image', url: editingProject.image || '/images/hero.png' }])];
                                updated[mIdx].url = e.target.value;
                                setEditingProject({ ...editingProject, showcaseMedia: updated });
                              }}
                              className="w-full bg-[#141413] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                            />

                            <label className="bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase font-bold px-3 flex items-center justify-center cursor-pointer cut-sm whitespace-nowrap">
                              📁 Upload
                              <input
                                type="file"
                                accept={med.type === 'video' ? 'video/*' : 'image/*'}
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(e.target.files[0], (dataUrl) => {
                                      const updated = [...(editingProject.showcaseMedia || [{ type: 'image', url: editingProject.image || '/images/hero.png' }])];
                                      updated[mIdx].url = dataUrl;
                                      setEditingProject({ ...editingProject, showcaseMedia: updated });
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Short &amp; Detailed Description *</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Full summary of what was crafted and key objectives achieved..."
                    value={editingProject.description || editingProject.shortDescription || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value, shortDescription: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Key Scope &amp; Features (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="Custom Logotype, Garment Packaging, Brand Guidelines"
                      value={editingProject.featuresStr !== undefined ? editingProject.featuresStr : (editingProject.features || []).join(', ')}
                      onChange={(e) => setEditingProject({ ...editingProject, featuresStr: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Tech Stack / Tools Used (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="Photoshop, Illustrator, Print Production"
                      value={editingProject.techStr !== undefined ? editingProject.techStr : (editingProject.tech || []).join(', ')}
                      onChange={(e) => setEditingProject({ ...editingProject, techStr: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                  </div>
                </div>

                {/* MULTI PROCESS PHOTOS SETUP */}
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-chakra text-lg text-white uppercase font-bold">
                        Development / Making Process Photos &amp; Notes
                      </h4>
                      <p className="text-xs text-[#95928a] font-mono">
                        Add behind-the-scenes photos taken while building/making this project.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const existing = editingProject.processImages || [];
                        setEditingProject({
                          ...editingProject,
                          processImages: [...existing, { url: '/images/hero.png', title: `Phase ${existing.length + 1} Photo`, note: 'Process snapshot note' }]
                        });
                      }}
                      className="bg-[#f2603e]/20 text-[#f2603e] border border-[#f2603e]/40 font-mono text-xs uppercase px-4 py-2 cut-sm hover:bg-[#f2603e] hover:text-black font-bold"
                    >
                      + Add Process Photo
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(editingProject.processImages || []).map((proc, pIdx) => (
                      <div key={pIdx} className="bg-[#0a0a0a] border border-white/10 p-4 cut-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#f2603e] font-bold uppercase">
                            Process Photo #{pIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const filtered = editingProject.processImages.filter((_, i) => i !== pIdx);
                              setEditingProject({ ...editingProject, processImages: filtered });
                            }}
                            className="font-mono text-[10px] text-red-400 hover:underline"
                          >
                            Remove Photo
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              placeholder="Image URL"
                              value={proc.url || ''}
                              onChange={(e) => {
                                const updated = [...editingProject.processImages];
                                updated[pIdx].url = e.target.value;
                                setEditingProject({ ...editingProject, processImages: updated });
                              }}
                              className="w-full bg-[#141413] border border-white/10 p-2 text-xs font-mono text-white outline-none cut-sm"
                            />
                            <label className="bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase font-bold px-2.5 flex items-center justify-center cursor-pointer cut-sm whitespace-nowrap">
                              📁 Upload
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(e.target.files[0], (dataUrl) => {
                                      const updated = [...editingProject.processImages];
                                      updated[pIdx].url = dataUrl;
                                      setEditingProject({ ...editingProject, processImages: updated });
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>

                          <input
                            type="text"
                            placeholder="Phase Title (e.g. Concept Draft)"
                            value={proc.title || ''}
                            onChange={(e) => {
                              const updated = [...editingProject.processImages];
                              updated[pIdx].title = e.target.value;
                              setEditingProject({ ...editingProject, processImages: updated });
                            }}
                            className="bg-[#141413] border border-white/10 p-2 text-xs font-mono text-white outline-none cut-sm"
                          />

                          <input
                            type="text"
                            placeholder="Short description note..."
                            value={proc.note || ''}
                            onChange={(e) => {
                              const updated = [...editingProject.processImages];
                              updated[pIdx].note = e.target.value;
                              setEditingProject({ ...editingProject, processImages: updated });
                            }}
                            className="bg-[#141413] border border-white/10 p-2 text-xs font-mono text-white outline-none cut-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="bg-transparent border border-white/20 text-[#95928a] hover:text-white font-mono text-xs uppercase px-6 py-3 cut-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#f2603e] text-black font-chakra font-bold text-xs uppercase tracking-wider px-8 py-3.5 cut-sm hover:bg-[#ff6f4a] transition-all shadow-lg"
                  >
                    Save &amp; Update Site Live →
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-chakra text-2xl text-white uppercase font-bold">
                    Items under "{activeCategory.category}"
                  </h3>

                  <button
                    onClick={openNewProjectForm}
                    className="bg-[#f2603e] text-black font-chakra font-bold text-xs uppercase px-5 py-3 cut-sm hover:bg-[#ff6f4a] transition-all"
                  >
                    + Add New {activeCategory.category} Item
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeCategory.projects.map((proj) => (
                    <div key={proj.id} className="bg-[#141413] border border-white/10 p-6 cut flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#f2603e] bg-black/60 px-3 py-1 border border-[#f2603e]/30 cut-sm">
                            {proj.subTag || proj.tag || 'General'}
                          </span>
                          <span className="font-mono text-[10px] text-[#605e58]">
                            ID: {proj.id}
                          </span>
                        </div>

                        <h4 className="font-chakra text-xl text-white uppercase font-bold">
                          {proj.name}
                        </h4>
                        <p className="text-xs text-[#95928a]">
                          Target/Client: <span className="text-white font-medium">{proj.client}</span>
                        </p>

                        {selectedCategoryKey === 'software-solutions' && (
                          <div className="font-mono text-[11px] text-emerald-400 bg-black/50 p-2 cut-sm border border-emerald-500/20 truncate">
                            🔗 Download: {proj.downloadUrl || '#'} ({proj.fileSize || 'N/A'})
                          </div>
                        )}

                        <p className="text-xs text-[#95928a] line-clamp-2">
                          {proj.description || proj.shortDescription}
                        </p>

                        <div className="text-[11px] font-mono text-[#605e58] pt-1 flex gap-3">
                          <span>🎞️ {proj.showcaseMedia ? proj.showcaseMedia.length : 1} Showcase Media</span>
                          <span>📸 {proj.processImages ? proj.processImages.length : 0} Process Photos</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProject({ ...proj })}
                            className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs px-3.5 py-1.5 cut-sm"
                          >
                            Edit All Details
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-500/30 font-mono text-xs px-3.5 py-1.5 cut-sm"
                          >
                            Delete
                          </button>
                        </div>

                        <a
                          href={selectedCategoryKey === 'software-solutions' ? `#product-${proj.id}` : `#project-${proj.id}`}
                          className="font-mono text-xs text-[#f2603e] hover:underline"
                        >
                          Preview →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: HOMEPAGE HERO BANNERS */}
        {activeTab === 'herobanners' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-chakra text-2xl text-white uppercase font-bold">
                  Homepage Main Hero Section Banners
                </h3>
                <p className="text-xs text-[#95928a] font-mono">
                  Manage the auto-playing Hero Banners at the top of the main Homepage (Hero.jsx).
                </p>
              </div>

              <button
                onClick={openNewHeroBannerForm}
                className="bg-[#f2603e] text-black font-chakra font-bold text-xs uppercase px-5 py-3 cut-sm hover:bg-[#ff6f4a]"
              >
                + Add New Homepage Hero Banner
              </button>
            </div>

            {editingHeroBanner ? (
              <form onSubmit={handleSaveHeroBanner} className="bg-[#141413] border border-[#f2603e]/50 p-6 sm:p-8 cut space-y-6">
                <h4 className="font-chakra text-xl text-white uppercase font-bold">
                  {editingHeroBanner.title ? `Edit Hero Slide: ${editingHeroBanner.title}` : 'Add New Homepage Hero Slide'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Badge / Tagline *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NUMBER ONE. DIGITAL STUDIO"
                      value={editingHeroBanner.badge || ''}
                      onChange={(e) => setEditingHeroBanner({ ...editingHeroBanner, badge: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Hero Main Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. We build the digital side of your business."
                      value={editingHeroBanner.title || ''}
                      onChange={(e) => setEditingHeroBanner({ ...editingHeroBanner, title: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Hero Subtitle / Description *</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Subtitle text for this hero slide..."
                    value={editingHeroBanner.subtitle || ''}
                    onChange={(e) => setEditingHeroBanner({ ...editingHeroBanner, subtitle: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Primary Button Text &amp; Link</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Text (e.g. Start a project)"
                        value={editingHeroBanner.ctaPrimaryText || ''}
                        onChange={(e) => setEditingHeroBanner({ ...editingHeroBanner, ctaPrimaryText: e.target.value })}
                        className="bg-[#0a0a0a] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                      />
                      <input
                        type="text"
                        placeholder="Link (e.g. #requirement-form)"
                        value={editingHeroBanner.ctaPrimaryLink || ''}
                        onChange={(e) => setEditingHeroBanner({ ...editingHeroBanner, ctaPrimaryLink: e.target.value })}
                        className="bg-[#0a0a0a] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Secondary Button Text &amp; Link</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Text (e.g. See our work)"
                        value={editingHeroBanner.ctaSecondaryText || ''}
                        onChange={(e) => setEditingHeroBanner({ ...editingHeroBanner, ctaSecondaryText: e.target.value })}
                        className="bg-[#0a0a0a] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                      />
                      <input
                        type="text"
                        placeholder="Link (e.g. #work)"
                        value={editingHeroBanner.ctaSecondaryLink || ''}
                        onChange={(e) => setEditingHeroBanner({ ...editingHeroBanner, ctaSecondaryLink: e.target.value })}
                        className="bg-[#0a0a0a] border border-white/10 p-2.5 text-xs font-mono text-white outline-none cut-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Hero Showcase Media (Image or Video URL) *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="/images/hero.png or video URL"
                      value={editingHeroBanner.image || ''}
                      onChange={(e) => setEditingHeroBanner({ ...editingHeroBanner, image: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                    <label className="bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase font-bold px-4 flex items-center justify-center cursor-pointer whitespace-nowrap cut-sm">
                      📁 Upload
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], (dataUrl) => {
                              setEditingHeroBanner({ ...editingHeroBanner, image: dataUrl });
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingHeroBanner(null)}
                    className="bg-transparent border border-white/20 text-[#95928a] font-mono text-xs px-6 py-3 cut-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#f2603e] text-black font-chakra font-bold text-xs uppercase px-8 py-3.5 cut-sm hover:bg-[#ff6f4a]"
                  >
                    Save Hero Banner →
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(storeData.homepageHeroBanners || []).map((banner) => (
                  <div key={banner.id} className="bg-[#141413] border border-white/10 p-6 cut space-y-4">
                    <div className="space-y-2">
                      <span className="font-mono text-xs text-[#f2603e] font-bold uppercase">
                        ⚡ {banner.badge}
                      </span>
                      <h4 className="font-chakra text-2xl text-white uppercase font-bold">
                        {banner.title}
                      </h4>
                      <p className="text-xs text-[#95928a] line-clamp-2">
                        {banner.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingHeroBanner({ ...banner })}
                          className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs px-3.5 py-1.5 cut-sm"
                        >
                          Edit Hero Banner
                        </button>
                        <button
                          onClick={() => handleDeleteHeroBanner(banner.id)}
                          className="bg-red-950/60 text-red-400 border border-red-500/30 font-mono text-xs px-3.5 py-1.5 cut-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: HOMEPAGE MOVING CARDS SELECTOR */}
        {activeTab === 'homepage' && (
          <div className="space-y-8">
            <div className="bg-[#141413] border border-white/10 p-6 cut">
              <h3 className="font-chakra text-2xl text-white uppercase font-bold mb-2">
                Select Featured Moving Projects for Homepage Cards
              </h3>
              <p className="text-xs text-[#95928a] font-mono">
                Toggle which projects cycle/move inside the 4 homepage category cards shown in the works grid.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {storeData.categories.map((catGroup) => (
                <div key={catGroup.key} className="bg-[#141413] border border-white/10 p-6 cut space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <span className="font-mono text-xs text-[#f2603e] font-bold uppercase tracking-wider block">
                      BOX CATEGORY: {catGroup.category}
                    </span>
                    <h4 className="font-chakra text-xl text-white font-bold uppercase">
                      {catGroup.category} Moving Pool
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {catGroup.projects.map((proj) => {
                      const isFeatured = proj.featuredOnHome !== false;
                      return (
                        <div
                          key={proj.id}
                          className={`p-3 cut-sm border flex items-center justify-between transition-all ${
                            isFeatured
                              ? 'bg-black/60 border-[#f2603e]/40'
                              : 'bg-black/20 border-white/5 opacity-60'
                          }`}
                        >
                          <div>
                            <span className="font-chakra text-sm font-bold text-white uppercase block">
                              {proj.name}
                            </span>
                            <span className="font-mono text-[10px] text-[#95928a]">
                              Sub-tag: {proj.subTag || proj.tag}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleHomepageFeatured(catGroup.key, proj.id)}
                            className={`font-mono text-xs uppercase px-3 py-1.5 cut-sm font-bold transition-all ${
                              isFeatured
                                ? 'bg-[#f2603e] text-black'
                                : 'bg-white/10 text-[#95928a] hover:text-white'
                            }`}
                          >
                            {isFeatured ? '✓ Active in Box' : '+ Hidden'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SOFTWARE SECTION HIGHLIGHT BANNERS */}
        {activeTab === 'banners' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-chakra text-2xl text-white uppercase font-bold">
                  Software Section Banners
                </h3>
                <p className="text-xs text-[#95928a] font-mono">
                  Manage highlight banners displayed in the Software Solutions section.
                </p>
              </div>

              <button
                onClick={openNewBannerForm}
                className="bg-[#f2603e] text-black font-chakra font-bold text-xs uppercase px-5 py-3 cut-sm hover:bg-[#ff6f4a]"
              >
                + Add New Banner Slide
              </button>
            </div>

            {editingBanner ? (
              <form onSubmit={handleSaveBanner} className="bg-[#141413] border border-[#f2603e]/50 p-6 sm:p-8 cut space-y-6">
                <h4 className="font-chakra text-xl text-white uppercase font-bold">
                  {editingBanner.title ? `Edit Banner: ${editingBanner.title}` : 'Add New Hero Banner'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Banner Main Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DineBuddy POS 7.2 Released"
                      value={editingBanner.title || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Badge Text</label>
                    <input
                      type="text"
                      placeholder="e.g. FEATURED POS"
                      value={editingBanner.badge || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Banner Subtitle / Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Multi-branch inventory sync with offline mode..."
                    value={editingBanner.subtitle || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Banner Image URL *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="/images/hero.png"
                        value={editingBanner.image || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                      />
                      <label className="bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase font-bold px-3 flex items-center justify-center cursor-pointer whitespace-nowrap cut-sm">
                        📁 File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(e.target.files[0], (dataUrl) => {
                                setEditingBanner({ ...editingBanner, image: dataUrl });
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">Target Software Product ID</label>
                    <input
                      type="text"
                      placeholder="pos-system or restaurant-management"
                      value={editingBanner.productId || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, productId: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingBanner(null)}
                    className="bg-transparent border border-white/20 text-[#95928a] font-mono text-xs px-6 py-3 cut-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#f2603e] text-black font-chakra font-bold text-xs uppercase px-8 py-3.5 cut-sm hover:bg-[#ff6f4a]"
                  >
                    Save Banner Slide →
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(storeData.softwareBanners || []).map((banner) => (
                  <div key={banner.id} className="bg-[#141413] border border-white/10 p-6 cut space-y-4">
                    <div className="space-y-2">
                      <span className="font-mono text-xs text-[#f2603e] font-bold uppercase">
                        ⚡ {banner.badge}
                      </span>
                      <h4 className="font-chakra text-2xl text-white uppercase font-bold">
                        {banner.title}
                      </h4>
                      <p className="text-xs text-[#95928a]">
                        {banner.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingBanner({ ...banner })}
                          className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs px-3.5 py-1.5 cut-sm"
                        >
                          Edit Slide
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="bg-red-950/60 text-red-400 border border-red-500/30 font-mono text-xs px-3.5 py-1.5 cut-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
