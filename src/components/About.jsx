import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, ArrowUpRight, Award, CheckSquare, Users, ExternalLink, GraduationCap, Briefcase, Code, ShieldCheck } from 'lucide-react';
import MotionBlurSection from './MotionBlurSection';

const About = ({ onOpenCertModal }) => {
  const stats = [
    { label: 'Years Experience', value: '2+ Yrs', icon: Award },
    { label: 'Completed Projects', value: '100+', icon: CheckSquare },
    { label: 'Happy Clients', value: '20+', icon: Users },
  ];

  const workHistory = [
    {
      role: 'Freelance Digital Marketing Specialist & Web Developer',
      company: 'Client Projects (Jaipur, Delhi, Nationwide)',
      period: '2023 – Present',
      points: [
        'Executed end-to-end digital marketing campaigns, Meta/Google Ads, custom React web applications, and Razorpay payment gateway integrations.',
        'Implemented AI marketing automation (n8n, ChatGPT, Claude, Antigravity) for real-time lead nurturing and CRM distribution.'
      ]
    },
    {
      role: 'Digital Marketing Associate',
      company: 'MEDIA LEVELLING (Startup)',
      period: '2023 – Present',
      points: [
        'Rebuilt & maintained agency website (media-levelling.com) with optimized UX/UI and performance analytics.',
        'Executed multi-channel paid advertising campaigns and managed automated lead channels.'
      ]
    },
    {
      role: 'Web Developer & Payment Integration Specialist',
      company: 'Shikva Foundation (New Delhi) & Day Foundation (Jabalpur)',
      period: '2024 – Present',
      points: [
        'Developed full NGO web portals (shikvafoundation.org & dayfoundation.in) with custom admin dashboards.',
        'Integrated Razorpay payment gateways for secure donor payment processing and internship registrations.'
      ]
    }
  ];

  return (
    <MotionBlurSection id="about" className="py-24 px-4 md:px-8 bg-[#f6eee8] relative overflow-hidden">
      {/* Liquid Orange Metablobs */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#ff6b00]/15 rounded-full blur-[120px] animate-liquid-orange-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Column: Creator Image Stack - Splash from LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -90, rotate: -3, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden lucid-glass border-white shadow-2xl group splashed-motion-card">
              <img
                src="/shahid_photo.png"
                alt="Shahid Khan - Digital Marketing Expert Jaipur"
                className="w-full h-[520px] object-cover filter contrast-105 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fcf8f5] via-transparent to-transparent opacity-90" />
              
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl lucid-glass bg-white/90 border-white shadow-lg">
                <span className="text-xs font-mono text-[#ff6b00] font-bold block mb-1">DIGITAL MARKETING & WEB DEVELOPER</span>
                <h4 className="font-antonio text-2xl text-[#181310] uppercase font-bold">Shahid Khan</h4>
              </div>
            </div>

            {/* Accent Glowing Backdrop */}
            <div className="absolute -bottom-6 -right-6 w-72 h-72 rounded-full bg-[#ff6b00]/20 blur-3xl -z-10 animate-pulse" />
          </motion.div>

          {/* Right Column: Bio & Statistics - Splash from RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 90, rotate: 3, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <span className="text-xs font-mono text-[#ff6b00] tracking-widest uppercase mb-3 block font-bold">
              // ABOUT SHAHID KHAN (CV DATA)
            </span>

            <h2 className="font-antonio text-4xl sm:text-6xl text-[#181310] font-bold uppercase tracking-tight mb-6">
              DRIVING GROWTH THROUGH <span className="text-[#ff6b00]">PERFORMANCE & CODE</span>
            </h2>

            <p className="text-[#5e5249] text-base md:text-lg font-normal leading-relaxed mb-6">
              Results-driven Digital Marketing Specialist and AI-driven Web Developer with extensive experience in Meta Ads, Google Ads, SEO, lead generation, paid campaign optimization, and marketing automation.
            </p>

            <p className="text-[#5e5249] text-sm md:text-base font-normal leading-relaxed mb-8">
              Skilled in building high-converting responsive websites, integrating payment gateways (Razorpay), implementing custom admin CRM dashboards, and managing full-funnel digital campaigns for businesses in Jaipur, agencies, NGOs, and retail brands.
            </p>

            {/* Certificate Highlight Banner */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="lucid-glass splashed-motion-card p-5 rounded-2xl border-white mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#181310]">Udemy Digital Marketing Certified</h4>
                  <p className="text-xs text-[#5e5249]">83.5 Hours Intensive Masterclass • UC-95eaf934</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenCertModal}
                className="px-4 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-semibold hover:bg-[#ff8a00] transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-lg"
              >
                <span>VIEW CERTIFICATE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>

            {/* Statistics Cards - Splash from BOTTOM */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 70, scale: 0.9, filter: 'blur(12px)' }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -8, scale: 1.04 }}
                    className="lucid-glass splashed-motion-card p-6 rounded-2xl border-white text-center hover:border-[#ff6b00]/50 transition-all shadow-md cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/10 text-[#ff6b00] mx-auto flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-antonio text-4xl font-extrabold text-[#181310] block mb-1">
                      {stat.value}
                    </span>
                    <span className="text-xs text-[#5e5249] tracking-wide uppercase font-semibold">
                      {stat.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Work Experience & Education Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 border-t border-black/5">
          {/* Work Experience Column */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ff6b00] text-white flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-antonio text-3xl text-[#181310] font-bold uppercase">
                PROFESSIONAL EXPERIENCE
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              {workHistory.map((work, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: isEven ? -70 : 70, filter: 'blur(12px)' }}
                    whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="lucid-glass splashed-motion-card p-6 rounded-2xl border-white bg-white/70 shadow-sm cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h4 className="font-antonio text-xl text-[#181310] font-bold">{work.role}</h4>
                      <span className="text-xs font-mono font-bold text-[#ff6b00] px-2.5 py-0.5 rounded-full bg-[#ff6b00]/10 shrink-0">{work.period}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#8c7d73] mb-4">{work.company}</p>
                    <ul className="space-y-2">
                      {work.points.map((pt, i) => (
                        <li key={i} className="text-xs text-[#5e5249] font-normal leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] inline-block mt-1.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Education & Certifications Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#181310] text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-antonio text-3xl text-[#181310] font-bold uppercase">
                EDUCATION & CREDENTIALS
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              <div className="lucid-glass p-6 rounded-2xl border-white bg-white/70 shadow-sm">
                <span className="text-[10px] font-mono font-bold text-[#ff6b00] block mb-1">DEGREE 01</span>
                <h4 className="font-antonio text-lg text-[#181310] font-bold">B.Sc. B.Ed. (PCM - Physics, Chemistry, Math)</h4>
                <p className="text-xs text-[#5e5249] mb-1 font-semibold">University of Rajasthan, Jaipur (2019 – 2023)</p>
                <span className="inline-block text-xs font-bold text-[#ff6b00] px-2 py-0.5 rounded bg-[#ff6b00]/10">Score: 70.28%</span>
              </div>

              <div className="lucid-glass p-6 rounded-2xl border-white bg-white/70 shadow-sm">
                <span className="text-[10px] font-mono font-bold text-[#ff6b00] block mb-1">DEGREE 02</span>
                <h4 className="font-antonio text-lg text-[#181310] font-bold">M.Sc. Mathematics</h4>
                <p className="text-xs text-[#5e5249] font-semibold">Vardhaman Mahaveer Open University (VMOU), Kota (Pursuing)</p>
              </div>

              <div className="lucid-glass p-6 rounded-2xl border-white bg-white/70 shadow-sm">
                <span className="text-[10px] font-mono font-bold text-[#ff6b00] block mb-2">OTHER CERTIFICATIONS</span>
                <div className="space-y-2 text-xs font-semibold text-[#181310]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#ff6b00]" />
                    <span>RSCIT (Basic Computer Course - VMOU Kota)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#ff6b00]" />
                    <span>Tally ERP (Business Accounting & Inventory)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionBlurSection>
  );
};

export default About;
