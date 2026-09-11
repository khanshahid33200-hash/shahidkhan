import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import About from '../components/About';
import Contact from '../components/Contact';

const AboutPage = ({ onOpenCertModal }) => {
  return (
    <div className="pt-24 min-h-screen bg-[#fcf8f5]">
      {/* Page Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 text-xs font-mono text-[#ff6b00] uppercase font-bold">
          <RouterLink to="/" className="flex items-center gap-1 hover:underline text-[#5e5249]">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>HOME</span>
          </RouterLink>
          <span>/</span>
          <span>ABOUT & SKILLS</span>
        </div>
      </div>

      {/* Main About View */}
      <About onOpenCertModal={onOpenCertModal} />

      {/* Contact Section */}
      <Contact />
    </div>
  );
};

export default AboutPage;
