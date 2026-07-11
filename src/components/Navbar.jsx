import React from 'react';

const navLinks = [
  { label: 'specs',   target: '#specs' },
  { label: 'colors',  target: '#car-carousel' },
  { label: 'reviews', target: '#footer' },
  { label: 'contact', target: '#footer' },
];

const Navbar = () => {
  return (
    <header className="w-full px-6 md:px-12 py-4 md:py-6 absolute top-0 z-10 left-0 flex items-center justify-between font-elms">
      <h1 className="font-bebas text-3xl md:text-4xl tracking-wider text-gray-100">
        SUPE-CAR
      </h1>

      <div id="nav-links" className="uppercase text-base font-semibold tracking-widest hidden md:flex gap-10 text-gray-800">
        {navLinks.map(({ label, target }) => (
          <span
            key={label}
            data-target={target}
            className="group relative cursor-pointer overflow-hidden h-[1.2em] flex flex-col"
          >
            <span className="block transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
              {label}
            </span>
            <span className="block absolute top-full left-0 text-red-600 transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
              {label}
            </span>
          </span>
        ))}
      </div>

      <button className="bg-black/90 hover:bg-black px-4 md:px-6 py-2 md:py-3 rounded-2xl text-white font-semibold text-xs md:text-sm tracking-widest">
        BOOK DEMO
      </button>
    </header>
  );
};

export default Navbar;
