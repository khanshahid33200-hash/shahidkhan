import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import MotionBlurSection from './MotionBlurSection';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Meta Ads & Lead Generation',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', service: 'Meta Ads & Lead Generation', message: '' });
    }, 4000);
  };

  return (
    <MotionBlurSection id="contact" className="py-24 px-4 md:px-8 bg-[#fcf8f5] relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#ff6b00]/10 blur-[150px] animate-liquid-orange-1 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Heading & Direct Contacts - Splash from LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -80, rotate: -3, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full lucid-glass border-white text-xs font-bold text-[#ff6b00] mb-6 shadow-md">
                <Sparkles className="w-4 h-4" />
                <span>LET'S GROW YOUR BUSINESS</span>
              </div>

              <h2 className="font-antonio text-5xl sm:text-7xl text-[#181310] font-extrabold uppercase tracking-tight mb-6 leading-none">
                LET'S WORK <br />
                <span className="text-[#ff6b00]">TOGETHER</span>
              </h2>

              <p className="text-[#5e5249] text-base md:text-lg font-normal leading-relaxed mb-10">
                Ready to scale your leads, optimize ad campaigns, or build a high-converting web platform? Get in touch today for a free marketing audit.
              </p>
            </div>

            {/* Direct Information Pills */}
            <div className="flex flex-col gap-4 pt-6 border-t border-black/5">
              <motion.a
                whileHover={{ x: 6, scale: 1.02 }}
                href="tel:+919587867559"
                className="lucid-glass splashed-motion-card p-4 rounded-2xl border-white flex items-center gap-4 hover:border-[#ff6b00] transition-all group shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/10 text-[#ff6b00] flex items-center justify-center group-hover:bg-[#ff6b00] group-hover:text-white transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-[#8c7d73] uppercase font-bold">DIRECT PHONE / CALL</span>
                  <span className="text-base font-bold text-[#181310]">+91 95878 67559</span>
                </div>
              </motion.a>

              <motion.a
                whileHover={{ x: 6, scale: 1.02 }}
                href="mailto:contact@shahidkhan.site"
                className="lucid-glass splashed-motion-card p-4 rounded-2xl border-white flex items-center gap-4 hover:border-[#ff6b00] transition-all group shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ff8a00]/10 text-[#ff8a00] flex items-center justify-center group-hover:bg-[#ff8a00] group-hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-[#8c7d73] uppercase font-bold">EMAIL ADDRESS</span>
                  <span className="text-base font-bold text-[#181310]">contact@shahidkhan.site</span>
                </div>
              </motion.a>

              <motion.a
                whileHover={{ x: 6, scale: 1.02 }}
                href="https://wa.me/919587867559?text=Hi%20Shahid%20I%20want%20to%20discuss%20my%20digital%20marketing"
                target="_blank"
                rel="noopener noreferrer"
                className="lucid-glass splashed-motion-card p-4 rounded-2xl border-white flex items-center gap-4 hover:border-[#25D366] transition-all group shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-[#8c7d73] uppercase font-bold">WHATSAPP CHAT</span>
                  <span className="text-base font-bold text-[#181310]">Chat Immediately (+91 95878 67559)</span>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: Contact Form - Splash from RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 80, rotate: 2, filter: 'blur(14px)' }}
            whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="lucid-glass splashed-motion-card p-8 md:p-12 rounded-3xl border-white bg-white/80 relative shadow-2xl">
              {submitted ? (
                <div className="py-16 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-antonio text-3xl text-[#181310] font-bold uppercase mb-2">INQUIRY RECEIVED!</h3>
                  <p className="text-[#5e5249] max-w-sm">Thank you, {formData.name || 'Friend'}. Shahid Khan will contact you directly within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="block text-xs font-mono text-[#8c7d73] uppercase tracking-wider mb-2 font-bold">
                      YOUR FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl bg-white/90 border border-black/10 text-[#181310] placeholder-[#8c7d73] focus:outline-none focus:border-[#ff6b00] transition-colors shadow-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-[#8c7d73] uppercase tracking-wider mb-2 font-bold">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rahul@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl bg-white/90 border border-black/10 text-[#181310] placeholder-[#8c7d73] focus:outline-none focus:border-[#ff6b00] transition-colors shadow-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#8c7d73] uppercase tracking-wider mb-2 font-bold">
                        PHONE NUMBER *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98290 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl bg-white/90 border border-black/10 text-[#181310] placeholder-[#8c7d73] focus:outline-none focus:border-[#ff6b00] transition-colors shadow-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#8c7d73] uppercase tracking-wider mb-2 font-bold">
                      SERVICE NEEDED ?
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl bg-white/90 border border-black/10 text-[#181310] focus:outline-none focus:border-[#ff6b00] transition-colors shadow-sm font-semibold"
                    >
                      <option value="Meta Ads & Lead Generation">Meta Ads (Facebook & Instagram Lead Gen)</option>
                      <option value="Google Ads & PPC">Google Ads (Search & Performance Max)</option>
                      <option value="SEO & Local Search">SEO & Local Business Rank #1 in Jaipur</option>
                      <option value="Landing Page Design">High-Converting Landing Page Design</option>
                      <option value="Website & Software Dev">Website & Custom Software Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#8c7d73] uppercase tracking-wider mb-2 font-bold">
                      PROJECT DETAILS OR GOALS *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your business, current monthly ad spend, or target lead goals..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl bg-white/90 border border-black/10 text-[#181310] placeholder-[#8c7d73] focus:outline-none focus:border-[#ff6b00] transition-colors resize-none shadow-sm font-medium"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 35px rgba(255,107,0,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-5 rounded-xl bg-[#ff6b00] text-white font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-3 hover:bg-[#ff8a00] transition-all shadow-[0_0_30px_rgba(255,107,0,0.35)] mt-2 cursor-pointer font-bold"
                  >
                    SUBMIT PROJECT INQUIRY
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionBlurSection>
  );
};

export default Contact;
