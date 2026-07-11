import React, { useRef, forwardRef, useImperativeHandle } from 'react';

const CarouselSection = forwardRef(function CarouselSection(_, ref) {
  const wrapperRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const colorBtnsRef = useRef(null);
  const slidesRef = useRef(null); // container whose children are the .carsouel slides

  // Expose DOM nodes to the parent (App.jsx) via ref
  useImperativeHandle(ref, () => ({
    get wrapperEl() { return wrapperRef.current; },
    get slides() { return slidesRef.current ? Array.from(slidesRef.current.children) : []; },
    get prevBtn() { return prevBtnRef.current; },
    get nextBtn() { return nextBtnRef.current; },
    get colorBtns() { return colorBtnsRef.current ? Array.from(colorBtnsRef.current.children) : []; },
  }));

  return (
    <div id="car-carousel" className="min-h-screen py-16 md:py-24 relative flex flex-col items-center justify-center z-0">
      <h2 className="text-4xl md:text-6xl font-bebas text-gray-900 mb-8 md:mb-16 tracking-wide uppercase">Select Your Finish</h2>

      <div id="carsoule-wrapper" ref={wrapperRef} className="w-11/12 md:w-8/12 h-[40vh] md:h-[60vh] mx-auto flex items-center relative z-10 overflow-hidden">

        {/* Slide track — ref gives us access to all .carsouel children */}
        <div ref={slidesRef} className="w-full h-full flex">
          <div className="carsouel w-full h-full shrink-0">
            <img src="/colorsCar/red.webp" alt="Ferrari 360 red" loading="eager" decoding="async" className="w-full h-full object-contain" />
          </div>
          <div className="carsouel w-full h-full shrink-0">
            <img src="/colorsCar/green.webp" alt="Ferrari 360 green" loading="lazy" decoding="async" className="w-full h-full object-contain" />
          </div>
          <div className="carsouel w-full h-full shrink-0">
            <img src="/colorsCar/orange.webp" alt="Ferrari 360 orange" loading="lazy" decoding="async" className="w-full h-full object-contain" />
          </div>
          <div className="carsouel w-full h-full shrink-0">
            <img src="/colorsCar/blue.webp" alt="Ferrari 360 blue" loading="lazy" decoding="async" className="w-full h-full object-contain" />
          </div>
          <div className="carsouel w-full h-full shrink-0">
            <img src="/colorsCar/black.webp" alt="Ferrari 360 black" loading="lazy" decoding="async" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Prev button */}
        <div ref={prevBtnRef} className="btns absolute z-10 top-1/2 left-[2%] md:left-[5%] scale-150 md:scale-200 text-black md:text-white cursor-pointer mix-blend-difference">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-square drop-shadow-md" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            <path d="M10.205 12.456A.5.5 0 0 0 10.5 12V4a.5.5 0 0 0-.832-.374l-4.5 4a.5.5 0 0 0 0 .748l4.5 4a.5.5 0 0 0 .537.082" />
          </svg>
        </div>

        {/* Next button */}
        <div ref={nextBtnRef} className="btns absolute z-10 top-1/2 right-[2%] md:right-[5%] -scale-x-150 scale-y-150 md:-scale-x-200 md:scale-y-200 text-black md:text-white cursor-pointer mix-blend-difference">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-square drop-shadow-md" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            <path d="M10.205 12.456A.5.5 0 0 0 10.5 12V4a.5.5 0 0 0-.832-.374l-4.5 4a.5.5 0 0 0 0 .748l4.5 4a.5.5 0 0 0 .537.082" />
          </svg>
        </div>
      </div>

      {/* Color swatches */}
      <div ref={colorBtnsRef} id="clr-btns" className="flex flex-wrap justify-center w-fit items-center gap-4 md:gap-6 mt-12 md:mt-16 px-4">
        <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-red-500    cursor-pointer border-2 md:border-4 border-white"></span>
        <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-green-500  cursor-pointer border-2 md:border-4 border-white"></span>
        <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-orange-500 cursor-pointer border-2 md:border-4 border-white"></span>
        <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-500   cursor-pointer border-2 md:border-4 border-white"></span>
        <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gray-900   cursor-pointer border-2 md:border-4 border-white"></span>
      </div>
    </div>
  );
});

export default CarouselSection;
