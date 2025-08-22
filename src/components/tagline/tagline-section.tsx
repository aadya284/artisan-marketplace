"use client";

export function TaglineSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-orange-50 via-white to-amber-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <pattern id="tagline-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M10 10L15 5L10 0L5 5Z" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#tagline-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              From Every State,
            </span>
            <br />
            <span className="text-gray-800">For Every Heart</span>
          </h2>
          
          {/* Decorative elements */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange-400"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
