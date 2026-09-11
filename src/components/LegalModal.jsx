import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, RefreshCw } from 'lucide-react';

const LegalModal = ({ activeModal, onClose }) => {
  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[85vh] lucid-glass bg-[#fcf8f5]/95 border-white rounded-3xl p-6 md:p-8 shadow-2xl overflow-y-auto flex flex-col justify-between"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/10 text-[#ff6b00] flex items-center justify-center">
                  {activeModal === 'privacy' && <ShieldCheck className="w-5 h-5" />}
                  {activeModal === 'refund' && <RefreshCw className="w-5 h-5" />}
                  {activeModal === 'terms' && <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-antonio font-bold text-2xl text-[#181310] tracking-wide uppercase">
                    {activeModal === 'privacy' && 'PRIVACY POLICY'}
                    {activeModal === 'refund' && 'REFUND & CANCELLATION POLICY'}
                    {activeModal === 'terms' && 'TERMS & CONDITIONS'}
                  </h3>
                  <p className="text-xs text-[#5e5249]">Shahid Khan Digital Marketing • Jaipur, Rajasthan, India</p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full border border-black/10 text-[#181310] hover:bg-black/5 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Legal Text Content Body */}
            <div className="text-sm text-[#5e5249] font-normal leading-relaxed space-y-4 mb-6 pr-2">
              {activeModal === 'privacy' && (
                <>
                  <p><strong>1. Introduction:</strong> Shahid Khan ("We", "Us", "Our") operates <em>shahidkhan.site</em>. We are committed to protecting your personal privacy and safeguarding data collected through lead forms, Meta Pixel, and Google Analytics.</p>
                  <p><strong>2. Information We Collect:</strong> Name, Email address, Phone number, Business details, Ad interaction data, IP address, and cookie identifiers for custom audience retargeting.</p>
                  <p><strong>3. How We Use Information:</strong> To respond to inquiries, run retargeting ad campaigns, track campaign conversions, and optimize landing page user experience.</p>
                  <p><strong>4. Data Protection & Sharing:</strong> We do not sell or rent user data. Information is shared only with secure third-party processors (Meta, Google, n8n, Firebase) under strict confidentiality.</p>
                  <p><strong>5. Your Rights:</strong> You may request access, correction, or deletion of your personal data at any time by contacting <em>contact@shahidkhan.site</em>.</p>
                </>
              )}

              {activeModal === 'refund' && (
                <>
                  <p><strong>1. Digital Marketing & Ad Spend:</strong> Ad campaign spend paid directly to Meta Ads or Google Ads is non-refundable as third-party platform costs.</p>
                  <p><strong>2. Service Retainers:</strong> Monthly digital marketing management retainers can be cancelled with a 15-day written notice prior to the next billing cycle.</p>
                  <p><strong>3. Custom Web Development:</strong> Milestone-based website design or software projects qualify for full refunds prior to project kickoff. Once design work commences, completed milestones are non-refundable.</p>
                  <p><strong>4. Dispute Resolution:</strong> If you are unsatisfied with project progress, please contact <em>contact@shahidkhan.site</em> or +91 95878 67559 for immediate resolution.</p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p><strong>1. Engagement Terms:</strong> By accessing <em>shahidkhan.site</em> or signing a marketing proposal with Shahid Khan, you agree to these terms.</p>
                  <p><strong>2. Client Responsibilities:</strong> Clients must provide timely access to ad accounts, branding assets, and project feedback.</p>
                  <p><strong>3. Limitation of Liability:</strong> Shahid Khan shall not be held liable for third-party ad platform bans, API outages, or unexpected algorithm policy shifts.</p>
                  <p><strong>4. Governing Law:</strong> These terms are governed by the laws of India. Any legal disputes shall be subject to exclusive jurisdiction of courts in Jaipur, Rajasthan.</p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-black/5 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#ff6b00] text-white text-xs font-semibold hover:bg-[#ff8a00] transition-all uppercase tracking-wider cursor-pointer shadow-md"
              >
                CLOSE LEGAL DOCUMENT
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;
