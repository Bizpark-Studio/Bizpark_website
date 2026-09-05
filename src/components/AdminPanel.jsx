import React, { useState, useEffect } from 'react';
import { getStoreData, saveStoreData, resetStoreData, deleteInquiry, clearAllInquiries, getBackendUrl, syncFromBackend } from '../data/store';
import { compressImage } from '../utils/imageCompressor';

const BACKEND_URL = getBackendUrl();

export default function AdminPanel() {
  const [storeData, setStoreData] = useState(getStoreData());
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('bizpark_admin_authed') === 'true';
  });

  // Login credentials state
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'herobanners' | 'homepage' | 'banners' | 'team' | 'inquiries' | 'settings'
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('branding');
  const [editingProject, setEditingProject] = useState(null);
  const [editingHeroBanner, setEditingHeroBanner] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [saveNotification, setSaveNotification] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');
  const [settingsState, setSettingsState] = useState(() => {
    const data = getStoreData();
    const storedBackend = typeof window !== 'undefined' ? localStorage.getItem('bizpark_backend_url') : '';
    return {
      adminEmail: 'bizparkstudio@gmail.com',
      whatsappNumber: '0783157736',
      phone: '0783157736',
      address: 'Colombo, Sri Lanka',
      web3formsKey: '68a920d3-df9e-456d-84d8-feb25b489cd5',
      backendUrl: storedBackend || '',
      ...(data.settings || {})
    };
  });
  const [emailConfig, setEmailConfig] = useState(null);
  const [testEmailStatus, setTestEmailStatus] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [cloudTestStatus, setCloudTestStatus] = useState('');
  const [isTestingCloud, setIsTestingCloud] = useState(false);

  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);

  // Fetch live client inquiries directly from MongoDB Atlas
  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/inquiries`);
      if (res.ok) {
        const liveInquiries = await res.json();
        if (Array.isArray(liveInquiries)) {
          setStoreData((prev) => ({
            ...prev,
            inquiries: liveInquiries
          }));
        }
      }
    } catch (err) {
      console.warn('Could not fetch inquiries from server:', err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // 1. Listen for background store updates
    const handleUpdate = () => {
      setStoreData(getStoreData());
    };
    window.addEventListener('bizpark_store_updated', handleUpdate);

    // 2. Fetch fresh site data from MongoDB Atlas on mount
    syncFromBackend().then((res) => {
      if (res && res.success && res.data) {
        setStoreData(res.data);
      }
    });

    // 3. Fetch latest inquiries from MongoDB
    fetchInquiries();

    return () => window.removeEventListener('bizpark_store_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (activeTab === 'settings') {
      const backendUrl = getBackendUrl();
      fetch(`${backendUrl}/api/email-config`)
        .then((res) => res.json())
        .then((data) => setEmailConfig(data))
        .catch(() => {});
    } else if (activeTab === 'inquiries') {
      fetchInquiries();
    }
  }, [activeTab]);

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailStatus('Sending test email notification...');
    try {
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: settingsState.adminEmail || 'bizparkstudio@gmail.com' })
      });
      const data = await res.json();
      if (data.sent) {
        setTestEmailStatus('✓ Test email dispatched successfully! Please check your inbox.');
      } else {
        setTestEmailStatus(`⚠️ Email not sent: ${data.reason || data.error || 'Check .env SMTP credentials'}`);
      }
    } catch {
      setTestEmailStatus(`❌ Error reaching backend at ${getBackendUrl()}. Make sure backend is running.`);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleTestCloudConnection = async () => {
    setIsTestingCloud(true);
    const backendUrl = getBackendUrl();
    setCloudTestStatus(`Testing connection to: ${backendUrl}...`);
    try {
      const res = await fetch(`${backendUrl}/api/health`);
      if (res.ok) {
        const data = await res.json();
        if (data.database === 'connected') {
          setCloudTestStatus(`✓ SUCCESS! Connected to MongoDB Atlas (${data.databaseName || 'bizpark_studio'}) via ${backendUrl} [Mode: ${data.environment || 'production'}]`);
        } else {
          setCloudTestStatus(`⚠️ Backend connected at ${backendUrl}, but MongoDB status is: ${data.database}. ${data.lastError ? `(Error: ${data.lastError})` : ''}`);
        }
      } else {
        setCloudTestStatus(`❌ Backend responded with HTTP status ${res.status}`);
      }
    } catch (err) {
      setCloudTestStatus(`❌ Connection failed to ${backendUrl}: ${err.message}. If your frontend is hosted, verify that backend is deployed or enter your live backend URL below.`);
    } finally {
      setIsTestingCloud(false);
    }
  };

  const handleForceCloudSync = async () => {
    triggerSaveNotification('Fetching latest data directly from MongoDB Atlas...');
    const result = await syncFromBackend();
    if (result && result.success) {
      setStoreData(result.data);
      triggerSaveNotification('✓ Live data successfully synchronized from MongoDB Atlas!');
    } else {
      triggerSaveNotification('⚠️ Could not sync from cloud. Using local store data.');
    }
  };

  const triggerSaveNotification = (msg) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(''), 4500);
  };

  const handleSaveAll = async (updatedData) => {
    setStoreData(updatedData);
    triggerSaveNotification('💾 Saving to Cloud Database...');
    const result = await saveStoreData(updatedData);
    if (result && result.remoteSaved) {
      triggerSaveNotification('✓ Content successfully saved to MongoDB Atlas & published live!');
    } else if (result && result.remoteError) {
      triggerSaveNotification(`⚠️ Saved locally, but CLOUD SYNC FAILED: ${result.remoteError}`);
      console.warn('Cloud sync failure:', result.remoteError);
    } else {
      triggerSaveNotification('✓ Content updated in local memory.');
    }
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

  // FILE UPLOAD HELPER — automatically compresses images and uploads to server /api/upload-image, falls back to optimized base64
  const handleFileUpload = async (file, callback) => {
    if (!file) return;
    try {
      triggerSaveNotification('⚡ Optimizing image resolution...');
      const optimizedFile = await compressImage(file);
      const backendUrl = getBackendUrl();
      const formData = new FormData();
      formData.append('image', optimizedFile);
      const res = await fetch(`${backendUrl}/api/upload-image`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          // If backend is on a different domain, format full URL
          const resolvedUrl = data.url.startsWith('http') || data.url.startsWith('data:')
            ? data.url
            : backendUrl && !backendUrl.includes('localhost') && backendUrl.startsWith('http')
            ? `${backendUrl}${data.url}`
            : data.url;
          callback(resolvedUrl);
          triggerSaveNotification('✓ Image optimized & uploaded successfully!');
          return;
        }
      }
    } catch {
      // fall through to base64 fallback with optimized image
    }
    // Fallback: convert optimized image to base64 data URL
    try {
      const optimizedFile = await compressImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        callback(e.target.result);
        triggerSaveNotification('✓ Image optimized & loaded into preview!');
      };
      reader.readAsDataURL(optimizedFile);
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        callback(e.target.result);
      };
      reader.readAsDataURL(file);
    }
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

  // INQUIRIES & LEADS HANDLERS
  const handleDeleteInquiryItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this client inquiry?')) {
      const remaining = (storeData.inquiries || []).filter((inq) => (inq._id || inq.id) !== id);
      setStoreData((prev) => ({ ...prev, inquiries: remaining }));
      deleteInquiry(id);

      try {
        const backendUrl = getBackendUrl();
        await fetch(`${backendUrl}/api/inquiries/${id}`, { method: 'DELETE' });
        triggerSaveNotification('✓ Inquiry deleted from MongoDB Atlas & local storage.');
      } catch {
        triggerSaveNotification('Inquiry deleted from local storage.');
      }
    }
  };

  const handleClearAllInquiriesList = async () => {
    if (window.confirm('Delete all client inquiries? This action cannot be undone.')) {
      setStoreData((prev) => ({ ...prev, inquiries: [] }));
      clearAllInquiries();

      try {
        const backendUrl = getBackendUrl();
        await fetch(`${backendUrl}/api/inquiries`, { method: 'DELETE' });
        triggerSaveNotification('✓ All inquiries cleared from MongoDB Atlas.');
      } catch {
        triggerSaveNotification('All inquiries cleared.');
      }
    }
  };

  // TEAM MEMBERS HANDLERS
  const openNewTeamMemberForm = () => {
    setEditingTeamMember({
      id: `team-${Date.now()}`,
      name: '',
      role: '',
      image: '/images/hero.png',
      bio: '',
      email: 'bizparkstudio@gmail.com',
      phone: '0783157736'
    });
  };

  const handleSaveTeamMember = (e) => {
    e.preventDefault();
    if (!editingTeamMember.name.trim()) return;
    const currentMembers = storeData.teamMembers || [];
    const exists = currentMembers.some((m) => m.id === editingTeamMember.id);
    const updatedMembers = exists
      ? currentMembers.map((m) => (m.id === editingTeamMember.id ? editingTeamMember : m))
      : [...currentMembers, editingTeamMember];

    const updated = {
      ...storeData,
      teamMembers: updatedMembers
    };
    handleSaveAll(updated);
    setEditingTeamMember(null);
    triggerSaveNotification('✓ Team member saved & published to About page!');
  };

  const handleDeleteTeamMember = (id) => {
    if (window.confirm('Are you sure you want to remove this team member from the About page?')) {
      const updatedMembers = (storeData.teamMembers || []).filter((m) => m.id !== id);
      const updated = {
        ...storeData,
        teamMembers: updatedMembers
      };
      handleSaveAll(updated);
      triggerSaveNotification('Team member removed.');
    }
  };

  // SYSTEM SETTINGS & DATA BACKUP HANDLERS
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (settingsState.backendUrl && settingsState.backendUrl.trim()) {
      localStorage.setItem('bizpark_backend_url', settingsState.backendUrl.trim());
    } else {
      localStorage.removeItem('bizpark_backend_url');
    }
    const updated = {
      ...storeData,
      settings: settingsState
    };
    await handleSaveAll(updated);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storeData, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `bizpark-studio-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    triggerSaveNotification('✓ Complete Site Data exported to JSON backup file!');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && parsed.categories) {
          handleSaveAll(parsed);
          triggerSaveNotification('✓ Site Data restored from JSON backup successfully!');
        } else {
          alert('Invalid backup JSON format. Missing categories array.');
        }
      } catch (err) {
        console.error('Import JSON parsing error:', err);
        alert('Failed to parse JSON file. Please ensure it is a valid file.');
      }
    };
    reader.readAsText(file);
  };

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
          <button
            onClick={() => { setActiveTab('team'); setEditingTeamMember(null); }}
            className={`font-mono text-xs uppercase px-5 py-3 cut-sm transition-all font-bold flex items-center gap-2 ${
              activeTab === 'team'
                ? 'bg-[#f2603e] text-black shadow-lg shadow-[#f2603e]/20'
                : 'bg-[#141413] text-[#95928a] hover:text-white border border-white/10'
            }`}
          >
            <span>5. Team Members</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-sm font-mono ${
              activeTab === 'team' ? 'bg-black text-[#f2603e]' : 'bg-[#f2603e] text-black font-bold'
            }`}>
              {(storeData.teamMembers || []).length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('inquiries'); setEditingProject(null); }}
            className={`font-mono text-xs uppercase px-5 py-3 cut-sm transition-all font-bold flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'bg-[#f2603e] text-black shadow-lg shadow-[#f2603e]/20'
                : 'bg-[#141413] text-[#95928a] hover:text-white border border-white/10'
            }`}
          >
            <span>6. Inquiries &amp; Leads</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-sm font-mono ${
              activeTab === 'inquiries' ? 'bg-black text-[#f2603e]' : 'bg-[#f2603e] text-black font-bold'
            }`}>
              {(storeData.inquiries || []).length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setEditingProject(null); }}
            className={`font-mono text-xs uppercase px-5 py-3 cut-sm transition-all font-bold ${
              activeTab === 'settings'
                ? 'bg-[#f2603e] text-black shadow-lg shadow-[#f2603e]/20'
                : 'bg-[#141413] text-[#95928a] hover:text-white border border-white/10'
            }`}
          >
            7. System Email, Contact &amp; Backup
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

        {/* TAB 5: INQUIRIES & LEADS INBOX */}
        {activeTab === 'inquiries' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141413] border border-white/10 p-6 cut">
              <div>
                <div className="inline-flex items-center gap-2 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-1 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#f2603e] animate-pulse" />
                  CLIENT LEADS VAULT
                </div>
                <h3 className="font-chakra text-2xl text-white uppercase font-bold">
                  Inquiries &amp; Customer Requirements ({(storeData.inquiries || []).length})
                </h3>
                <p className="text-xs text-[#95928a] font-mono mt-1">
                  Every inquiry submitted across the homepage and case studies is preserved here in real-time.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={fetchInquiries}
                  disabled={isLoadingInquiries}
                  className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase px-3.5 py-2 cut-sm transition-all flex items-center gap-1.5"
                >
                  {isLoadingInquiries ? 'Syncing...' : 'Refresh Leads 🔄'}
                </button>
                {storeData.inquiries && storeData.inquiries.length > 0 && (
                  <button
                    onClick={handleClearAllInquiriesList}
                    className="bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 font-mono text-xs uppercase px-4 py-2 cut-sm transition-all"
                  >
                    Clear All Leads 🗑
                  </button>
                )}
              </div>
            </div>

            {/* Filter Search Input */}
            <div className="bg-[#141413] border border-white/10 p-4 cut flex items-center gap-4">
              <span className="font-mono text-xs text-[#605e58] uppercase font-bold whitespace-nowrap">Filter Inquiries:</span>
              <input
                type="text"
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                placeholder="Search by client name, email, phone, company, or requirement keywords..."
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] px-4 py-2.5 text-xs font-mono text-white outline-none cut-sm"
              />
              {inquirySearch && (
                <button
                  onClick={() => setInquirySearch('')}
                  className="font-mono text-xs text-[#95928a] hover:text-white px-2"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Inquiries List */}
            {(() => {
              const filtered = (storeData.inquiries || []).filter((inq) => {
                if (!inquirySearch.trim()) return true;
                const q = inquirySearch.toLowerCase();
                return (
                  (inq.name && inq.name.toLowerCase().includes(q)) ||
                  (inq.email && inq.email.toLowerCase().includes(q)) ||
                  (inq.phone && inq.phone.toLowerCase().includes(q)) ||
                  (inq.company && inq.company.toLowerCase().includes(q)) ||
                  (inq.details && inq.details.toLowerCase().includes(q)) ||
                  (inq.source && inq.source.toLowerCase().includes(q))
                );
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-[#141413] border border-white/10 p-12 text-center cut font-mono text-sm text-[#95928a] space-y-3">
                    <p className="text-base text-white font-chakra uppercase font-bold">No Inquiries Found</p>
                    <p className="text-xs">
                      {inquirySearch ? 'No inquiries matched your search keyword.' : 'Client inquiries submitted through the website will appear here.'}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filtered.map((inq) => {
                    const inqId = inq._id || inq.id;
                    const inqDate = inq.date || (inq.createdAt ? new Date(inq.createdAt).toLocaleString() : 'Recent');
                    return (
                    <div
                      key={inqId}
                      className="bg-[#141413] border border-white/10 p-6 cut transition-all hover:border-[#f2603e]/40 space-y-4 shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-[#f2603e] font-bold bg-black/60 px-3 py-1 border border-[#f2603e]/30 cut-sm">
                            {inq.source || 'Website Lead'}
                          </span>
                          <span className="font-mono text-xs text-[#95928a]">
                            Received: <strong className="text-white">{inqDate}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {inq.email && (
                            <a
                              href={`mailto:${inq.email}?subject=Regarding Your Bizpark Studio Inquiry&body=Hi ${inq.name},%0D%0A%0D%0AThank you for reaching out to Bizpark Studio regarding your project.`}
                              className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs px-3 py-1.5 cut-sm transition-all"
                            >
                              ✉ Reply via Email
                            </a>
                          )}
                          {inq.phone && (
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-black font-mono text-xs px-3 py-1.5 cut-sm transition-all font-bold"
                            >
                              💬 WhatsApp
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteInquiryItem(inqId)}
                            className="text-red-400 hover:text-red-300 font-mono text-xs px-2.5 py-1.5 border border-red-500/20 hover:border-red-500/40 cut-sm"
                          >
                            Delete ✕
                          </button>
                        </div>
                      </div>

                      {/* Lead Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#0a0a0a] p-4 cut-sm font-mono text-xs">
                        <div>
                          <span className="block text-[10px] text-[#605e58] uppercase">Client Name</span>
                          <span className="text-sm font-bold text-white">{inq.name}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#605e58] uppercase">Email Address</span>
                          <span className="text-xs text-[#f2603e] break-all">{inq.email}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#605e58] uppercase">Phone / WhatsApp</span>
                          <span className="text-xs text-white">{inq.phone || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#605e58] uppercase">Budget &amp; Timeline</span>
                          <span className="text-xs text-emerald-400 font-semibold">{inq.budget || 'N/A'} ({inq.timeline || 'ASAP'})</span>
                        </div>
                      </div>

                      {inq.company && (
                        <p className="font-mono text-xs text-[#95928a]">
                          Company / Brand Entity: <strong className="text-white">{inq.company}</strong>
                        </p>
                      )}

                      {inq.services && inq.services.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[10px] text-[#605e58] uppercase mr-1">Services:</span>
                          {inq.services.map((s, idx) => (
                            <span key={idx} className="font-mono text-[10px] text-white bg-[#0a0a0a] px-2 py-0.5 border border-white/10 cut-sm">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Project Requirements text */}
                      <div className="bg-black/60 border border-white/5 p-4 cut-sm">
                        <span className="block font-mono text-[10px] text-[#f2603e] uppercase font-bold mb-1.5">
                          Requirement Details:
                        </span>
                        <p className="text-xs text-[#f5f4ef] font-mono whitespace-pre-wrap leading-relaxed">
                          {inq.details || inq.message || 'No additional details provided.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              );
            })()}

          </div>
        )}

        {/* TAB 5: TEAM MEMBERS MANAGEMENT */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141413] border border-white/10 p-6 cut shadow-2xl">
              <div>
                <div className="inline-flex items-center gap-2 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-1 font-bold">
                  <span>👥</span>
                  ABOUT PAGE TEAM ROSTER
                </div>
                <h3 className="font-chakra text-2xl text-white uppercase font-bold">
                  Studio Team Members &amp; Specialists
                </h3>
                <p className="text-xs text-[#95928a] font-mono mt-1">
                  Manage the specialists, roles, profile photos, and bios displayed on the public About page.
                </p>
              </div>
              <button
                onClick={openNewTeamMemberForm}
                className="bg-[#f2603e] hover:bg-[#ff6f4a] text-black font-chakra font-bold text-xs uppercase px-6 py-3.5 cut-sm transition-all shadow-lg flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
              >
                <span>+</span>
                <span>Add Team Member</span>
              </button>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(storeData.teamMembers || []).map((member) => (
                <div
                  key={member.id}
                  className="bg-[#141413] border border-white/10 hover:border-[#f2603e]/60 cut p-6 space-y-4 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-4">
                    {/* Image Preview & Badges */}
                    <div className="relative aspect-[4/3] w-full bg-[#0a0a0a] rounded overflow-hidden border border-white/10">
                      <img
                        src={member.image || '/images/hero.png'}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => { e.target.src = '/images/hero.png'; }}
                      />
                      <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 text-[10px] font-mono text-[#f2603e] border border-white/10 cut-sm">
                        {member.role ? member.role.split(' ')[0] : 'SPECIALIST'}
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-xs text-[#f2603e] font-bold uppercase tracking-wider mb-1">
                        {member.role || 'Role not specified'}
                      </div>
                      <h4 className="font-chakra text-xl font-bold text-white uppercase">
                        {member.name}
                      </h4>
                      <p className="text-xs text-[#95928a] leading-relaxed mt-2 line-clamp-3">
                        {member.bio || 'No bio description provided.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-1 text-xs font-mono text-[#95928a]">
                      {member.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#605e58]">Email:</span>
                          <span className="text-white truncate">{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#605e58]">Phone:</span>
                          <span className="text-emerald-400 font-semibold">{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setEditingTeamMember(member)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-chakra font-bold text-xs uppercase py-2.5 cut-sm transition-all text-center"
                    >
                      Edit Profile ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteTeamMember(member.id)}
                      className="px-3.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-chakra font-bold text-xs uppercase cut-sm transition-all"
                      title="Remove Member"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit / Add Team Member Modal */}
            {editingTeamMember && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#141413] border border-[#f2603e]/40 p-6 sm:p-8 cut max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <div className="font-mono text-xs text-[#f2603e] uppercase tracking-wider font-bold">
                        // PROFILE EDITOR
                      </div>
                      <h3 className="font-chakra text-2xl font-bold text-white uppercase">
                        {editingTeamMember.name ? `Edit: ${editingTeamMember.name}` : 'Add New Team Member'}
                      </h3>
                    </div>
                    <button
                      onClick={() => setEditingTeamMember(null)}
                      className="text-[#95928a] hover:text-white text-xl p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveTeamMember} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                          Full Name <span className="text-[#f2603e]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editingTeamMember.name || ''}
                          onChange={(e) => setEditingTeamMember({ ...editingTeamMember, name: e.target.value })}
                          placeholder="e.g. Anuruddha Jayasanke"
                          className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                          Role / Title <span className="text-[#f2603e]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editingTeamMember.role || ''}
                          onChange={(e) => setEditingTeamMember({ ...editingTeamMember, role: e.target.value })}
                          placeholder="e.g. Founder &amp; Lead Architect"
                          className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                        />
                      </div>
                    </div>

                    {/* Profile Image with File Upload + URL */}
                    <div className="bg-[#0a0a0a] border border-white/10 p-4 cut-sm space-y-3">
                      <label className="block font-mono text-xs text-[#f2603e] uppercase font-bold">
                        Profile Photo
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-20 h-20 rounded bg-[#141413] border border-white/20 overflow-hidden flex-shrink-0">
                          <img
                            src={editingTeamMember.image || '/images/hero.png'}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/images/hero.png'; }}
                          />
                        </div>
                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex items-center gap-2">
                            <label className="bg-white/10 hover:bg-[#f2603e] hover:text-black text-white text-xs font-chakra font-bold uppercase px-4 py-2.5 cut-sm cursor-pointer transition-all border border-white/20">
                              <span>Choose Photo File 📁</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files && e.target.files[0];
                                  if (file) {
                                    handleFileUpload(file, (url) => {
                                      setEditingTeamMember((prev) => ({ ...prev, image: url }));
                                    });
                                  }
                                }}
                              />
                            </label>
                            <span className="text-[11px] font-mono text-[#605e58]">
                              Uploads directly to server
                            </span>
                          </div>
                          <input
                            type="text"
                            value={editingTeamMember.image || ''}
                            onChange={(e) => setEditingTeamMember({ ...editingTeamMember, image: e.target.value })}
                            placeholder="Or paste direct image URL (e.g. /images/team1.jpg)"
                            className="w-full bg-[#141413] border border-white/10 focus:border-[#f2603e] p-2.5 text-xs font-mono text-white outline-none cut-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                        Professional Bio / Summary
                      </label>
                      <textarea
                        rows={3}
                        value={editingTeamMember.bio || ''}
                        onChange={(e) => setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })}
                        placeholder="Brief overview of background, specializations, and studio role..."
                        className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#f2603e] p-3 text-xs font-sans text-white outline-none cut-sm resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editingTeamMember.email || ''}
                          onChange={(e) => setEditingTeamMember({ ...editingTeamMember, email: e.target.value })}
                          placeholder="e.g. member@bizparkstudio.com"
                          className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                          WhatsApp / Mobile Number
                        </label>
                        <input
                          type="text"
                          value={editingTeamMember.phone || ''}
                          onChange={(e) => setEditingTeamMember({ ...editingTeamMember, phone: e.target.value })}
                          placeholder="e.g. 0783157736"
                          className="w-full bg-[#0a0a0a] border border-white/15 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingTeamMember(null)}
                        className="bg-white/10 hover:bg-white/20 text-white font-chakra font-bold text-xs uppercase px-6 py-3 cut-sm transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#f2603e] hover:bg-[#ff6f4a] text-black font-chakra font-bold text-xs uppercase px-8 py-3 cut-sm transition-all shadow-lg"
                      >
                        Save Team Member →
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SYSTEM EMAIL SETTINGS & DATA BACKUP */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            
            {/* Email Dispatch Configuration Form */}
            <form onSubmit={handleSaveSettings} className="bg-[#141413] border border-white/10 p-6 sm:p-8 cut space-y-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4">
                <div className="inline-flex items-center gap-2 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-1 font-bold">
                  <span>⚙</span>
                  EMAIL &amp; NOTIFICATION CONFIGURATION
                </div>
                <h3 className="font-chakra text-2xl text-white uppercase font-bold">
                  Form Email Dispatcher
                </h3>
                <p className="text-xs text-[#95928a] font-mono mt-1">
                  Configure where incoming website client inquiries and project submissions get delivered.
                </p>
              </div>

              {/* Live Dispatch Engine Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0a0a0a] border border-white/10 p-5 cut-sm font-mono text-xs">
                <div className="space-y-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold uppercase">1. Gmail / SMTP Engine:</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold cut-sm ${emailConfig?.emailPasswordConfigured ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                      {emailConfig?.emailPasswordConfigured ? '✓ LIVE & CONNECTED' : '⚠️ APP PASSWORD PENDING'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#95928a] leading-relaxed">
                    Sender: <span className="text-white">{emailConfig?.senderEmail || 'bizparkstudio@gmail.com'}</span><br />
                    {emailConfig?.emailPasswordConfigured 
                      ? 'Nodemailer will send high-priority HTML emails directly to your admin inbox on every new lead.'
                      : 'To activate direct Gmail delivery, add your 16-character Google App Password to EMAIL_APP_PASSWORD in the .env file.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={isSendingTestEmail}
                    className="mt-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-chakra font-bold uppercase px-3.5 py-2 cut-sm border border-white/15 disabled:opacity-50 transition-all"
                  >
                    {isSendingTestEmail ? 'Sending Test...' : 'Send Test Lead Email ✉'}
                  </button>
                  {testEmailStatus && (
                    <div className="text-[11px] font-mono text-[#f2603e] pt-1">
                      {testEmailStatus}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 md:pt-0 md:pl-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold uppercase">2. Web3Forms Free Relay:</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold cut-sm ${settingsState.web3formsKey ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-[#888] border border-white/10'}`}>
                      {settingsState.web3formsKey ? '✓ ACTIVE GATEWAY' : 'OPTIONAL BACKUP'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#95928a] leading-relaxed">
                    Zero-password backup gateway. Forwards inquiries directly to your email without needing SMTP credentials or passwords.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                    Receiver Admin Email <span className="text-[#f2603e]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={settingsState.adminEmail || ''}
                    onChange={(e) => setSettingsState({ ...settingsState, adminEmail: e.target.value })}
                    placeholder="bizparkstudio@gmail.com"
                    className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                  />
                  <span className="text-[11px] text-[#605e58] font-mono mt-1 block">
                    All client requirement submissions will target this address.
                  </span>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                    Studio Official WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={settingsState.whatsappNumber || ''}
                    onChange={(e) => setSettingsState({ ...settingsState, whatsappNumber: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                  />
                  <span className="text-[11px] text-[#605e58] font-mono mt-1 block">
                    Used for instant WhatsApp chat shortcuts across forms and cards.
                  </span>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                    Studio Mobile / Telephone Hotline
                  </label>
                  <input
                    type="text"
                    value={settingsState.phone || ''}
                    onChange={(e) => setSettingsState({ ...settingsState, phone: e.target.value })}
                    placeholder="0783157736"
                    className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                  />
                  <span className="text-[11px] text-[#605e58] font-mono mt-1 block">
                    Official phone number shown on the Contact page &amp; footer.
                  </span>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#95928a] uppercase mb-2">
                    Studio Physical Address / Base
                  </label>
                  <input
                    type="text"
                    value={settingsState.address || ''}
                    onChange={(e) => setSettingsState({ ...settingsState, address: e.target.value })}
                    placeholder="Colombo, Sri Lanka"
                    className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                  />
                  <span className="text-[11px] text-[#605e58] font-mono mt-1 block">
                    Studio address shown on the Contact page and official communications.
                  </span>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/10 p-5 cut-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="font-mono text-xs text-[#f2603e] uppercase font-bold">
                    Web3Forms Free API Access Key (Optional for Direct SMTP Delivery)
                  </label>
                  <a
                    href="https://web3forms.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono text-[#f2603e] hover:underline"
                  >
                    Get Free Key at web3forms.com (1-Click) ↗
                  </a>
                </div>

                <input
                  type="text"
                  value={settingsState.web3formsKey || ''}
                  onChange={(e) => setSettingsState({ ...settingsState, web3formsKey: e.target.value })}
                  placeholder="e.g. b149b071-700a-428a-9a99-sample-key"
                  className="w-full bg-[#141413] border border-white/10 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                />
                <p className="text-[11px] text-[#95928a] font-mono leading-relaxed">
                  Web3Forms is a completely free, zero-setup service that forwards form submissions directly to your email inbox without needing any backend server. You can get an instant key by entering your email at <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="text-white underline">web3forms.com</a>. If blank, inquiries will still be 100% saved in the <strong>Inquiries &amp; Leads Inbox</strong> above!
                </p>
              </div>

              {/* Cloud Database & Live Hosting Backend Server Settings */}
              <div className="bg-[#0a0a0a] border border-[#f2603e]/40 p-5 cut-sm space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f2603e] animate-pulse" />
                    <span className="font-mono text-xs text-[#f2603e] font-bold uppercase tracking-wider">
                      Live Cloud Database &amp; API Server URL
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#95928a] uppercase bg-white/5 px-2 py-0.5 cut-sm border border-white/10">
                    MongoDB Atlas Connected
                  </span>
                </div>

                <p className="text-xs text-[#95928a] font-mono leading-relaxed">
                  When your website is hosted live (e.g. Netlify, Vercel, cPanel, or custom domain), enter the URL of your deployed Express backend API here. Edits to projects, hero banners, and leads will save directly to MongoDB Atlas.
                </p>

                <div>
                  <label className="block font-mono text-xs text-[#95928a] uppercase mb-1.5 font-semibold">
                    Backend API Endpoint URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={settingsState.backendUrl || ''}
                      onChange={(e) => setSettingsState({ ...settingsState, backendUrl: e.target.value })}
                      placeholder="e.g. https://bizpark-backend.onrender.com (or leave empty for auto-detect / same-origin)"
                      className="flex-1 bg-[#141413] border border-white/15 focus:border-[#f2603e] p-3 text-xs font-mono text-white outline-none cut-sm"
                    />
                    <button
                      type="button"
                      onClick={handleTestCloudConnection}
                      disabled={isTestingCloud}
                      className="bg-white/10 hover:bg-[#f2603e] hover:text-black text-white font-chakra font-bold text-xs uppercase px-5 py-3 cut-sm transition-all border border-white/20 whitespace-nowrap disabled:opacity-50 cursor-pointer"
                    >
                      {isTestingCloud ? 'Testing...' : 'Test Connection ⚡'}
                    </button>
                    <button
                      type="button"
                      onClick={handleForceCloudSync}
                      className="bg-white/10 hover:bg-white/20 text-white font-chakra font-bold text-xs uppercase px-4 py-3 cut-sm transition-all border border-white/20 whitespace-nowrap cursor-pointer"
                    >
                      Force Re-Sync 🔄
                    </button>
                  </div>
                  <span className="text-[11px] text-[#605e58] font-mono mt-1.5 block">
                    Active resolved URL: <strong className="text-white">{getBackendUrl()}</strong>
                  </span>
                </div>

                {cloudTestStatus && (
                  <div className={`p-3 cut-sm font-mono text-xs ${
                    cloudTestStatus.includes('SUCCESS')
                      ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                      : cloudTestStatus.includes('Testing')
                      ? 'bg-[#141413] border border-white/20 text-[#f2603e]'
                      : 'bg-red-950/80 border border-red-500/50 text-red-300'
                  }`}>
                    {cloudTestStatus}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#f2603e] hover:bg-[#ff6f4a] text-black font-chakra font-bold text-xs uppercase px-8 py-3.5 cut-sm transition-all shadow-lg"
                >
                  Save Settings &amp; Cloud Configuration →
                </button>
              </div>
            </form>

            {/* Complete Data Backup & Migration (Export / Import JSON) */}
            <div className="bg-[#141413] border border-white/10 p-6 sm:p-8 cut space-y-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4">
                <div className="inline-flex items-center gap-2 text-xs text-[#f2603e] font-mono uppercase tracking-widest mb-1 font-bold">
                  <span>💾</span>
                  DATA PERSISTENCE &amp; CLOUD BACKUP
                </div>
                <h3 className="font-chakra text-2xl text-white uppercase font-bold">
                  Backup, Restore &amp; Migrate Entire Website Data
                </h3>
                <p className="text-xs text-[#95928a] font-mono mt-1">
                  Because browser storage is local to this device, use these tools to backup all your projects, hero banners, software products, and leads into a single JSON file that can be restored on any computer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-[#0a0a0a] border border-white/10 p-6 cut-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-mono text-xs text-emerald-400 font-bold uppercase block">
                      EXPORT BACKUP
                    </span>
                    <h4 className="font-chakra text-xl text-white uppercase font-bold">
                      Download Full Data Backup (.JSON)
                    </h4>
                    <p className="text-xs text-[#95928a] font-mono leading-relaxed">
                      Exports all 4 categories, custom projects, process photos, hero banners, software download links, and inquiries into an offline file.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-chakra font-bold text-xs uppercase py-3.5 cut-sm transition-all flex items-center justify-center gap-2 border border-white/15"
                  >
                    <span>Download Site Data JSON ⬇</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-[#0a0a0a] border border-white/10 p-6 cut-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-mono text-xs text-[#f2603e] font-bold uppercase block">
                      RESTORE / MIGRATE
                    </span>
                    <h4 className="font-chakra text-xl text-white uppercase font-bold">
                      Import Backup File (.JSON)
                    </h4>
                    <p className="text-xs text-[#95928a] font-mono leading-relaxed">
                      Upload a previously exported backup file to synchronize your latest edits, projects, and hero banners to this browser immediately.
                    </p>
                  </div>
                  <label className="w-full bg-[#f2603e] hover:bg-[#ff6f4a] text-black font-chakra font-bold text-xs uppercase py-3.5 cut-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <span>Upload &amp; Restore JSON File ⬆</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={handleImportJSON}
                    />
                  </label>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
