import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUp, Sparkles, Globe, Share2, MessageCircle, Send, Code2, Phone, Mail } from 'lucide-react';

const Footer = ({ onOpenLegalModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f6eee8] border-t border-white/80 py-16 px-4 md:px-8 text-[#5e5249] relative overflow-hidden">
      {/* Liquid Orange Glow Accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#ff6b00]/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
        {/* Top Row: Brand & Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-10 px-3 rounded-full lucid-glass border-white flex items-center justify-center text-[#ff6b00] shadow-sm">
              <img src="/LOGO.png" alt="Shahid Khan Logo" className="h-6 w-auto object-contain" />
            </div>
            <div>
              <span className="font-antonio text-2xl tracking-wider text-[#181310] font-bold block">SHAHID KHAN</span>
              <span className="text-[10px] text-[#ff6b00] tracking-widest uppercase font-mono font-bold">BEST DIGITAL MARKETING AGENCY JAIPUR</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold">
            <Link to="/" className="hover:text-[#ff6b00] transition-colors">Home</Link>
            <Link to="/services" className="hover:text-[#ff6b00] transition-colors">Services & Products</Link>
            <Link to="/about" className="hover:text-[#ff6b00] transition-colors">About & Skills</Link>
            <Link to="/portfolio" className="hover:text-[#ff6b00] transition-colors">Portfolio</Link>
            <Link to="/contact" className="hover:text-[#ff6b00] transition-colors">Contact</Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <motion.a
              whileHover={{ y: -3, scale: 1.1 }}
              href="https://wa.me/919587867559"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full lucid-glass border-white flex items-center justify-center hover:border-[#25D366] hover:text-[#25D366] transition-colors shadow-sm"
              title="WhatsApp Direct"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ y: -3, scale: 1.1 }}
              href="mailto:khanshahid33200@gmail.com"
              className="w-10 h-10 rounded-full lucid-glass border-white flex items-center justify-center hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors shadow-sm"
              title="Email Shahid Khan"
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          </div>
        </div>

        {/* Middle Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        {/* Bottom Row: Copyright & Legal */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
          <p>© {new Date().getFullYear()} Shahid Khan. All rights reserved. Jaipur, Rajasthan, India.</p>
          
          <div className="flex items-center gap-6 font-semibold">
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="hover:text-[#ff6b00] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegalModal('terms')}
              className="hover:text-[#ff6b00] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full lucid-glass border-white flex items-center justify-center text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white transition-all shadow-sm"
              title="Scroll to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
