import React, { useState } from 'react';

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer id="footer" className="w-full">
      <div className="w-full h-[30vh]">
        <img
          src="/footer.webp"
          alt="The FERRARI 360"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full bg-gradient-to-b from-zinc-950 to-black py-10 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Premium subtle red radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="mb-6 max-w-2xl relative z-10">
          <p className="text-2xl md:text-4xl font-bebas text-white tracking-widest uppercase mb-1">
            Designed to Inspire.
          </p>
          <p className="text-2xl md:text-4xl font-bebas text-red-600 tracking-widest uppercase mb-4">
            Engineered for Experience.
          </p>
          <p className="text-sm md:text-base font-elms text-gray-400 font-light tracking-widest uppercase">
            Meet Hatkar
          </p>
        </div>

        {/* Small CTA Contact Button with Hover Tagline */}
        <div className="relative mb-8 z-20">
          <a
            href="mailto:meethatkar2004@gmail.com"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600/50 text-white transition-all duration-300 shadow-lg hover:shadow-red-900/20 text-xs md:text-sm font-elms tracking-wider cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-semibold tracking-wide">Contact Me</span>

            {/* Hover Tagline Tooltip / Popup */}
            <div
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[280px] md:max-w-xs px-4 py-2.5 bg-zinc-900/95 border border-red-600/30 rounded-xl text-gray-300 text-xs font-light tracking-wide shadow-2xl backdrop-blur-md pointer-events-none transition-all duration-300 ${isHovered
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-2 scale-95'
                }`}
            >
              <p className="text-white font-medium text-xs mb-0.5">
                Have a project in mind? 🚀
              </p>
              <p className="text-gray-400 text-[11px] leading-tight">
                Contact developer to discuss about your project
              </p>
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/95"></div>
            </div>
          </a>
        </div>

        <div className="w-full max-w-7xl border-t border-zinc-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <p className="font-bebas text-gray-500 tracking-widest text-sm md:text-base">
            {new Date().getFullYear()} Ferrari 360
          </p>
          <p className="font-elms text-gray-500 text-xs md:text-sm text-center md:text-right">
            Crafted by{' '}
            <span className="text-white font-semibold tracking-wide">Meet Hatkar</span>
            {' '}·{' '}
            <span className="text-red-500 font-semibold tracking-widest uppercase text-xs">
              MotionGrid Digital Agency
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
