import React from 'react';
import { ArrowUpRight, Calendar, Tag } from 'lucide-react';

const BlogInsights = () => {
  const articles = [
    {
      id: 1,
      title: '5 DESIGN TRENDS THAT WILL DEFINE 2024',
      category: 'Insights',
      date: 'Apr 30, 2025',
      excerpt: 'Explore the top design trends for 2024 that will influence web, UI/UX, and branding projects, helping you stay ahead of the curve.',
      image: 'https://framerusercontent.com/images/1wFj19qQG6zNr7gj3iTlH0Gdlu8.jpeg'
    },
    {
      id: 2,
      title: 'HOW TO STREAMLINE YOUR DESIGN WORKFLOW',
      category: 'Tutorials',
      date: 'Apr 27, 2025',
      excerpt: 'Discover practical strategies to improve your design process, save time, and deliver quality work more efficiently.',
      image: 'https://framerusercontent.com/images/xmKml0E7v2iBI4zbbj0yVccaQwg.jpeg'
    }
  ];

  return (
    <section id="blogs" className="py-24 px-4 md:px-8 bg-[#14161d] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono text-[#d0ff71] tracking-widest uppercase mb-2 block">
              // THOUGHT LEADERSHIP
            </span>
            <h2 className="font-antonio text-4xl sm:text-6xl text-white font-bold uppercase tracking-tight">
              DESIGN INSIGHTS <span className="text-[#d0ff71]">& IDEAS</span>
            </h2>
          </div>
          <p className="text-[#9ea4b5] max-w-md text-sm md:text-base font-light">
            Articles and guides to help you elevate your craft, optimize digital workflows, and spark new creative ideas.
          </p>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {articles.map((art) => (
            <div key={art.id} className="glass-card rounded-3xl overflow-hidden border-[#272a3a] group flex flex-col justify-between hover:border-[#d0ff71]/60 transition-all duration-500">
              <div className="relative h-64 overflow-hidden bg-[#0d0e12]">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181a24] via-transparent to-transparent opacity-90" />
                
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#0d0e12]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#d0ff71] uppercase">
                    {art.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#0d0e12]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#9ea4b5] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {art.date}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h3 className="font-antonio text-2xl text-white font-bold uppercase tracking-wide mb-3 group-hover:text-[#d0ff71] transition-colors">
                  {art.title}
                </h3>
                <p className="text-[#9ea4b5] text-sm font-light leading-relaxed mb-6">
                  {art.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#272a3a]">
                  <span className="text-xs font-mono text-[#646b7c]">5 MIN READ</span>
                  <span className="text-xs font-semibold text-[#d0ff71] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    READ ARTICLE <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button className="px-8 py-4 rounded-full bg-[#181a24] border border-[#272a3a] text-white font-semibold text-xs tracking-wider uppercase inline-flex items-center gap-3 hover:border-[#d0ff71] hover:text-[#d0ff71] transition-all transform hover:scale-105">
            BROWSE ALL INSIGHTS
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogInsights;
