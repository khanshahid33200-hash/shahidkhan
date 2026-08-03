import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
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
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  Code,
  Layers,
  Cpu,
  Send,
  MessageSquare,
  Award,
  Users,
  Check
} from 'lucide-react';

// 3D Tilt Card Component reserved ONLY for Hero Photo
const HeroPhoto3D = ({ children, className = "" }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-10deg to 10deg tilt)
    const rotateXVal = ((y - centerY) / centerY) * -10;
    const rotateYVal = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative transform-3d ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Animated Counter Component that starts from 0 when scrolled into view
const AnimatedCounter = ({ target, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1800; // ms
    const steps = 50;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
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

  // Scroll driven animation: Hero photo reduces in size and travels DOWN into next section
  const { scrollY } = useScroll();
  const photoScale = useTransform(scrollY, [0, 500], [1, 0.72]);
  const photoY = useTransform(scrollY, [0, 500], [0, 160]); // Compact downward travel
  const photoRotateY = useTransform(scrollY, [0, 500], [0, 8]);
  const photoRotateZ = useTransform(scrollY, [0, 500], [0, 2]);

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
          type: "Digital Marketing Lead",
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn("Firebase record notice:", err);
    }

    // Track Meta Pixel Lead event
    trackPixelEvent('Lead', {
      content_name: serviceRequired || 'Digital Marketing Inquiry',
      value: 1.00,
      currency: 'USD'
    });

    setSubmitting(false);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 6000);
    e.target.reset();
  };

  // Marketing Focused Tools List (17 tools)
  const toolsList = [
    { name: "Meta Ads Manager", category: "Paid Ads", desc: "Facebook & Instagram High-ROAS Campaigns" },
    { name: "Google Ads", category: "Search & PMax", desc: "Search, Display & Performance Max Ads" },
    { name: "Meta Pixel & CAPI", category: "Tracking", desc: "Conversion & Custom Event Tracking" },
    { name: "Google Analytics 4", category: "Analytics", desc: "User Behavior & Funnel Analysis" },
    { name: "Canva Pro", category: "Ad Creatives", desc: "High-Converting Ad Banners & Creatives" },
    { name: "Figma", category: "Landing Pages", desc: "UI/UX & High-Conversion Page Layouts" },
    { name: "n8n Automation", category: "Lead Funnels", desc: "Automated Lead Alerts & CRM Sync" },
    { name: "ChatGPT", category: "AI Copywriting", desc: "Ad Copies & Audience Targeting Prompts" },
    { name: "Claude AI", category: "AI Strategy", desc: "Campaign Strategy & Funnel Architecture" },
    { name: "Firebase", category: "CRM Database", desc: "Lead Capture & Realtime Records" },
    { name: "Cloudflare", category: "DNS & Security", desc: "Fast Landing Page CDN & Protection" },
    { name: "HTML5 & CSS3", category: "Landing Pages", desc: "Conversion-Focused Web Structure" },
    { name: "JavaScript", category: "Web Tech", desc: "Custom Tracking & Form Scripts" },
    { name: "React", category: "Frontend", desc: "Ultra-Fast Responsive Web Portals" },
    { name: "Next.js", category: "SEO Tech", desc: "SEO-Optimized Performance Portals" },
    { name: "VS Code", category: "Code Editor", desc: "Custom Scripting & Integration" },
    { name: "GitHub", category: "Version Control", desc: "Deployment & Asset Management" }
  ];

  // Skills Data (Marketing First)
  const skillsCategories = [
    {
      title: "Digital Marketing & Paid Ads",
      icon: <TrendingUp className="w-5 h-5" />,
      skills: ["Meta Ads (FB & IG)", "Google Ads (Search & PMax)", "B2B / B2C Lead Generation", "Social Media Marketing", "Campaign Optimization", "Audience Targeting & Research", "Conversion Rate Optimization (CRO)", "ROAS Scaling"]
    },
    {
      title: "Conversion Funnels & Landing Pages",
      icon: <Code className="w-5 h-5" />,
      skills: ["High-Converting Landing Pages", "Business Websites", "NGO Donation Portals", "Admin Management Dashboards", "Payment Gateway Integration (Razorpay)", "Responsive Mobile Design"]
    },
    {
      title: "Marketing Analytics & Tracking",
      icon: <BarChart3 className="w-5 h-5" />,
      skills: ["Google Analytics 4 (GA4)", "Meta Pixel & Custom Events", "CRM Lead Tracking Setup", "Lead Distribution Systems", "Remarketing & Retargeting Funnels"]
    },
    {
      title: "AI & Marketing Automation",
      icon: <Zap className="w-5 h-5" />,
      skills: ["n8n Workflow Automation", "AI Copywriting (ChatGPT/Claude)", "Automated Lead Nurturing", "WhatsApp & Email Alerts", "Business System Integration"]
    }
  ];

  // Projects Data (Marketing Outcome Focused)
  const projectsData = [
    {
      id: 1,
      title: "Shree Jagdamba Furniture",
      category: "Paid Advertising & Lead Gen",
      location: "Jaipur, India",
      description: "Targeted Meta Ads campaign paired with a custom web booking catalog, driving consistent high-intent local customer inquiries and direct furniture orders.",
      services: ["Meta Advertising", "Lead Generation", "Business Website", "Online Booking", "CRM Setup"],
      link: null
    },
    {
      id: 2,
      title: "Shikva Foundation",
      category: "NGO Marketing & Growth",
      location: "New Delhi, India",
      website: "shikvafoundation.org",
      description: "Social media fundraising strategy and donation web application with Razorpay integration, expanding nationwide donor participation for social causes.",
      services: ["Social Media Marketing", "Donation Campaigns", "Donation Website", "Payment Gateway Integration"],
      link: "https://shikvafoundation.org"
    },
    {
      id: 3,
      title: "Day Foundation",
      category: "NGO Marketing & Growth",
      location: "Jabalpur, India",
      website: "dayfoundation.in",
      description: "Multi-channel volunteer recruitment and fundraising campaigns combined with a volunteer & internship registration portal.",
      services: ["Fundraising Campaigns", "Volunteer Recruitment", "Internship Portal", "Payment Integration"],
      link: "https://dayfoundation.in"
    },
    {
      id: 4,
      title: "Radhey Krishna Sports Shop",
      category: "Paid Advertising & Lead Gen",
      location: "Jaipur, India",
      description: "Hyper-local Meta & Instagram ads strategy driving footfalls and online inquiries for a premium local sports showroom.",
      services: ["Meta Ads", "Hyper-Local Marketing", "Brand Promotion", "Lead Generation"],
      link: null
    },
    {
      id: 5,
      title: "Media Levelling",
      category: "Agency Marketing & Funnels",
      location: "Agency Portal",
      website: "media-levelling.com",
      description: "Comprehensive digital marketing and website redesign for a growth agency, optimizing lead distribution and client acquisition funnels.",
      services: ["Agency Marketing", "Meta Ads", "Website Redesign", "Lead Distribution Funnel"],
      link: "https://media-levelling.com"
    },
    {
      id: 6,
      title: "Local Retail & Service Clients",
      category: "Paid Advertising & Lead Gen",
      location: "Pan-India",
      description: "High-converting landing pages, Meta/Google ad setups, and automated CRM lead capture systems engineered to lower client acquisition costs.",
      services: ["Lead Generation", "Meta Ads Management", "Landing Page Design", "CRM Automation"],
      link: null
    }
  ];

  // 14 Digital Marketing Focused Services
  const servicesList = [
    { name: "Meta Ads Management (FB & IG)", desc: "End-to-end Meta paid ad campaigns with laser-targeted audience reach, ad creative testing, and high ROAS optimization." },
    { name: "Google Ads (Search & PMax)", desc: "Capturing high-intent customer searches through Google Search, Display, and Performance Max advertising." },
    { name: "B2B & B2C Lead Generation", desc: "Building full lead capture funnels that consistently deliver pre-qualified client inquiries to your business." },
    { name: "High-Converting Landing Pages", desc: "Designing conversion-first landing pages optimized for fast load speeds and maximum ad click-to-lead conversion." },
    { name: "Conversion Rate Optimization (CRO)", desc: "Analyzing user behavior and A/B testing page elements to maximize sales from your existing website traffic." },
    { name: "Retargeting & Remarketing", desc: "Setting up retargeting funnels on Meta & Google to re-engage website visitors and close lost prospects." },
    { name: "Meta Pixel & GA4 Analytics", desc: "Installing and verifying Meta Pixel, CAPI, and Google Analytics 4 for accurate conversion tracking." },
    { name: "Social Media Marketing (SMM)", desc: "Strategic content planning, brand positioning, and social channel management to build brand authority." },
    { name: "SEO & Local Search Ranking", desc: "On-page SEO optimization and local search setup to capture organic customer traffic in your target area." },
    { name: "CRM Setup & Lead Automation", desc: "Connecting lead forms directly to CRM systems and n8n workflows for instant WhatsApp and email notifications." },
    { name: "Business Website Development", desc: "Building modern, fast, responsive websites structured specifically around lead capture and business presentation." },
    { name: "Razorpay Payment Gateway", desc: "Seamless payment integration for client deposits, online product orders, or NGO donation processing." },
    { name: "AI Copywriting & Ad Creatives", desc: "Crafting persuasive ad headlines, engaging copy, and eye-catching ad visuals using AI tools and Canva." },
    { name: "Full-Funnel Growth Strategy", desc: "Custom digital marketing roadmap tailored to your specific industry, budget, and revenue goals." }
  ];

  // Marketing Testimonials
  const testimonials = [
    {
      quote: "Shahid transformed our online presence and ad strategy. Our lead volume doubled while keeping lead costs surprisingly low.",
      author: "Founder, Retail & Furniture Business",
      role: "Jaipur, India"
    },
    {
      quote: "Excellent expertise in Meta Ads and campaign management. Shahid knows how to structure campaigns that deliver real client inquiries.",
      author: "Marketing Director, Media Levelling Agency",
      role: "New Delhi, India"
    },
    {
      quote: "Highly reliable for digital marketing and fundraising. The online donation portal and ad campaigns brought national donor support.",
      author: "Operations Lead, Non-Profit Organization",
      role: "Pan-India"
    }
  ];

  // Marketing Workflow Process
  const processSteps = [
    { step: "01", title: "Strategy & Audience Research", desc: "Analyzing your target customer profile, competitor ads, offer structure, and campaign objectives." },
    { step: "02", title: "Funnel & Creative Planning", desc: "Designing high-converting ad copy, visual assets, landing page layouts, and lead capture forms." },
    { step: "03", title: "Landing Page & Tracking Setup", desc: "Building fast landing pages and integrating Meta Pixel, GA4, and CRM lead capture automation." },
    { step: "04", title: "Campaign Launch", desc: "Configuring audience targeting, budgeting, bidding strategy, and launching live Meta & Google ad campaigns." },
    { step: "05", title: "Optimization & A/B Testing", desc: "Monitoring key metrics (CTR, CPC, CPA, ROAS), testing winning ad creatives, and scaling top audiences." },
    { step: "06", title: "Reporting & Scaling", desc: "Delivering detailed performance reports, lead counts, and scaling budget for maximum profit growth." }
  ];

  // Marketing FAQ
  const faqItems = [
    { q: "What digital marketing services do you specialize in?", a: "I specialize in Meta Ads (Facebook & Instagram), Google Ads (Search & PMax), Lead Generation, High-Converting Landing Page Design, SEO, Meta Pixel & GA4 Analytics, and n8n Lead Automation." },
    { q: "How do Meta Ads help my business get leads?", a: "Meta Ads allow us to target your exact ideal customer based on interests, demographics, and online behavior. We direct them to a high-converting landing page or lead form to collect pre-qualified inquiries." },
    { q: "Do you build the landing pages for ad campaigns?", a: "Yes! A great ad requires a high-converting landing page. I build fast, mobile-friendly landing pages equipped with Meta Pixel tracking and CRM integration." },
    { q: "Can you set up Meta Pixel and Google Analytics tracking?", a: "Absolutetly. Proper tracking is essential for success. I set up Meta Pixel, custom conversion events, and GA4 to ensure every lead and conversion is accurately measured." },
    { q: "Do you work with local businesses, agencies, and NGOs?", a: "Yes! I have successfully managed marketing campaigns and built lead systems for local retail stores, growth agencies, non-profit NGOs, and service businesses." },
    { q: "How soon can we launch a marketing campaign?", a: "Typically within 3 to 5 days! This includes audience research, ad creative prep, landing page setup, tracking verification, and campaign launch." }
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
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <img 
              src="/LOGO.png" 
              alt="Shahid Khan Logo" 
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-[var(--text-primary)]">Shahid Khan</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Digital Marketing & Growth Specialist</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#about" className="hover:text-[var(--text-primary)] transition-colors">About</a>
            <a href="#skills" className="hover:text-[var(--text-primary)] transition-colors">Skills</a>
            <a href="#services" className="hover:text-[var(--text-primary)] transition-colors">Services</a>
            <a href="#projects" className="hover:text-[var(--text-primary)] transition-colors">Campaigns</a>
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
                <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">Marketing Skills</a>
                <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">Marketing Services</a>
                <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">Featured Campaigns</a>
                <a href="#process" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">Campaign Process</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">FAQ</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1">Contact Me</a>
              </nav>
              <div className="pt-2">
                <a 
                  href="/Shahid_Khan_CV.pdf" 
                  download 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-xs font-bold tracking-wider uppercase"
                >
                  <Download className="w-4 h-4" /> Download Marketing Resume PDF
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>


      {/* HERO SECTION (COMPACT HEIGHT & PADDING) */}
      <section className="relative pt-8 pb-14 md:pt-14 md:pb-16 max-w-7xl mx-auto px-6">
        
        {/* Availability Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-secondary)] mb-6 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Available for Paid Ad Campaigns & Growth Projects</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Hero Left Column (Marketing Content) */}
          <div className="lg:col-span-7 space-y-5">
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15]"
            >
              Scale Your Business with <span className="underline underline-offset-6 decoration-[var(--border-color)]">High-ROAS Digital Marketing</span> & Performance Ads.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl"
            >
              I help businesses, agencies, NGOs, and retail brands generate high-intent leads, lower customer acquisition costs, and scale revenue through Meta Ads, Google Search & PMax, and high-converting paid funnels.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <a 
                href="#contact" 
                className="px-6 py-3.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-xs sm:text-sm font-bold tracking-wide hover:opacity-90 transition-all duration-300 flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Get More Leads & Sales</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a 
                href="#projects" 
                className="px-6 py-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] font-heading text-xs sm:text-sm font-bold tracking-wide hover:bg-[var(--bg-hover)] transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Explore Marketing Work</span>
                <ArrowDown className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Hero Marketing Quick Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-4 flex flex-wrap gap-5 text-xs text-[var(--text-muted)] font-medium border-t border-[var(--border-color)] mt-6"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--text-primary)]" />
                <span>Meta & Google Certified Ads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--text-primary)]" />
                <span>High ROAS Paid Campaigns</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--text-primary)]" />
                <span>Lead Gen & Funnel Optimization</span>
              </div>
            </motion.div>

          </div>

          {/* Hero Right Column (3D TILT & SMOOTH DOWNWARD TRAVEL PROFILE PHOTO) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end perspective-1000 lg:-mt-12">
            <motion.div 
              style={{ 
                scale: photoScale, 
                y: photoY, 
                rotateY: photoRotateY, 
                rotateZ: photoRotateZ
              }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="w-full max-w-[320px] sm:max-w-[350px] lg:max-w-[360px] z-20"
            >
              <HeroPhoto3D className="w-full">
                <div className="rounded-3xl overflow-hidden shadow-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2">
                  <div className="rounded-2xl overflow-hidden relative">
                    <img 
                      src="/shahid_photo.png" 
                      onError={(e) => { e.currentTarget.src = heroPhoto; }}
                      alt="Shahid Khan — Digital Marketing Specialist" 
                      className="w-full h-auto object-cover filter grayscale contrast-105 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500 transform group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl backdrop-blur-md bg-black/60 border border-white/10 text-white flex items-center justify-between">
                      <div>
                        <p className="font-heading font-bold text-xs sm:text-sm">Shahid Khan</p>
                        <p className="text-[11px] text-neutral-300">Digital Marketer & Growth Strategist</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-white/20 text-[9px] font-mono uppercase font-bold tracking-wider">
                        META & GOOGLE ADS
                      </span>
                    </div>
                  </div>
                </div>
              </HeroPhoto3D>
            </motion.div>
          </div>

        </div>

        {/* ANIMATED MARKETING STATISTICS SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Leads Generated", target: 1000, suffix: "+" },
            { label: "Campaigns Managed", target: 50, suffix: "+" },
            { label: "Brands Scaled", target: 5, suffix: "+" },
            { label: "High ROAS Funnels", target: 20, suffix: "+" }
          ].map((stat, idx) => (
            <div key={idx} className="p-5 rounded-2xl glass-card border border-[var(--border-color)] text-center space-y-1 hover:border-[var(--text-primary)] transition-all shadow-sm">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </h3>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </section>


      {/* ABOUT ME SECTION (REDUCED PADDING py-14) */}
      <section id="about" className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">About Me</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1">Who I Am</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              <p className="font-medium text-base text-[var(--text-primary)]">
                I am <strong className="font-bold">Shahid Khan</strong>, a Performance Digital Marketer and Growth Strategist with extensive experience helping local retail businesses, agencies, non-profits, and startups build profitable digital advertising systems.
              </p>

              <p>
                My expertise centers on <strong className="text-[var(--text-primary)]">Meta Ads (Facebook & Instagram), Google Ads (Search & Performance Max), B2B/B2C lead generation, audience research, paid funnel architecture, and conversion rate optimization (CRO)</strong>. I equip campaigns with Meta Pixel CAPI, Google Analytics 4 tracking, and high-converting landing pages built to maximize ROAS.
              </p>

              <p>
                By combining persuasive marketing copywriting with AI automation (ChatGPT, Claude, n8n) and web technology, I deliver complete end-to-end client acquisition funnels that turn paid traffic into revenue.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <p className="font-heading font-bold text-xs sm:text-sm text-[var(--text-primary)]">Location</p>
                  <p className="text-xs text-[var(--text-muted)]">Jaipur, Rajasthan, India (Available Globally)</p>
                </div>

                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <p className="font-heading font-bold text-xs sm:text-sm text-[var(--text-primary)]">Primary Focus</p>
                  <p className="text-xs text-[var(--text-muted)]">Meta & Google Paid Ads + Lead Gen Funnels</p>
                </div>
              </div>
            </div>

            {/* Highlights Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              
              <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1.5 hover:border-[var(--text-primary)] transition-all shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center mb-2">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-[var(--text-primary)]">Meta & Google Paid Advertising</h3>
                <p className="text-xs text-[var(--text-secondary)]">Strategic audience targeting, creative ad design, A/B testing, and budget scaling focused on maximum Return on Ad Spend (ROAS).</p>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1.5 hover:border-[var(--text-primary)] transition-all shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-[var(--text-primary)]">Lead Generation & Sales Funnels</h3>
                <p className="text-xs text-[var(--text-secondary)]">Engineered landing pages and lead capture systems built to convert cold paid traffic into pre-qualified sales calls and inquiries.</p>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1.5 hover:border-[var(--text-primary)] transition-all shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center mb-2">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-[var(--text-primary)]">Meta Pixel & Analytics Setup</h3>
                <p className="text-xs text-[var(--text-secondary)]">Complete conversion tracking via Meta Pixel, CAPI, and GA4 to ensure every dollar of ad spend is measured and optimized.</p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* SKILLS SECTION (REDUCED PADDING py-14) */}
      <section id="skills" className="py-14 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Capabilities</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Digital Marketing Skills</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">A specialized performance marketing toolkit engineered for lead acquisition, ad optimization, and business scaling.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillsCategories.map((cat, idx) => (
              <div key={idx} className="p-7 rounded-3xl glass-card border border-[var(--border-color)] hover:border-[var(--text-primary)] transition-all shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">{cat.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* MARKETING TECH TOOLS SECTION (REDUCED PADDING py-14) */}
      <section className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Marketing Tech</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Marketing Tools & Platforms</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">The industry-standard marketing, tracking, creative, and web technologies I use to launch and scale profitability.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {toolsList.map((tool, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] hover:-translate-y-0.5 transition-all cursor-pointer group shadow-sm flex flex-col justify-between h-full">
                <div>
                  <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-[var(--text-muted)] block mb-1">
                    {tool.category}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-[var(--text-primary)] group-hover:underline">
                    {tool.name}
                  </h4>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] mt-2 leading-tight">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* FEATURED CAMPAIGNS & PROJECTS SECTION (REDUCED PADDING py-14) */}
      <section id="projects" className="py-14 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Client Success</span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1">Featured Campaigns & Projects</h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Paid Advertising & Lead Gen', 'NGO Marketing & Growth', 'Agency Marketing & Funnels'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveProjectFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 flex flex-col justify-between h-full hover:border-[var(--text-primary)] transition-all duration-300 group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-wider border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                        {project.location}
                      </span>
                      {project.website && (
                        <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                          <Globe className="w-3 h-3" /> {project.website}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-lg text-[var(--text-primary)] mb-2 group-hover:underline">
                      {project.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-5">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-[var(--border-color)]">
                      {project.services.map((srv, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-[var(--bg-primary)] text-[10px] font-medium text-[var(--text-secondary)]">
                          {srv}
                        </span>
                      ))}
                    </div>

                    {project.link ? (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl border border-[var(--border-dark)] bg-transparent text-xs font-heading font-bold text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
                      >
                        <span>View Live Platform</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="w-full py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-heading font-semibold text-[var(--text-muted)] text-center">
                        Active Lead Campaign
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>


      {/* WHAT I CAN DO FOR YOU (REDUCED PADDING py-14) */}
      <section id="services" className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Services</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Digital Marketing Services</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Data-driven paid advertising, lead capture funnels, and marketing analytics designed to grow your revenue.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {servicesList.map((srv, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center font-heading font-bold text-[11px] mb-3">
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[var(--text-primary)] mb-1.5">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* MARKETING RESULTS & PERFORMANCE SECTION (REDUCED PADDING py-14) */}
      <section className="py-14 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 shadow-xl">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Impact</span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Measurable Marketing Outcomes</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div className="p-3 border-r border-[var(--border-color)] last:border-0">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-primary)]">
                  <AnimatedCounter target={1000} suffix="+" />
                </p>
                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">Leads Generated</p>
              </div>

              <div className="p-3 border-r border-[var(--border-color)] last:border-0">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-primary)]">
                  <AnimatedCounter target={50} suffix="+" />
                </p>
                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">Campaigns Managed</p>
              </div>

              <div className="p-3 border-r border-[var(--border-color)] last:border-0">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-primary)]">
                  <AnimatedCounter target={5} suffix="+" />
                </p>
                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">Brands Scaled</p>
              </div>

              <div className="p-3 border-r border-[var(--border-color)] last:border-0">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-primary)]">
                  <AnimatedCounter target={20} suffix="+" />
                </p>
                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">High ROAS Funnels</p>
              </div>

              <div className="p-3 border-r border-[var(--border-color)] last:border-0">
                <p className="font-display font-extrabold text-lg sm:text-xl text-[var(--text-primary)]">High</p>
                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">ROAS Focus</p>
              </div>

              <div className="p-3">
                <p className="font-display font-extrabold text-lg sm:text-xl text-[var(--text-primary)]">100%</p>
                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-1">Growth Support</p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* WHY CHOOSE ME (REDUCED PADDING py-14) */}
      <section className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Why Hire Me</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Marketing First Advantage</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Meta & Google Ads Focus", desc: "Expertise in structuring high-converting Meta paid ads, Google Search, and PMax campaigns." },
              { title: "Lead Generation Architecture", desc: "Every campaign is built around collecting qualified leads, phone calls, and direct customer inquiries." },
              { title: "Meta Pixel & GA4 Analytics", desc: "Verified conversion tracking setups so you can track exact CPA, Cost-per-Lead, and ROAS." },
              { title: "High-Converting Landing Pages", desc: "Custom landing page development engineered for maximum visitor-to-lead conversion rates." },
              { title: "n8n Lead Automation", desc: "Connecting lead forms to CRM systems, email alerts, and instant WhatsApp follow-up workflows." },
              { title: "Transparent Campaign Reporting", desc: "Clear, data-backed reporting on impressions, clicks, lead volume, cost per lead, and campaign ROAS." },
              { title: "Affordable & Flexible Models", desc: "Custom campaign packages structured for local businesses, agencies, and non-profits." },
              { title: "AI-Powered Strategy", desc: "Using AI tools (ChatGPT, Claude) for audience research, creative copywriting, and rapid optimization." }
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all space-y-1.5 h-full shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center font-bold text-[11px]">
                  ✓
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-[var(--text-primary)]">{item.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* CAMPAIGN WORKFLOW PROCESS (REDUCED PADDING py-14) */}
      <section id="process" className="py-14 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Workflow</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Campaign Process</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">A battle-tested 6-step framework for launching profitable digital advertising campaigns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((p, idx) => (
              <div key={idx} className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] relative hover:border-[var(--text-primary)] transition-all shadow-sm h-full">
                <span className="font-display font-extrabold text-4xl text-[var(--border-color)] block mb-3">
                  {p.step}
                </span>
                <h3 className="font-heading font-bold text-lg text-[var(--text-primary)] mb-1.5">
                  {p.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* TESTIMONIALS SECTION (REDUCED PADDING py-14) */}
      <section className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Feedback</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Client Testimonials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col justify-between hover:border-[var(--text-primary)] transition-all shadow-sm h-full">
                <div className="space-y-3">
                  <div className="flex text-amber-500 gap-1 text-xs">
                    {"★★★★★"}
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-color)] mt-4">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-[var(--text-primary)]">{t.author}</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* FAQ SECTION (REDUCED PADDING py-14) */}
      <section id="faq" className="py-14 border-t border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-12 space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Questions</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Marketing FAQ</h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left font-heading font-bold text-sm sm:text-base text-[var(--text-primary)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-3"
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


      {/* CONTACT SECTION (REDUCED PADDING py-14) */}
      <section id="contact" className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Contact Info Left */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Start Scaling</span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mt-1 leading-tight">
                  Grow Your Business Today
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
                  Ready to launch high-ROAS Meta/Google ads, capture qualified leads, or build a conversion-focused landing page? Let's discuss your marketing strategy.
                </p>
              </div>

              <div className="space-y-3.5 font-medium text-xs sm:text-sm">
                <a href="mailto:contact@shahidkhan.site" className="p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center gap-3.5 hover:border-[var(--text-primary)] transition-all">
                  <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--text-muted)]">Direct Email</p>
                    <p className="font-heading font-bold text-[var(--text-primary)]">contact@shahidkhan.site</p>
                  </div>
                </a>

                <a href="tel:+919587867559" className="p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center gap-3.5 hover:border-[var(--text-primary)] transition-all">
                  <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--text-muted)]">Phone / WhatsApp</p>
                    <p className="font-heading font-bold text-[var(--text-primary)]">+91 95878 67559</p>
                  </div>
                </a>

                <div className="p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--text-muted)]">Location</p>
                    <p className="font-heading font-bold text-[var(--text-primary)]">Jaipur, Rajasthan, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Contact Form Right */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xl">
                
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[var(--text-primary)] mb-5">Book a Strategy Session</h3>

                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  
                  {formSubmitted && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Thank you! Your marketing inquiry has been saved to Firebase. I will get back to you shortly.</span>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Your Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        placeholder="Shahid Khan" 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder="you@example.com" 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Phone / WhatsApp *</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required
                        placeholder="+91 98765 43210" 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Business Name</label>
                      <input 
                        type="text" 
                        name="businessName" 
                        placeholder="Company or Brand Name" 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Marketing Service *</label>
                      <select 
                        name="serviceRequired"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      >
                        <option value="">Select Primary Goal...</option>
                        <option value="Meta Ads Campaign (FB & IG)">Meta Ads Campaign (FB & IG)</option>
                        <option value="Google Ads (Search & PMax)">Google Ads (Search & PMax)</option>
                        <option value="Lead Generation & Sales Funnels">Lead Generation & Sales Funnels</option>
                        <option value="High-Converting Landing Page">High-Converting Landing Page</option>
                        <option value="Meta Pixel & GA4 Setup">Meta Pixel & GA4 Setup</option>
                        <option value="NGO Campaign & Payment Portal">NGO Campaign & Payment Portal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Monthly Ad Budget</label>
                      <select 
                        name="budget"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                      >
                        <option value="Flexible">Flexible / Discuss Strategy</option>
                        <option value="₹15,000 - ₹30,000">₹15,000 - ₹30,000 / month</option>
                        <option value="₹30,000 - ₹75,000">₹30,000 - ₹75,000 / month</option>
                        <option value="₹75,000+">₹75,000+ / month</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Project Details *</label>
                    <textarea 
                      rows={3} 
                      name="message" 
                      required 
                      placeholder="Tell me about your product, current ad campaigns, or lead generation goals..." 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-xs sm:text-sm font-bold tracking-wide hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>{submitting ? 'Submitting Strategy Inquiry...' : 'Submit Marketing Inquiry ↗'}</span>
                  </button>

                </form>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* FLOATING ACTION BUTTON (WHATSAPP QUICK CHAT) */}
      <a 
        href="https://wa.me/919587867559?text=Hello%20Shahid,%20I%20want%20to%20discuss%20a%20digital%20marketing%20campaign%20for%20my%20business." 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-emerald-600 text-white shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center gap-2 group cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden group-hover:inline text-xs font-bold font-heading pr-1">Chat on WhatsApp</span>
      </a>


      {/* FOOTER */}
      <footer className="py-8 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <img 
              src="/LOGO.png" 
              alt="Shahid Khan Logo" 
              className="h-7 w-auto object-contain" 
            />
            <p className="text-[11px] font-semibold text-[var(--text-secondary)]">
              © {new Date().getFullYear()} Shahid Khan. Digital Marketing Specialist & Growth Strategist.
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs font-medium text-[var(--text-secondary)]">
            <a href="#about" className="hover:text-[var(--text-primary)]">About</a>
            <a href="#skills" className="hover:text-[var(--text-primary)]">Skills</a>
            <a href="#services" className="hover:text-[var(--text-primary)]">Services</a>
            <a href="#projects" className="hover:text-[var(--text-primary)]">Campaigns</a>
            <a href="#contact" className="hover:text-[var(--text-primary)]">Contact</a>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-[var(--text-primary)]">
            <a href="https://shahidkhan.site" target="_blank" rel="noreferrer" className="hover:underline">shahidkhan.site</a>
            <span>•</span>
            <a href="https://github.com/khanshahid33200-hash" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
          </div>

        </div>
      </footer>

    </div>
  );
}
