import React from 'react';
import { motion } from 'framer-motion';

/**
 * MotionBlurSection
 * Wraps section elements with scroll-triggered motion blur, elevation, scale, and fade animations.
 */
const MotionBlurSection = ({ children, className = '', id }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 60, filter: 'blur(16px)', scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default MotionBlurSection;
