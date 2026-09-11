import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LiquidImage = ({ src, alt, className = '', containerClassName = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden group ${containerClassName}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* SVG Filter Definition for Liquid Fluid Displacement */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="hero-liquid-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={isHovered ? "0.035 0.065" : "0.015 0.028"}
              numOctaves="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="6s"
                values="0.015 0.028; 0.032 0.055; 0.015 0.028"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isHovered ? "26" : "12"}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Liquid Pulse Backlight Glow */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#ff6b00]/40 to-[#ff8a00]/40 blur-md animate-pulse pointer-events-none" />

      {/* Liquid Image Element with SVG Displacement Filter */}
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${className}`}
        style={{
          filter: 'url(#hero-liquid-filter)'
        }}
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.5 }}
      />

      {/* Liquid Reflection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ff6b00]/15 to-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-full" />
    </div>
  );
};

export default LiquidImage;
