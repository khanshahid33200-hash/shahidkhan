import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ExternalLink, Download } from 'lucide-react';

const CertificateModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] lucid-glass bg-[#fcf8f5]/95 border-white rounded-3xl p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/15 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff6b00]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-antonio font-bold text-lg sm:text-xl text-[#181310] tracking-wide uppercase">
                    Udemy Digital Marketing Certificate
                  </h3>
                  <p className="text-xs text-[#5e5249]">Shahid Khan • Aug 4, 2026 • 83.5 Total Hours Masterclass</p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full border border-black/10 text-[#181310] hover:bg-black/5 cursor-pointer transition-colors"
                aria-label="Close Certificate Modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Certificate Image View */}
            <div className="rounded-2xl overflow-hidden border border-black/10 shadow-lg bg-white mb-6">
              <img 
                src="/udemy_digital_marketing_certificate.png" 
                alt="Udemy Digital Marketing Certificate - Shahid Khan" 
                className="w-full h-auto object-contain max-h-[60vh]"
              />
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/5">
              <div className="text-xs text-[#8c7d73] font-mono font-bold">
                VERIFICATION ID: UC-95eaf934-2a3e-452a-b9e1-ec1406b220a1
              </div>

              <div className="flex items-center gap-3">
                <a 
                  href="https://ude.my/UC-95eaf934-2a3e-452a-b9e1-ec1406b220a1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-black/10 lucid-glass text-[#181310] text-xs font-bold hover:border-[#ff6b00] hover:text-[#ff6b00] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>VERIFY ONLINE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a 
                  href="/udemy_digital_marketing_certificate.pdf" 
                  download="Shahid_Khan_Udemy_Digital_Marketing_Certificate.pdf"
                  className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white text-xs font-bold hover:bg-[#ff8a00] transition-all flex items-center gap-2 shadow-lg cursor-pointer uppercase tracking-wider"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD PDF</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;
