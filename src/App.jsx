import React, { useState, useEffect } from 'react';
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
  Globe
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio_theme') || 'light';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);
  }, [theme]);

  useEffect(() => {
    initMetaPixel();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const subject = formData.get('subject') || '';
    const message = formData.get('message') || '';

    try {
      if (db) {
        await addDoc(collection(db, "contacts"), {
          name,
          email,
          subject,
          message,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn("Firebase record notice:", err);
    }

    // Track Meta Pixel Lead event
    trackPixelEvent('Lead', {
      content_name: 'Portfolio Contact Form',
      value: 1.00,
      currency: 'USD'
    });

    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      
      {/* -------------------------------------------------------------
          NAVIGATION BAR
      ------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <a href="#" className="flex items-center gap-3 font-heading font-extrabold text-xl tracking-tight">
            <div className="w-8 h-8 bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center font-black rounded-sm clip-polygon">
              S
            </div>
            <span>Shahid Khan</span>
          </a>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#about" className="hover:text-[var(--text-primary)] transition-colors">About Me</a>
            <a href="#portfolio" className="hover:text-[var(--text-primary)] transition-colors">Portfolio</a>
            <a href="#services" className="hover:text-[var(--text-primary)] transition-colors">Services</a>
            <a href="#experience" className="hover:text-[var(--text-primary)] transition-colors">Experience</a>
            <a href="#contact" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold font-heading rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </>
              )}
            </button>

            <a 
              href="/Shahid_Khan_CV.pdf" 
              download 
              className="hidden sm:inline-flex items-center gap-1.5 font-heading font-semibold text-sm pb-0.5 border-b-2 border-[var(--text-primary)] hover:opacity-75 transition-opacity"
            >
              Download CV <ArrowUpRight className="w-4 h-4" />
            </a>

            {/* MOBILE MENU TOGGLE */}
            <button 
              className="md:hidden p-2 text-[var(--text-primary)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU OVERLAY */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-6 py-6 space-y-4 text-sm font-medium">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)]">About Me</a>
            <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Portfolio</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Services</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Experience</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Contact</a>
            <a href="/Shahid_Khan_CV.pdf" download className="inline-flex items-center gap-2 pt-2 text-[var(--text-primary)] font-semibold border-b border-[var(--text-primary)]">
              Download CV <Download className="w-4 h-4" />
            </a>
          </div>
        )}
      </header>

      {/* -------------------------------------------------------------
          HERO SECTION (MATCHING EDITORIAL REFERENCE DESIGN)
      ------------------------------------------------------------- */}
      <section id="about" className="pt-36 pb-20 border-b border-[var(--border-color)] min-h-[calc(100vh-80px)] flex items-center">
        <div class="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO LEFT COLUMN */}
            <div className="lg:col-span-7 relative lg:pl-12">
              
              {/* SIDEBAR VERTICAL TEXT */}
              <div className="hidden lg:flex absolute left-0 top-0 bottom-0 flex-col justify-between items-center border-r border-[var(--border-color)] pr-4 py-2">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium [writing-mode:vertical-rl] rotate-180">Digital Marketer</span>
                <span className="text-xs text-[var(--text-muted)] font-medium [writing-mode:vertical-rl] rotate-180">2026</span>
              </div>

              {/* STATS ROW */}
              <div className="flex items-center gap-12 mb-10">
                <div>
                  <h3 className="font-heading text-4xl lg:text-5xl font-light text-[var(--text-primary)]">+6</h3>
                  <p className="text-xs font-medium text-[var(--text-muted)] mt-1 uppercase tracking-wider">Projects completed</p>
                </div>
                <div>
                  <h3 className="font-heading text-xl lg:text-2xl font-normal text-[var(--text-primary)]">Meta & Google</h3>
                  <p className="text-xs font-medium text-[var(--text-muted)] mt-1 uppercase tracking-wider">Certified Ads Expert</p>
                </div>
              </div>

              {/* GIANT HEADLINE */}
              <h1 className="font-display text-7xl sm:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-none text-[var(--text-primary)] mb-6">
                Hello
              </h1>

              {/* SUBTITLE */}
              <p className="text-xl sm:text-2xl text-[var(--text-secondary)] font-normal mb-12 flex items-center gap-3">
                <span className="text-[var(--text-muted)]">—</span> I'm Shahid, a Digital Marketer & AI Website Creator
              </p>

              {/* SCROLL BUTTON */}
              <a href="#portfolio" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Scroll down <ArrowDown className="w-4 h-4" />
              </a>
            </div>

            {/* HERO RIGHT COLUMN (PORTRAIT CUTOUT PHOTO) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-color)] group">
                <img 
                  src="/shahid_photo.png" 
                  onError={(e) => { e.currentTarget.src = heroPhoto; }}
                  alt="Shahid Khan — Digital Marketer & AI Website Creator" 
                  className="w-full h-auto object-cover filter grayscale contrast-105 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500 transform group-hover:scale-102"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SERVICES & EXPERTISE SECTION
      ------------------------------------------------------------- */}
      <section id="services" className="py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">Core Expertise</div>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">Services & Tools</h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mb-16">
            Combining performance marketing strategy with AI automation tools and custom web development.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* SERVICE 1 */}
            <div className="p-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--border-dark)] hover:-translate-y-1 transition-all">
              <div className="font-heading text-sm font-semibold text-[var(--text-muted)] mb-6">01</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Digital Marketing & Paid Ads</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                Executing high-ROAS Meta Ads (FB & IG), Google Ads (Search/PMax), SEO strategies, and B2B/B2C lead generation funnels.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Meta Ads', 'Google Ads', 'SEO', 'ROAS Scaling'].map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]">{tag}</span>
                ))}
              </div>
            </div>

            {/* SERVICE 2 */}
            <div className="p-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--border-dark)] hover:-translate-y-1 transition-all">
              <div className="font-heading text-sm font-semibold text-[var(--text-muted)] mb-6">02</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">AI & Marketing Automation</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                Building automated lead nurturing workflows, prompt engineering models, and LLM integrations using Antigravity, ChatGPT, Claude, and n8n.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Antigravity', 'ChatGPT', 'Claude AI', 'n8n Automation'].map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]">{tag}</span>
                ))}
              </div>
            </div>

            {/* SERVICE 3 */}
            <div className="p-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--border-dark)] hover:-translate-y-1 transition-all">
              <div className="font-heading text-sm font-semibold text-[var(--text-muted)] mb-6">03</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Analytics & MarTech</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                Setting up event measurement, Meta Pixel tracking, Google Analytics 4 (GA4), and online payment processing via Razorpay.
              </p>
              <div className="flex flex-wrap gap-2">
                {['GA4', 'Meta Pixel', 'Razorpay Integration', 'CRM Setup'].map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]">{tag}</span>
                ))}
              </div>
            </div>

            {/* SERVICE 4 */}
            <div className="p-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--border-dark)] hover:-translate-y-1 transition-all">
              <div className="font-heading text-sm font-semibold text-[var(--text-muted)] mb-6">04</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Website Development</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                Creating fast, responsive business portals, NGO platforms, and conversion landing pages optimized for maximum customer action.
              </p>
              <div className="flex flex-wrap gap-2">
                {['HTML5/CSS3', 'JavaScript', 'Firebase', 'Supabase', 'Canva'].map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]">{tag}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          PORTFOLIO PROJECTS SECTION
      ------------------------------------------------------------- */}
      <section id="portfolio" className="py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">Selected Work</div>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">Featured Projects</h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mb-16">
            A showcase of custom websites, NGO platforms, payment integrations, and performance ad campaigns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* PROJECT 1 */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden flex flex-col justify-between hover:border-[var(--border-dark)] hover:-translate-y-1.5 transition-all">
              <div className="p-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Agency & Marketing</div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Media Levelling</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  Rebuilt agency digital infrastructure, optimized client conversion funnels, and executed multi-channel ad campaigns.
                </p>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">• Rebuilt agency website with performance analytics tracking</li>
                  <li className="flex items-center gap-2">• Executed Meta & Search campaigns for agency clients</li>
                  <li className="flex items-center gap-2">• Provided ongoing website support and lead routing</li>
                </ul>
              </div>
              <div className="px-8 py-5 bg-[var(--bg-hover)] border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">media-levelling.com</span>
                <a href="https://media-levelling.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider font-heading hover:underline">
                  Visit Site <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* PROJECT 2 */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden flex flex-col justify-between hover:border-[var(--border-dark)] hover:-translate-y-1.5 transition-all">
              <div className="p-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Retail & E-Commerce / CRM</div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Shree Jagdamba Furniture</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  Full business website, online booking system, custom admin dashboard, and Meta Ads lead generation funnel.
                </p>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">• Developed business portal with product booking & ordering</li>
                  <li className="flex items-center gap-2">• Built real-time lead management admin dashboard</li>
                  <li className="flex items-center gap-2">• Executed Meta Ads targeting local furniture buyers</li>
                </ul>
              </div>
              <div className="px-8 py-5 bg-[var(--bg-hover)] border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">Jaipur, Rajasthan</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-heading">Local Client</span>
              </div>
            </div>

            {/* PROJECT 3 */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden flex flex-col justify-between hover:border-[var(--border-dark)] hover:-translate-y-1.5 transition-all">
              <div className="p-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">NGO & Digital Fundraising</div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Shikva Foundation</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  Complete NGO web portal, donor management dashboard, Razorpay payment gateway integration, and digital fundraising campaigns.
                </p>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">• Built responsive web app with donation landing pages</li>
                  <li className="flex items-center gap-2">• Integrated Razorpay for automated receipt processing</li>
                  <li className="flex items-center gap-2">• Managed digital fundraising & donor social media drives</li>
                </ul>
              </div>
              <div className="px-8 py-5 bg-[var(--bg-hover)] border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">shikvafoundation.org</span>
                <a href="https://shikvafoundation.org" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider font-heading hover:underline">
                  Visit Site <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* PROJECT 4 */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden flex flex-col justify-between hover:border-[var(--border-dark)] hover:-translate-y-1.5 transition-all">
              <div className="p-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">NGO & Platform Management</div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Day Foundation</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  NGO web portal featuring intern & volunteer management workflows, payment gateway integration, and social media campaigns.
                </p>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">• Created volunteer & internship application portal</li>
                  <li className="flex items-center gap-2">• Integrated Razorpay payment gateway for registrations</li>
                  <li className="flex items-center gap-2">• Executed social media marketing campaigns across regions</li>
                </ul>
              </div>
              <div className="px-8 py-5 bg-[var(--bg-hover)] border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">dayfoundation.in</span>
                <a href="https://dayfoundation.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider font-heading hover:underline">
                  Visit Site <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* PROJECT 5 */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden flex flex-col justify-between hover:border-[var(--border-dark)] hover:-translate-y-1.5 transition-all">
              <div className="p-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Local Paid Advertising</div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Radhey Krishna Sports Shop</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  Interactive showroom website, hyper-local Meta/Instagram advertising, and local customer lead generation.
                </p>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">• Developed showroom website showcasing product catalog</li>
                  <li className="flex items-center gap-2">• Ran geo-targeted Meta ad campaigns driving store visits</li>
                  <li className="flex items-center gap-2">• Generated local customer leads & brand awareness</li>
                </ul>
              </div>
              <div className="px-8 py-5 bg-[var(--bg-hover)] border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">Local Business</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-heading">Lead Generation</span>
              </div>
            </div>

            {/* PROJECT 6 */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden flex flex-col justify-between hover:border-[var(--border-dark)] hover:-translate-y-1.5 transition-all">
              <div className="p-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Growth & Landing Pages</div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Additional Client Projects</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  Custom landing pages, lead capture setups, social media management, and local SEO for regional brands.
                </p>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">• Built mobile-first landing pages built for high conversion</li>
                  <li className="flex items-center gap-2">• Handled social media management & content scheduling</li>
                  <li className="flex items-center gap-2">• Executed local lead generation campaigns</li>
                </ul>
              </div>
              <div className="px-8 py-5 bg-[var(--bg-hover)] border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">Multiple Clients</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-heading">Ongoing Strategy</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          EXPERIENCE SECTION
      ------------------------------------------------------------- */}
      <section id="experience" className="py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">Career Path</div>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">Work Experience</h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mb-16">
            Track record of building digital solutions, optimizing paid advertising, and automating business workflows.
          </p>

          <div className="max-w-3xl border-l-2 border-[var(--border-color)] pl-8 space-y-8">
            <div className="relative">
              <div className="absolute -left-[41px] top-1.5 w-4 h-4 bg-[var(--text-primary)] rounded-full border-4 border-[var(--bg-primary)]"></div>
              <div className="text-xs font-semibold text-[var(--text-muted)] tracking-widest mb-1">2021 — PRESENT</div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">Freelance Digital Marketer & Website Developer</h3>
              <p className="text-sm font-medium text-[var(--text-secondary)] mb-4">Independent Practice — Jaipur, India</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Partnering with businesses, agencies, NGOs, and retail brands to develop custom websites, execute performance marketing campaigns on Meta & Google Ads, integrate CRM & Razorpay systems, and automate marketing operations using AI tools (Antigravity, n8n, ChatGPT).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          CONTACT SECTION & FORM
      ------------------------------------------------------------- */}
      <section id="contact" className="py-28 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 p-8 lg:p-14 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
            
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">Get In Touch</div>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-4">Let's work together.</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                Have a project or opportunity? Feel free to send a message or contact directly via email or phone.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-primary)]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase text-[var(--text-muted)] font-medium">Email Me</div>
                    <a href="mailto:contact@shahidkhan.site" className="text-sm font-bold text-[var(--text-primary)] hover:underline">contact@shahidkhan.site</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-primary)]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase text-[var(--text-muted)] font-medium">Call / WhatsApp</div>
                    <a href="tel:+919587867559" className="text-sm font-bold text-[var(--text-primary)] hover:underline">+91 9587867559</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-primary)]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase text-[var(--text-muted)] font-medium">Location</div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">Jaipur, Rajasthan, India</div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              {formSubmitted && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Thank you! Your message has been sent and saved to Firebase.
                </div>
              )}
              <div>
                <input type="text" name="name" required placeholder="Your Full Name" className="w-full px-4 py-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors" />
              </div>
              <div>
                <input type="email" name="email" required placeholder="Your Email Address" className="w-full px-4 py-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors" />
              </div>
              <div>
                <input type="text" name="subject" placeholder="Subject / Service Required" className="w-full px-4 py-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors" />
              </div>
              <div>
                <textarea rows={4} name="message" required placeholder="Your Message..." className="w-full px-4 py-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"></textarea>
              </div>
              <button type="submit" className="w-full py-4 rounded-lg bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-sm font-bold tracking-wide hover:opacity-90 transition-opacity cursor-pointer">
                Send Message ↗
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          FOOTER
      ------------------------------------------------------------- */}
      <footer className="py-12 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[var(--text-muted)]">
          <div>© 2026 Shahid Khan. All rights reserved. Built with React & Tailwind CSS.</div>
          <div className="flex gap-6">
            <a href="/Shahid_Khan_CV.pdf" download className="hover:text-[var(--text-primary)] transition-colors">Download CV (PDF)</a>
            <a href="mailto:contact@shahidkhan.site" className="hover:text-[var(--text-primary)] transition-colors">Email</a>
            <a href="tel:+919587867559" className="hover:text-[var(--text-primary)] transition-colors">Phone</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
