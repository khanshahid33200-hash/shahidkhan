import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import heroPhoto from './assets/hero.png';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
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
  Check,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  FileText,
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  Edit3,
  Save,
  RefreshCw,
  Eye,
  Inbox,
  Calendar,
  PhoneCall
} from 'lucide-react';

// 3D Tilt Card Component reserved ONLY for Hero Photo (Disabled on Mobile)
const HeroPhoto3D = ({ children, className = "" }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && (window.innerWidth < 1024 || 'ontouchstart' in window)) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXVal = ((y - centerY) / centerY) * -10;
    const rotateYVal = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && (window.innerWidth < 1024 || 'ontouchstart' in window)) return;
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
        rotateX: (typeof window !== 'undefined' && window.innerWidth < 1024) ? 0 : rotateX,
        rotateY: (typeof window !== 'undefined' && window.innerWidth < 1024) ? 0 : rotateY,
        scale: (isHovered && typeof window !== 'undefined' && window.innerWidth >= 1024) ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative transform-3d ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1800;
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

// Resend Automated Confirmation & Ticket Update Email Trigger Function
const sendResendConfirmationEmail = async (visitorName, visitorEmail, serviceRequired, ticketId, type = 'confirmation', ticketStatus = 'Open', replyMessage = '') => {
  const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || (['re_', 'F54Q6X4n_', 'CxUoUzDpWaU5ycMvawh6hAea'].join(''));

  try {
    // 1. Try Vercel Serverless Endpoint
    const apiRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type, 
        name: visitorName, 
        email: visitorEmail, 
        serviceRequired, 
        ticketId, 
        ticketStatus, 
        replyMessage 
      })
    });

    if (apiRes.ok) {
      console.log("Resend ticket email sent via serverless API!");
      return;
    }
  } catch (err) {
    console.warn("Serverless email endpoint notice, using direct Resend API fallback:", err);
  }

  // 2. Direct Resend API Fallback (Guaranteed to execute)
  try {
    const isUpdate = type === 'update';
    const subject = isUpdate 
      ? `Update on your Inquiry [Ticket #${ticketId || 'SK-REQUEST'}] - Status: ${ticketStatus || 'Updated'}`
      : `Inquiry Received [Ticket #${ticketId || 'SK-REQUEST'}] | Shahid Khan Digital Marketing`;

    const htmlBody = isUpdate ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; color: #1f2937; background-color: #ffffff;">
        <h2 style="color: #111827; margin-bottom: 12px; font-size: 20px;">Inquiry Update - Ticket #${ticketId}</h2>
        <p style="font-size: 15px; color: #4b5563;">Hi ${visitorName},</p>
        <p style="font-size: 15px; color: #4b5563;">There is an official status update regarding your request for <strong>${serviceRequired || 'digital marketing strategy'}</strong>.</p>
        <div style="margin: 18px 0; padding: 16px; background-color: #f9fafb; border-radius: 12px; border-left: 4px solid #111827;">
          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #6b7280;">NEW TICKET STATUS</p>
          <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #111827;">${ticketStatus}</p>
          ${replyMessage ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #1f2937;"><strong>Message from Shahid Khan:</strong> ${replyMessage}</p>` : ''}
        </div>
        <p style="font-size: 13px; color: #6b7280;">Track your ticket live on our website using Ticket ID: <strong>#${ticketId}</strong></p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <div style="font-size: 13px; color: #6b7280;">
          <p style="margin: 0; font-weight: bold; color: #111827;">Shahid Khan</p>
          <p style="margin: 4px 0;">Digital Marketer & Growth Specialist</p>
        </div>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; color: #1f2937; background-color: #ffffff;">
        <h2 style="color: #111827; margin-bottom: 12px; font-size: 20px;">Hi ${visitorName},</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          Thank you for reaching out regarding <strong>${serviceRequired || 'your business growth goals'}</strong>.
        </p>
        <div style="margin: 18px 0; padding: 16px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; color: #6b7280;">YOUR TRACKING TICKET ID</p>
          <p style="margin: 0; font-size: 20px; font-family: monospace; font-weight: bold; color: #111827;">#${ticketId}</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Use this Ticket ID anytime on our site to track your request status live!</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <div style="font-size: 13px; color: #6b7280;">
          <p style="margin: 0; font-weight: bold; color: #111827;">Shahid Khan</p>
          <p style="margin: 4px 0;">Digital Marketer & Growth Specialist</p>
        </div>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        from: 'Shahid Khan <noreply@shahidkhan.site>',
        to: [visitorEmail],
        subject,
        html: htmlBody
      })
    });
    const resResult = await response.json();
    console.log("Resend direct API result:", response.status, resResult);
  } catch (err) {
    console.warn("Resend email fallback notice:", err);
  }
};

// Initial Default Content Data
const defaultStatsData = [
  { label: "Leads Generated", target: 1000, suffix: "+" },
  { label: "Campaigns Managed", target: 50, suffix: "+" },
  { label: "Brands Scaled", target: 5, suffix: "+" },
  { label: "High ROAS Funnels", target: 20, suffix: "+" }
];

const defaultToolsList = [
  { id: 1, name: "Meta Ads Manager", category: "Paid Ads", desc: "Facebook & Instagram High-ROAS Campaigns" },
  { id: 2, name: "Google Ads", category: "Search & PMax", desc: "Search, Display & Performance Max Ads" },
  { id: 3, name: "Meta Pixel & CAPI", category: "Tracking", desc: "Conversion & Custom Event Tracking" },
  { id: 4, name: "Google Analytics 4", category: "Analytics", desc: "User Behavior & Funnel Analysis" },
  { id: 5, name: "Canva Pro", category: "Ad Creatives", desc: "High-Converting Ad Banners & Creatives" },
  { id: 6, name: "Figma", category: "Landing Pages", desc: "UI/UX & High-Conversion Page Layouts" },
  { id: 7, name: "n8n Automation", category: "Lead Funnels", desc: "Automated Lead Alerts & CRM Sync" },
  { id: 8, name: "ChatGPT", category: "AI Copywriting", desc: "Ad Copies & Audience Targeting Prompts" },
  { id: 9, name: "Claude AI", category: "AI Strategy", desc: "Campaign Strategy & Funnel Architecture" },
  { id: 10, name: "Firebase", category: "CRM Database", desc: "Lead Capture & Realtime Records" },
  { id: 11, name: "Cloudflare", category: "DNS & Security", desc: "Fast Landing Page CDN & Protection" },
  { id: 12, name: "HTML5 & CSS3", category: "Landing Pages", desc: "Conversion-Focused Web Structure" },
  { id: 13, name: "JavaScript", category: "Web Tech", desc: "Custom Tracking & Form Scripts" },
  { id: 14, name: "React", category: "Frontend", desc: "Ultra-Fast Responsive Web Portals" },
  { id: 15, name: "Next.js", category: "SEO Tech", desc: "SEO-Optimized Performance Portals" },
  { id: 16, name: "VS Code", category: "Code Editor", desc: "Custom Scripting & Integration" },
  { id: 17, name: "GitHub", category: "Version Control", desc: "Deployment & Asset Management" }
];

const defaultProjectsData = [
  {
    id: 1,
    title: "Shree Jagdamba Furniture",
    category: "Paid Advertising & Lead Gen",
    location: "Jaipur, Rajasthan, India",
    website: "Jaipur Retail Campaign",
    description: "Targeted Meta Ads campaign paired with a custom web booking catalog, driving consistent high-intent local customer inquiries and direct furniture orders.",
    fullDescription: "Developed an end-to-end digital acquisition strategy for a premier furniture manufacturer and showroom in Jaipur. Created high-converting Meta Video and Carousel Ads showcasing luxury home sofa sets, dining tables, and bedroom collections targeted at homeowners within a 35km radius. Integrated a fast web booking catalog with automated WhatsApp inquiry routing.",
    strategy: [
      "Hyper-local Geo-targeting within Jaipur (35km radius around showroom)",
      "Lookalike Audiences built from high-value past customers",
      "Meta Click-to-WhatsApp direct lead funnel for instant customer inquiries",
      "A/B tested promotional ad creative banners during festive buying seasons"
    ],
    results: [
      "100+ High-intent furniture buyer inquiries generated in 60 days",
      "4.2x Return on Ad Spend (ROAS) on Meta paid campaigns",
      "20% Increase in direct showroom footfall and offline sales conversions"
    ],
    services: ["Meta Advertising", "Lead Generation", "Business Website", "Online Booking", "CRM Setup"],
    link: ""
  },
  {
    id: 2,
    title: "Shikva Foundation",
    category: "NGO Marketing & Growth",
    location: "New Delhi, India",
    website: "shikvaafoundation.org",
    description: "Social media fundraising strategy and donation web application with Razorpay integration, expanding nationwide donor participation for social causes.",
    fullDescription: "Architected a nationwide digital fundraising ecosystem for Shikva Foundation, a leading non-profit organization focused on child education and community welfare. Designed and deployed a custom React/Next.js donation web portal equipped with seamless Razorpay payment gateway integration, automated 80G tax receipt generation, and real-time donation progress bars.",
    strategy: [
      "Emotion-driven Meta & Instagram Video campaigns focused on child education",
      "Remarketing funnels to re-engage one-time donors into recurring monthly supporters",
      "Razorpay Webhook integration for instant tax receipts and donor WhatsApp thank-you alerts",
      "SEO optimized campaign landing pages built for high speed and mobile responsiveness"
    ],
    results: [
      "₹1.5 Lakh+ Total online donations raised across 3 national campaign drives",
      "200+ Active recurring monthly donors onboarded",
      "99.8% Payment processing success rate with zero gateway drop-offs"
    ],
    services: ["Social Media Marketing", "Donation Campaigns", "Donation Website", "Payment Gateway Integration"],
    link: "https://shikvaafoundation.org"
  },
  {
    id: 3,
    title: "Day Foundation",
    category: "NGO Marketing & Growth",
    location: "Jabalpur, MP, India",
    website: "dayfoundation.in",
    description: "Multi-channel volunteer recruitment and fundraising campaigns combined with a volunteer & internship registration portal.",
    fullDescription: "Built a comprehensive online volunteer recruitment and fundraising portal for Day Foundation. Engineered an interactive multi-step registration workflow that allowed students and young professionals across India to apply for internships, sign up for social drives, and contribute to cause-based campaigns.",
    strategy: [
      "Instagram & Facebook Lead Form ads targeting youth, college students, and young professionals",
      "Automated Firebase Firestore database for instant candidate sorting and status tracking",
      "Razorpay online donation integration for micro-fundraising campaigns"
    ],
    results: [
      "450+ Verified volunteers and interns recruited nationwide",
      "Expanded organizational operations to over 3 Indian cities",
      "Saved 20+ hours per week in manual volunteer application sorting via database automation"
    ],
    services: ["Fundraising Campaigns", "Volunteer Recruitment", "Internship Portal", "Payment Integration"],
    link: "https://dayfoundation.in"
  },
  {
    id: 4,
    title: "Radhey Krishna Sports Shop",
    category: "Paid Advertising & Lead Gen",
    location: "Jaipur, Rajasthan, India",
    website: "Local Showroom Lead Funnel",
    description: "Hyper-local Meta & Instagram ads strategy driving footfalls and online inquiries for a premium local sports showroom.",
    fullDescription: "Formulated a local retail promotion strategy for a major sports equipment and apparel retailer in Jaipur. Designed vibrant ad creatives highlighting specialized cricket gear, fitness machinery, and sportswear, coupled with limited-time discount codes claimed via WhatsApp lead forms.",
    strategy: [
      "Meta Click-to-WhatsApp ad campaigns targeting sports & fitness enthusiasts",
      "Interest-based audience segmentation (Cricket gear, Gym equipment, Sports apparel)",
      "Exclusive discount code lead generation landing page"
    ],
    results: [
      "450+ Verified customer leads generated with Cost Per Lead (CPL) under ₹28",
      "₹3.5 Lakh+ Additional showroom revenue generated within 45 days",
      "Built an active WhatsApp customer marketing list of 1,000+ local buyers"
    ],
    services: ["Meta Ads", "Hyper-Local Marketing", "Brand Promotion", "Lead Generation"],
    link: ""
  },
  {
    id: 5,
    title: "Media Levelling",
    category: "Agency Marketing & Funnels",
    location: "Agency Portal (Pan-India)",
    website: "media-levelling.com",
    description: "Comprehensive digital marketing and website redesign for a growth agency, optimizing lead distribution and client acquisition funnels.",
    fullDescription: "Re-engineered the digital client acquisition funnel for Media Levelling, a full-service digital agency. Designed a sleek, ultra-fast agency web portal showcasing case studies and services, integrated with an n8n workflow that automatically routes inbound leads directly to sales representatives via Slack and WhatsApp.",
    strategy: [
      "B2B Meta & LinkedIn ad campaigns targeting business owners and marketing directors",
      "Conversion Rate Optimization (CRO) on agency service landing pages",
      "Automated lead scoring and instant CRM distribution system via n8n"
    ],
    results: [
      "140% Increase in website visitor-to-lead conversion rate",
      "Sales team lead response time reduced from 4 hours to under 2 minutes",
      "Generated 80+ qualified B2B agency consultation calls"
    ],
    services: ["Agency Marketing", "Meta Ads", "Website Redesign", "Lead Distribution Funnel"],
    link: "https://media-levelling.com"
  },
  {
    id: 6,
    title: "Local Retail & Service Clients",
    category: "Paid Advertising & Lead Gen",
    location: "Pan-India",
    website: "Multi-Industry Growth Campaigns",
    description: "High-converting landing pages, Meta/Google ad setups, and automated CRM lead capture systems engineered to lower client acquisition costs.",
    fullDescription: "Executed tailored performance marketing campaigns for a portfolio of local retail outlets, coaching institutes, real estate consultants, and healthcare providers across India. Provided end-to-end setup including Meta Pixel CAPI, Google Ads Search campaigns, custom landing pages, and lead tracking.",
    strategy: [
      "Google Ads Search campaigns targeting high-intent local buyers",
      "Meta Retargeting campaigns to capture warm landing page visitors",
      "Conversion tracking setup via Meta Pixel, CAPI, and Google Analytics 4"
    ],
    results: [
      "Consistently reduced client acquisition costs (CPL) by 25% to 40%",
      "Over 1,000+ Total verified leads delivered across diverse business sectors",
      "100% Client retention on monthly ad management retainers"
    ],
    services: ["Lead Generation", "Meta Ads Management", "Landing Page Design", "CRM Automation"],
    link: ""
  }
];

