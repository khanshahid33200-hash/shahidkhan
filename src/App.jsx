import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';

// Lazy Loaded Secondary Pages & Modals for 60%+ Faster Initial Loading
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const MyProductsPage = lazy(() => import('./pages/MyProductsPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CertificateModal = lazy(() => import('./components/CertificateModal'));
const LegalModal = lazy(() => import('./components/LegalModal'));

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-[#ff6b00] border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState(null);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-[#fcf8f5] min-h-screen text-[#181310] font-inter selection:bg-[#ff6b00] selection:text-white relative overflow-hidden flex flex-col justify-between">
        <Navbar />

        <main className="grow">
          <Suspense fallback={<PageFallback />}>
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
          </Suspense>
        </main>

        <Footer onOpenLegalModal={(modalType) => setActiveLegalModal(modalType)} />

        {/* Lightbox Modals */}
        <Suspense fallback={null}>
          {certModalOpen && (
            <CertificateModal
              isOpen={certModalOpen}
              onClose={() => setCertModalOpen(false)}
            />
          )}

          {activeLegalModal && (
            <LegalModal
              activeModal={activeLegalModal}
              onClose={() => setActiveLegalModal(null)}
            />
          )}
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
