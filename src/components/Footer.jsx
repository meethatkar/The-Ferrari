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
      <div className="w-full bg-black py-5 px-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="font-bebas text-gray-400 tracking-widest text-sm md:text-base">
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
    </footer>
  );
};

export default Footer;
