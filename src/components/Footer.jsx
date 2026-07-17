import React from 'react';

const Footer = () => {
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
