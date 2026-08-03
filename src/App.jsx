import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import heroPhoto from './assets/hero.png';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initMetaPixel, trackPixelEvent } from './metaPixel';
import { 
  Sun, 
  Moon, 
  ArrowUpRight, 
  ArrowDown, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Download,
  Menu,
  X,
  Globe,
  ChevronDown,
  Sparkles,
  Zap,
  TrendingUp,
  Code,
  Layers,
  Cpu,
  ShieldCheck,
  Clock,
  Send,
  MessageSquare,
  Award,
  Users,
  Target
} from 'lucide-react';

// Animated Counter Component using Framer Motion
const AnimatedCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // ms
    const increment = Math.ceil(target / (duration / 30));
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}{suffix}</span>;
};

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio_theme') || 'light';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProjectFilter, setActiveProjectFilter] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Custom Cursor state
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);
  }, [theme]);

  useEffect(() => {
    initMetaPixel();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('a')) {
        setCursorHovered(true);
      } else {
        setCursorHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    const businessName = formData.get('businessName') || '';
    const serviceRequired = formData.get('serviceRequired') || '';
    const budget = formData.get('budget') || '';
    const message = formData.get('message') || '';

    try {
      if (db) {
        await addDoc(collection(db, "contacts"), {
          name,
          email,
          phone,
          businessName,
          serviceRequired,
          budget,
          message,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn("Firebase record notice:", err);
    }

    // Track Meta Pixel Lead event
    trackPixelEvent('Lead', {
      content_name: serviceRequired || 'Portfolio Inquiry',
      value: 1.00,
      currency: 'USD'
    });

    setSubmitting(false);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 6000);
    e.target.reset();
  };

  // Tools List (17 tools)
  const toolsList = [
    { name: "Meta Ads", category: "Ads & Traffic", desc: "FB & IG High ROAS Ads" },
    { name: "Google Ads", category: "Search Ads", desc: "PMax & Search Campaigns" },
    { name: "ChatGPT", category: "AI & Content", desc: "Prompt Engineering & Copy" },
    { name: "Claude", category: "AI & Logic", desc: "Vibe Coding & System Logic" },
    { name: "Firebase", category: "Backend & DB", desc: "Realtime DB & Auth" },
    { name: "Supabase", category: "Database", desc: "PostgreSQL & API" },
    { name: "n8n", category: "Automation", desc: "Workflow Integration" },
    { name: "GitHub", category: "Version Control", desc: "Code Deployment & CI" },
    { name: "Cloudflare", category: "Security & DNS", desc: "CDN & SSL Protection" },
    { name: "VS Code", category: "Development", desc: "Modern Code Editor" },
    { name: "Canva", category: "Ad Creatives", desc: "High Conversion Banners" },
    { name: "Figma", category: "UI/UX Design", desc: "Website Mockups & Layouts" },
    { name: "HTML5", category: "Frontend", desc: "Semantic Web Structure" },
    { name: "CSS3", category: "Styling", desc: "Vanilla & Tailwind CSS" },
    { name: "JavaScript", category: "Logic", desc: "ES6+ Modern JS" },
    { name: "React", category: "Framework", desc: "Interactive Web Apps" },
    { name: "Next.js", category: "Framework", desc: "SEO-First Web Apps" }
  ];

  // Skills Data (4 Categories)
  const skillsCategories = [
    {
      title: "Digital Marketing",
      icon: <TrendingUp className="w-5 h-5" />,
      skills: ["Meta Ads", "Google Ads", "Lead Generation", "Social Media Marketing", "Campaign Optimization", "Audience Research", "Conversion Optimization"]
    },
    {
      title: "Website Development",
      icon: <Code className="w-5 h-5" />,
      skills: ["Business Websites", "Landing Pages", "NGO Websites", "Admin Dashboards", "Payment Gateway Integration", "Firebase Development", "Responsive Design"]
    },
    {
      title: "AI and Automation",
      icon: <Cpu className="w-5 h-5" />,
      skills: ["ChatGPT", "Claude AI", "n8n Automation", "Prompt Engineering", "Business Automation", "Workflow Integration"]
    },
    {
      title: "Business & Strategy",
      icon: <Layers className="w-5 h-5" />,
      skills: ["CRM Setup", "Customer Management", "Project Management", "Technical Support", "Client Communication"]
    }
  ];

  // Projects Data (6 Projects)
  const projectsData = [
    {
      id: 1,
      title: "Shree Jagdamba Furniture",
      category: "Web Development",
      location: "Jaipur, India",
      description: "Full custom furniture business web app featuring online booking, product catalog, custom admin management dashboard, and Meta lead generation ad campaigns.",
      services: ["Business Website", "Online Booking", "Online Orders", "Admin Dashboard", "CRM Setup", "Meta Advertising", "Lead Generation"],
      link: null
    },
    {
      id: 2,
      title: "Shikva Foundation",
      category: "NGOs & Organizations",
      location: "New Delhi, India",
      website: "shikvafoundation.org",
      description: "Complete NGO web portal with online donation management, automated receipt generation via Razorpay, and national social media fundraising campaigns.",
      services: ["Donation Website", "Admin Dashboard", "Payment Gateway", "Donation Campaigns", "Social Media Marketing"],
      link: "https://shikvafoundation.org"
    },
    {
      id: 3,
      title: "Day Foundation",
      category: "NGOs & Organizations",
      location: "Jabalpur, India",
      website: "dayfoundation.in",
      description: "Multi-functional non-profit platform with integrated volunteer portal, internship application workflow, and online donation processing.",
      services: ["Donation Management", "Volunteer Portal", "Internship Portal", "Payment Integration", "Admin Dashboard", "Fundraising Campaigns"],
      link: "https://dayfoundation.in"
    },
    {
      id: 4,
      title: "Radhey Krishna Sports Shop",
      category: "Digital Marketing",
      location: "Jaipur, India",
      description: "Showroom web catalog and hyper-local Meta & Instagram ads strategy to boost store footfalls and generate high-intent customer inquiries.",
      services: ["Business Website", "Meta Ads", "Brand Promotion", "Lead Generation"],
      link: null
    },
    {
      id: 5,
      title: "Media Levelling",
      category: "Web Development",
      location: "Agency Portal",
      website: "media-levelling.com",
      description: "Modernized agency platform with performance analytics integration, lead distribution funnel, and ongoing website maintenance.",
      services: ["Website Redesign", "Website Maintenance", "Client Management", "Agency Marketing", "Meta Ads"],
      link: "https://media-levelling.com"
    },
    {
      id: 6,
      title: "Local Business & Retail Clients",
      category: "CRM & Automation",
      location: "Pan-India",
      description: "High-converting landing pages, custom CRM pipelines, and targeted Meta/Google ad setups driving scalable customer acquisition for local businesses.",
      services: ["Landing Pages", "Business Websites", "Brand Identity", "Social Media Management", "Lead Generation", "Meta Advertising"],
      link: null
    }
  ];

  // 14 Core Services
  const servicesList = [
    { name: "Business Website Development", desc: "Modern, responsive, fast-loading websites built to convert visitors into loyal clients." },
    { name: "Landing Page Design", desc: "High-impact, conversion-focused landing pages engineered for paid advertising campaigns." },
    { name: "Admin Dashboard Development", desc: "Custom web admin portals to monitor inquiries, manage orders, and control site data." },
    { name: "AI Powered Websites", desc: "Integrating smart AI chatbots, automated responses, and Vibe Coding intelligence." },
    { name: "CRM Integration", desc: "Setting up real-time customer pipeline management to track every single incoming lead." },
    { name: "Firebase Backend", desc: "Real-time database storage, secure authentication, and cloud infrastructure setup." },
    { name: "Payment Gateway Integration", desc: "Seamless Razorpay & UPI integration for donations, product sales, and booking deposits." },
    { name: "Meta Ads Management", desc: "End-to-end Facebook & Instagram paid ad campaigns targeting high-intent buyers." },
    { name: "Google Ads Management", desc: "High-converting Google Search & PMax ads capturing active search intent." },
    { name: "Lead Generation", desc: "Building full lead capture funnels that deliver qualified inquiries directly to your inbox." },
    { name: "Website Maintenance", desc: "Regular technical updates, security monitoring, performance fixes, and content edits." },
    { name: "Automation with n8n", desc: "Automating repetitive tasks between CRM, email, WhatsApp, and database systems." },
    { name: "SEO Setup", desc: "On-page SEO optimization, meta tags, schema markup, and search engine index submission." },
    { name: "Performance Optimization", desc: "Optimizing website load times, code assets, image compression, and Core Web Vitals." }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "Professional work with excellent communication and timely delivery. Shahid helped us launch our platform smoothly.",
      author: "Director, Educational & Retail Brand",
      role: "Jaipur, India"
    },
    {
      quote: "Great experience managing our website and advertising campaigns. Our lead inquiries increased significantly within 30 days.",
      author: "Marketing Head, Media Levelling Agency",
      role: "New Delhi, India"
    },
    {
      quote: "Delivered exactly what our organization needed. The Razorpay donation system and volunteer portal work flawlessly.",
      author: "Operations Manager, NGO Organization",
      role: "Pan-India"
    }
  ];

  // Working Process Steps
  const processSteps = [
    { step: "01", title: "Requirement Discussion", desc: "Deep dive into your business goals, target audience, brand identity, and key technical deliverables." },
    { step: "02", title: "Planning", desc: "Structuring site architecture, defining campaign funnels, selecting tech stack, and setting timelines." },
    { step: "03", title: "Design", desc: "Crafting modern, responsive UI mockups focused on visual excellence, trust, and high conversion." },
    { step: "04", title: "Development", desc: "Clean frontend coding, database integration, Meta Pixel setup, and payment gateway configuration." },
    { step: "05", title: "Testing", desc: "Rigorous cross-device responsive testing, performance speed check, and lead form validation." },
    { step: "06", title: "Launch", desc: "Publishing to live domain/Vercel, submitting SEO sitemaps, and launching active ad campaigns." }
  ];

  // FAQ Items
  const faqItems = [
    { q: "What services do you provide?", a: "I specialize in end-to-end Digital Marketing (Meta Ads, Google Ads, Lead Gen), Custom Website Development (React, Next.js, Firebase), AI & n8n Workflow Automation, and CRM setup." },
    { q: "Do you build websites for businesses and NGOs?", a: "Yes! I have extensive experience building websites for retail businesses, agencies, local services, as well as non-profit NGOs with Razorpay donation portals." },
    { q: "Do you manage Meta Ads?", a: "Absolutetly. I set up, target, optimize, and manage high-ROAS Meta Ads (Facebook & Instagram) campaigns to generate consistent, quality leads for your business." },
    { q: "Do you provide long term website support?", a: "Yes, I offer ongoing technical maintenance, security updates, server monitoring, and content updates to keep your website running at peak performance." },
    { q: "Can you automate business workflows?", a: "Yes, using n8n and AI integrations, I can connect your contact forms, CRM, email notifications, and WhatsApp alerts so you never miss a prospective client." },
    { q: "How long does a project take?", a: "A standard business website or landing page typically takes 3 to 7 days, depending on custom features and database requirements." }
  ];

  const filteredProjects = activeProjectFilter === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.category === activeProjectFilter);

  return (
    <div className="min-h-screen relative selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* CUSTOM DESKTOP CURSOR */}
      <div 
        className={`hidden md:block fixed pointer-events-none z-50 rounded-full transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2 ${
          cursorHovered 
            ? 'w-10 h-10 bg-neutral-900/20 dark:bg-white/20 border border-neutral-900 dark:border-white scale-125' 
            : 'w-4 h-4 bg-neutral-900 dark:bg-white opacity-80'
        }`}
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />

      {/* STICKY HEADER NAV */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--header-bg)] border-b border-[var(--border-color)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <span className="w-10 h-10 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-display font-extrabold text-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              S
            </span>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg tracking-tight text-[var(--text-primary)]">Shahid Khan</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Digital Marketer & AI Creator</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#about" className="hover:text-[var(--text-primary)] transition-colors">About</a>
            <a href="#skills" className="hover:text-[var(--text-primary)] transition-colors">Skills</a>
            <a href="#services" className="hover:text-[var(--text-primary)] transition-colors">Services</a>
            <a href="#projects" className="hover:text-[var(--text-primary)] transition-colors">Projects</a>
            <a href="#process" className="hover:text-[var(--text-primary)] transition-colors">Process</a>
            <a href="#faq" className="hover:text-[var(--text-primary)] transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all cursor-pointer shadow-sm"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <a 
              href="/Shahid_Khan_CV.pdf" 
              download 
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border-dark)] bg-transparent text-xs font-bold font-heading uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-6 space-y-4"
            >
              <nav className="flex flex-col space-y-3 font-heading font-medium text-base">
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">About Me</a>
                <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">Skills & Tools</a>
                <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">Services</a>
                <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">Featured Projects</a>
                <a href="#process" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">Working Process</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">FAQ</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">Contact Me</a>
              </nav>
              <div className="pt-2">
                <a 
                  href="/Shahid_Khan_CV.pdf" 
                  download 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-xs font-bold tracking-wider uppercase"
                >
                  <Download className="w-4 h-4" /> Download Resume PDF
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>


      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 max-w-7xl mx-auto px-6">
        
        {/* Availability Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-secondary)] mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Available for New Projects & Freelance Roles</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Column (Content) */}
          <div className="lg:col-span-7 space-y-6">
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1]"
            >
              Grow Your Business with <span className="underline underline-offset-8 decoration-[var(--border-color)]">Smart Digital Marketing</span> and AI Powered Websites.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl"
            >
              I build modern websites, run high performance ad campaigns, automate business workflows, and help brands generate more leads, customers, and revenue.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a 
                href="#contact" 
                className="px-7 py-4 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-sm font-bold tracking-wide hover:opacity-90 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <span>Let's Work Together</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a 
                href="#projects" 
                className="px-7 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] font-heading text-sm font-bold tracking-wide hover:bg-[var(--bg-hover)] transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>View My Work</span>
                <ArrowDown className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Hero Quick Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 flex flex-wrap gap-6 text-xs text-[var(--text-muted)] font-medium border-t border-[var(--border-color)] mt-8"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--text-primary)]" />
                <span>Meta & Google Certified Ads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--text-primary)]" />
                <span>AI & n8n Automation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--text-primary)]" />
                <span>React / Next.js Web Development</span>
              </div>
            </motion.div>

          </div>

          {/* Hero Right Column (Portrait Photo Card) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-color)] bg-[var(--bg-card)] group p-2">
              <div className="rounded-2xl overflow-hidden relative">
                <img 
                  src="/shahid_photo.png" 
                  onError={(e) => { e.currentTarget.src = heroPhoto; }}
                  alt="Shahid Khan — Digital Marketer & AI Website Creator" 
                  className="w-full h-auto object-cover filter grayscale contrast-105 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500 transform group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md bg-black/60 border border-white/10 text-white flex items-center justify-between">
                  <div>
                    <p className="font-heading font-bold text-sm">Shahid Khan</p>
                    <p className="text-xs text-neutral-300">Vibe Coding & Growth Specialist</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-white/20 text-[10px] font-mono uppercase font-bold tracking-wider">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ANIMATED STATISTICS SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          <div className="p-6 rounded-2xl glass-card border border-[var(--border-color)] text-center space-y-1 hover:border-[var(--text-primary)] transition-all">
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)]">
              <AnimatedCounter target={20} suffix="+" />
            </h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Projects Completed</p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-[var(--border-color)] text-center space-y-1 hover:border-[var(--text-primary)] transition-all">
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)]">
              <AnimatedCounter target={5} suffix="+" />
            </h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Brands Worked With</p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-[var(--border-color)] text-center space-y-1 hover:border-[var(--text-primary)] transition-all">
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)]">
              <AnimatedCounter target={100} suffix="+" />
            </h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Campaigns Managed</p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-[var(--border-color)] text-center space-y-1 hover:border-[var(--text-primary)] transition-all">
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)]">
              <AnimatedCounter target={1000} suffix="+" />
            </h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Leads Generated</p>
          </div>
        </motion.div>

      </section>


      {/* ABOUT ME SECTION ("WHO I AM") */}
      <section id="about" className="py-20 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">About Me</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mt-2">Who I Am</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-7 space-y-6 text-base text-[var(--text-secondary)] leading-relaxed">
              <p className="font-medium text-lg text-[var(--text-primary)]">
                I am <strong className="font-bold">Shahid Khan</strong>, a Digital Marketer and AI Website Creator with hands-on experience helping businesses, startups, agencies, NGOs, and local retail brands build a powerful online presence.
              </p>

              <p>
                My work combines high-converting website development, Meta advertising (Facebook & Instagram), Google Ads, CRM lead tracking integration, AI tools, workflow automation (n8n), and strategic business growth. I focus on building digital systems that generate qualified leads, elevate customer experience, and support long-term revenue growth.
              </p>

              <p>
                Whether you need a brand-new website, an admin management dashboard, automated donation workflows, or high-ROAS marketing campaigns, I deliver end-to-end solutions engineered for measurable success.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <p className="font-heading font-bold text-sm text-[var(--text-primary)]">Location</p>
                  <p className="text-xs text-[var(--text-muted)]">Jaipur, Rajasthan, India (Open to Remote)</p>
                </div>

                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <p className="font-heading font-bold text-sm text-[var(--text-primary)]">Core Specialty</p>
                  <p className="text-xs text-[var(--text-muted)]">Paid Ads + AI Web Apps + Automation</p>
                </div>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              
              <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 hover:border-[var(--text-primary)] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center mb-3">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">Performance Marketing</h3>
                <p className="text-xs text-[var(--text-secondary)]">Data-driven Meta Ads and Google Search/PMax campaigns optimized for high ROAS and low CPA.</p>
              </div>

              <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 hover:border-[var(--text-primary)] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center mb-3">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">AI & Vibe Coding Web Development</h3>
                <p className="text-xs text-[var(--text-secondary)]">React, Next.js, and Tailwind CSS development integrated with Firebase databases and Razorpay portals.</p>
              </div>

              <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 hover:border-[var(--text-primary)] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">n8n & AI Workflow Automation</h3>
                <p className="text-xs text-[var(--text-secondary)]">Automating lead distribution, CRM sync, email alerts, and business operations for seamless execution.</p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* SKILLS SECTION */}
      <section id="skills" className="py-20 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Capabilities</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Skills & Expertise</h2>
            <p className="text-sm text-[var(--text-secondary)]">A comprehensive toolkit spanning paid performance marketing, full-stack web creation, and AI automation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillsCategories.map((cat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-3xl glass-card border border-[var(--border-color)] hover:border-[var(--text-primary)] transition-all shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[var(--text-primary)]">{cat.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {cat.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* ANIMATED TOOLS SECTION (17 TOOLS GRID) */}
      <section className="py-20 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Tech Stack</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Tools & Technologies</h2>
            <p className="text-sm text-[var(--text-secondary)]">The modern tools and frameworks I use to build scalable web applications and run profit-driven ad campaigns.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {toolsList.map((tool, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[var(--text-muted)] block mb-1">
                    {tool.category}
                  </span>
                  <h4 className="font-heading font-bold text-base text-[var(--text-primary)] group-hover:underline">
                    {tool.name}
                  </h4>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] mt-3 leading-tight">
                  {tool.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* FEATURED PROJECTS SECTION (INTERACTIVE FILTERABLE Showcase) */}
      <section id="projects" className="py-20 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Portfolio</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mt-1">Featured Projects</h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Web Development', 'Digital Marketing', 'NGOs & Organizations', 'CRM & Automation'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveProjectFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
                    activeProjectFilter === filter 
                      ? 'bg-[var(--btn-bg)] text-[var(--btn-text)] shadow-md' 
                      : 'border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-7 flex flex-col justify-between hover:border-[var(--text-primary)] transition-all duration-300 group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                        {project.location}
                      </span>
                      {project.website && (
                        <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1">
                          <Globe className="w-3 h-3" /> {project.website}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-xl text-[var(--text-primary)] mb-2 group-hover:underline">
                      {project.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-[var(--border-color)]">
                      {project.services.map((srv, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-[var(--bg-primary)] text-[10px] font-medium text-[var(--text-secondary)]">
                          {srv}
                        </span>
                      ))}
                    </div>

                    {project.link ? (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full py-3 rounded-xl border border-[var(--border-dark)] bg-transparent text-xs font-heading font-bold text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
                      >
                        <span>Visit Live Site</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="w-full py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-heading font-semibold text-[var(--text-muted)] text-center">
                        Client Business System
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>


      {/* WHAT I CAN DO FOR YOU (14 SERVICES GRID) */}
      <section id="services" className="py-20 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Services</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">What I Can Do For You</h2>
            <p className="text-sm text-[var(--text-secondary)]">Tailored solutions engineered to scale your brand presence, streamline operations, and boost lead conversions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((srv, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center font-heading font-bold text-xs mb-4">
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>
                  <h3 className="font-heading font-bold text-base text-[var(--text-primary)] mb-2">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* RESULTS SECTION */}
      <section className="py-20 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 sm:p-12 shadow-xl">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Track Record</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Proven Client Results</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
              <div className="p-4 border-r border-[var(--border-color)] last:border-0">
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">20+</p>
                <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">Websites Built</p>
              </div>

              <div className="p-4 border-r border-[var(--border-color)] last:border-0">
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">5+</p>
                <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">Brands Served</p>
              </div>

              <div className="p-4 border-r border-[var(--border-color)] last:border-0">
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">100+</p>
                <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">Paid Campaigns</p>
              </div>

              <div className="p-4 border-r border-[var(--border-color)] last:border-0">
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">1000+</p>
                <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">Leads Generated</p>
              </div>

              <div className="p-4 border-r border-[var(--border-color)] last:border-0">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-primary)]">Fast</p>
                <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">Delivery Time</p>
              </div>

              <div className="p-4">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-primary)]">100%</p>
                <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">Long Term Support</p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* WHY CHOOSE ME SECTION */}
      <section className="py-20 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Advantage</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Why Choose Me</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Modern Website Design", desc: "Clean, responsive, high-converting layouts that reflect modern visual excellence." },
              { title: "Business Focused Solutions", desc: "Every line of code and ad campaign is structured specifically around lead generation & revenue." },
              { title: "Marketing First Approach", desc: "I build websites with built-in Meta Pixel tracking, analytics, and sales funnel logic." },
              { title: "AI Powered Workflow", desc: "Leveraging n8n automation, ChatGPT, and Claude to build faster and deliver smarter." },
              { title: "Reliable Support", desc: "Dedicated long-term technical maintenance, performance monitoring, and updates." },
              { title: "Affordable Pricing", desc: "Transparent, flexible pricing suited for local businesses, agencies, and non-profits." },
              { title: "Fast Communication", desc: "Direct client updates, quick turnaround times, and clear project progression." },
              { title: "Latest Technologies", desc: "React 19, Vite, Tailwind CSS v4, Firebase, Cloudflare, and modern API integrations." }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">{item.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* WORKING PROCESS SECTION (INTERACTIVE 6-STEP TIMELINE) */}
      <section id="process" className="py-20 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Workflow</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Working Process</h2>
            <p className="text-sm text-[var(--text-secondary)]">A structured 6-step roadmap ensuring transparent communication and timely project execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((p, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] relative hover:border-[var(--text-primary)] transition-all shadow-sm"
              >
                <span className="font-display font-extrabold text-5xl text-[var(--border-color)] block mb-4">
                  {p.step}
                </span>
                <h3 className="font-heading font-bold text-xl text-[var(--text-primary)] mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* TESTIMONIALS SECTION */}
      <section className="py-20 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Feedback</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Client Testimonials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col justify-between hover:border-[var(--text-primary)] transition-all shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex text-amber-500 gap-1 text-sm">
                    {"★★★★★"}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-6 border-t border-[var(--border-color)] mt-6">
                  <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">{t.author}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* FAQ SECTION (ACCORDION) */}
      <section id="faq" className="py-20 border-t border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Questions</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left font-heading font-bold text-base text-[var(--text-primary)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-4"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* CONTACT SECTION ("LET'S BUILD SOMETHING AMAZING") */}
      <section id="contact" className="py-20 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Info Left */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Get In Touch</span>
                <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mt-2 leading-tight">
                  Let's Build Something Amazing
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-4 leading-relaxed">
                  Looking for a high-converting website, digital marketing strategy, paid ad campaigns, or AI automation for your business? Let's discuss your project goals.
                </p>
              </div>

              <div className="space-y-4 font-medium text-sm">
                <a href="mailto:contact@shahidkhan.site" className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center gap-4 hover:border-[var(--text-primary)] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Email Address</p>
                    <p className="font-heading font-bold text-[var(--text-primary)]">contact@shahidkhan.site</p>
                  </div>
                </a>

                <a href="tel:+919587867559" className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center gap-4 hover:border-[var(--text-primary)] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Direct Phone / WhatsApp</p>
                    <p className="font-heading font-bold text-[var(--text-primary)]">+91 95878 67559</p>
                  </div>
                </a>

                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Location</p>
                    <p className="font-heading font-bold text-[var(--text-primary)]">Jaipur, Rajasthan, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Contact Form Right */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xl">
                
                <h3 className="font-heading font-bold text-2xl text-[var(--text-primary)] mb-6">Start a Conversation</h3>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  
                  {formSubmitted && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>Thank you! Your inquiry has been sent and saved to Firebase. I will get back to you shortly.</span>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Your Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        placeholder="Shahid Khan" 
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder="you@example.com" 
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="+91 98765 43210" 
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Business / Company Name</label>
                      <input 
                        type="text" 
                        name="businessName" 
                        placeholder="Your Company Name" 
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Service Required *</label>
                      <select 
                        name="serviceRequired"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      >
                        <option value="">Select Service...</option>
                        <option value="Business Website Development">Business Website Development</option>
                        <option value="Meta & Paid Ads Management">Meta & Paid Ads Management</option>
                        <option value="AI & n8n Workflow Automation">AI & n8n Workflow Automation</option>
                        <option value="NGO Website & Payment Gateway">NGO Website & Payment Gateway</option>
                        <option value="CRM & Lead Generation">CRM & Lead Generation</option>
                        <option value="Other Custom Project">Other Custom Project</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Estimated Budget</label>
                      <select 
                        name="budget"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      >
                        <option value="Flexible">Flexible</option>
                        <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                        <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                        <option value="₹50,000+">₹50,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Project Details *</label>
                    <textarea 
                      rows={4} 
                      name="message" 
                      required 
                      placeholder="Describe your business goals, project scope, or advertising requirements..." 
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-sm font-bold tracking-wide hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>{submitting ? 'Sending Inquiries...' : 'Submit Project Inquiry ↗'}</span>
                  </button>

                </form>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* FLOATING ACTION BUTTON (WHATSAPP QUICK CHAT) */}
      <a 
        href="https://wa.me/919587867559?text=Hello%20Shahid,%20I%20would%20like%20to%20discuss%20a%20project." 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-600 text-white shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center gap-2 group cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden group-hover:inline text-xs font-bold font-heading pr-1">Chat on WhatsApp</span>
      </a>


      {/* FOOTER */}
      <footer className="py-12 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-display font-extrabold text-sm flex items-center justify-center">
              S
            </span>
            <p className="text-xs font-semibold text-[var(--text-secondary)]">
              © {new Date().getFullYear()} Shahid Khan. Digital Marketer & AI Website Creator.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-[var(--text-secondary)]">
            <a href="#about" className="hover:text-[var(--text-primary)]">About</a>
            <a href="#skills" className="hover:text-[var(--text-primary)]">Skills</a>
            <a href="#services" className="hover:text-[var(--text-primary)]">Services</a>
            <a href="#projects" className="hover:text-[var(--text-primary)]">Projects</a>
            <a href="#contact" className="hover:text-[var(--text-primary)]">Contact</a>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[var(--text-primary)]">
            <a href="https://shahidkhan.site" target="_blank" rel="noreferrer" className="hover:underline">shahidkhan.site</a>
            <span>•</span>
            <a href="https://github.com/khanshahid33200-hash" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
          </div>

        </div>
      </footer>

    </div>
  );
}
