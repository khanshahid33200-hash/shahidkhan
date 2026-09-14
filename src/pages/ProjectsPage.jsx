import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Contact from '../components/Contact';

const ProjectsPage = () => {
  const [filter, setFilter] = useState('ALL');

  const projectList = [
    {
      id: 1,
      title: 'MEDIA LEVELLING AGENCY PLATFORM',
      client: 'Media Levelling (Startup)',
      category: 'Web Development',
      tag: 'WEB DEV & PAID ADS',
      link: 'https://media-levelling.com',
      image: 'https://framerusercontent.com/images/w08JBQPFYIq2vr4OfcD9W6vxEug.jpeg',
      description: 'High-converting agency website built for lead acquisition and performance marketing service showcase.'
    },
    {
      id: 2,
      title: 'MEDTECH FIXATERS — SMART OPD & EMR',
      client: 'Shahid Khan (Own Product)',
      category: 'My Products & SaaS',
      tag: 'FLAGSHIP HEALTHCARE SAAS',
      link: 'https://medtechfixaters.in',
      image: 'https://framerusercontent.com/images/qbjsnnvP9w7UaA2syp36oUe8OSo.jpg',
      description: 'Smart clinic management platform featuring QR reception check-in, 30-second EMR prescriptions, and WhatsApp patient alerts.'
    },
    {
      id: 3,
      title: 'TECHLEV ANALYST — FINANCIAL RATIO AI',
      client: 'Shahid Khan (Own Product)',
      category: 'My Products & SaaS',
      tag: 'FINANCIAL EDTECH PLATFORM',
      link: 'https://techlev.eu',
      image: 'https://framerusercontent.com/images/w08JBQPFYIq2vr4OfcD9W6vxEug.jpeg',
      description: 'Instant corporate financial ratio calculator computing 20+ metrics with Claude AI analyst educational briefs.'
    },
    {
      id: 4,
      title: 'SHREE JAGDAMBA FURNITURE WEBSITE & CRM',
      client: 'Shree Jagdamba Furniture, Jaipur',
      category: 'Local Business SEO',
      tag: 'E-COMMERCE & CRM',
      link: 'https://shahidkhan.site',
      image: 'https://framerusercontent.com/images/qbjsnnvP9w7UaA2syp36oUe8OSo.jpg',
      description: 'Local business e-commerce storefront and lead management portal for Jaipur furniture showroom.'
    },
    {
      id: 5,
      title: 'SHIKVA FOUNDATION NGO WEB PORTAL',
      client: 'Shikva Foundation, New Delhi',
      category: 'NGO & Payments',
      tag: 'NGO PORTAL & RAZORPAY',
      link: 'https://shikvafoundation.org',
      image: 'https://framerusercontent.com/images/nTU7b0ZAdWdlqCI4mQ4tGTPpDs.jpeg',
      description: 'Transparent NGO web portal integrated with Razorpay payment gateway for instant online donations.'
    },
    {
      id: 6,
      title: 'DAY FOUNDATION NGO & VOLUNTEER SYSTEM',
      client: 'Day Foundation, Jabalpur',
      category: 'NGO & Payments',
      tag: 'VOLUNTEER CRM & RAZORPAY',
      link: 'https://dayfoundation.in',
      image: 'https://framerusercontent.com/images/2nWXrWvPxxMHSpsOkNYf8KjzP7Q.jpeg',
      description: 'Volunteer registration system and community initiative platform with automated receipt generation.'
    },
    {
      id: 7,
      title: 'RADHEY KRISHNA SPORTS SHOWROOM',
      client: 'Radhey Krishna Sports Shop, Jaipur',
      category: 'Paid Ads & Lead Gen',
      tag: 'HYPER-LOCAL META ADS',
      link: 'https://shahidkhan.site',
      image: 'https://framerusercontent.com/images/1wFj19qQG6zNr7gj3iTlH0Gdlu8.jpeg',
      description: 'Hyper-local Meta lead generation ads campaign for sports equipment store in Jaipur.'
    },
    {
      id: 8,
      title: 'REACT LANDING PAGE & N8N AUTOMATION',
      client: 'Growth Clients & E-Commerce Brands',
      category: 'Paid Ads & Lead Gen',
      tag: 'N8N WHATSAPP AUTOMATION',
      link: 'https://shahidkhan.site',
      image: 'https://framerusercontent.com/images/xmKml0E7v2iBI4zbbj0yVccaQwg.jpeg',
      description: 'High-speed React landing page integrated with n8n automated WhatsApp lead notifications.'
    }
  ];

  const categories = ['ALL', 'My Products & SaaS', 'Web Development', 'Paid Ads & Lead Gen', 'NGO & Payments', 'Local Business SEO'];

  const filteredProjects = filter === 'ALL'
    ? projectList
    : projectList.filter(p => p.category === filter);

  return (
    <div className="pt-24 min-h-screen bg-[#fcf8f5]">
      {/* Page Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 text-xs font-mono text-[#ff6b00] uppercase font-bold mb-6">
          <RouterLink to="/" className="flex items-center gap-1 hover:underline text-[#5e5249]">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>HOME</span>
          </RouterLink>
          <span>/</span>
          <span>PORTFOLIO & CASE STUDIES</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono text-[#ff6b00] tracking-widest uppercase mb-2 block font-bold">
              // CLIENT WORK & SAAS PROJECTS
            </span>
            <h1 className="font-antonio text-4xl sm:text-6xl text-[#181310] font-bold uppercase tracking-tight">
              COMPLETE <span className="text-[#ff6b00]">PORTFOLIO</span>
            </h1>
          </div>
          <p className="text-[#5e5249] max-w-md text-sm md:text-base font-normal">
            Explore Shahid Khan's complete collection of client case studies, custom web applications, SaaS platforms, and ad campaigns.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                filter === cat
                  ? 'bg-[#ff6b00] text-white shadow-[0_0_25px_rgba(255,107,0,0.4)] font-bold'
                  : 'lucid-glass text-[#5e5249] border-white hover:text-[#181310]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Full Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="lucid-glass rounded-3xl overflow-hidden border-white shadow-xl flex flex-col justify-between p-6 bg-white/80 hover:border-[#ff6b00]/50 transition-all duration-300 group hover:-translate-y-2"
            >
              <div>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-5">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#181310]/80 text-[#ff6b00] border border-[#ff6b00]/30 backdrop-blur-md">
                      {project.tag}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#8c7d73] block uppercase mb-1">{project.client}</span>
                <h3 className="font-antonio text-xl text-[#181310] font-extrabold uppercase leading-tight tracking-wide mb-3">
                  {project.title}
                </h3>
                <p className="text-xs text-[#5e5249] font-normal leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-bold font-antonio tracking-wider uppercase hover:bg-[#181310] transition-colors shadow-md"
                >
                  <span>VISIT LIVE SITE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <Contact />
    </div>
  );
};

export default ProjectsPage;
