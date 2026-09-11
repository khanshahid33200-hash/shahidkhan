import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Projects from '../components/Projects';
import MyProducts from '../components/MyProducts';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

const HomePage = ({ onOpenCertModal }) => {
  return (
    <>
      <Hero />
      <Services />
      <About onOpenCertModal={onOpenCertModal} />
      <Projects />
      <MyProducts />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
};

export default HomePage;
