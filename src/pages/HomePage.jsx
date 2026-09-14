import React, { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import LazySection from '../components/LazySection';
import SkeletonSection from '../components/SkeletonSection';

// Dynamically Lazy Load Subsequent Sections for Server Cost & Bandwidth Savings
const About = lazy(() => import('../components/About'));
const Projects = lazy(() => import('../components/Projects'));
const MyProducts = lazy(() => import('../components/MyProducts'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const FAQ = lazy(() => import('../components/FAQ'));
const Contact = lazy(() => import('../components/Contact'));

const HomePage = ({ onOpenCertModal }) => {
  return (
    <>
      {/* Initial Hero & Next Section (Services) Loaded Immediately */}
      <Hero />
      
      <LazySection eager minHeight="500px">
        <Services />
      </LazySection>

      {/* Subsequent Sections Loaded On-Demand As User Scrolls Near Them */}
      <LazySection minHeight="600px" fallback={<SkeletonSection />}>
        <Suspense fallback={<SkeletonSection />}>
          <About onOpenCertModal={onOpenCertModal} />
        </Suspense>
      </LazySection>

      <LazySection minHeight="650px" fallback={<SkeletonSection />}>
        <Suspense fallback={<SkeletonSection />}>
          <Projects />
        </Suspense>
      </LazySection>

      <LazySection minHeight="650px" fallback={<SkeletonSection />}>
        <Suspense fallback={<SkeletonSection />}>
          <MyProducts />
        </Suspense>
      </LazySection>

      <LazySection minHeight="550px" fallback={<SkeletonSection />}>
        <Suspense fallback={<SkeletonSection />}>
          <Testimonials />
        </Suspense>
      </LazySection>

      <LazySection minHeight="500px" fallback={<SkeletonSection />}>
        <Suspense fallback={<SkeletonSection />}>
          <FAQ />
        </Suspense>
      </LazySection>

      <LazySection minHeight="550px" fallback={<SkeletonSection />}>
        <Suspense fallback={<SkeletonSection />}>
          <Contact />
        </Suspense>
      </LazySection>
    </>
  );
};

export default HomePage;