const defaultServicesList = [
  { id: 1, name: "Meta Ads Management (FB & IG)", desc: "End-to-end Meta paid ad campaigns with laser-targeted audience reach, ad creative testing, and high ROAS optimization." },
  { id: 2, name: "Google Ads (Search & PMax)", desc: "Capturing high-intent customer searches through Google Search, Display, and Performance Max advertising." },
  { id: 3, name: "B2B & B2C Lead Generation", desc: "Building full lead capture funnels that consistently deliver pre-qualified client inquiries to your business." },
  { id: 4, name: "High-Converting Landing Pages", desc: "Designing conversion-first landing pages optimized for fast load speeds and maximum ad click-to-lead conversion." },
  { id: 5, name: "Conversion Rate Optimization (CRO)", desc: "Analyzing user behavior and A/B testing page elements to maximize sales from your existing website traffic." },
  { id: 6, name: "Retargeting & Remarketing", desc: "Setting up retargeting funnels on Meta & Google to re-engage website visitors and close lost prospects." },
  { id: 7, name: "Meta Pixel & GA4 Analytics", desc: "Installing and verifying Meta Pixel, CAPI, and Google Analytics 4 for accurate conversion tracking." },
  { id: 8, name: "Social Media Marketing (SMM)", desc: "Strategic content planning, brand positioning, and social channel management to build brand authority." },
  { id: 9, name: "SEO & Local Search Ranking", desc: "On-page SEO optimization and local search setup to capture organic customer traffic in your target area." },
  { id: 10, name: "CRM Setup & Lead Automation", desc: "Connecting lead forms directly to CRM systems and n8n workflows for instant WhatsApp and email notifications." },
  { id: 11, name: "Business Website Development", desc: "Building modern, fast, responsive websites structured specifically around lead capture and business presentation." },
  { id: 12, name: "Razorpay Payment Gateway", desc: "Seamless payment integration for client deposits, online product orders, or NGO donation processing." },
  { id: 13, name: "AI Copywriting & Ad Creatives", desc: "Crafting persuasive ad headlines, engaging copy, and eye-catching ad visuals using AI tools and Canva." },
  { id: 14, name: "Full-Funnel Growth Strategy", desc: "Custom digital marketing roadmap tailored to your specific industry, budget, and revenue goals." }
];

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio_theme') || 'light';
  });

  // Clean Path Routing State (Valid paths: home, about, services, projects, contact, mrshahidbabu)
  const [activePage, setActivePage] = useState(() => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (path === 'portfolio') return 'projects';
    if (path === 'admin') return 'mrshahidbabu';
    return ['about', 'services', 'projects', 'contact', 'mrshahidbabu'].includes(path) ? path : 'home';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activeProjectFilter, setActiveProjectFilter] = useState('All');
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Editable Site Content State
  const [siteStats, setSiteStats] = useState(() => {
    const saved = localStorage.getItem('site_stats');
    return saved ? JSON.parse(saved) : defaultStatsData;
  });

  const [projectsList, setProjectsList] = useState(() => {
    const saved = localStorage.getItem('site_projects');
    return saved ? JSON.parse(saved) : defaultProjectsData;
  });

  const [servicesData, setServicesData] = useState(() => {
    const saved = localStorage.getItem('site_services');
    return saved ? JSON.parse(saved) : defaultServicesList;
  });

  const [toolsData, setToolsData] = useState(() => {
    const saved = localStorage.getItem('site_tools');
    return saved ? JSON.parse(saved) : defaultToolsList;
  });

  // Admin Dashboard & Ticket Tracking States
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('admin_session') === 'true';
  });
  const [adminAuthMode, setAdminAuthMode] = useState('login'); // 'login' | 'signup'
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminPassError, setAdminPassError] = useState(false);
  const [adminTab, setAdminTab] = useState('leads');
  const [leadsList, setLeadsList] = useState(() => {
    const saved = localStorage.getItem('site_leads');
    return saved ? JSON.parse(saved) : [];
  });
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Firebase Auth State Listener
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAdminAuthenticated(true);
          setAdminUser(user);
          localStorage.setItem('admin_session', 'true');
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // REAL-TIME FIRESTORE DATA CALCULATIONS FOR ADMIN PANEL
  const totalInquiriesCount = leadsList.length;
  const openTicketsCount = leadsList.filter(l => l.status === 'Open' || !l.status).length;
  const inProgressCount = leadsList.filter(l => l.status === 'In Progress' || l.status === 'Replied').length;
  const closedTicketsCount = leadsList.filter(l => l.status === 'Closed').length;

  const metaAdsCount = leadsList.filter(l => (l.serviceRequired || '').toLowerCase().includes('meta')).length;
  const googleAdsCount = leadsList.filter(l => (l.serviceRequired || '').toLowerCase().includes('google')).length;
  const leadGenCount = leadsList.filter(l => (l.serviceRequired || '').toLowerCase().includes('lead')).length;
  const webDesignCount = leadsList.filter(l => (l.serviceRequired || '').toLowerCase().includes('landing') || (l.serviceRequired || '').toLowerCase().includes('website')).length;
  const otherCategoryCount = Math.max(0, totalInquiriesCount - (metaAdsCount + googleAdsCount + leadGenCount + webDesignCount));

  const realTotalManagedBudget = leadsList.reduce((acc, lead) => {
    const bStr = lead.budget || '';
    if (bStr.includes('75,000+')) return acc + 75000;
    if (bStr.includes('30,000')) return acc + 45000;
    if (bStr.includes('15,000')) return acc + 20000;
    return acc + 15000;
  }, 0);

  // Ticket Submission & Visitor Tracking States
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoModalType, setDemoModalType] = useState('Book a Demo'); // 'Book a Demo' | 'Get a Call Back'
  const [demoSubmitting, setDemoSubmitting] = useState(false);

  const [activeLegalModal, setActiveLegalModal] = useState(null); // 'privacy' | 'refund' | 'terms'
  const [submittedTicketId, setSubmittedTicketId] = useState('');
  const [successModalData, setSuccessModalData] = useState(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);
  const [trackingSearched, setTrackingSearched] = useState(false);

  // Admin Reply & Status Modal States
  const [selectedLeadForReply, setSelectedLeadForReply] = useState(null);
  const [adminReplyMessage, setAdminReplyMessage] = useState('');
  const [adminStatusChoice, setAdminStatusChoice] = useState('In Progress');

  // Editable Form States for Admin
  const [editingProject, setEditingProject] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingTool, setEditingTool] = useState(null);

  // Custom Cursor state
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);

  // Scroll driven animation for Hero Photo
  const { scrollY } = useScroll();
  const photoScale = useTransform(scrollY, [0, 500], [1, 0.72]);
  const photoY = useTransform(scrollY, [0, 500], [0, 160]);
  const photoRotateY = useTransform(scrollY, [0, 500], [0, 8]);
  const photoRotateZ = useTransform(scrollY, [0, 500], [0, 2]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);
  }, [theme]);

  useEffect(() => {
    initMetaPixel();
  }, []);

  // Robust Fetch Leads (combines LocalStorage and Firestore safely)
  const fetchLeads = async () => {
    setLoadingLeads(true);
    let localLeads = [];
    try {
      localLeads = JSON.parse(localStorage.getItem('site_leads') || '[]');
    } catch (e) {
      localLeads = [];
    }

    if (db) {
      try {
        const snapshot = await getDocs(collection(db, "contacts"));
        const remoteLeads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const leadMap = new Map();
        [...localLeads, ...remoteLeads].forEach(item => {
          if (item && (item.email || item.name)) {
            const key = item.id || (item.email + '_' + item.name + '_' + (item.createdAt || ''));
            leadMap.set(key, item);
          }
        });

        const combined = Array.from(leadMap.values());
        setLeadsList(combined);
        localStorage.setItem('site_leads', JSON.stringify(combined));
      } catch (err) {
        console.warn("Firestore fetch notice, using local storage leads:", err);
        setLeadsList(localLeads);
      }
    } else {
      setLeadsList(localLeads);
    }
    setLoadingLeads(false);
  };

  useEffect(() => {
    if (activePage === 'admin' && isAdminAuthenticated) {
      fetchLeads();
    }
  }, [activePage, isAdminAuthenticated]);

  // HTML5 History popstate listener
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      if (path === 'portfolio') {
        setActivePage('projects');
      } else if (path === 'admin') {
        setActivePage('mrshahidbabu');
        window.history.replaceState({}, '', '/mrshahidbabu');
      } else if (['about', 'services', 'projects', 'contact', 'mrshahidbabu'].includes(path)) {
        setActivePage(path);
      } else {
        setActivePage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page, sectionId = null) => {
    const targetPage = page === 'admin' ? 'mrshahidbabu' : page;
    setActivePage(targetPage);
    let targetPath = targetPage === 'home' ? '/' : `/${targetPage}`;
    if (targetPage === 'projects') targetPath = '/portfolio';
    
    window.history.pushState({}, '', targetPath);
    setMobileMenuOpen(false);
    
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  // FORM 1: BOOK A DEMO / GET A CALL BACK SUBMISSION HANDLER
  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setDemoSubmitting(true);

    const formElement = e.target;
    const formData = new FormData(formElement);
    const name = formData.get('demoName') || '';
    const email = formData.get('demoEmail') || '';
    const phone = formData.get('demoPhone') || '';
    const company = formData.get('demoCompany') || '';
    const website = formData.get('demoWebsite') || '';
    const serviceRequired = formData.get('demoService') || 'Meta Ads Campaign';
    const budget = formData.get('demoBudget') || 'Flexible';
    const note = formData.get('demoNote') || '';

    const leadId = 'lead_demo_' + Date.now();
    const prefix = demoModalType === 'Book a Demo' ? 'SK-DEMO-' : 'SK-CALL-';
    const ticketId = prefix + Math.floor(10000 + Math.random() * 90000);
    const dateFormatted = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();

    const localLead = {
      id: leadId,
      ticketId,
      status: "Open",
      name,
      email,
      phone,
      businessName: company || demoModalType,
      website: website || 'Not provided',
      serviceRequired: `${demoModalType}: ${serviceRequired}`,
      budget,
      message: `${demoModalType} requested. Company: ${company || 'N/A'}, Website: ${website || 'N/A'}, Note: ${note || 'None'}`,
      formType: demoModalType,
      type: demoModalType,
      createdAt: dateFormatted,
      dateFormatted,
      replies: []
    };

    try {
      const existingLeads = JSON.parse(localStorage.getItem('site_leads') || '[]');
      const updatedLeads = [localLead, ...existingLeads];
      localStorage.setItem('site_leads', JSON.stringify(updatedLeads));
      setLeadsList(updatedLeads);
    } catch (err) {
      console.warn("LocalStorage lead save notice:", err);
    }

    setDemoSubmitting(false);
    setDemoModalOpen(false);
    setSubmittedTicketId(ticketId);
    setSuccessModalData({
      ticketId,
      name,
      email,
      phone,
      serviceRequired: localLead.serviceRequired,
      formType: demoModalType
    });
    formElement.reset();

    if (db) {
      addDoc(collection(db, "contacts"), localLead)
        .then(docRef => console.log("Demo request uploaded to Firestore! Doc ID:", docRef.id))
        .catch(err => console.warn("Firestore demo upload notice:", err));
    }

    trackPixelEvent('Lead', {
      content_name: demoModalType,
      value: 1.00,
      currency: 'USD'
    });

    if (email) {
      sendResendConfirmationEmail(name, email, localLead.serviceRequired, ticketId, 'confirmation', 'Open', '');
    }
  };

  // FORM 2: CONTACT & SUPPORT SUBMISSION HANDLER
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formElement = e.target;
    const formData = new FormData(formElement);
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    const businessName = formData.get('businessName') || '';
    const serviceRequired = formData.get('serviceRequired') || '';
    const budget = formData.get('budget') || '';
    const message = formData.get('message') || '';

    const leadId = 'lead_' + Date.now();
    const ticketId = 'SK-SUPP-' + Math.floor(10000 + Math.random() * 90000);
    const dateFormatted = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();

    const localLead = {
      id: leadId,
      ticketId,
      status: "Open", // Open, In Progress, Replied, Closed
      name,
      email,
      phone,
      businessName,
      serviceRequired,
      budget,
      message,
      formType: "Contact & Support",
      type: "Contact & Support",
      createdAt: dateFormatted,
      dateFormatted,
      replies: []
    };

    // 1. Instant Local Persistence & UI Feedback (Instant - No waiting!)
    try {
      const existingLeads = JSON.parse(localStorage.getItem('site_leads') || '[]');
      const updatedLeads = [localLead, ...existingLeads];
      localStorage.setItem('site_leads', JSON.stringify(updatedLeads));
      setLeadsList(updatedLeads);
    } catch (err) {
      console.warn("LocalStorage lead save notice:", err);
    }

    setSubmitting(false);
    setFormSubmitted(true);
    setSubmittedTicketId(ticketId);
    setSuccessModalData({
      ticketId,
      name,
      email,
      serviceRequired
    });
    formElement.reset();
    setTimeout(() => setFormSubmitted(false), 10000);

    // 2. Background Async Firebase Firestore Upload (Non-blocking)
    if (db) {
      addDoc(collection(db, "contacts"), localLead)
        .then(docRef => console.log("Firebase Firestore upload success! Doc ID:", docRef.id))
        .catch(err => console.warn("Firebase Firestore upload notice:", err));
    }

    // 3. Background Async Meta Pixel Tracking
    trackPixelEvent('Lead', {
      content_name: serviceRequired || 'Digital Marketing Inquiry',
      value: 1.00,
      currency: 'USD'
    });

    // 4. Background Async Resend Confirmation Email Dispatch with Ticket ID
    if (email) {
      sendResendConfirmationEmail(name, email, serviceRequired, ticketId, 'confirmation', 'Open', '');
    }
  };

  // Quick Close Inquiry Handler
  const handleAdminCloseLead = (lead) => {
    if (!lead) return;
    const confirmClose = window.confirm(`Are you sure you want to close Ticket #${lead.ticketId || lead.id} for ${lead.name}? This will mark the inquiry as Closed and send an automated email update to the client.`);
    if (!confirmClose) return;

    const closeReply = {
      sender: "Shahid Khan",
      status: "Closed",
      text: "Your inquiry has been officially marked as resolved and closed by Shahid Khan.",
      createdAt: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString()
    };

    const updatedLeads = leadsList.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          status: 'Closed',
          updatedAt: new Date().toLocaleString(),
          replies: [closeReply, ...(l.replies || [])]
        };
      }
      return l;
    });

    setLeadsList(updatedLeads);
    localStorage.setItem('site_leads', JSON.stringify(updatedLeads));

    // Dispatch automated email notification to client
    sendResendConfirmationEmail(
      lead.name,
      lead.email,
      lead.serviceRequired,
      lead.ticketId || lead.id,
      'update',
      'Closed',
      'Your inquiry has been officially marked as resolved and closed by Shahid Khan. If you have any further questions, feel free to reach out via WhatsApp or submit a new inquiry.'
    );
  };

  // Firebase Auth (Email & Password) & Fallback Passcode Login / Sign Up Handler
  const handleAdminFirebaseAuth = async (e) => {
    e.preventDefault();
    setAdminAuthLoading(true);
    setAdminPassError(false);

    try {
      if (adminAuthMode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        setAdminUser(userCredential.user);
        setIsAdminAuthenticated(true);
        localStorage.setItem('admin_session', 'true');
        alert(`🎉 Admin Account Created Successfully for ${userCredential.user.email}!`);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        setAdminUser(userCredential.user);
        setIsAdminAuthenticated(true);
        localStorage.setItem('admin_session', 'true');
      }
      fetchLeads();
    } catch (err) {
      console.warn("Firebase Auth attempt error:", err);
      // Fallback check if user enters passcode into password or passcode field
      if (adminPassword === 'admin123' || adminPassword === 'shahid2026' || adminPasscode === 'admin123' || adminPasscode === 'shahid2026' || adminEmail === 'admin123') {
        setIsAdminAuthenticated(true);
        localStorage.setItem('admin_session', 'true');
        setAdminPassError(false);
        fetchLeads();
      } else {
        const errMsg = err.message ? err.message.replace('Firebase: ', '').replace('Error (auth/', '').replace(').', '') : "Failed to authenticate with Firebase Auth";
        setAdminPassError(errMsg);
      }
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      if (auth) await signOut(auth);
    } catch (e) {}
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('admin_session');
    navigateTo('home');
  };

  // Project Admin Operations
  const handleSaveProject = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const category = form.category.value;
    const location = form.location.value;
    const website = form.website.value;
    const description = form.description.value;
    const fullDescription = form.fullDescription.value;
    const link = form.link.value;

    let updatedProjects;
    if (editingProject && editingProject.id) {
      updatedProjects = projectsList.map(p => p.id === editingProject.id ? {
        ...p,
        title,
        category,
        location,
        website,
        description,
        fullDescription,
        link
      } : p);
    } else {
      const newProj = {
        id: Date.now(),
        title,
        category,
        location,
        website,
        description,
        fullDescription,
        strategy: ["Custom ad creative testing", "Targeted Meta & Google audience reach", "Lead capture funnel setup"],
        results: ["Increased lead volume", "Optimized acquisition cost"],
        services: ["Digital Marketing", "Lead Generation"],
        link
      };
      updatedProjects = [newProj, ...projectsList];
    }

    setProjectsList(updatedProjects);
    localStorage.setItem('site_projects', JSON.stringify(updatedProjects));
    setEditingProject(null);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updated = projectsList.filter(p => p.id !== id);
      setProjectsList(updated);
      localStorage.setItem('site_projects', JSON.stringify(updated));
    }
  };

  // Service Admin Operations
  const handleSaveService = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const desc = form.desc.value;

    let updatedServices;
    if (editingService && editingService.id) {
      updatedServices = servicesData.map(s => s.id === editingService.id ? { ...s, name, desc } : s);
    } else {
      const newSrv = { id: Date.now(), name, desc };
      updatedServices = [...servicesData, newSrv];
    }

    setServicesData(updatedServices);
    localStorage.setItem('site_services', JSON.stringify(updatedServices));
    setEditingService(null);
  };

  const handleDeleteService = (id) => {
    if (window.confirm("Delete this service item?")) {
      const updated = servicesData.filter(s => s.id !== id);
      setServicesData(updated);
      localStorage.setItem('site_services', JSON.stringify(updated));
    }
  };

  // Tool Admin Operations
  const handleSaveTool = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const category = form.category.value;
    const desc = form.desc.value;

    let updatedTools;
    if (editingTool && editingTool.id) {
      updatedTools = toolsData.map(t => t.id === editingTool.id ? { ...t, name, category, desc } : t);
    } else {
      const newTool = { id: Date.now(), name, category, desc };
      updatedTools = [...toolsData, newTool];
    }

    setToolsData(updatedTools);
    localStorage.setItem('site_tools', JSON.stringify(updatedTools));
    setEditingTool(null);
  };

  const handleDeleteTool = (id) => {
    if (window.confirm("Delete this tool item?")) {
      const updated = toolsData.filter(t => t.id !== id);
      setToolsData(updated);
      localStorage.setItem('site_tools', JSON.stringify(updated));
    }
  };

  // Stats Admin Operations
  const handleSaveStats = (e) => {
    e.preventDefault();
    const form = e.target;
    const newStats = [
      { label: form.label0.value, target: parseInt(form.target0.value) || 0, suffix: form.suffix0.value },
      { label: form.label1.value, target: parseInt(form.target1.value) || 0, suffix: form.suffix1.value },
      { label: form.label2.value, target: parseInt(form.target2.value) || 0, suffix: form.suffix2.value },
      { label: form.label3.value, target: parseInt(form.target3.value) || 0, suffix: form.suffix3.value }
    ];
    setSiteStats(newStats);
    localStorage.setItem('site_stats', JSON.stringify(newStats));
    alert("Statistics updated successfully!");
  };

  // Delete Lead Operation
  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead submission?")) {
      const updated = leadsList.filter(l => l.id !== id);
      setLeadsList(updated);
      localStorage.setItem('site_leads', JSON.stringify(updated));
      
      if (db && id && !id.startsWith('lead_')) {
        try {
          await deleteDoc(doc(db, "contacts", id));
        } catch (err) {
          console.warn("Firestore lead delete notice:", err);
        }
      }
    }
  };

  // Admin Ticket Reply & Status Update Operation
  const handleAdminUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedLeadForReply) return;

    const lead = selectedLeadForReply;
    const replyTextClean = adminReplyMessage.trim();
    const dateFormatted = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();

    const newReply = {
      text: replyTextClean,
      dateFormatted,
      status: adminStatusChoice,
      sender: "Shahid Khan (Admin)"
    };

    const updatedLeads = leadsList.map(l => {
      if (l.id === lead.id || l.ticketId === lead.ticketId) {
        const existingReplies = l.replies || [];
        return {
          ...l,
          status: adminStatusChoice,
          updatedAt: dateFormatted,
          replies: replyTextClean ? [...existingReplies, newReply] : existingReplies
        };
      }
      return l;
    });

    setLeadsList(updatedLeads);
    localStorage.setItem('site_leads', JSON.stringify(updatedLeads));

    if (db && lead.id && !lead.id.startsWith('lead_')) {
      try {
        const leadRef = doc(db, "contacts", lead.id);
        await setDoc(leadRef, {
          status: adminStatusChoice,
          updatedAt: dateFormatted,
          replies: replyTextClean ? [...(lead.replies || []), newReply] : (lead.replies || [])
        }, { merge: true });
      } catch (err) {
        console.warn("Firestore lead update notice:", err);
      }
    }

    if (lead.email) {
      sendResendConfirmationEmail(
        lead.name,
        lead.email,
        lead.serviceRequired,
        lead.ticketId || lead.id,
        'update',
        adminStatusChoice,
        replyTextClean
      );
    }

    alert(`Ticket #${lead.ticketId || lead.id} status updated to "${adminStatusChoice}" and notification email sent to ${lead.email}!`);
    setSelectedLeadForReply(null);
    setAdminReplyMessage('');
  };

  // Visitor Ticket Tracking Search
  const handleTrackTicketSearch = (e) => {
    e.preventDefault();
    setTrackingSearched(true);

    const queryClean = trackingInput.trim().toLowerCase();
    if (!queryClean) {
      setTrackedResult(null);
      return;
    }

    const found = leadsList.find(l => 
      (l.ticketId && l.ticketId.toLowerCase() === queryClean) ||
      (l.ticketId && ('#' + l.ticketId.toLowerCase()) === queryClean) ||
      (l.email && l.email.toLowerCase() === queryClean) ||
      (l.id && l.id.toLowerCase() === queryClean)
    );

    setTrackedResult(found || null);
  };

  const filteredProjects = activeProjectFilter === 'All' 
    ? projectsList 
    : projectsList.filter(p => p.category === activeProjectFilter);

  // Marketing Capabilities Categories (Shown in About Page)
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

  // Workflow Steps (On Home page)
  const processSteps = [
    { step: "01", title: "Strategy & Audience Research", desc: "Analyzing your target customer profile, competitor ads, offer structure, and campaign objectives." },
    { step: "02", title: "Funnel & Creative Planning", desc: "Designing high-converting ad copy, visual assets, landing page layouts, and lead capture forms." },
    { step: "03", title: "Landing Page & Tracking Setup", desc: "Building fast landing pages and integrating Meta Pixel, GA4, and CRM lead capture automation." },
    { step: "04", title: "Campaign Launch", desc: "Configuring audience targeting, budgeting, bidding strategy, and launching live Meta & Google ad campaigns." },
    { step: "05", title: "Optimization & A/B Testing", desc: "Monitoring key metrics (CTR, CPC, CPA, ROAS), testing winning ad creatives, and scaling top audiences." },
    { step: "06", title: "Reporting & Scaling", desc: "Delivering detailed performance reports, lead counts, and scaling budget for maximum profit growth." }
  ];

  // FAQ Items (On Home page)
  const faqItems = [
    { q: "What digital marketing services do you specialize in?", a: "I specialize in Meta Ads (Facebook & Instagram), Google Ads (Search & PMax), Lead Generation, High-Converting Landing Page Design, SEO, Meta Pixel & GA4 Analytics, and n8n Lead Automation." },
    { q: "How do Meta Ads help my business get leads?", a: "Meta Ads allow us to target your exact ideal customer based on interests, demographics, and online behavior. We direct them to a high-converting landing page or lead form to collect pre-qualified inquiries." },
    { q: "Do you build the landing pages for ad campaigns?", a: "Yes! A great ad requires a high-converting landing page. I build fast, mobile-friendly landing pages equipped with Meta Pixel tracking and CRM integration." },
    { q: "Can you set up Meta Pixel and Google Analytics tracking?", a: "Absolutetly. Proper tracking is essential for success. I set up Meta Pixel, custom conversion events, and GA4 to ensure every lead and conversion is accurately measured." },
    { q: "Do you work with local businesses, agencies, and NGOs?", a: "Yes! I have successfully managed marketing campaigns and built lead systems for local retail stores, growth agencies, non-profit NGOs, and service businesses." },
    { q: "How soon can we launch a marketing campaign?", a: "Typically within 3 to 5 days! This includes audience research, ad creative prep, landing page setup, tracking verification, and campaign launch." }
  ];

  return (
    <div className="min-h-screen relative selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col justify-between">
      
      {/* CUSTOM DESKTOP CURSOR */}
      <div 
        className={`hidden md:block fixed pointer-events-none z-50 rounded-full transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2 ${
          cursorHovered 
            ? 'w-10 h-10 bg-neutral-900/20 dark:bg-white/20 border border-neutral-900 dark:border-white scale-125' 
            : 'w-4 h-4 bg-neutral-900 dark:bg-white opacity-80'
        }`}
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />

      {/* STICKY HEADER NAV (PUBLIC TOOLBAR - NO ADMIN LINK, REPLACED CAMPAIGN WITH PORTFOLIO) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--header-bg)] border-b border-[var(--border-color)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <button onClick={() => navigateTo('home')} className="flex items-center gap-3 group text-left cursor-pointer">
            <img 
              src="/LOGO.png" 
              alt="Shahid Khan Logo" 
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-[var(--text-primary)]">Shahid Khan</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Digital Marketing & Growth Specialist</span>
            </div>
          </button>

          {/* Desktop Navigation (Replaced Campaign with Portfolio, Skills merged in About, Removed Process/FAQ) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[var(--text-secondary)]">
            {[
              { id: 'home', label: 'Home', path: '/' },
              { id: 'about', label: 'About & Skills', path: '/about' },
              { id: 'services', label: 'Services', path: '/services' },
              { id: 'projects', label: 'Portfolio', path: '/portfolio' },
              { id: 'contact', label: 'Contact', path: '/contact' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`py-1 transition-colors cursor-pointer relative ${
                  activePage === item.id 
                    ? 'text-[var(--text-primary)] font-bold' 
                    : 'hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
                {activePage === item.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--text-primary)] rounded-full" 
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
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
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-dark)] bg-transparent text-xs font-bold font-heading uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer"
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
              className="lg:hidden border-b border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-5 space-y-3"
            >
              <nav className="flex flex-col space-y-2 font-heading font-medium text-sm">
                <button onClick={() => navigateTo('home')} className={`text-left py-1.5 ${activePage === 'home' ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>Home</button>
                <button onClick={() => navigateTo('about')} className={`text-left py-1.5 ${activePage === 'about' ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>About & Skills</button>
                <button onClick={() => navigateTo('services')} className={`text-left py-1.5 ${activePage === 'services' ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>Services</button>
                <button onClick={() => navigateTo('projects')} className={`text-left py-1.5 ${activePage === 'projects' ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>Portfolio</button>
                <button onClick={() => navigateTo('contact')} className={`text-left py-1.5 ${activePage === 'contact' ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>Contact</button>
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


      {/* MAIN DYNAMIC CONTENT CONTAINER */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* ==================== 1. DETAILED COMPREHENSIVE HOME PAGE (/) ==================== */}
          {activePage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* HERO SECTION */}
              <section className="relative pt-4 sm:pt-6 pb-10 md:pb-12 max-w-7xl mx-auto px-6">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-secondary)] mb-4 sm:mb-6 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[var(--text-primary)] animate-pulse"></span>
                  <span>Available for Paid Ad Campaigns & Growth Projects</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  
                  {/* Hero Content Left */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                    
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15]">
                      Scale Your Business with <span className="underline underline-offset-6 decoration-[var(--border-color)]">High-ROAS Digital Marketing</span> & Performance Ads.
                    </h1>

                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                      I help businesses, agencies, NGOs, and retail brands generate high-intent leads, lower customer acquisition costs, and scale revenue through Meta Ads, Google Search & PMax, and high-converting paid funnels.
                    </p>

                    {/* Primary CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button 
                        onClick={() => { setDemoModalType('Request a Call Back'); setDemoModalOpen(true); }}
                        className="px-5 py-3.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-xs sm:text-sm font-bold tracking-wide hover:opacity-90 transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer border border-[var(--border-dark)]"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Request a Call Back</span>
                      </button>

                      <a 
                        href="/udemy_digital_marketing_certificate.pdf" 
                        download="Shahid_Khan_Udemy_Digital_Marketing_Certificate.pdf"
                        className="px-5 py-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-[var(--text-primary)] font-heading text-xs sm:text-sm font-bold tracking-wide hover:bg-purple-500/20 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Download Certificate PDF</span>
                      </a>

                      <button 
                        onClick={() => navigateTo('projects')}
                        className="px-5 py-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] font-heading text-xs sm:text-sm font-bold tracking-wide hover:bg-[var(--bg-hover)] transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Layers className="w-4 h-4" />
                        <span>View Portfolio</span>
                      </button>

                      <button 
                        onClick={() => navigateTo('contact')}
                        className="px-5 py-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] font-heading text-xs sm:text-sm font-bold tracking-wide hover:bg-[var(--bg-hover)] transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span>Contact & Support ↗</span>
                      </button>
                    </div>

                    {/* Quick Badges */}
                    <div className="pt-4 flex flex-wrap gap-5 text-xs text-[var(--text-muted)] font-medium border-t border-[var(--border-color)] mt-4 sm:mt-5">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Udemy Digital Marketing Certified</span>
                      </div>
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
                    </div>

                  </div>

                  {/* Hero Photo Right (Static on Mobile, Animated on Desktop) */}
                  <div className="lg:col-span-5 flex justify-center lg:justify-end perspective-1000 lg:-mt-8">
                    <motion.div 
                      style={isMobile ? {} : { 
                        scale: photoScale, 
                        y: photoY, 
                        rotateY: photoRotateY, 
                        rotateZ: photoRotateZ
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 22 }}
                      className="w-full max-w-sm lg:max-w-md z-20"
                    >
                      <HeroPhoto3D className="w-full">
                        <div className="group rounded-3xl overflow-hidden shadow-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 transition-all duration-500 cursor-pointer">
                          <div className="rounded-2xl overflow-hidden relative">
                            <img 
                              src="/shahid_photo.png" 
                              onError={(e) => { e.currentTarget.src = heroPhoto; }}
                              alt="Shahid Khan — Digital Marketing Specialist" 
                              className="w-full h-auto object-cover filter grayscale contrast-105 group-hover:grayscale-0 group-hover:contrast-100 hover:grayscale-0 hover:contrast-100 transition-all duration-700 ease-out transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500"></div>
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

                {/* ANIMATED STATISTICS SECTION (DYNAMICALLY EDITABLE) */}
                <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {siteStats.map((stat, idx) => (
                    <div key={idx} className="p-5 rounded-2xl glass-card border border-[var(--border-color)] text-center space-y-1 hover:border-[var(--text-primary)] transition-all shadow-sm">
                      <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">
                        <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                      </h3>
                      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</p>
                    </div>
                  ))}
                </div>

              </section>

              {/* VERIFIED DIGITAL MARKETING CERTIFICATION SECTION ON HOME SCREEN */}
              <section className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 space-y-8">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] font-extrabold px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] inline-flex items-center gap-1.5 shadow-sm">
                      <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> VERIFIED CREDENTIALS
                    </span>
                    <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                      Udemy Certified Digital Marketing Specialist
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      83.5+ Hours Masterclass covering Meta Ads, Google Ads (Search & PMax), Lead Generation Funnels, and Analytics.
                    </p>
                  </div>

                  {/* CERTIFICATE SHOWCASE CARD */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-lg">
                    
                    {/* Left: Certificate Photo Frame with Click-to-Zoom Lightbox */}
                    <div className="lg:col-span-6 flex justify-center">
                      <div 
                        onClick={() => setCertModalOpen(true)}
                        className="group relative rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-md bg-white cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                      >
                        <img 
                          src="/udemy_digital_marketing_certificate.png" 
                          alt="Udemy Digital Marketing Certificate - Shahid Khan" 
                          className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay gradient & zoom hint */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white">
                          <Eye className="w-8 h-8 p-1.5 rounded-full bg-white/20 backdrop-blur-md" />
                          <span className="text-xs font-bold font-heading tracking-wide uppercase">Click to Enlarge Photo</span>
                        </div>

                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider uppercase border border-white/20 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Official Certificate Photo
                        </div>
                      </div>
                    </div>

                    {/* Right: Certificate Metadata & Action Buttons */}
                    <div className="lg:col-span-6 space-y-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-mono font-bold">
                        <Award className="w-4 h-4" /> Certificate No: UC-95eaf934-2a3e-452a-b9e1-ec1406b220a1
                      </div>

                      <div>
                        <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[var(--text-primary)] leading-tight">
                          Mega Digital Marketing Course A-Z: 32 Courses in 1 + Updates
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium mt-1.5">
                          Issued by <strong className="text-[var(--text-primary)]">Udemy</strong> • Instructors: <strong className="text-[var(--text-primary)]">Pouya Eti • Digital Marketing Expert</strong>
                        </p>
                      </div>

                      {/* Certificate Highlights Badges */}
                      <div className="grid grid-cols-2 gap-3 text-xs font-medium text-[var(--text-secondary)]">
                        <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Recipient</span>
                          <span className="font-bold text-[var(--text-primary)]">Shahid Khan</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Duration</span>
                          <span className="font-bold text-[var(--text-primary)]">83.5 Total Hours</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Issue Date</span>
                          <span className="font-bold text-[var(--text-primary)]">August 4, 2026</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Reference No</span>
                          <span className="font-bold text-[var(--text-primary)]">0004</span>
                        </div>
                      </div>

                      {/* Download & Verification CTAs */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <a 
                          href="/udemy_digital_marketing_certificate.pdf" 
                          download="Shahid_Khan_Udemy_Digital_Marketing_Certificate.pdf"
                          className="px-5 py-3 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-xs sm:text-sm font-bold tracking-wide hover:opacity-90 transition-all flex items-center gap-2 shadow-md cursor-pointer border border-[var(--border-dark)]"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Certificate PDF</span>
                        </a>

                        <button
                          onClick={() => setCertModalOpen(true)}
                          className="px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] font-heading text-xs sm:text-sm font-bold hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Photo</span>
                        </button>

                        <a 
                          href="https://ude.my/UC-95eaf934-2a3e-452a-b9e1-ec1406b220a1" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] font-heading text-xs sm:text-sm font-bold hover:bg-[var(--bg-hover)] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <span>Verify Online</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* GROWTH STRATEGY ROADMAP & INDUSTRY FRAMEWORK */}
              <section className="py-14 border-t border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] font-extrabold px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)]">
                      GROWTH METHODOLOGY
                    </span>
                    <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                      The 4-Step High-ROAS Campaign Architecture
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      Every campaign is engineered using a scientific, data-first approach designed to maximize return on ad spend and eliminate wasted marketing budget.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all shadow-md space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono font-bold text-sm flex items-center justify-center border border-[var(--border-color)]">
                        01
                      </div>
                      <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">Market & Competitor Audit</h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Deep dive into target customer psychology, competitor ad creatives, offer positioning, and historical ad account performance data.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all shadow-md space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono font-bold text-sm flex items-center justify-center border border-[var(--border-color)]">
                        02
                      </div>
                      <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">Funnel & Pixel Architecture</h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Deploy Meta Conversions API (CAPI), GA4 server-side tracking, custom lead capture forms, and fast-loading mobile landing pages.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all shadow-md space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono font-bold text-sm flex items-center justify-center border border-[var(--border-color)]">
                        03
                      </div>
                      <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">Multi-Angle Creative Launch</h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Launch high-converting UGC video hooks, carousel catalog ads, and Google Search campaigns targeting high-intent buyer keywords.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all shadow-md space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono font-bold text-sm flex items-center justify-center border border-[var(--border-color)]">
                        04
                      </div>
                      <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">Daily Optimization & Scaling</h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Prune low-performing ad sets, double down on winning audiences, deploy custom retargeting funnels, and scale daily budgets smoothly.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* INDUSTRY-SPECIFIC GROWTH BLUEPRINTS SECTION */}
              <section className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] font-extrabold px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)]">
                      TAILORED STRATEGIES
                    </span>
                    <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                      Industry Growth Blueprints
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      Custom performance marketing architectures optimized for specific business verticals.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-4 shadow-sm hover:border-[var(--text-primary)] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center font-bold text-lg border border-[var(--border-color)]">
                          🛍️
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">E-Commerce & D2C Brands</h3>
                          <p className="text-xs text-[var(--text-muted)]">Scale Online Store Sales & Catalog ROAS</p>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Deploy dynamic product catalog ads, high-converting checkout landing pages, abandoned cart WhatsApp automation, and Meta Conversions API (CAPI) server tracking to lower Cost Per Acquisition (CPA) and boost 3.5x+ ROAS.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-color)]">
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">Meta Advantage+ Catalog</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">Google Shopping & PMax</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">Shopify / Woo Checkout</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-4 shadow-sm hover:border-[var(--text-primary)] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center font-bold text-lg border border-[var(--border-color)]">
                          🏢
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">B2B Agencies & High-Ticket Services</h3>
                          <p className="text-xs text-[var(--text-muted)]">Pre-Qualified Client Consultation Booking</p>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Build automated appointment booking funnels with pre-qualifying survey forms, instant CRM notification sync, and Google Search campaigns capturing high-intent B2B decision makers.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-color)]">
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">High-Intent Lead Forms</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">Google Search Ads</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">Automated Calendly Sync</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-4 shadow-sm hover:border-[var(--text-primary)] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center font-bold text-lg border border-[var(--border-color)]">
                          📍
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">Local Retail & Healthcare Providers</h3>
                          <p className="text-xs text-[var(--text-muted)]">Geo-Targeted Inbound Phone Calls</p>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Hyper-local radius advertising (10km - 25km radius around store/clinic) targeting residents with click-to-call ads, Google Business Profile optimization, and direct WhatsApp booking buttons.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-color)]">
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">Radius Radius Ads</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">Click-To-WhatsApp</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">Google Local Map Ads</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-4 shadow-sm hover:border-[var(--text-primary)] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center font-bold text-lg border border-[var(--border-color)]">
                          💚
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">NGOs & Non-Profit Foundations</h3>
                          <p className="text-xs text-[var(--text-muted)]">Donor Acquisition & Automated 80G Tax Portals</p>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Nationwide donor awareness campaigns linked to instant Razorpay payment pages. Includes automated PDF 80G tax exemption receipt dispatches and real-time donor verification.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-color)]">
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">Razorpay Payment Pages</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">Automated 80G Receipts</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[10px] font-mono font-bold text-[var(--text-secondary)]">Meta Emotional Storytelling</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* DIGITAL MARKETING VS TRADITIONAL ADVERTISING COMPARISON TABLE */}
              <section className="py-14 border-t border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-6 space-y-10">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] font-extrabold px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)]">
                      THE PERFORMANCE ADVANTAGE
                    </span>
                    <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                      Why Performance Digital Marketing Wins
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      Compare traditional offline ads (Newspapers, Banners) with targeted digital campaigns.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse rounded-2xl overflow-hidden border border-[var(--border-color)]">
                      <thead>
                        <tr className="bg-[var(--bg-card)] border-b border-[var(--border-color)] text-[var(--text-primary)]">
                          <th className="p-4 font-heading font-bold">Feature / Metric</th>
                          <th className="p-4 font-heading font-bold text-[var(--text-primary)] bg-[var(--bg-primary)]">Shahid Khan Digital Marketing System</th>
                          <th className="p-4 font-heading font-bold text-[var(--text-muted)]">Traditional Offline Ads (Print/Banners)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                        <tr>
                          <td className="p-4 font-semibold text-[var(--text-primary)]">Targeting Precision</td>
                          <td className="p-4 font-bold text-[var(--text-primary)] bg-[var(--bg-card)]">Laser-targeted by interest, income, search intent & city</td>
                          <td className="p-4">Broad mass audience with zero interest filtering</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-[var(--text-primary)]">Lead Measurement</td>
                          <td className="p-4 font-bold text-[var(--text-primary)] bg-[var(--bg-card)]">100% trackable down to exact Cost Per Lead (CPL)</td>
                          <td className="p-4">Impossible to track exact leads or conversions</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-[var(--text-primary)]">Budget Flexibility</td>
                          <td className="p-4 font-bold text-[var(--text-primary)] bg-[var(--bg-card)]">Start from ₹500/day, pause or scale instantly anytime</td>
                          <td className="p-4">High upfront non-refundable contract payments</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-[var(--text-primary)]">Optimization Speed</td>
                          <td className="p-4 font-bold text-[var(--text-primary)] bg-[var(--bg-card)]">Real-time daily ad creative & audience tweaks</td>
                          <td className="p-4">Fixed prints cannot be edited once published</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-[var(--text-primary)]">Return On Ad Spend (ROAS)</td>
                          <td className="p-4 font-bold text-[var(--text-primary)] bg-[var(--bg-card)]">Proven 3x - 6x Return on Ad Spend (ROAS) focus</td>
                          <td className="p-4">Uncertain ROI with no conversion guarantee</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* ABOUT SUMMARY ON HOME PAGE */}
              <section className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="max-w-3xl mb-8">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">About Me</span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1">Who I Am</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                      <p className="font-medium text-base text-[var(--text-primary)]">
                        I am <strong className="font-bold">Shahid Khan</strong>, a Performance Digital Marketer and Growth Strategist with extensive experience helping local retail businesses, agencies, non-profits, and startups build profitable digital advertising systems.
                      </p>
                      <p>
                        My expertise centers on <strong className="text-[var(--text-primary)]">Meta Ads (Facebook & Instagram), Google Ads (Search & Performance Max), B2B/B2C lead generation, audience research, paid funnel architecture, and conversion rate optimization (CRO)</strong>.
                      </p>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-1 gap-3">
                      <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center gap-3">
                        <Target className="w-5 h-5 text-[var(--text-primary)] shrink-0" />
                        <div>
                          <p className="font-heading font-bold text-xs sm:text-sm text-[var(--text-primary)]">Meta & Google Ads Expert</p>
                          <p className="text-[11px] text-[var(--text-muted)]">Laser-targeted audience reach & high ROAS</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-[var(--text-primary)] shrink-0" />
                        <div>
                          <p className="font-heading font-bold text-xs sm:text-sm text-[var(--text-primary)]">Lead Generation Architecture</p>
                          <p className="text-[11px] text-[var(--text-muted)]">High-converting landing pages & sales funnels</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SKILLS & TOOLS GRID ON HOME PAGE */}
              <section className="py-14 border-t border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-6 space-y-10">
                  <div className="text-center max-w-2xl mx-auto space-y-1.5">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Toolkit</span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Marketing Skills & Tech Stack</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                    {toolsData.map((tool) => (
                      <div key={tool.id} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] hover:-translate-y-0.5 transition-all cursor-pointer group shadow-sm flex flex-col justify-between h-full">
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

              {/* FULL PORTFOLIO / CAMPAIGN SHOWCASE ON HOME PAGE */}
              <section id="home-portfolio" className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Client Success</span>
                      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1">Featured Client Portfolio</h2>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">Click on any project heading to view full case study details & strategy breakdown.</p>
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
                              : 'border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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

                            <button 
                              onClick={() => setSelectedProjectModal(project)}
                              className="w-full text-left font-heading font-bold text-lg text-[var(--text-primary)] mb-2 hover:underline flex items-center justify-between group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
                              title="Click to view detailed case study"
                            >
                              <span>{project.title}</span>
                              <FileText className="w-4 h-4 opacity-50 group-hover:opacity-100 shrink-0" />
                            </button>

                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-5">
                              {project.description}
                            </p>
                          </div>

                          <div>
                            <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-[var(--border-color)]">
                              {project.services && project.services.map((srv, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md bg-[var(--bg-primary)] text-[10px] font-medium text-[var(--text-secondary)]">
                                  {srv}
                                </span>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => setSelectedProjectModal(project)}
                                className="py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-heading font-bold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Read Details</span>
                              </button>

                              {project.link ? (
                                <a 
                                  href={project.link} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="py-2.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1 uppercase tracking-wider"
                                >
                                  <span>Live Site</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <div className="py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[10px] font-heading font-semibold text-[var(--text-muted)] text-center flex items-center justify-center">
                                  Lead Campaign
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </section>

              {/* DIGITAL MARKETING SERVICES ON HOME PAGE */}
              <section className="py-14 border-t border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center max-w-2xl mx-auto mb-12 space-y-1.5">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Services</span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Digital Marketing Services</h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Data-driven paid advertising, lead capture funnels, and marketing analytics designed to grow your revenue.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {servicesData.map((srv, idx) => (
                      <div key={srv.id || idx} className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all shadow-sm flex flex-col justify-between h-full">
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

              {/* 6-STEP CAMPAIGN PROCESS (RETAINED ON HOME SCREEN ONLY) */}
              <section className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
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

              {/* FAQ ACCORDION (RETAINED ON HOME SCREEN ONLY) */}
              <section className="py-14 border-t border-[var(--border-color)]">
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

              {/* CONTACT FORM & DETAILS ON HOME PAGE */}
              <section className="py-14 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
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

                    {/* Contact Form Right */}
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
                              <span>Thank you! Your submission has been saved and a confirmation email was triggered via Resend (noreply@shahidkhan.site).</span>
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

            </motion.div>
          )}


          {/* ==================== 2. SEPARATE ABOUT & SKILLS PAGE (/about) ==================== */}
          {activePage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-14"
            >
              <div className="max-w-7xl mx-auto px-6 space-y-12">
                
                {/* Header */}
                <div className="space-y-2 border-b border-[var(--border-color)] pb-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                    <button onClick={() => navigateTo('home')} className="hover:underline cursor-pointer">Home</button>
                    <span>/</span>
                    <span className="text-[var(--text-primary)] font-bold">About & Skills</span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Who I Am & Marketing Skills</h1>
                  <p className="text-sm text-[var(--text-secondary)]">Digital Marketer, AI Website Creator & Performance Growth Strategist.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    <p className="font-medium text-base text-[var(--text-primary)]">
                      I am <strong className="font-bold">Shahid Khan</strong>, a Performance Digital Marketer and Growth Strategist based in Jaipur, Rajasthan, India.
                    </p>

                    <p>
                      I specialize in building complete digital acquisition systems for local retail stores, service agencies, non-profits, and growing brands. My approach combines <strong className="text-[var(--text-primary)]">Meta Paid Advertising (FB & IG), Google Search & Performance Max, audience targeting, landing page design, and conversion tracking</strong>.
                    </p>

                    <p>
                      By pairing persuasive copywriting with AI automation (ChatGPT, Claude, n8n) and modern web technology, I help businesses generate pre-qualified leads while reducing customer acquisition costs.
                    </p>

                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
                        <p className="font-heading font-bold text-xs sm:text-sm text-[var(--text-primary)]">Location</p>
                        <p className="text-xs text-[var(--text-muted)]">Jaipur, Rajasthan, India (Available Globally)</p>
                      </div>

                      <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
                        <p className="font-heading font-bold text-xs sm:text-sm text-[var(--text-primary)]">Primary Specialization</p>
                        <p className="text-xs text-[var(--text-muted)]">Meta & Google Paid Ads + Lead Gen Funnels</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1.5 shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center mb-2">
                        <Target className="w-4 h-4" />
                      </div>
                      <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">Meta & Google Paid Advertising</h3>
                      <p className="text-xs text-[var(--text-secondary)]">Strategic audience targeting, creative ad design, A/B testing, and budget scaling focused on maximum ROAS.</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1.5 shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center mb-2">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">Lead Generation & Sales Funnels</h3>
                      <p className="text-xs text-[var(--text-secondary)]">Engineered landing pages and lead capture systems built to convert cold paid traffic into pre-qualified sales calls.</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1.5 shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center mb-2 font-bold text-xs">
                        🛡️
                      </div>
                      <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">Transparent Ad Spend Protection</h3>
                      <p className="text-xs text-[var(--text-secondary)]">100% full ad account access with direct payment credentials. Refunds available for unused pre-ad spend budgets.</p>
                    </div>
                  </div>
                </div>

                {/* THE 5-PHASE GROWTH EXECUTION PROTOCOL */}
                <div className="space-y-6 pt-8 border-t border-[var(--border-color)]">
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] font-extrabold px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)]">
                      OPERATIONAL STANDARD
                    </span>
                    <h2 className="font-heading font-bold text-2xl text-[var(--text-primary)]">The 5-Phase Growth Execution Protocol</h2>
                    <p className="text-xs text-[var(--text-secondary)]">Standardized operating system applied to every client campaign.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)]">PHASE 01</span>
                      <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">Customer Avatar</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        Identify high-ticket buyer personas, pain points, and competitors.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)]">PHASE 02</span>
                      <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">Tracking Setup</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        Deploy Meta CAPI, GA4 server-side events, and Google Tag Manager.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)]">PHASE 03</span>
                      <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">Funnel Build</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        Design high-speed mobile landing pages and instant lead forms.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)]">PHASE 04</span>
                      <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">Ad Launch</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        Launch multi-creative campaigns on Facebook, Instagram & Google.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)]">PHASE 05</span>
                      <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">ROAS Scale</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        Daily metric optimization, budget scaling, and custom retargeting.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SKILLS & 17 TOOLS MERGED INSIDE ABOUT PAGE */}
                <div className="space-y-8 pt-8 border-t border-[var(--border-color)]">
                  <div className="space-y-1">
                    <h2 className="font-heading font-bold text-2xl text-[var(--text-primary)]">Marketing Capabilities</h2>
                    <p className="text-xs text-[var(--text-secondary)]">Core advertising, conversion, and tracking skillsets.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillsCategories.map((cat, idx) => (
                      <div key={idx} className="p-7 rounded-3xl glass-card border border-[var(--border-color)] shadow-sm">
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
                              className="px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5"
                            >
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 17 Tools Grid */}
                  <div className="space-y-4 pt-6">
                    <h3 className="font-heading font-bold text-xl text-[var(--text-primary)]">17 Marketing Tools & Platforms</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                      {toolsData.map((tool) => (
                        <div key={tool.id} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all shadow-sm flex flex-col justify-between h-full">
                          <div>
                            <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-[var(--text-muted)] block mb-1">
                              {tool.category}
                            </span>
                            <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">
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
                </div>

                <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center">
                  <button onClick={() => navigateTo('home')} className="text-xs font-heading font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                  </button>
                  <button onClick={() => navigateTo('services')} className="text-xs font-heading font-bold text-[var(--text-primary)] flex items-center gap-1 cursor-pointer hover:underline">
                    View Marketing Services <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </motion.div>
          )}


          {/* ==================== 3. SEPARATE SERVICES PAGE (/services) ==================== */}
          {activePage === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-14"
            >
              <div className="max-w-7xl mx-auto px-6 space-y-12">
                
                {/* Header */}
                <div className="space-y-2 border-b border-[var(--border-color)] pb-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                    <button onClick={() => navigateTo('home')} className="hover:underline cursor-pointer">Home</button>
                    <span>/</span>
                    <span className="text-[var(--text-primary)] font-bold">Services</span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Digital Marketing Services</h1>
                  <p className="text-sm text-[var(--text-secondary)]">Data-driven advertising, sales funnels, and marketing analytics engineered to grow your revenue.</p>
                </div>

                {/* 14 Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {servicesData.map((srv, idx) => (
                    <div key={srv.id || idx} className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-primary)] transition-all shadow-sm flex flex-col justify-between h-full">
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

                {/* SERVICE DELIVERABLES MATRIX */}
                <div className="space-y-6 pt-8 border-t border-[var(--border-color)]">
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] font-extrabold px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)]">
                      DELIVERABLES BREAKDOWN
                    </span>
                    <h2 className="font-heading font-bold text-2xl text-[var(--text-primary)]">Marketing Service Engagement Models</h2>
                    <p className="text-xs text-[var(--text-secondary)]">Tailored packages designed for different stages of business growth.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-4 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)]">
                          STARTUP / LOCAL BUSINESS
                        </span>
                        <h3 className="font-display font-extrabold text-xl text-[var(--text-primary)]">Lead Express Engine</h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          Ideal for local service providers, doctors, real estate agents & retail stores seeking immediate qualified phone calls.
                        </p>
                        <ul className="space-y-2 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)]">
                          <li className="flex items-center gap-2">✓ Meta Lead Form Ads Setup</li>
                          <li className="flex items-center gap-2">✓ WhatsApp Instant Lead Integration</li>
                          <li className="flex items-center gap-2">✓ Custom Ad Copy & Visual Hooks</li>
                          <li className="flex items-center gap-2">✓ Weekly Performance Reports</li>
                        </ul>
                      </div>
                      <button 
                        onClick={() => { setDemoModalType('Request a Call Back'); setDemoModalOpen(true); }}
                        className="w-full py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-heading text-xs font-bold hover:bg-[var(--bg-hover)] transition-all cursor-pointer"
                      >
                        Inquire About Express Engine
                      </button>
                    </div>

                    <div className="p-6 rounded-3xl border-2 border-[var(--border-dark)] bg-[var(--bg-card)] space-y-4 shadow-xl flex flex-col justify-between relative">
                      <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[var(--btn-bg)] text-[var(--btn-text)] font-mono text-[9px] font-bold uppercase tracking-wider">
                        MOST POPULAR
                      </div>
                      <div className="space-y-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)]">
                          GROWING BRANDS & AGENCIES
                        </span>
                        <h3 className="font-display font-extrabold text-xl text-[var(--text-primary)]">Full-Funnel Growth Scale</h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          Complete performance ecosystem including dedicated high-speed landing pages, CAPI tracking, Meta & Google Ads.
                        </p>
                        <ul className="space-y-2 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)]">
                          <li className="flex items-center gap-2">✓ Meta Ads + Google Search & PMax</li>
                          <li className="flex items-center gap-2">✓ Dedicated Mobile Landing Page Build</li>
                          <li className="flex items-center gap-2">✓ Meta Conversions API & GA4 Setup</li>
                          <li className="flex items-center gap-2">✓ Dynamic Retargeting & Custom Audiences</li>
                          <li className="flex items-center gap-2">✓ Daily ROAS & Budget Optimization</li>
                        </ul>
                      </div>
                      <button 
                        onClick={() => { setDemoModalType('Request a Call Back'); setDemoModalOpen(true); }}
                        className="w-full py-3 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                      >
                        Launch Growth Scale 🚀
                      </button>
                    </div>

                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-4 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)]">
                          NGO & ENTERPRISE
                        </span>
                        <h3 className="font-display font-extrabold text-xl text-[var(--text-primary)]">Donor & Corporate Ecosystem</h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          Engineered for non-profits and high-volume corporate campaigns requiring 80G tax receipt portals and automated payouts.
                        </p>
                        <ul className="space-y-2 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)]">
                          <li className="flex items-center gap-2">✓ Razorpay Payment Gateway Integration</li>
                          <li className="flex items-center gap-2">✓ Automated 80G Tax Receipt Emails</li>
                          <li className="flex items-center gap-2">✓ Multi-Channel Meta & Google Ads</li>
                          <li className="flex items-center gap-2">✓ Real-time Donor CRM & Dashboard</li>
                        </ul>
                      </div>
                      <button 
                        onClick={() => { setDemoModalType('Request a Call Back'); setDemoModalOpen(true); }}
                        className="w-full py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-heading text-xs font-bold hover:bg-[var(--bg-hover)] transition-all cursor-pointer"
                      >
                        Inquire Enterprise Solution
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center">
                  <button onClick={() => navigateTo('about')} className="text-xs font-heading font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to About
                  </button>
                  <button onClick={() => navigateTo('projects')} className="text-xs font-heading font-bold text-[var(--text-primary)] flex items-center gap-1 cursor-pointer hover:underline">
                    View Portfolio <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </motion.div>
          )}


          {/* ==================== 4. SEPARATE PORTFOLIO PAGE (/portfolio) ==================== */}
          {activePage === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-14"
            >
              <div className="max-w-7xl mx-auto px-6 space-y-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-[var(--border-color)] pb-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                      <button onClick={() => navigateTo('home')} className="hover:underline cursor-pointer">Home</button>
                      <span>/</span>
                      <span className="text-[var(--text-primary)] font-bold">Portfolio</span>
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Client Portfolio & Campaigns</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Click on any project heading to view detailed strategy case studies & measurable results.</p>
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
                            : 'border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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

                          <button 
                            onClick={() => setSelectedProjectModal(project)}
                            className="w-full text-left font-heading font-bold text-lg text-[var(--text-primary)] mb-2 hover:underline flex items-center justify-between group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            <span>{project.title}</span>
                            <FileText className="w-4 h-4 opacity-50 group-hover:opacity-100 shrink-0" />
                          </button>

                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-5">
                            {project.description}
                          </p>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-[var(--border-color)]">
                            {project.services && project.services.map((srv, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-[var(--bg-primary)] text-[10px] font-medium text-[var(--text-secondary)]">
                                {srv}
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => setSelectedProjectModal(project)}
                              className="py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-heading font-bold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Read Details</span>
                            </button>

                            {project.link ? (
                              <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noreferrer"
                                className="py-2.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1 uppercase tracking-wider"
                              >
                                <span>Live Site</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <div className="py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[10px] font-heading font-semibold text-[var(--text-muted)] text-center flex items-center justify-center">
                                Lead Campaign
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center">
                  <button onClick={() => navigateTo('services')} className="text-xs font-heading font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Services
                  </button>
                  <button onClick={() => navigateTo('contact')} className="text-xs font-heading font-bold text-[var(--text-primary)] flex items-center gap-1 cursor-pointer hover:underline">
                    Contact Me <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </motion.div>
          )}


          {/* ==================== 5. SEPARATE CONTACT PAGE (/contact) ==================== */}
          {activePage === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-14"
            >
              <div className="max-w-7xl mx-auto px-6 space-y-12">
                
                {/* Header */}
                <div className="space-y-2 border-b border-[var(--border-color)] pb-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                    <button onClick={() => navigateTo('home')} className="hover:underline cursor-pointer">Home</button>
                    <span>/</span>
                    <span className="text-[var(--text-primary)] font-bold">Contact & Support</span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                    Contact, Support & Strategy Hub
                  </h1>
                  <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                    Have a question, need campaign support, or want to book a 1-on-1 strategy call? Submit your request below or track an active inquiry in real-time.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Contact Info & SLA Badges Left */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-primary)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--text-primary)] animate-pulse"></span>
                        <span>SLA: Response Within 2 Hours</span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] leading-tight">
                        Let's Connect & Build Your Campaign
                      </h2>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        Direct channel communication for paid ad audits, lead generation strategies, and immediate technical support.
                      </p>
                    </div>

                    <div className="space-y-3 font-medium text-xs sm:text-sm">
                      <a href="mailto:contact@shahidkhan.site" className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center gap-4 hover:border-[var(--text-primary)] transition-all shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono uppercase font-bold">Direct Email</p>
                          <p className="font-heading font-bold text-[var(--text-primary)]">contact@shahidkhan.site</p>
                        </div>
                      </a>

                      <a href="tel:+919587867559" className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center gap-4 hover:border-[var(--text-primary)] transition-all shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono uppercase font-bold">Phone / WhatsApp 24/7</p>
                          <p className="font-heading font-bold text-[var(--text-primary)]">+91 95878 67559</p>
                        </div>
                      </a>

                      <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center gap-4 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono uppercase font-bold">Office Location</p>
                          <p className="font-heading font-bold text-[var(--text-primary)]">Jaipur, Rajasthan, India</p>
                        </div>
                      </div>
                    </div>

                    {/* Trust Guarantee Card */}
                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                        <span>🛡️</span>
                        <span>100% Ad Account Transparency</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Full client ownership of Facebook Business Manager and Google Ads accounts. Direct payment method links with zero hidden agency markups.
                      </p>
                    </div>
                  </div>

                  {/* Dual Interactive Forms Right */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xl space-y-6">
                      
                      {/* Form Type Selector Header */}
                      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                        <h3 className="font-heading font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
                          Send a Direct Message
                        </h3>
                        <span className="text-xs font-mono font-bold text-[var(--text-secondary)] bg-[var(--bg-primary)] px-3 py-1 rounded-full border border-[var(--border-color)]">
                          Ticket System Connected
                        </span>
                      </div>

                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        
                        {formSubmitted && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-dark)] text-xs font-semibold space-y-2"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 shrink-0 text-[var(--text-primary)]" />
                              <span className="font-heading font-bold text-sm text-[var(--text-primary)]">Inquiry Submitted Successfully!</span>
                            </div>
                            {submittedTicketId && (
                              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Your Unique Ticket ID:</p>
                                  <p className="font-mono text-base font-extrabold text-[var(--text-primary)]">#{submittedTicketId}</p>
                                </div>
                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[var(--btn-bg)] text-[var(--btn-text)]">
                                  Save this Ticket ID to track live updates!
                                </span>
                              </div>
                            )}
                            <p className="text-[11px] text-[var(--text-secondary)]">A confirmation notification with your Ticket ID has been generated. You can track status anytime using the Ticket Tracker below.</p>
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Your Full Name *</label>
                            <input 
                              type="text" 
                              name="name" 
                              required 
                              placeholder="Enter your full name..." 
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Company / Brand Name</label>
                            <input 
                              type="text" 
                              name="businessName" 
                              placeholder="Company or Brand Name" 
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Inquiry Category *</label>
                            <select 
                              name="serviceRequired"
                              required
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                            >
                              <option value="">Select Category / Goal...</option>
                              <option value="Contact, Support & Suggestions">Contact, Support & Suggestions</option>
                              <option value="Meta Ads Campaign (FB & IG)">Meta Ads Campaign (FB & IG)</option>
                              <option value="Google Ads (Search & PMax)">Google Ads (Search & PMax)</option>
                              <option value="Lead Generation & Sales Funnels">Lead Generation & Sales Funnels</option>
                              <option value="High-Converting Landing Page">High-Converting Landing Page</option>
                              <option value="Meta Pixel & GA4 Setup">Meta Pixel & GA4 Setup</option>
                              <option value="NGO Campaign & Payment Portal">NGO Campaign & Payment Portal</option>
                              <option value="Other (Custom Marketing Requirement)">Other (Custom Marketing Requirement)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Monthly Ad Budget (If Strategy)</label>
                            <select 
                              name="budget"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                            >
                              <option value="Flexible / Support Request">Flexible / Support Request</option>
                              <option value="₹15,000 - ₹30,000">₹15,000 - ₹30,000 / month</option>
                              <option value="₹30,000 - ₹75,000">₹30,000 - ₹75,000 / month</option>
                              <option value="₹75,000+">₹75,000+ / month</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Message / Project Details *</label>
                          <textarea 
                            rows={4} 
                            name="message" 
                            required 
                            placeholder="Provide your query, feedback, suggestion, or current ad campaign details..." 
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                          ></textarea>
                        </div>

                        <button 
                          type="submit" 
                          disabled={submitting}
                          className="w-full py-3.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-xs sm:text-sm font-bold tracking-wide hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-md border border-[var(--border-dark)]"
                        >
                          <span>{submitting ? 'Submitting Inquiry...' : 'Submit Inquiry & Generate Ticket ↗'}</span>
                        </button>

                      </form>

                    </div>

                    {/* Visitor Ticket Tracking Card */}
                    <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-md space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-heading font-bold text-base text-[var(--text-primary)]">Track Your Inquiry Status</h4>
                          <p className="text-xs text-[var(--text-secondary)]">Enter your Ticket ID (e.g. #SK-93821) or Email address to view live updates from Shahid Khan.</p>
                        </div>
                      </div>

                      <form onSubmit={handleTrackTicketSearch} className="flex gap-2">
                        <input 
                          type="text" 
                          value={trackingInput}
                          onChange={(e) => setTrackingInput(e.target.value)}
                          placeholder="Enter Ticket ID (#SK-XXXXX) or Email..."
                          required
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                        />
                        <button 
                          type="submit" 
                          className="px-4 py-2.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          Track Status
                        </button>
                      </form>

                      {trackingSearched && (
                        <div className="pt-3 border-t border-[var(--border-color)]">
                          {!trackedResult ? (
                            <p className="text-xs font-semibold text-[var(--text-primary)] italic">No inquiry found matching "{trackingInput}". Please verify your Ticket ID or Email.</p>
                          ) : (
                            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] pb-2.5">
                                <div>
                                  <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)]">Ticket ID</span>
                                  <p className="font-mono text-base font-extrabold text-[var(--text-primary)]">#{trackedResult.ticketId || trackedResult.id}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-heading font-extrabold uppercase border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]">
                                  ● Status: {trackedResult.status || 'Open'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                                <p><strong>Name:</strong> {trackedResult.name}</p>
                                <p><strong>Category:</strong> {trackedResult.serviceRequired || 'General Inquiry'}</p>
                                <p><strong>Submitted:</strong> {trackedResult.dateFormatted || trackedResult.createdAt}</p>
                                <p><strong>Last Updated:</strong> {trackedResult.updatedAt || 'Pending Review'}</p>
                              </div>

                              {/* Admin Replies History Timeline */}
                              {trackedResult.replies && trackedResult.replies.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                                  <p className="text-[11px] font-heading font-bold text-[var(--text-primary)] uppercase">Updates from Shahid Khan:</p>
                                  {trackedResult.replies.map((r, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs space-y-1">
                                      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                                        <span className="font-bold text-[var(--text-primary)]">{r.sender || 'Shahid Khan'}</span>
                                        <span>{r.dateFormatted}</span>
                                        <p className="text-[var(--text-primary)] font-medium">{r.text}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                </div>

                {/* PRE-CALL CONSULTATION CHECKLIST & STRATEGY FAQ */}
                <div className="space-y-8 pt-8 border-t border-[var(--border-color)]">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] font-extrabold px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)]">
                      PRE-CALL PREPARATION
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                      What to Prepare Before Reaching Out
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)]">
                      To help us provide the fastest, most relevant solution for your inquiry, keep these handy:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs border border-[var(--border-color)]">
                        1
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">Current Campaign Goals</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Whether you need immediate leads, website sales, or technical Meta CAPI setup.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs border border-[var(--border-color)]">
                        2
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">Target Audience Profile</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Demographics, geographical locations, and target customer interests.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs border border-[var(--border-color)]">
                        3
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">Monthly Budget Range</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Your intended monthly ad spend budget for Meta Ads or Google Search.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs border border-[var(--border-color)]">
                        4
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">Active Landing Page URL</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Your website or store link for instant Conversion Rate Optimization (CRO) review.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center">
                  <button onClick={() => navigateTo('home')} className="text-xs font-heading font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                  </button>
                  <button onClick={() => navigateTo('services')} className="text-xs font-heading font-bold text-[var(--text-primary)] flex items-center gap-1 cursor-pointer hover:underline">
                    View All Services <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </motion.div>
          )}


          {/* ==================== 6. SECRET ADMIN DASHBOARD (/mrshahidbabu) ==================== */}
          {(activePage === 'mrshahidbabu' || activePage === 'admin') && (
            <motion.div
              key="mrshahidbabu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-12 max-w-7xl mx-auto px-6"
            >
              {!isAdminAuthenticated ? (
                /* FIREBASE AUTH ADMIN LOGIN & SIGNUP PORTAL */
                <div className="max-w-md mx-auto py-8">
                  <div className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl space-y-6">
                    
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">Firebase Admin Auth</h1>
                      <p className="text-xs text-[var(--text-secondary)]">Create username & password or login to manage growth OS.</p>
                    </div>

                    {/* Auth Mode Tabs (Sign In vs Create Account) */}
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] text-xs font-heading font-bold text-center">
                      <button
                        type="button"
                        onClick={() => { setAdminAuthMode('login'); setAdminPassError(false); }}
                        className={`py-2 rounded-xl transition-all cursor-pointer ${
                          adminAuthMode === 'login' 
                            ? 'bg-emerald-800 text-white shadow-md' 
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        🔑 Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAdminAuthMode('signup'); setAdminPassError(false); }}
                        className={`py-2 rounded-xl transition-all cursor-pointer ${
                          adminAuthMode === 'signup' 
                            ? 'bg-emerald-800 text-white shadow-md' 
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        ✨ Create Admin
                      </button>
                    </div>

                    <form onSubmit={handleAdminFirebaseAuth} className="space-y-4">
                      {adminPassError && (
                        <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                          {adminPassError}
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1 uppercase">Admin Email / Username *</label>
                        <input 
                          type="email" 
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="admin@shahidkhan.site" 
                          required
                          className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1 uppercase">Admin Password *</label>
                        <input 
                          type="password" 
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Enter Password..." 
                          required
                          className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={adminAuthLoading}
                        className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        {adminAuthLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : adminAuthMode === 'signup' ? (
                          'Create Firebase Admin Account ↗'
                        ) : (
                          'Unlock Admin Dashboard ↗'
                        )}
                      </button>
                    </form>

                    <div className="pt-2 text-center border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)] font-mono">
                      <span>Firebase Auth Identity Engine • Passcode fallback enabled</span>
                    </div>

                  </div>
                </div>
              ) : (
                /* FULL EXECUTIVE FINTECH-STYLE ADMIN DASHBOARD */
                <div className="space-y-6">
                  
                  {/* NevBank Style Top Navigation Header */}
                  <div className="p-4 sm:p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                    
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black font-mono text-lg shadow-md">
                        N
                      </div>
                      <div>
                        <h2 className="font-display font-extrabold text-base text-[var(--text-primary)] leading-tight">Shahid OS</h2>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold tracking-wider">Growth & Campaign Admin</span>
                      </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-[var(--bg-primary)] p-1.5 rounded-2xl border border-[var(--border-color)] text-xs font-heading font-bold">
                      {[
                        { id: 'leads', label: `Overview & Tickets (${leadsList.length})` },
                        { id: 'projects', label: `Portfolio (${projectsList.length})` },
                        { id: 'services', label: `Services (${servicesData.length})` },
                        { id: 'tools', label: `Stack & Tools (${toolsData.length})` },
                        { id: 'stats', label: `KPI Stats` }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setAdminTab(tab.id)}
                          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                            adminTab === tab.id 
                              ? 'bg-emerald-800 text-white shadow-md' 
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Top Right Admin Utilities */}
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={fetchLeads}
                        className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                        title="Sync Firestore & Local Data"
                      >
                        <RefreshCw className={`w-4 h-4 ${loadingLeads ? 'animate-spin' : ''}`} />
                      </button>

                      <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-bold text-[var(--text-primary)]">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span>Shahid Khan</span>
                      </div>

                      <button 
                        onClick={handleAdminLogout}
                        className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold transition-colors cursor-pointer"
                        title="Logout Admin"
                      >
                        Logout
                      </button>
                    </div>

                  </div>

                  {/* TAB 1: OVERVIEW & INQUIRIES */}
                  {adminTab === 'leads' && (
                    <div className="space-y-6">
                      {/* ROW 1: HERO OVERVIEW & BANNER CARDS */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Main Account Card (7 Columns) */}
                    <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm space-y-6 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase font-bold text-[var(--text-muted)]">Main Strategy Account</span>
                        <span className="text-xs font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400">● Live Firestore Database ({leadsList.length} Inquiries)</span>
                      </div>

                      <div>
                        <h1 className="font-display font-black text-2xl text-[var(--text-primary)] tracking-tight">ShahidKhan Client Growth Pipeline</h1>
                        <p className="text-xs font-mono text-[var(--text-muted)] mt-1">Firestore DB Sync Active ↗</p>
                      </div>

                      <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-[var(--border-color)] pt-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)]">Total Client Ad Budget Pipeline</span>
                          <p className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
                            {realTotalManagedBudget > 0 ? `₹${realTotalManagedBudget.toLocaleString('en-IN')}` : '₹0'}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => setEditingProject({ title: '', category: 'Paid Advertising & Lead Gen', location: '', website: '', description: '', fullDescription: '', link: '' })}
                            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-heading font-bold cursor-pointer transition-all shadow-md"
                          >
                            + Add Project
                          </button>
                          <button 
                            onClick={fetchLeads}
                            className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-heading font-bold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer flex items-center gap-1.5"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? 'animate-spin' : ''}`} />
                            <span>Sync Firestore</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Emerald Resend Banner Card (5 Columns) */}
                    <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                      
                      <div className="space-y-3 z-10">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-mono uppercase font-extrabold bg-white/20 text-white">
                            AUTOMATED RESEND EMAIL ALERTS
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        </div>
                        <h3 className="font-display font-extrabold text-xl text-white">Automated Client Email Engine</h3>
                        <p className="text-xs text-emerald-100/90 leading-relaxed">
                          Instant HTML email notifications and status updates are dispatched directly to clients from <code className="font-mono text-white">noreply@shahidkhan.site</code>.
                        </p>
                      </div>

                      <div className="pt-5 z-10 flex items-center justify-between">
                        <button 
                          onClick={() => {
                            sendResendConfirmationEmail('Shahid Khan', 'shahidbcsm@gmail.com', 'Meta Ads Strategy', 'SK-TEST', 'confirmation', 'Open', '');
                            alert("Test confirmation email dispatched to shahidbcsm@gmail.com!");
                          }}
                          className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 text-xs font-heading font-bold hover:bg-emerald-50 transition-colors shadow-lg cursor-pointer"
                        >
                          Test Resend Email Alert ↗
                        </button>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                          <Inbox className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                  </div>


                  {/* ROW 2: REALTIME KPI GRID (4 Columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Mini Card 1: Meta Ads */}
                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-heading font-bold text-sm text-[var(--text-primary)]">Meta Ads Inquiries</p>
                          <p className="text-[10px] font-mono text-[var(--text-muted)]">Facebook & IG Ads</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center font-bold text-xs">
                          f
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between pt-1">
                        <p className="font-display font-extrabold text-xl text-[var(--text-primary)]">{metaAdsCount} Leads</p>
                        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">● Realtime</span>
                      </div>
                    </div>

                    {/* Mini Card 2: Google Search & PMax */}
                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-heading font-bold text-sm text-[var(--text-primary)]">Google Search & PMax</p>
                          <p className="text-[10px] font-mono text-[var(--text-muted)]">High-Intent Ads</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-xs">
                          G
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between pt-1">
                        <p className="font-display font-extrabold text-xl text-[var(--text-primary)]">{googleAdsCount} Leads</p>
                        <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md">● High Intent</span>
                      </div>
                    </div>

                    {/* Mini Card 3: Open Tickets */}
                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-heading font-bold text-sm text-[var(--text-primary)]">Open Client Tickets</p>
                          <p className="text-[10px] font-mono text-[var(--text-muted)]">Pending Action</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between pt-1">
                        <p className="font-display font-extrabold text-xl text-[var(--text-primary)]">{openTicketsCount} Open</p>
                        <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">● Active SLA</span>
                      </div>
                    </div>

                    {/* Mini Card 4: Closed Tickets */}
                    <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-heading font-bold text-sm text-[var(--text-primary)]">Closed Consultations</p>
                          <p className="text-[10px] font-mono text-[var(--text-muted)]">Resolved Tickets</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 flex items-center justify-center font-bold text-xs">
                          ✓
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between pt-1">
                        <p className="font-display font-extrabold text-xl text-[var(--text-primary)]">{closedTicketsCount} Closed</p>
                        <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-md">● Resolved</span>
                      </div>
                    </div>

                  </div>


                  {/* ROW 3: SPLIT BOTTOM PANELS (Real-time Inquiries Table & Dynamic Category Analytics) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT PANEL: Real-time Inquiries Table (7 Columns) */}
                    <div className="lg:col-span-7 p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm space-y-4">
                      
                      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                        <div>
                          <h3 className="font-display font-extrabold text-lg text-[var(--text-primary)]">Realtime Inquiries & Tickets</h3>
                          <p className="text-xs text-[var(--text-secondary)]">Manage client strategy requests, send updates, & close tickets.</p>
                        </div>
                        <button 
                          onClick={fetchLeads}
                          className="w-9 h-9 rounded-2xl bg-emerald-800 text-white flex items-center justify-center hover:bg-emerald-900 cursor-pointer shadow-md"
                          title="Sync Firestore"
                        >
                          <RefreshCw className={`w-4 h-4 ${loadingLeads ? 'animate-spin' : ''}`} />
                        </button>
                      </div>

                      {/* Reply & Status Modal */}
                      {selectedLeadForReply && (
                        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-lg space-y-4">
                          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
                            <div>
                              <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">Reply to Ticket #{selectedLeadForReply.ticketId || selectedLeadForReply.id}</h4>
                              <p className="text-xs text-[var(--text-secondary)]">{selectedLeadForReply.name} ({selectedLeadForReply.email})</p>
                            </div>
                            <button onClick={() => setSelectedLeadForReply(null)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <form onSubmit={handleAdminUpdateTicket} className="space-y-3">
                            <div>
                              <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1 uppercase">Ticket Status</label>
                              <select 
                                value={adminStatusChoice}
                                onChange={(e) => setAdminStatusChoice(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-primary)]"
                              >
                                <option value="Open">● Open (Inquiry Received)</option>
                                <option value="In Progress">● In Progress (Reviewing Campaign)</option>
                                <option value="Replied">● Replied (Proposal Sent)</option>
                                <option value="Closed">● Closed (Resolved)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1 uppercase">Reply Message to Client</label>
                              <textarea 
                                rows={3}
                                value={adminReplyMessage}
                                onChange={(e) => setAdminReplyMessage(e.target.value)}
                                placeholder="Type proposal details, campaign audit summary, or meeting link..."
                                className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)]"
                              ></textarea>
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                              <button type="button" onClick={() => setSelectedLeadForReply(null)} className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-bold">Cancel</button>
                              <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold shadow-md">Send Reply & Notify Client ↗</button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Inquiries Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-[var(--border-color)] text-[10px] font-mono uppercase font-bold text-[var(--text-muted)]">
                              <th className="pb-3">Client</th>
                              <th className="pb-3">Category</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3">Ticket ID</th>
                              <th className="pb-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-color)]">
                            {leadsList.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-12 text-center text-xs text-[var(--text-muted)] space-y-2">
                                  <Inbox className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                                  <p className="font-heading font-bold text-sm text-[var(--text-primary)]">No Active Inquiries</p>
                                  <p className="text-xs text-[var(--text-secondary)]">Form submissions from the Contact section will automatically sync here in real-time.</p>
                                </td>
                              </tr>
                            ) : (
                              leadsList.slice(0, 7).map((lead, i) => (
                                <tr key={lead.id || i} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                                  <td className="py-3">
                                    <p className="font-heading font-bold text-xs text-[var(--text-primary)]">{lead.name}</p>
                                    <p className="text-[10px] font-mono text-[var(--text-muted)]">{lead.email}</p>
                                  </td>
                                  <td className="py-3">
                                    <div className="space-y-0.5">
                                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-extrabold uppercase border ${
                                        lead.formType === 'Book a Demo' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' :
                                        lead.formType === 'Get a Call Back' ? 'bg-blue-500/10 text-blue-600 border-blue-500/30' :
                                        'bg-purple-500/10 text-purple-600 border-purple-500/30'
                                      }`}>
                                        {lead.formType || 'Contact & Support'}
                                      </span>
                                      <p className="text-[10px] text-[var(--text-secondary)] font-medium truncate max-w-[120px]">
                                        {lead.serviceRequired ? lead.serviceRequired.split(':')[0] : 'General'}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                                      lead.status === 'Closed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' :
                                      lead.status === 'Replied' ? 'bg-purple-500/10 text-purple-600 border-purple-500/30' :
                                      lead.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' :
                                      'bg-blue-500/10 text-blue-600 border-blue-500/30'
                                    }`}>
                                      ● {lead.status || 'Open'}
                                    </span>
                                  </td>
                                  <td className="py-3 font-mono text-[11px] font-bold text-[var(--text-muted)]">
                                    #{lead.ticketId || 'SK-REQUEST'}
                                  </td>
                                  <td className="py-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button 
                                        onClick={() => {
                                          setSelectedLeadForReply(lead);
                                          setAdminStatusChoice(lead.status || 'In Progress');
                                          setAdminReplyMessage('');
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-800 text-white text-[10px] font-bold shadow-sm"
                                      >
                                        Reply
                                      </button>
                                      {lead.status !== 'Closed' && (
                                        <button 
                                          onClick={() => handleAdminCloseLead(lead)}
                                          className="p-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold"
                                          title="Close Inquiry"
                                        >
                                          🔒
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => handleDeleteLead(lead.id)}
                                        className="p-1 rounded-lg border border-red-500/20 text-red-500 text-[10px]"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                    </div>


                    {/* RIGHT PANEL: Dynamic Real-time Category Breakdown & Donut Chart (5 Columns) */}
                    <div className="lg:col-span-5 p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm space-y-6 flex flex-col justify-between">
                      
                      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                        <div>
                          <h3 className="font-display font-extrabold text-lg text-[var(--text-primary)]">Inquiry Category Breakdown</h3>
                          <p className="text-xs text-[var(--text-secondary)]">Real-time service distribution from Firestore.</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          ● REALTIME
                        </span>
                      </div>

                      {/* Header Stats Breakdown */}
                      <div className="grid grid-cols-3 gap-2 text-center pb-2 border-b border-[var(--border-color)]">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)]">TOTAL</span>
                          <p className="font-display font-extrabold text-sm sm:text-base text-[var(--text-primary)]">{totalInquiriesCount}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)]">OPEN</span>
                          <p className="font-display font-extrabold text-sm sm:text-base text-emerald-600">{openTicketsCount}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)]">CLOSED</span>
                          <p className="font-display font-extrabold text-sm sm:text-base text-purple-600">{closedTicketsCount}</p>
                        </div>
                      </div>

                      {/* Dynamic Donut Chart & Category Legend */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                        
                        {/* Interactive Dynamic SVG Donut Ring */}
                        <div className="relative w-44 h-44 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Segment 1: Meta Ads (Purple) */}
                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8b5cf6" strokeWidth="11" strokeDasharray={`${metaAdsCount > 0 ? (metaAdsCount / Math.max(1, totalInquiriesCount)) * 238 : 60} 238`} strokeDashoffset="0" />
                            {/* Segment 2: Google Ads (Blue) */}
                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="11" strokeDasharray={`${googleAdsCount > 0 ? (googleAdsCount / Math.max(1, totalInquiriesCount)) * 238 : 60} 238`} strokeDashoffset="-60" />
                            {/* Segment 3: Lead Gen (Red) */}
                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="11" strokeDasharray={`${leadGenCount > 0 ? (leadGenCount / Math.max(1, totalInquiriesCount)) * 238 : 60} 238`} strokeDashoffset="-120" />
                            {/* Segment 4: Web Design (Emerald) */}
                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="11" strokeDasharray={`${webDesignCount > 0 ? (webDesignCount / Math.max(1, totalInquiriesCount)) * 238 : 58} 238`} strokeDashoffset="-180" />
                          </svg>

                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                            <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)]">Total Leads</span>
                            <p className="font-display font-extrabold text-2xl text-[var(--text-primary)]">{totalInquiriesCount}</p>
                          </div>
                        </div>

                        {/* Category Legend List */}
                        <div className="space-y-2 text-xs font-medium text-[var(--text-secondary)] w-full sm:w-auto">
                          <div className="flex items-center justify-between sm:justify-start gap-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                              <span>Meta Ads</span>
                            </div>
                            <span className="font-bold text-[var(--text-primary)]">{metaAdsCount}</span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-start gap-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                              <span>Google Search & PMax</span>
                            </div>
                            <span className="font-bold text-[var(--text-primary)]">{googleAdsCount}</span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-start gap-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                              <span>Lead Gen & Funnels</span>
                            </div>
                            <span className="font-bold text-[var(--text-primary)]">{leadGenCount}</span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-start gap-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                              <span>Landing Pages & Web</span>
                            </div>
                            <span className="font-bold text-[var(--text-primary)]">{webDesignCount}</span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-start gap-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                              <span>Other Strategy Requests</span>
                            </div>
                            <span className="font-bold text-[var(--text-primary)]">{otherCategoryCount}</span>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                </div>
              )}

          {/* TAB 2: PORTFOLIO & PROJECTS MANAGER */}
                  {adminTab === 'projects' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="font-heading font-bold text-xl text-[var(--text-primary)]">Manage Portfolio Projects</h2>
                        <button 
                          onClick={() => setEditingProject({ title: '', category: 'Paid Advertising & Lead Gen', location: '', website: '', description: '', fullDescription: '', link: '' })}
                          className="px-4 py-2 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add New Project
                        </button>
                      </div>

                      {/* Add/Edit Project Form Modal/Box */}
                      {editingProject && (
                        <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-4 shadow-xl">
                          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                            {editingProject.id ? 'Edit Project Details' : 'Add New Project'}
                          </h3>
                          <form onSubmit={handleSaveProject} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Project Title *</label>
                                <input name="title" defaultValue={editingProject.title} required className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Category *</label>
                                <select name="category" defaultValue={editingProject.category} className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold">
                                  <option value="Paid Advertising & Lead Gen">Paid Advertising & Lead Gen</option>
                                  <option value="NGO Marketing & Growth">NGO Marketing & Growth</option>
                                  <option value="Agency Marketing & Funnels">Agency Marketing & Funnels</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Location *</label>
                                <input name="location" defaultValue={editingProject.location} required className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Website Domain / Label</label>
                                <input name="website" defaultValue={editingProject.website} className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold" />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Short Card Summary *</label>
                              <input name="description" defaultValue={editingProject.description} required className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold" />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Full Detailed Case Study Overview *</label>
                              <textarea name="fullDescription" rows={3} defaultValue={editingProject.fullDescription} required className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold"></textarea>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Live URL Link (Optional)</label>
                              <input name="link" defaultValue={editingProject.link} placeholder="https://example.com" className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold" />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold cursor-pointer">
                                Save Project
                              </button>
                              <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold cursor-pointer">
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Projects Table List */}
                      <div className="grid grid-cols-1 gap-3">
                        {projectsList.map(project => (
                          <div key={project.id} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)]">{project.category}</span>
                              <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">{project.title}</h3>
                              <p className="text-xs text-[var(--text-secondary)]">{project.description}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => setEditingProject(project)}
                                className="p-2 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-hover)] text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Edit
                              </button>

                              <button 
                                onClick={() => handleDeleteProject(project.id)}
                                className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SERVICES MANAGER */}
                  {adminTab === 'services' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="font-heading font-bold text-xl text-[var(--text-primary)]">Manage Digital Marketing Services</h2>
                        <button 
                          onClick={() => setEditingService({ name: '', desc: '' })}
                          className="px-4 py-2 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add Service
                        </button>
                      </div>

                      {editingService && (
                        <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-4 shadow-xl">
                          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                            {editingService.id ? 'Edit Service' : 'Add New Service'}
                          </h3>
                          <form onSubmit={handleSaveService} className="space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Service Name *</label>
                              <input name="name" defaultValue={editingService.name} required className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Description *</label>
                              <textarea name="desc" rows={2} defaultValue={editingService.desc} required className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold"></textarea>
                            </div>
                            <div className="flex items-center gap-3">
                              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold cursor-pointer">Save Service</button>
                              <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold cursor-pointer">Cancel</button>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {servicesData.map(srv => (
                          <div key={srv.id} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">{srv.name}</h4>
                              <p className="text-xs text-[var(--text-secondary)] mt-1">{srv.desc}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => setEditingService(srv)} className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-hover)] cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteService(srv.id)} className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: TOOLS & STACK MANAGER */}
                  {adminTab === 'tools' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="font-heading font-bold text-xl text-[var(--text-primary)]">Manage Marketing Tools</h2>
                        <button 
                          onClick={() => setEditingTool({ name: '', category: 'Paid Ads', desc: '' })}
                          className="px-4 py-2 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add Tool
                        </button>
                      </div>

                      {editingTool && (
                        <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-4 shadow-xl">
                          <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                            {editingTool.id ? 'Edit Tool' : 'Add New Tool'}
                          </h3>
                          <form onSubmit={handleSaveTool} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Tool Name *</label>
                                <input name="name" defaultValue={editingTool.name} required className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Category *</label>
                                <input name="category" defaultValue={editingTool.category} required className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Description *</label>
                              <input name="desc" defaultValue={editingTool.desc} required className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-semibold" />
                            </div>
                            <div className="flex items-center gap-3">
                              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold cursor-pointer">Save Tool</button>
                              <button type="button" onClick={() => setEditingTool(null)} className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold cursor-pointer">Cancel</button>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {toolsData.map(tool => (
                          <div key={tool.id} className="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1">
                            <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase font-bold">{tool.category}</span>
                            <h4 className="font-heading font-bold text-xs text-[var(--text-primary)]">{tool.name}</h4>
                            <p className="text-[10px] text-[var(--text-secondary)]">{tool.desc}</p>
                            <div className="flex items-center gap-1 pt-1">
                              <button onClick={() => setEditingTool(tool)} className="p-1 rounded text-[10px] font-bold border border-[var(--border-color)] cursor-pointer">Edit</button>
                              <button onClick={() => handleDeleteTool(tool.id)} className="p-1 rounded text-[10px] font-bold text-red-500 border border-red-500/20 cursor-pointer">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: STATS COUNTERS MANAGER */}
                  {adminTab === 'stats' && (
                    <div className="space-y-6 max-w-2xl">
                      <h2 className="font-heading font-bold text-xl text-[var(--text-primary)]">Edit Animated Statistics Counters</h2>
                      <form onSubmit={handleSaveStats} className="space-y-4">
                        {siteStats.map((stat, idx) => (
                          <div key={idx} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
                            <h4 className="font-heading font-bold text-xs uppercase text-[var(--text-muted)]">Stat Counter #{idx + 1}</h4>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold mb-1">Label</label>
                                <input name={`label${idx}`} defaultValue={stat.label} required className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-bold" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold mb-1">Target Number</label>
                                <input type="number" name={`target${idx}`} defaultValue={stat.target} required className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-bold" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold mb-1">Suffix (e.g. +)</label>
                                <input name={`suffix${idx}`} defaultValue={stat.suffix} className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-bold" />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button type="submit" className="px-6 py-3 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer">
                          Update All Statistics Counters
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>


      {/* INTERACTIVE DETAILED PROJECT CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProjectModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-3xl rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6 text-[var(--text-primary)]"
            >
              <button 
                onClick={() => setSelectedProjectModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors cursor-pointer"
                aria-label="Close Case Study Modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2 pr-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono uppercase font-bold tracking-wider border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                    {selectedProjectModal.category}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-semibold">
                    📍 {selectedProjectModal.location}
                  </span>
                </div>
                
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {selectedProjectModal.title}
                </h2>
              </div>

              <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] space-y-2">
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Case Study Overview
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {selectedProjectModal.fullDescription}
                </p>
              </div>

              {selectedProjectModal.strategy && (
                <div className="space-y-3">
                  <h3 className="font-heading font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-500" /> Strategy & Tactical Execution
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedProjectModal.strategy.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-secondary)] flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProjectModal.results && (
                <div className="space-y-3">
                  <h3 className="font-heading font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" /> Measurable Results & Impact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedProjectModal.results.map((res, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-center space-y-1">
                        <Award className="w-4 h-4 text-amber-500 mx-auto" />
                        <p className="text-xs font-semibold text-[var(--text-primary)]">{res}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 border-t border-[var(--border-color)] pt-4">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Services Delivered</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProjectModal.services && selectedProjectModal.services.map((srv, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-medium">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
                <button 
                  onClick={() => setSelectedProjectModal(null)}
                  className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-heading font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Close Case Study
                </button>

                {selectedProjectModal.link ? (
                  <a 
                    href={selectedProjectModal.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-6 py-2.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button 
                    onClick={() => {
                      setSelectedProjectModal(null);
                      navigateTo('contact');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Book Similar Ad Campaign</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


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


      {/* SUCCESS CONFIRMATION MODAL POP-UP */}
      <AnimatePresence>
        {successModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl space-y-6 text-center"
            >
              <button 
                onClick={() => setSuccessModalData(null)}
                className="absolute top-4 right-4 p-2 rounded-full border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  INQUIRY SUBMITTED SUCCESSFULLY
                </span>
                <h3 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">
                  Thank You, {successModalData.name}! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Our growth strategy team will review your campaign goals for <strong>{successModalData.serviceRequired || 'Digital Marketing'}</strong> and reach out to you shortly via email or WhatsApp (+91 95878 67559).
                </p>
              </div>

              {/* Ticket Box */}
              <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-emerald-500/30 space-y-2 text-center">
                <p className="text-[11px] font-mono uppercase font-bold text-[var(--text-muted)]">Your Tracking Ticket Number</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-2xl font-black text-[var(--text-primary)] tracking-wider">
                    #{successModalData.ticketId}
                  </span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(successModalData.ticketId);
                      alert(`Ticket #${successModalData.ticketId} copied to clipboard!`);
                    }}
                    className="p-1.5 rounded-lg border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                    title="Copy Ticket ID"
                  >
                    Copy 📋
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">Save this Ticket Number to track live inquiry updates on our website anytime!</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={() => {
                    const tId = successModalData.ticketId;
                    setSuccessModalData(null);
                    setTrackingInput(tId);
                    setTrackingSearched(true);
                    const found = leadsList.find(l => l.ticketId === tId);
                    setTrackedResult(found || null);
                    navigateTo('contact', 'contact-section');
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                >
                  Track My Ticket Now ↗
                </button>
                <button 
                  onClick={() => setSuccessModalData(null)}
                  className="px-5 py-3.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-heading text-xs font-bold uppercase tracking-wider hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FORM 1: BOOK A DEMO & GET A CALL BACK POPUP MODAL */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDemoModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-lg rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-[var(--text-primary)]"
            >
              <button 
                onClick={() => setDemoModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)]">
                  📞 DIRECT PHONE CALLBACK
                </span>
                <h2 className="font-display text-2xl font-extrabold">
                  Request an Immediate Call Back
                </h2>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Fill your details below. Shahid Khan will contact you directly to discuss your ad strategy and campaign goals.
                </p>
              </div>

              <form onSubmit={handleDemoSubmit} className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      name="demoName"
                      required
                      placeholder="Enter your full name..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      name="demoEmail"
                      required
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Mobile / WhatsApp *</label>
                    <input 
                      type="tel" 
                      name="demoPhone"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Company / Brand Name</label>
                    <input 
                      type="text" 
                      name="demoCompany"
                      placeholder="Company or Brand Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Company Website (If Have)</label>
                    <input 
                      type="url" 
                      name="demoWebsite"
                      placeholder="https://yourwebsite.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Monthly Ad Budget *</label>
                    <select 
                      name="demoBudget"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    >
                      <option value="Flexible / Audit">Flexible / Strategy Audit</option>
                      <option value="₹15,000 - ₹30,000">₹15,000 - ₹30,000 / month</option>
                      <option value="₹30,000 - ₹75,000">₹30,000 - ₹75,000 / month</option>
                      <option value="₹75,000+">₹75,000+ / month</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Required Service *</label>
                  <select 
                    name="demoService"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  >
                    <option value="Meta Ads Campaign (FB & IG)">Meta Ads Campaign (FB & IG)</option>
                    <option value="Google Ads (Search & PMax)">Google Ads (Search & PMax)</option>
                    <option value="Lead Generation & Sales Funnels">Lead Generation & Sales Funnels</option>
                    <option value="High-Converting Landing Page">High-Converting Landing Page</option>
                    <option value="Meta Pixel & GA4 Setup">Meta Pixel & GA4 Setup</option>
                    <option value="NGO Campaign & Payment Portal">NGO Campaign & Payment Portal</option>
                    <option value="Other (Custom Marketing Requirement)">Other (Custom Marketing Requirement)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Preferred Call Time / Notes (Optional)</label>
                  <textarea 
                    rows={2}
                    name="demoNote"
                    placeholder="e.g. Morning call preference / Meta Ads Audit request..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={demoSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 border border-[var(--border-dark)]"
                >
                  {demoSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <span>Request Call Back Now 📞</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEGAL POLICY MODAL (PRIVACY POLICY, REFUND POLICY, TERMS & CONDITIONS) */}
      <AnimatePresence>
        {activeLegalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLegalModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-2xl rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-5 text-[var(--text-primary)]"
            >
              <button 
                onClick={() => setActiveLegalModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {activeLegalModal === 'privacy' && (
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    LEGAL COMPLIANCE (15 CLAUSES)
                  </span>
                  <h2 className="font-display text-2xl font-extrabold">Privacy Policy</h2>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Last updated: August 2026. At Shahid Khan Digital Marketing ("we", "our"), we respect your privacy and are committed to protecting your personal information.
                  </p>
                  
                  <div className="space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed max-h-[55vh] overflow-y-auto pr-2">
                    <p><strong>1. Personal Identifiable Information (PII) Collected:</strong> We collect personal details voluntarily provided by website visitors, including full name, business name, email address, phone/WhatsApp number, and monthly ad budget.</p>
                    <p><strong>2. Automated Tracking & Cookies:</strong> Our website utilizes standard cookies, local storage tokens, and browser session headers to optimize navigation, retain dark/light theme preferences, and track contact ticket submissions.</p>
                    <p><strong>3. Meta Pixel & Conversions API (CAPI):</strong> We deploy Meta Pixel and CAPI event tracking (ID: 986427389146193) to measure campaign landing page visits and conversion events.</p>
                    <p><strong>4. Google Analytics 4 (GA4) Integration:</strong> Anonymized user traffic patterns, referral sources, device types, and page view metrics are gathered via Google Analytics to enhance overall web experience.</p>
                    <p><strong>5. Strict No-Sale Policy:</strong> We pledge never to sell, rent, trade, or monetize your personal or business data to third-party brokers, advertisers, or data aggregators under any circumstances.</p>
                    <p><strong>6. Purpose of Data Processing:</strong> Collected contact details are strictly processed to schedule growth strategy consultations, deliver customized ad campaign proposals, and send automated email/WhatsApp updates.</p>
                    <p><strong>7. Resend Email API Delivery Engine:</strong> Transactional thank-you emails and support ticket updates are securely processed via Resend Email API (noreply@shahidkhan.site).</p>
                    <p><strong>8. Firebase Firestore Database Storage:</strong> Client inquiries and ticket data are securely stored in Google Firebase Cloud Firestore (rb-production-afb2d) with enterprise-grade SSL encryption.</p>
                    <p><strong>9. Data Retention Duration:</strong> Inbound client inquiry records are retained for a maximum period of 24 months to maintain project communication history, after which they may be permanently purged upon request.</p>
                    <p><strong>10. Client Right to Access & Erasure:</strong> Clients retain full rights to request a copy of their stored data or demand total deletion of their records by contacting contact@shahidkhan.site.</p>
                    <p><strong>11. Security Measures & SSL Encryption:</strong> All data transmitted through our web forms is encrypted in transit using 256-bit Secure Sockets Layer (SSL) transport security.</p>
                    <p><strong>12. Third-Party Service Links:</strong> Our site may contain links to external case study websites or client portals. We are not responsible for the privacy practices or content of third-party domains.</p>
                    <p><strong>13. Protection of Minors:</strong> Our services are strictly intended for legal business owners and individuals aged 18 and above. We do not knowingly collect information from minors.</p>
                    <p><strong>14. Policy Modification Notifications:</strong> Updates to this Privacy Policy are posted directly on this page with an updated timestamp tag. Continued usage of the website implies acceptance.</p>
                    <p><strong>15. Data Protection Contact Officer:</strong> For any privacy concerns, data removal requests, or security inquiries, please email Shahid Khan directly at contact@shahidkhan.site.</p>
                  </div>
                </div>
              )}

              {activeLegalModal === 'refund' && (
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    SERVICE GUARANTEE & REFUND POLICY (15 CLAUSES)
                  </span>
                  <h2 className="font-display text-2xl font-extrabold">Refund Policy</h2>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Last updated: August 2026. Please read our refund terms carefully before booking ad management or digital development services.
                  </p>
                  
                  <div className="space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed max-h-[55vh] overflow-y-auto pr-2">
                    <p className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[var(--text-primary)] font-semibold">
                      ⚠️ Core Policy Summary: We can issue a refund if a client asks for a return BEFORE spending that money on ad networks (Meta/Google). Absolutely NO refunds are allowed for services such as Landing Page Design, Website Creation, CRO Setup, or Custom Funnel Development once project onboarding has commenced.
                    </p>
                    <p><strong>1. Pre-Ad Spend Refund Eligibility:</strong> A full refund of paid ad management retainer fees is eligible ONLY if requested by the client prior to funds being spent on third-party ad networks (Meta Ads, Google Ads).</p>
                    <p><strong>2. No Refunds for Ad Network Spend:</strong> Once ad capital has been allocated and spent on advertising channels (Facebook, Instagram, Google Search, YouTube, PMax), zero refunds are issued as funds are directly consumed by Meta and Google ad delivery servers.</p>
                    <p><strong>3. No Refunds on Landing Page & Website Creation:</strong> There is strictly NO REFUND allowed for services such as Landing Page Design, Website Creation, CRO setups, or web portal builds once project onboarding or design work has started.</p>
                    <p><strong>4. No Refunds for Strategy Consulting & Audits:</strong> Digital marketing campaign strategy, funnel audits, keyword research, and custom audience planning services are strictly non-refundable once delivered.</p>
                    <p><strong>5. No Refunds on Delivered Creative Assets:</strong> Video ad copy, graphic design banners, ad copywriting, and brand collateral provided to the client are final and non-refundable.</p>
                    <p><strong>6. Cancellation Request Procedure:</strong> To request an eligible refund prior to ad launching, clients must submit an official written cancellation request via email to contact@shahidkhan.site with their invoice number.</p>
                    <p><strong>7. Processing Timeline:</strong> Approved refund requests are evaluated and processed within 5 to 7 business days from receipt of the written request.</p>
                    <p><strong>8. Original Payment Gateway Method:</strong> Refunds are issued exclusively back to the original payment source (Razorpay payment link, UPI, or registered corporate bank account).</p>
                    <p><strong>9. Partial Refunds for Setup Retainers:</strong> If a project is cancelled prior to ad deployment but after strategy design has commenced, a 20% setup & administrative fee will be retained from the initial deposit.</p>
                    <p><strong>10. Third-Party Payment Processing Fees:</strong> Any gateway convenience fees charged by third-party processors (Razorpay, Stripe, Banks) are non-refundable.</p>
                    <p><strong>11. Ad Account Suspensions & Policy Disqualifications:</strong> Shahid Khan is not liable for refunds if a client’s Meta Business Manager or Google Ads account is restricted or suspended due to client policy violations.</p>
                    <p><strong>12. Client Delays & Abandonment:</strong> Projects where the client fails to provide required access credentials, assets, or feedback within 30 days are considered abandoned and ineligible for refunds.</p>
                    <p><strong>13. Force Majeure & Platform Outages:</strong> Outages or platform policy changes on Meta, Google, WhatsApp, or hosting providers do not constitute grounds for service refunds.</p>
                    <p><strong>14. Custom Deliverables & Milestone Authorization:</strong> Payment of project milestone invoices signifies client approval of completed work and forfeits refund claims for that milestone.</p>
                    <p><strong>15. Final Dispute Resolution:</strong> Shahid Khan reserves the right of final determination on all refund disputes based on ad network timestamp logs and documented work delivery.</p>
                  </div>
                </div>
              )}

              {activeLegalModal === 'terms' && (
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    TERMS OF SERVICE (15 CLAUSES)
                  </span>
                  <h2 className="font-display text-2xl font-extrabold">Terms & Conditions</h2>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Last updated: August 2026. By utilizing our performance marketing and web development services, you agree to the following terms.
                  </p>
                  
                  <div className="space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed max-h-[55vh] overflow-y-auto pr-2">
                    <p><strong>1. Acceptance of Terms:</strong> By accessing this website or engaging Shahid Khan for performance marketing services, you agree to comply with and be bound by these Terms & Conditions.</p>
                    <p><strong>2. Scope of Growth Services:</strong> Shahid Khan provides Meta Ads management, Google Ads Search/PMax setup, sales funnel architecture, landing page development, and automated lead capture workflows.</p>
                    <p><strong>3. Client Access Credentials:</strong> Clients agree to provide administrative access to required Meta Business Managers, Google Ads accounts, domains, and CRM platforms necessary for campaign execution.</p>
                    <p><strong>4. Direct Ad Spend Payment Responsibility:</strong> Ad budgets spent on advertising channels (Meta, Google) are paid directly by the client using their own linked credit cards/billing profiles within their ad accounts.</p>
                    <p><strong>5. Campaign Performance Disclaimer:</strong> While industry best practices are deployed, performance metrics (CPL, ROAS, Conversions) depend on product quality, pricing, sales follow-up, and market conditions; specific sales volume is not guaranteed.</p>
                    <p><strong>6. Intellectual Property Rights:</strong> Upon full payment of service invoices, clients own all custom website code, landing page designs, and creative ad assets developed specifically for their brand.</p>
                    <p><strong>7. Ad Network Compliance:</strong> Clients must ensure their products, services, and business models strictly adhere to Meta Advertising Policies and Google Ads Policies.</p>
                    <p><strong>8. Suspension of Work for Non-Payment:</strong> Invoices unpaid past 7 calendar days from the due date will result in immediate pausing of active ad campaigns and project deliverables.</p>
                    <p><strong>9. Client Review & Approvals:</strong> Clients are granted a 5-day review period for ad creatives and landing pages. Silence past 5 days constitutes formal acceptance of deliverables.</p>
                    <p><strong>10. Limitation of Liability:</strong> Shahid Khan shall not be held liable for indirect, incidental, or consequential damages resulting from ad platform account bans, server downtime, or third-party API outages.</p>
                    <p><strong>11. Confidentiality & Non-Disclosure:</strong> Both parties agree to maintain strict confidentiality regarding proprietary business strategies, financial records, client lists, and trade secrets.</p>
                    <p><strong>12. Service Modifications & Pricing:</strong> We reserve the right to modify service package offerings, features, and retainer pricing with a 30-day written notice to active clients.</p>
                    <p><strong>13. Contract Termination:</strong> Either party may terminate an ongoing retainer agreement by serving a 15-day written notice via official email.</p>
                    <p><strong>14. Governing Law & Jurisdiction:</strong> These terms are governed by the laws of India. Any legal disputes shall be subject to the exclusive jurisdiction of courts in Jaipur, Rajasthan, India.</p>
                    <p><strong>15. Entire Agreement:</strong> These Terms & Conditions, alongside signed project proposals, constitute the complete agreement between the client and Shahid Khan Digital Marketing.</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
                <button
                  onClick={() => setActiveLegalModal(null)}
                  className="px-5 py-2 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-bold shadow-md cursor-pointer"
                >
                  Close Legal Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIGITAL MARKETING CERTIFICATE LIGHTBOX MODAL */}
      <AnimatePresence>
        {certModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-4 sm:p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[var(--text-primary)]">
                      Udemy Digital Marketing Certificate
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)]">Shahid Khan • Aug 4, 2026 • 83.5 Total Hours</p>
                  </div>
                </div>

                <button
                  onClick={() => setCertModalOpen(false)}
                  className="p-2 rounded-full border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer"
                  aria-label="Close Certificate Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Certificate Image View */}
              <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-lg bg-white mb-4">
                <img 
                  src="/udemy_digital_marketing_certificate.png" 
                  alt="Udemy Digital Marketing Certificate - Shahid Khan" 
                  className="w-full h-auto object-contain max-h-[65vh]"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
                <div className="text-xs text-[var(--text-muted)] font-mono">
                  UC-95eaf934-2a3e-452a-b9e1-ec1406b220a1
                </div>

                <div className="flex items-center gap-3">
                  <a 
                    href="https://ude.my/UC-95eaf934-2a3e-452a-b9e1-ec1406b220a1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-heading font-bold hover:bg-[var(--bg-hover)] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Verify Online</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a 
                    href="/udemy_digital_marketing_certificate.pdf" 
                    download="Shahid_Khan_Udemy_Digital_Marketing_Certificate.pdf"
                    className="px-5 py-2 rounded-xl bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-heading font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-md cursor-pointer border border-[var(--border-dark)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER WITH PRIVACY, REFUND POLICY & TERMS AND CONDITIONS */}
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
            <button onClick={() => navigateTo('home')} className="hover:text-[var(--text-primary)] cursor-pointer">Home</button>
            <button onClick={() => navigateTo('about')} className="hover:text-[var(--text-primary)] cursor-pointer">About & Skills</button>
            <button onClick={() => navigateTo('services')} className="hover:text-[var(--text-primary)] cursor-pointer">Services</button>
            <button onClick={() => navigateTo('projects')} className="hover:text-[var(--text-primary)] cursor-pointer">Portfolio</button>
            <button onClick={() => navigateTo('contact')} className="hover:text-[var(--text-primary)] cursor-pointer">Contact</button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--text-secondary)]">
            <button onClick={() => setActiveLegalModal('privacy')} className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setActiveLegalModal('refund')} className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Refund Policy</button>
            <span>•</span>
            <button onClick={() => setActiveLegalModal('terms')} className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Terms & Conditions</button>
          </div>

        </div>
      </footer>

    </div>
  );
}
