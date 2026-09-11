import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CertificateModal from './components/CertificateModal';
import LegalModal from './components/LegalModal';

// Separate Page Views
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import MyProductsPage from './pages/MyProductsPage';
import ReviewsPage from './pages/ReviewsPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';

function App() {
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-[#fcf8f5] min-h-screen text-[#181310] font-inter selection:bg-[#ff6b00] selection:text-white relative overflow-hidden flex flex-col justify-between">
        {/* SVG Liquid Filter Definition */}
        <svg className="hidden">
          <defs>
            <filter id="liquid-glass-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <Navbar />

        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage onOpenCertModal={() => setCertModalOpen(true)} />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage onOpenCertModal={() => setCertModalOpen(true)} />} />
            <Route path="/portfolio" element={<ProjectsPage />} />
            <Route path="/products" element={<MyProductsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>

        <Footer onOpenLegalModal={(modalType) => setActiveLegalModal(modalType)} />

        {/* Lightbox Modals */}
        <CertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
        />

        <LegalModal
          activeModal={activeLegalModal}
          onClose={() => setActiveLegalModal(null)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
