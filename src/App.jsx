import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Process from './components/Process';
import Work from './components/Work';
import Products from './components/Products';
import RequirementForm from './components/RequirementForm';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';
import ProductDetail from './components/ProductDetail';

export default function App() {
  const [route, setRoute] = useState({ page: 'home', id: null });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#project-')) {
        const id = hash.replace('#project-', '');
        setRoute({ page: 'project', id });
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.startsWith('#product-')) {
        const id = hash.replace('#product-', '');
        setRoute({ page: 'product', id });
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setRoute({ page: 'home', id: null });
        if (hash) {
          const targetId = hash.slice(1);
          setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (route.page !== 'home') return;

    // Scroll reveal observer matching the original JS behavior
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [route.page]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f4ef] font-sans">
      <Navbar currentPage={route.page} />
      <main>
        {route.page === 'home' && (
          <>
            <Hero />
            <Marquee />
            <Services />
            <Process />
            <Work />
            <Products />
            <RequirementForm />
          </>
        )}
        {route.page === 'project' && <ProjectDetail projectId={route.id} />}
        {route.page === 'product' && <ProductDetail productId={route.id} />}
      </main>
      <Footer currentPage={route.page} />
    </div>
  );
}
