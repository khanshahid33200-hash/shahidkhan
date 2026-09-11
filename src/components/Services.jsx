import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search, Globe, Layout, Code, TrendingUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import MotionBlurSection from './MotionBlurSection';

const Services = () => {
  const [activeTab, setActiveTab] = useState(0);

  const services = [
    {
      id: '01',
      title: 'META ADS & LEAD GENERATION',
      icon: Target,
      color: '#ff6b00',
      description: 'Run targeted Facebook & Instagram ad campaigns that acquire qualified leads, boost conversions, and maximize Return on Ad Spend (ROAS).',
      features: [
        'Custom Audience Research & Retargeting',
        'High-Converting Ad Copy & Creative Design',
        'Meta Pixel & CAPI Event Tracking Setup',
        'n8n & WhatsApp Automated Lead Funnels'
      ]
    },
    {
      id: '02',
      title: 'GOOGLE ADS & PPC CAMPAIGNS',
      icon: Search,
      color: '#ff8a00',
      description: 'Capture high-intent search traffic with Google Search Ads, Performance Max (PMax), Display Ads, and YouTube Video advertising.',
      features: [
        'Keyword Bidding & Negative Keyword Auditing',
        'PMax & Search Campaign Setup',
        'Google Analytics 4 (GA4) Conversion Tracking',
        'Landing Page Quality Score Optimization'
      ]
    },
    {
      id: '03',
      title: 'SEO & LOCAL SEARCH RANKINGS',
      icon: TrendingUp,
      color: '#ff6b00',
      description: 'Dominate search engine results in Jaipur, Rajasthan, and nationwide with data-driven On-Page, Off-Page, and Technical SEO.',
      features: [
        'Local SEO & Google Business Profile (GMB) Rank #1',
        'Keyword Strategy & Content Optimization',
        'Technical Site Audits & Core Web Vitals',
        'High-Authority Link Building & Citations'
      ]
    },
    {
      id: '04',
      title: 'HIGH-CONVERTING LANDING PAGES',
      icon: Layout,
      color: '#8b5cf6',
      description: 'Design and build lightning-fast, mobile-first landing pages engineered specifically to convert paid ad traffic into active inquiries.',
      features: [
        'Custom UX/UI Wireframing & Prototyping',
        'Fast Mobile Optimization & Zero Lag',
        'Conversion Rate Optimization (CRO)',
        'Form Integration & CRM Sync'
      ]
    },
    {
      id: '05',
      title: 'WEBSITE & SOFTWARE DEVELOPMENT',
      icon: Code,
      color: '#ff6b00',
      description: 'Build modern, responsive React web applications, business websites, and custom software systems tailored for scaling companies.',
      features: [
        'Full-Stack React & Vite Development',
        'Custom Web Applications & Software Solutions',
        'E-Commerce Storefronts & Payment Gateways',
        'API Integration & Cloud Deployment'
      ]
    },
    {
      id: '06',
      title: 'SOCIAL MEDIA & GROWTH MARKETING',
      icon: Globe,
      color: '#ff8a00',
      description: 'Build strong brand authority, grow your audience, and execute full-funnel organic and paid social media strategies.',
      features: [
        'Social Media Content Strategy & Planning',
        'Instagram & Facebook Account Growth',
        'Brand Identity & Visual Asset Design',
        'Performance Metrics & ROI Reporting'
      ]
    }
  ];

  return (
    <MotionBlurSection id="services" className="py-24 px-4 md:px-8 relative bg-[#fcf8f5] overflow-hidden">
      {/* Liquid Orange Background Metablobs */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#ff6b00]/10 rounded-full blur-[110px] animate-liquid-orange-1 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with Blurred Scroll Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <span className="text-xs font-mono text-[#ff6b00] tracking-widest uppercase mb-2 block font-semibold">
              // SERVICES & CAPABILITIES
            </span>
            <h2 className="font-antonio text-4xl sm:text-6xl md:text-7xl text-[#181310] font-bold uppercase tracking-tight">
              WHAT I CAN DO <span className="text-[#ff6b00]">FOR YOUR BUSINESS</span>
            </h2>
          </div>
          <p className="text-[#5e5249] max-w-md text-sm md:text-base font-normal leading-relaxed">
            As a Digital Marketing Specialist & Software Developer in Jaipur, I deliver full-funnel solutions from lead generation ads to custom web development.
          </p>
        </motion.div>

        {/* Interactive Accordion / Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Navigation Pills - Splash from LEFT */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {services.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === index;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(index)}
                  initial={{ opacity: 0, x: -70, rotate: -2, filter: 'blur(12px)' }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-5 rounded-2xl text-left transition-all duration-300 flex items-center justify-between border cursor-pointer splashed-motion-card ${
                    isActive
                      ? 'lucid-glass border-[#ff6b00] shadow-[0_0_30px_rgba(255,107,0,0.2)] bg-white/95 translate-x-2'
                      : 'lucid-glass bg-white/50 border-white/80 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-[#8c7d73] font-bold">{item.id}</span>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#fff8f3]" style={{ color: item.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-antonio text-lg sm:text-xl text-[#181310] tracking-wide font-bold">{item.title}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#8c7d73] transition-transform duration-300 ${isActive ? 'rotate-[-90deg] text-[#ff6b00]' : ''}`} />
                </motion.button>
              );
            })}
          </div>

          {/* Right Service Detail Card - Splash from RIGHT */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {services.map((item, index) => {
                if (activeTab !== index) return null;
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 80, rotate: 2, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -80, filter: 'blur(12px)' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="lucid-glass p-8 md:p-12 rounded-3xl border-white relative overflow-hidden h-full flex flex-col justify-between shadow-xl splashed-motion-card"
                  >
                    <div className="absolute top-0 right-0 p-8 text-9xl font-antonio font-black text-[#ff6b00]/5 select-none pointer-events-none">
                      {item.id}
                    </div>

                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-white border border-[#ff6b00]/20 flex items-center justify-center mb-6 shadow-md" style={{ color: item.color }}>
                        <Icon className="w-7 h-7" />
                      </div>

                      <h3 className="font-antonio text-3xl md:text-4xl text-[#181310] uppercase font-bold mb-4">
                        {item.title}
                      </h3>

                      <p className="text-[#5e5249] text-base md:text-lg mb-8 font-normal leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-black/5">
                      {item.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-white/80 shadow-sm"
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#ff6b00] shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-[#181310] font-semibold">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MotionBlurSection>
  );
};

export default Services;
