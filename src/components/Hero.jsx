import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Sparkles, Target, BarChart3, Code, Award } from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, filter: 'blur(14px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 px-4 md:px-8 flex items-center justify-center overflow-hidden gradient-bg-light-hero">
      {/* User Photo Background Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 md:opacity-30 pointer-events-none mix-blend-multiply filter contrast-110 saturate-105"
        style={{ backgroundImage: `url('/shahid_photo.png')` }}
      />

      {/* Radial & Linear Gradient Overlay for Pristine Text Readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#fcf8f5]/85 via-[#fcf8f5]/70 to-[#fcf8f5]/90 pointer-events-none" />

      {/* Liquid Blurred Orange Background Metablobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff6b00]/15 rounded-full blur-[60px] animate-liquid-orange-1 pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#ff8a00]/10 rounded-full blur-[70px] animate-liquid-orange-2 pointer-events-none z-0" />

      {/* Hero Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto text-center flex flex-col items-center"
      >
        {/* Status Tag Pill */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full lucid-glass text-xs font-semibold text-[#ff6b00] mb-8 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#ff6b00] inline-block animate-ping"></span>
          <span>Hi 👋 I'm Shahid Khan — Jaipur, Rajasthan</span>
        </motion.div>

        {/* Large Antonio Display Headline */}
        <motion.h1 variants={itemVariants} className="font-antonio text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-extrabold tracking-tight text-[#181310] leading-none mb-6 uppercase">
          SHAHID <span className="gradient-text-orange">KHAN</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p variants={itemVariants} className="font-antonio text-xl sm:text-3xl md:text-4xl text-[#ff6b00] tracking-wide uppercase font-bold mb-8">
          DIGITAL MARKETING AGENCY JAIPUR // META & GOOGLE ADS EXPERT
        </motion.p>

        {/* Creator Avatar & Role Subtitle */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5 mb-10 max-w-3xl mx-auto">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#ff6b00] shadow-[0_0_35px_rgba(255,107,0,0.35)] shrink-0">
            <img
              src="/shahid_photo.png"
              alt="Shahid Khan - Digital Marketing Expert Jaipur"
              className="w-full h-full object-cover"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <p className="text-base sm:text-lg text-[#5e5249] font-normal leading-relaxed text-center sm:text-left">
            Helping businesses generate high-intent leads, scale ROAS, and dominate search rankings through Meta Ads, Google Ads, SEO, High-Converting Landing Pages, and Custom Software Development.
          </p>
        </motion.div>

        {/* CTA Button Group */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.06, boxShadow: "0 0 35px rgba(255,107,0,0.45)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-[#ff6b00] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(255,107,0,0.35)] cursor-pointer"
          >
            VIEW CASE STUDIES
            <ArrowUpRight className="w-5 h-5" />
          </motion.a>
          <motion.a
            href="https://wa.me/919587867559?text=Hi%20Shahid%20I%20want%20to%20discuss%20a%20digital%20marketing%20project"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06, borderColor: "#ff6b00", color: "#ff6b00" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full lucid-glass text-[#181310] font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer shadow-md"
          >
            CHAT ON WHATSAPP
          </motion.a>
        </motion.div>

        {/* Floating Feature Badges with Directional Splashed Motion & Lucid Glass */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {/* Card 1: Appears from LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -90, rotate: -4, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.08, rotate: [-1, 2, -1, 0], boxShadow: "0 25px 45px rgba(255,107,0,0.35)", y: -8 }}
            whileTap={{ scale: 0.95 }}
            className="lucid-glass splashed-motion-card p-4 rounded-2xl flex items-center gap-3 border-white/90 shadow-lg cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center shrink-0 shadow-inner">
              <Target className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left relative z-10">
              <span className="block text-[10px] font-mono text-[#8c7d73] uppercase font-bold">SPECIALTY</span>
              <span className="text-xs font-extrabold text-[#181310] font-antonio tracking-wide">Meta & Google Ads</span>
            </div>
          </motion.div>

          {/* Card 2: Appears from RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 90, rotate: 4, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.08, rotate: [1, -2, 1, 0], boxShadow: "0 25px 45px rgba(255,138,0,0.35)", y: -8 }}
            whileTap={{ scale: 0.95 }}
            className="lucid-glass splashed-motion-card p-4 rounded-2xl flex items-center gap-3 border-white/90 shadow-lg cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ff8a00]/15 text-[#ff8a00] flex items-center justify-center shrink-0 shadow-inner">
              <BarChart3 className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left relative z-10">
              <span className="block text-[10px] font-mono text-[#8c7d73] uppercase font-bold">PERFORMANCE</span>
              <span className="text-xs font-extrabold text-[#181310] font-antonio tracking-wide">200%+ ROAS Scale</span>
            </div>
          </motion.div>

          {/* Card 3: Appears from BOTTOM */}
          <motion.div
            initial={{ opacity: 0, y: 90, scale: 0.9, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.08, rotate: [-1, 2, -1, 0], boxShadow: "0 25px 45px rgba(255,107,0,0.35)", y: -8 }}
            whileTap={{ scale: 0.95 }}
            className="lucid-glass splashed-motion-card p-4 rounded-2xl flex items-center gap-3 border-white/90 shadow-lg cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center shrink-0 shadow-inner">
              <Code className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left relative z-10">
              <span className="block text-[10px] font-mono text-[#8c7d73] uppercase font-bold">DEVELOPMENT</span>
              <span className="text-xs font-extrabold text-[#181310] font-antonio tracking-wide">Funnels & React Apps</span>
            </div>
          </motion.div>

          {/* Card 4: Appears from TOP/RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 70, y: -40, rotate: -3, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.08, rotate: [1, -2, 1, 0], boxShadow: "0 25px 45px rgba(255,138,0,0.35)", y: -8 }}
            whileTap={{ scale: 0.95 }}
            className="lucid-glass splashed-motion-card p-4 rounded-2xl flex items-center gap-3 border-white/90 shadow-lg cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ff8a00]/15 text-[#ff8a00] flex items-center justify-center shrink-0 shadow-inner">
              <Award className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left relative z-10">
              <span className="block text-[10px] font-mono text-[#8c7d73] uppercase font-bold">CERTIFIED</span>
              <span className="text-xs font-extrabold text-[#181310] font-antonio tracking-wide">Udemy Digital Marketer</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.a variants={itemVariants} href="#services" className="mt-16 text-[#8c7d73] hover:text-[#ff6b00] transition-colors flex flex-col items-center gap-2 relative z-20">
          <span className="text-[10px] tracking-widest uppercase font-mono font-semibold">SCROLL DOWN</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-[#ff6b00]" />
        </motion.a>
      </motion.div>

      {/* Smooth Faded Curved Bottom Edge Divider (White Color) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-10">
        {/* Soft Ambient White Glow Behind Curve */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-28 bg-gradient-to-t from-white via-white/80 to-transparent blur-xl pointer-events-none" />

        <svg
          className="relative block w-full h-20 sm:h-28 md:h-36 drop-shadow-[0_-6px_20px_rgba(255,255,255,0.8)]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="hero-white-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="75%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
            </linearGradient>

            {/* Bottom-to-Top White Gradient: Solid White at Bottom (100%), Light Faded White at Top (0%) */}
            <linearGradient id="hero-white-fill-grad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Curved Base Fill Layer with Faded White Gradient */}
          <path
            d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"
            fill="url(#hero-white-fill-grad)"
          />

          {/* Faded White Top Curved Edge Line */}
          <path
            d="M0,0 C300,90 900,90 1200,0"
            fill="none"
            stroke="url(#hero-white-stroke-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
