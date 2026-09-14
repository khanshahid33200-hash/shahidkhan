import React, { useState, useEffect, useRef } from 'react';
import SkeletonSection from './SkeletonSection';

const LazySection = ({
  children,
  eager = false,
  minHeight = '400px',
  fallback = <SkeletonSection />
}) => {
  const [shouldRender, setShouldRender] = useState(eager);
  const containerRef = useRef(null);

  useEffect(() => {
    if (eager || shouldRender) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '450px 0px 450px 0px', // Load section 450px before entering viewport
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [eager, shouldRender]);

  return (
    <div ref={containerRef} style={{ minHeight: shouldRender ? 'auto' : minHeight }}>
      {shouldRender ? children : fallback}
    </div>
  );
};

export default LazySection;
