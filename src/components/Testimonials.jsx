import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, TrendingUp, HeartHandshake } from 'lucide-react';
import MotionBlurSection from './MotionBlurSection';

const Testimonials = () => {
  const reviews = [
    {
      id: 1,
      quote: "Shahid completely restructured our Meta Ads campaign for our Jaipur store. Within 3 weeks our lead volume doubled while Cost Per Lead dropped by 40%!",
      name: "Rajesh Sharma",
      role: "Business Owner, Jaipur",
      avatar: "https://framerusercontent.com/images/xPotMb4VrNT5rTGtXQvpYqXunU.jpg?width=400&height=400",
      rating: 5
    },
    {
      id: 2,
      quote: "The custom landing page Shahid built loaded instantly on mobile and doubled our Google Ads conversion rate. Best digital marketer in Jaipur hands down.",
      name: "Vikram Rathore",
      role: "Real Estate Director",
      avatar: "https://framerusercontent.com/images/hleE21gbHw2Y29KULoer3tF8.jpg?width=400&height=400",
      rating: 5
    },
    {
      id: 3,
      quote: "His technical SEO and Google Maps optimization brought us to the #1 spot in Jaipur for our main keywords. Organic phone call inquiries jumped 300%.",
      name: "Dr. Ananya Mehta",
      role: "Clinic Founder",
      avatar: "https://framerusercontent.com/images/RTNUbNmEH3Lg1VzA3NOYHdp3bHQ.jpg?width=400&height=400",
      rating: 5
    },
    {
      id: 4,
      quote: "Shahid built our React web app and integrated automated WhatsApp lead alerts. Super fast delivery and extremely professional communication.",
      name: "Siddharth Verma",
      role: "E-Commerce Founder",
      avatar: "https://framerusercontent.com/images/ZbUvwGb7xhhwmovo3t9YO4bAIGs.jpg?width=400&height=400",
      rating: 5
    }
  ];

  return (
    <MotionBlurSection id="reviews" className="py-24 px-4 md:px-8 bg-[#f6eee8] relative overflow-hidden">
      {/* Background Liquid Orange Metablobs */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#ff6b00]/15 rounded-full blur-[130px] animate-liquid-orange-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <span className="text-xs font-mono text-[#ff6b00] tracking-widest uppercase mb-2 block font-semibold">
              // CLIENT TESTIMONIALS
            </span>
            <h2 className="font-antonio text-4xl sm:text-6xl text-[#181310] font-bold uppercase tracking-tight">
              WHAT MY CLIENTS <span className="text-[#ff6b00]">SAY</span>
            </h2>
          </div>
          <p className="text-[#5e5249] max-w-md text-sm md:text-base font-normal">
            Read how Shahid Khan helps local retail businesses, real estate firms, and e-commerce brands scale in Jaipur and across India.
          </p>
        </motion.div>

        {/* Metrics Banner - Directional Splashed Motion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -80, rotate: -3, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.03 }}
            className="lucid-glass splashed-motion-card p-8 rounded-3xl border-white flex items-center gap-6 shadow-md cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ff6b00]/10 text-[#ff6b00] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <span className="font-antonio text-4xl font-extrabold text-[#181310] block">20+</span>
              <span className="text-xs text-[#5e5249] tracking-wide uppercase font-semibold">Happy Clients Served</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.92, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.03 }}
            className="lucid-glass splashed-motion-card p-8 rounded-3xl border-white flex items-center gap-6 shadow-md cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ff8a00]/10 text-[#ff8a00] flex items-center justify-center shrink-0">
              <Star className="w-7 h-7 fill-[#ff8a00]" />
            </div>
            <div>
              <span className="font-antonio text-4xl font-extrabold text-[#181310] block">99%</span>
              <span className="text-xs text-[#5e5249] tracking-wide uppercase font-semibold">Client Retention Rate</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80, rotate: 3, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.03 }}
            className="lucid-glass splashed-motion-card p-8 rounded-3xl border-white flex items-center gap-6 shadow-md cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ff6b00]/10 text-[#ff6b00] flex items-center justify-center shrink-0">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <span className="font-antonio text-4xl font-extrabold text-[#181310] block">200%+</span>
              <span className="text-xs text-[#5e5249] tracking-wide uppercase font-semibold">Average ROAS & Lead Scale</span>
            </div>
          </motion.div>
        </div>

        {/* Review Cards Grid - Directional Splash */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, x: isEven ? -80 : 80, rotate: isEven ? -2 : 2, filter: 'blur(12px)' }}
                whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.7, delay: (index % 2) * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="lucid-glass splashed-motion-card p-8 rounded-3xl border-white flex flex-col justify-between hover:border-[#ff6b00]/50 transition-all shadow-xl cursor-pointer"
              >
                <div>
                  {/* Rating & Quote Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#ff6b00] fill-[#ff6b00]" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-[#ff6b00]/30" />
                  </div>

                  <p className="text-[#181310] text-base md:text-lg font-normal leading-relaxed mb-8 italic">
                    "{rev.quote}"
                  </p>
                </div>

                {/* Reviewer Profile */}
                <div className="flex items-center gap-4 pt-6 border-t border-black/5">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
                  />
                  <div>
                    <h4 className="font-antonio text-lg text-[#181310] font-bold tracking-wide uppercase">{rev.name}</h4>
                    <span className="text-xs text-[#5e5249] font-medium">{rev.role}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MotionBlurSection>
  );
};

export default Testimonials;
