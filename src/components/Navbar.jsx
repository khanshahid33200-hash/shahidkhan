import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Sparkles, Phone } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services & Products', path: '/services' },
    { name: 'About & Skills', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0, filter: 'blur(10px)' }}
      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 pt-4 pb-2 transition-all duration-300 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="h-10 px-3 rounded-full lucid-glass bg-white/80 border-white flex items-center justify-center text-[#ff6b00] group-hover:border-[#ff6b00] transition-colors shadow-md">
            <img src="/LOGO.png" alt="Shahid Khan Logo" className="h-6 w-auto object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-antonio text-lg tracking-wider text-[#181310] font-bold">SHAHID KHAN</span>
            <span className="text-[10px] text-[#ff6b00] tracking-widest flex items-center gap-1 font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] inline-block animate-ping"></span>
              DIGITAL MARKETING JAIPUR
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Lucid Pill */}
        <motion.nav
          className={`hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all duration-300 ${
            scrolled ? 'lucid-nav bg-[#fcf8f5]/90 border-white shadow-xl backdrop-blur-2xl' : 'lucid-glass bg-white/60 border-white/80'
          }`}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#ff6b00] text-white shadow-md'
                    : 'text-[#5e5249] hover:text-[#181310] hover:bg-black/5'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </motion.nav>

        {/* Call CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <motion.a
            href="tel:+919587867559"
            whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(255,107,0,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 rounded-full bg-[#ff6b00] text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            +91 95878 67559
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden w-10 h-10 rounded-full lucid-glass border-white text-[#181310] flex items-center justify-center cursor-pointer shadow-md"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mt-3 max-w-7xl mx-auto rounded-3xl lucid-glass bg-white/95 border-white p-6 shadow-2xl pointer-events-auto flex flex-col gap-4"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider font-antonio transition-colors ${
                      isActive ? 'bg-[#ff6b00] text-white' : 'text-[#181310] hover:bg-black/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="pt-4 border-t border-black/10 flex flex-col gap-3">
              <a
                href="tel:+919587867559"
                className="w-full py-3.5 rounded-2xl bg-[#ff6b00] text-white font-antonio font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg"
              >
                <Phone className="w-4 h-4" />
                CALL SHAHID KHAN (+91 95878 67559)
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
