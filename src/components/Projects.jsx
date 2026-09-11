import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Sparkles, ChevronLeft, ChevronRight, Globe, ShieldCheck } from 'lucide-react';
import MotionBlurSection from './MotionBlurSection';

const Projects = () => {
  const [filter, setFilter] = useState('ALL');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const projectList = [
    {
      id: 1,
      title: 'MEDIA LEVELLING AGENCY PLATFORM',
      client: 'Media Levelling (Startup)',
      category: 'Web Development',
      tag: 'WEB DEV & PAID ADS',
      link: 'https://media-levelling.com',
      image: 'https://framerusercontent.com/images/w08JBQPFYIq2vr4OfcD9W6vxEug.jpeg',
      accent: '#ff6b00'
    },
    {
      id: 2,
      title: 'MEDTECH FIXATERS — SMART OPD & EMR',
      client: 'Shahid Khan (Own Product)',
      category: 'My Products & SaaS',
      tag: 'FLAGSHIP HEALTHCARE SAAS',
      link: 'https://medtechfixaters.in',
      image: 'https://framerusercontent.com/images/qbjsnnvP9w7UaA2syp36oUe8OSo.jpg',
      accent: '#ff6b00'
    },
    {
      id: 3,
      title: 'TECHLEV ANALYST — FINANCIAL RATIO AI',
      client: 'Shahid Khan (Own Product)',
      category: 'My Products & SaaS',
      tag: 'FINANCIAL EDTECH PLATFORM',
      link: 'https://techlev.eu',
      image: 'https://framerusercontent.com/images/w08JBQPFYIq2vr4OfcD9W6vxEug.jpeg',
      accent: '#ff8a00'
    },
    {
      id: 4,
      title: 'SHREE JAGDAMBA FURNITURE WEBSITE & CRM',
      client: 'Shree Jagdamba Furniture, Jaipur',
      category: 'Local Business SEO',
      tag: 'E-COMMERCE & CRM',
      link: 'https://shahidkhan.site',
      image: 'https://framerusercontent.com/images/qbjsnnvP9w7UaA2syp36oUe8OSo.jpg',
      accent: '#ff8a00'
    },
    {
      id: 5,
      title: 'SHIKVA FOUNDATION NGO WEB PORTAL',
      client: 'Shikva Foundation, New Delhi',
      category: 'NGO & Payments',
      tag: 'NGO PORTAL & RAZORPAY',
      link: 'https://shikvafoundation.org',
      image: 'https://framerusercontent.com/images/nTU7b0ZAdWdlqCI4mQ4tGTPpDs.jpeg',
      accent: '#ff6b00'
    },
    {
      id: 6,
      title: 'DAY FOUNDATION NGO & VOLUNTEER SYSTEM',
      client: 'Day Foundation, Jabalpur',
      category: 'NGO & Payments',
      tag: 'VOLUNTEER CRM & RAZORPAY',
      link: 'https://dayfoundation.in',
      image: 'https://framerusercontent.com/images/2nWXrWvPxxMHSpsOkNYf8KjzP7Q.jpeg',
      accent: '#ff8a00'
    },
    {
      id: 7,
      title: 'RADHEY KRISHNA SPORTS SHOWROOM',
      client: 'Radhey Krishna Sports Shop, Jaipur',
      category: 'Paid Ads & Lead Gen',
      tag: 'HYPER-LOCAL META ADS',
      link: 'https://shahidkhan.site',
      image: 'https://framerusercontent.com/images/1wFj19qQG6zNr7gj3iTlH0Gdlu8.jpeg',
      accent: '#ff6b00'
    },
    {
      id: 8,
      title: 'REACT LANDING PAGE & N8N AUTOMATION',
      client: 'Growth Clients & E-Commerce Brands',
      category: 'Paid Ads & Lead Gen',
      tag: 'N8N WHATSAPP AUTOMATION',
      link: 'https://shahidkhan.site',
      image: 'https://framerusercontent.com/images/xmKml0E7v2iBI4zbbj0yVccaQwg.jpeg',
      accent: '#ff8a00'
    }
  ];

  const categories = ['ALL', 'My Products & SaaS', 'Web Development', 'Paid Ads & Lead Gen', 'NGO & Payments', 'Local Business SEO'];

  const filteredProjects = filter === 'ALL'
    ? projectList
    : projectList.filter(p => p.category === filter);

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [filter]);

  // Automatic side scroll timer (smooth slide every 3.5s)
  useEffect(() => {
    if (isPaused || filteredProjects.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredProjects.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, filteredProjects.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  return (
    <MotionBlurSection id="projects" className="py-24 px-4 md:px-8 bg-[#fcf8f5] relative overflow-hidden">
      {/* Background Liquid Orange Metablobs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#ff6b00]/10 rounded-full blur-[130px] animate-liquid-orange-1 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff8a00]/10 rounded-full blur-[130px] animate-liquid-orange-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="text-xs font-mono text-[#ff6b00] tracking-widest uppercase mb-2 block font-bold">
              // DEPTH-BLUR 3D CAROUSEL PORTFOLIO
            </span>
            <h2 className="font-antonio text-4xl sm:text-6xl text-[#181310] font-bold uppercase tracking-tight">
              FEATURED <span className="text-[#ff6b00]">CASE STUDIES</span>
            </h2>
          </div>
          <p className="text-[#5e5249] max-w-md text-sm md:text-base font-normal">
            Swipe or scroll through Shahid Khan's square portfolio cards in centered 3D depth-blur focus.
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                filter === cat
                  ? 'bg-[#ff6b00] text-white shadow-[0_0_25px_rgba(255,107,0,0.4)] font-bold'
                  : 'lucid-glass text-[#5e5249] border-white hover:text-[#181310]'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* FRAMER DEPTH-BLUR CAROUSEL CONTAINER */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center overflow-hidden py-8 px-4"
        >
          <div className="relative w-full max-w-5xl h-[380px] sm:h-[440px] flex items-center justify-center">
            <AnimatePresence initial={false}>
              {filteredProjects.map((project, index) => {
                const offset = index - activeIndex;
                const absOffset = Math.abs(offset);

                // Hide cards further than 2 positions away
                if (absOffset > 2) return null;

                // Calculate 3D Depth Blur Carousel transform parameters
                let xPosition = 0;
                let scale = 1;
                let opacity = 1;
                let blurAmount = 0;
                let rotateY = 0;
                let zIndex = 30;

                if (offset === 0) {
                  // CENTERED MAIN CARD IN FOCUS
                  xPosition = 0;
                  scale = 1;
                  opacity = 1;
                  blurAmount = 0;
                  rotateY = 0;
                  zIndex = 30;
                } else if (offset === -1) {
                  // LEFT SIDE CARD 1 - TIGHT OVERLAP
                  xPosition = -150;
                  scale = 0.88;
                  opacity = 0.8;
                  blurAmount = 6;
                  rotateY = 0;
                  zIndex = 20;
                } else if (offset === 1) {
                  // RIGHT SIDE CARD 1 - TIGHT OVERLAP
                  xPosition = 150;
                  scale = 0.88;
                  opacity = 0.8;
                  blurAmount = 6;
                  rotateY = 0;
                  zIndex = 20;
                } else if (offset === -2) {
                  // FAR LEFT CARD 2 - CLOSE OVERLAP
                  xPosition = -260;
                  scale = 0.76;
                  opacity = 0.45;
                  blurAmount = 14;
                  rotateY = 0;
                  zIndex = 10;
                } else if (offset === 2) {
                  // FAR RIGHT CARD 2 - CLOSE OVERLAP
                  xPosition = 260;
                  scale = 0.76;
                  opacity = 0.45;
                  blurAmount = 14;
                  rotateY = 0;
                  zIndex = 10;
                }

                // Tight spacing adjustment for mobile screens
                if (typeof window !== 'undefined' && window.innerWidth < 640) {
                  if (offset === -1) xPosition = -85;
                  if (offset === 1) xPosition = 85;
                  if (offset === -2) xPosition = -160;
                  if (offset === 2) xPosition = 160;
                }

                const isMain = offset === 0;

                return (
                  <motion.div
                    key={project.id}
                    onClick={() => setActiveIndex(index)}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{
                      x: xPosition,
                      scale: scale,
                      opacity: opacity,
                      rotateY: 0,
                      zIndex: zIndex,
                      filter: `blur(${blurAmount}px)`
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={isMain ? { scale: 1.03, y: -4 } : { scale: scale * 1.03 }}
                    className={`absolute rounded-2xl overflow-hidden lucid-glass border-white shadow-2xl cursor-pointer group flex flex-col justify-between p-5 sm:p-6 bg-[#181310] ${
                      isMain ? 'ring-2 ring-[#ff6b00]/60 shadow-[0_20px_50px_rgba(255,107,0,0.35)]' : ''
                    }`}
                    style={{
                      width: 'clamp(270px, 80vw, 360px)',
                      height: 'clamp(270px, 80vw, 360px)',
                      aspectRatio: '1 / 1',
                      minWidth: 'clamp(270px, 80vw, 360px)',
                      minHeight: 'clamp(270px, 80vw, 360px)',
                      maxWidth: 'clamp(270px, 80vw, 360px)',
                      maxHeight: 'clamp(270px, 80vw, 360px)'
                    }}
                  >
                    {/* Full Background Square Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />

                    {/* Dark/Liquid Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181310] via-[#181310]/50 to-transparent pointer-events-none" />

                    {/* Minimal Top Tag Badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#181310]/80 text-[#ff6b00] border border-[#ff6b00]/30 backdrop-blur-md">
                        {project.tag}
                      </span>
                      {isMain && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b00] animate-ping" />
                      )}
                    </div>

                    {/* Minimal Bottom Content: Title & Direct Link */}
                    <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-white/70 block uppercase">{project.client}</span>
                        <h3 className="font-antonio text-xl sm:text-2xl text-white font-extrabold uppercase leading-tight tracking-wide">
                          {project.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-bold font-antonio tracking-wider uppercase hover:bg-white hover:text-[#181310] transition-colors shadow-lg"
                        >
                          <span>VISIT SITE</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>

                        <span className="text-[10px] font-mono text-white/60">
                          0{index + 1} / 0{filteredProjects.length}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Left / Right Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-40 w-12 h-12 rounded-full lucid-glass bg-white/90 border-white text-[#181310] hover:text-[#ff6b00] flex items-center justify-center shadow-xl hover:scale-110 transition-all cursor-pointer"
            aria-label="Previous Project"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-40 w-12 h-12 rounded-full lucid-glass bg-white/90 border-white text-[#181310] hover:text-[#ff6b00] flex items-center justify-center shadow-xl hover:scale-110 transition-all cursor-pointer"
            aria-label="Next Project"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Carousel Progress Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {filteredProjects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i
                  ? 'w-8 bg-[#ff6b00] shadow-[0_0_15px_rgba(255,107,0,0.5)]'
                  : 'w-2.5 bg-black/20 hover:bg-black/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </MotionBlurSection>
  );
};

export default Projects;
