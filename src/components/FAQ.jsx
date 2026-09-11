import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import MotionBlurSection from './MotionBlurSection';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      id: '01',
      question: 'WHAT DIGITAL MARKETING SERVICES DO YOU SPECIALIZE IN?',
      answer: 'I specialize in Meta Ads (Facebook & Instagram), Google Ads (Search, PMax, Display), Local SEO & Google Business Profile Optimization in Jaipur, High-Converting Landing Page Design, n8n WhatsApp Lead Automation, and Custom Software & Web Development.'
    },
    {
      id: '02',
      question: 'HOW DO META ADS & GOOGLE ADS GENERATE LEADS FOR MY BUSINESS?',
      answer: 'We target your exact customer demographics and high-intent search terms across Meta and Google, directing prospects to a mobile-optimized landing page equipped with Meta Pixel & CAPI tracking to capture verified contact details.'
    },
    {
      id: '03',
      question: 'CAN YOU DESIGN AND DEVELOP LANDING PAGES FOR MY ADS?',
      answer: 'Yes! A successful ad campaign requires a high-converting landing page. I build fast, responsive landing pages in React / Vite with zero lag, custom CTA forms, and direct CRM / WhatsApp lead notification setup.'
    },
    {
      id: '04',
      question: 'HOW SOON CAN WE LAUNCH A MARKETING CAMPAIGN IN JAIPUR?',
      answer: 'Most ad campaigns can be launched within 3 to 5 business days! This includes audience research, ad copy creation, landing page build, Meta Pixel / GA4 verification, and budget testing.'
    },
    {
      id: '05',
      question: 'DO YOU WORK WITH LOCAL RETAIL & SERVICE BUSINESSES IN JAIPUR?',
      answer: 'Absolutely! I have managed performance marketing, Local SEO, and lead funnels for real estate firms, healthcare clinics, retail stores, growth agencies, and startups across Jaipur, Rajasthan, and nationwide.'
    },
    {
      id: '06',
      question: 'HOW DO I GET STARTED AND GET A FREE AUDIT?',
      answer: 'Simply call or WhatsApp me directly at +91 95878 67559 or submit an inquiry through the form below. I will provide a complimentary audit of your current ad campaigns, landing page, or SEO rank!'
    }
  ];

  return (
    <MotionBlurSection id="faq" className="py-24 px-4 md:px-8 bg-[#fcf8f5] relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-[#ff6b00] tracking-widest uppercase mb-2 block font-semibold">
            // FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="font-antonio text-4xl sm:text-6xl text-[#181310] font-bold uppercase tracking-tight mb-4">
            GOT QUESTIONS? <span className="text-[#ff6b00]">WE HAVE ANSWERS</span>
          </h2>
          <p className="text-[#5e5249] max-w-lg mx-auto text-sm md:text-base font-normal">
            Answers to common questions about Meta Ads, Google Ads, SEO, Landing Page design, and timeline in Jaipur.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, x: isEven ? -70 : 70, rotate: isEven ? -1.5 : 1.5, filter: 'blur(12px)' }}
                whileInView={{ opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.01, y: -2 }}
                className={`lucid-glass splashed-motion-card rounded-2xl border transition-all duration-300 ${
                  isOpen ? 'bg-white/95 border-[#ff6b00]/60 shadow-[0_0_25px_rgba(255,107,0,0.15)]' : 'bg-white/60 border-white hover:border-[#ff6b00]/30'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-[#ff6b00] font-bold">{faq.id}.</span>
                    <h3 className="font-antonio text-lg md:text-2xl text-[#181310] uppercase font-bold tracking-wide">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 shrink-0 ${
                    isOpen ? 'bg-[#ff6b00] text-white rotate-180' : 'bg-white text-[#8c7d73] border border-black/10'
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 text-[#5e5249] text-sm md:text-base font-normal leading-relaxed border-t border-black/5 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MotionBlurSection>
  );
};

export default FAQ;
