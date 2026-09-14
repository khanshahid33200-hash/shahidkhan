import React from 'react';

const SkeletonSection = ({ title = 'LOADING SECTION...' }) => {
  return (
    <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-3">
          <div className="h-4 w-36 bg-[#ff6b00]/20 rounded-full" />
          <div className="h-10 w-72 sm:w-96 bg-black/10 rounded-2xl" />
        </div>
        <div className="h-12 w-full max-w-md bg-black/5 rounded-2xl" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="lucid-glass rounded-3xl p-6 border-white/60 shadow-sm flex flex-col justify-between h-72 bg-white/40 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="h-6 w-20 bg-[#ff6b00]/15 rounded-full" />
              <div className="h-8 w-3/4 bg-black/10 rounded-xl" />
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full bg-black/5 rounded" />
                <div className="h-3 w-5/6 bg-black/5 rounded" />
                <div className="h-3 w-2/3 bg-black/5 rounded" />
              </div>
            </div>
            <div className="h-10 w-32 bg-[#ff6b00]/20 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonSection;
