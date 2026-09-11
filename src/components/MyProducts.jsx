import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Stethoscope, LineChart, Sparkles, CheckCircle2, QrCode, Cpu, Layers, Users, Zap, Shield, ArrowUpRight } from 'lucide-react';
import MotionBlurSection from './MotionBlurSection';

const MyProducts = () => {
  const [activeTab, setActiveTab] = useState('medtech');

  const products = [
    {
      id: 'medtech',
      name: 'MedTech Fixaters',
      title: 'SMART OPD & DIGITAL EMR CLINIC PLATFORM',
      badge: 'FLAGSHIP HEALTHCARE SAAS',
      url: 'https://medtechfixaters.in',
      tagline: 'Transforming paper OPDs into high-speed digital smart clinics with QR check-in & 30-second EMR.',
      accent: '#ff6b00',
      icon: Stethoscope,
      whatIsIt: 'MedTech Fixaters is an end-to-end digital healthcare and clinic management platform engineered by Shahid Khan. It eliminates slow paper OPD counters, replaces manual token management with smart QR code check-ins, and provides doctors with a 30-second voice-assisted EMR prescription generator.',
      whoFor: [
        'Private Clinics & Independent Doctors',
        'Hospital OPD Reception Counters',
        'Polyclinics & Diagnostic Centers',
        'Healthcare Practitioners seeking zero-paper operations'
      ],
      features: [
        {
          title: 'Smart QR Reception & Token Display',
          desc: 'Patients scan clinic QR code on arrival to join live digital queue with TV monitor display support.'
        },
        {
          title: '30-Second Digital EMR Prescriptions',
          desc: 'Fast, voice-assisted digital prescriptions with customized dosage templates and auto-generated PDFs.'
        },
        {
          title: 'WhatsApp & SMS Automated Patient Reminders',
          desc: 'Direct WhatsApp prescription delivery, follow-up date alerts, and appointment confirmations.'
        },
        {
          title: 'OPD Analytics & Financial Dashboard',
          desc: 'Real-time daily patient counts, revenue tracking, prescription frequency reports, and doctor performance insights.'
        }
      ],
      techStack: ['React.js', 'Voice EMR Engine', 'QR Queue System', 'WhatsApp Cloud API', 'TailwindCSS', 'Node.js']
    },
    {
      id: 'techlev',
      name: 'TechLev Analyst',
      title: 'AI FINANCIAL RATIO CALCULATOR & ANALYSIS DASHBOARD',
      badge: 'FINANCIAL EDTECH PLATFORM',
      url: 'https://techlev.eu',
      tagline: 'Compute 20+ financial ratios instantly and generate AI analyst briefs from financial statements.',
      accent: '#ff8a00',
      icon: LineChart,
      whatIsIt: 'TechLev Analyst is a web application and financial statement analysis dashboard built by Shahid Khan. It bridges the gap between accounting formulas and real-world corporate financial statements by computing 20+ financial ratios instantly and delivering AI-powered educational briefs.',
      whoFor: [
        'Finance & Business Students',
        'Investment Analysts & Accounting Trainees',
        'Educators, Founders & Financial Analysts',
        'Anyone learning corporate balance sheet analysis'
      ],
      features: [
        {
          title: '20+ Instant Financial Ratios',
          desc: 'Computes profitability, liquidity, leverage, working capital efficiency, and valuation multiples instantly.'
        },
        {
          title: 'Claude AI Analyst Briefs',
          desc: 'One-click 250-word educational briefs powered by Claude AI analyzing company strengths, risks, and next steps.'
        },
        {
          title: 'Interactive Learn Mode',
          desc: 'Toggle switch revealing plain-English definitions, exact formulas, and healthy industry benchmark ranges.'
        },
        {
          title: 'Pre-Loaded Corporate Models',
          desc: 'Sample datasets for high-growth SaaS, retail, and capex-heavy industrial financial models.'
        }
      ],
      techStack: ['React.js', 'Claude AI API', 'Financial Calculation Engine', 'TailwindCSS', 'Zero-Login Architecture']
    }
  ];

  const currentProduct = products.find(p => p.id === activeTab);

  return (
    <MotionBlurSection id="products" className="py-24 px-4 md:px-8 bg-[#f6eee8] relative overflow-hidden">
      {/* Background Liquid Orange Glow */}
      <div className="absolute top-1/3 left-10 w-[30rem] h-[30rem] bg-[#ff6b00]/15 rounded-full blur-[140px] animate-liquid-orange-1 pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#ff8a00]/15 rounded-full blur-[130px] animate-liquid-orange-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono text-[#ff6b00] tracking-widest uppercase mb-2 block font-bold">
              // SAAS PLATFORMS & OWN PRODUCTS
            </span>
            <h2 className="font-antonio text-4xl sm:text-6xl md:text-7xl text-[#181310] font-bold uppercase tracking-tight">
              MY OWN <span className="text-[#ff6b00]">PRODUCTS & PLATFORMS</span>
            </h2>
          </div>
          <p className="text-[#5e5249] max-w-md text-sm md:text-base font-normal leading-relaxed">
            Full-stack web applications and digital SaaS platforms built and launched by Shahid Khan, solving real-world problems in Healthcare and Financial Education.
          </p>
        </div>

        {/* Product Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          {products.map((prod) => {
            const Icon = prod.icon;
            const isActive = activeTab === prod.id;
            return (
              <button
                key={prod.id}
                onClick={() => setActiveTab(prod.id)}
                className={`px-6 py-3.5 rounded-2xl font-antonio text-base uppercase tracking-wider font-bold transition-all flex items-center gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-[#ff6b00] text-white shadow-[0_0_25px_rgba(255,107,0,0.35)] scale-105'
                    : 'lucid-glass text-[#5e5249] hover:text-[#181310] hover:bg-white/80'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{prod.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-normal ${
                  isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#ff6b00]'
                }`}>
                  LIVE
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Product Detailed View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="lucid-glass rounded-3xl p-6 sm:p-10 border-white/80 shadow-2xl relative overflow-hidden"
          >
            {/* Top Banner Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 border-b border-black/10 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] text-xs font-bold font-mono mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentProduct.badge}</span>
                </div>
                <h3 className="font-antonio text-3xl sm:text-5xl text-[#181310] font-extrabold uppercase tracking-tight mb-2">
                  {currentProduct.name}
                </h3>
                <p className="text-base sm:text-lg text-[#ff6b00] font-bold font-mono uppercase">
                  {currentProduct.tagline}
                </p>
              </div>

              <a
                href={currentProduct.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#181310] text-white hover:bg-[#ff6b00] transition-all duration-300 font-antonio text-sm uppercase tracking-wider font-bold shadow-lg hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] shrink-0"
              >
                <span>LAUNCH PLATFORM ({currentProduct.url.replace('https://', '')})</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Product Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              {/* Left Column: What It Is & Who For */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* What Is It */}
                <div className="p-6 rounded-2xl bg-white/70 border border-white/90 shadow-sm">
                  <h4 className="text-xs font-mono text-[#ff6b00] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>WHAT IS IT?</span>
                  </h4>
                  <p className="text-sm sm:text-base text-[#5e5249] leading-relaxed font-normal">
                    {currentProduct.whatIsIt}
                  </p>
                </div>

                {/* Who Is It For */}
                <div className="p-6 rounded-2xl bg-white/70 border border-white/90 shadow-sm">
                  <h4 className="text-xs font-mono text-[#ff6b00] font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>WHO IS IT FOR?</span>
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    {currentProduct.whoFor.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#181310] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Pills */}
                <div className="p-6 rounded-2xl bg-white/70 border border-white/90 shadow-sm">
                  <h4 className="text-xs font-mono text-[#ff6b00] font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span>PLATFORM TECH STACK</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-[#ff6b00]/10 text-[#ff6b00] text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Core Features Grid */}
              <div className="lg:col-span-7">
                <h4 className="text-xs font-mono text-[#ff6b00] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>KEY PLATFORM FEATURES & CAPABILITIES</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentProduct.features.map((feat, index) => {
                    const featInitial =
                      index % 2 === 0
                        ? { opacity: 0, x: -60, rotate: -2, filter: 'blur(10px)' }
                        : { opacity: 0, x: 60, rotate: 2, filter: 'blur(10px)' };

                    return (
                      <motion.div
                        key={index}
                        initial={featInitial}
                        whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, filter: 'blur(0px)' }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.05, y: -6 }}
                        className="p-5 rounded-2xl bg-white/80 border border-white/90 shadow-sm hover:border-[#ff6b00]/40 hover:shadow-md transition-all flex flex-col justify-between splashed-motion-card cursor-pointer"
                      >
                        <div>
                          <div className="w-8 h-8 rounded-xl bg-[#ff6b00]/10 text-[#ff6b00] flex items-center justify-center font-mono font-bold text-xs mb-3">
                            0{index + 1}
                          </div>
                          <h5 className="font-antonio text-lg text-[#181310] font-bold uppercase mb-2">
                            {feat.title}
                          </h5>
                          <p className="text-xs text-[#5e5249] font-normal leading-relaxed">
                            {feat.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Live Link Callout Banner */}
                <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#ff6b00]/10 to-[#ff8a00]/10 border border-[#ff6b00]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ff6b00] text-white flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-[#181310] uppercase font-antonio">Fully Deployed & Production Ready</span>
                      <span className="text-xs text-[#5e5249]">Built, owned, and operated by Shahid Khan</span>
                    </div>
                  </div>
                  <a
                    href={currentProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold text-[#ff6b00] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>{currentProduct.url}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionBlurSection>
  );
};

export default MyProducts;
