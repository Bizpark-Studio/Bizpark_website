import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Process from './components/Process';
import Work from './components/Work';
import RequirementForm from './components/RequirementForm';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f4ef] font-sans">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Process />
        <Work />
        <RequirementForm />
      </main>
      <Footer />
    </div>
  );
}
