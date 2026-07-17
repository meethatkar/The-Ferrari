import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const getPhaseText = (v) => {
  if (v <= 25) return 'Forging the aluminum chassis...';
  if (v <= 50) return 'Installing the 3.6L V8...';
  if (v <= 75) return 'Sculpting the Pininfarina bodywork...';
  if (v < 95) return 'Igniting the engine...';
  return 'Ready to Drive.';
};

const Loader = ({ setIsLoaded }) => {
  const loaderRef = useRef(null);
  const percentRef = useRef(null);
  const phaseRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    const counter = { value: 0 };

    const tween = gsap.to(counter, {
      value: 100,
      duration: 4,
      ease: 'none',
      onUpdate() {
        const v = Math.floor(counter.value);
        // Direct DOM writes — zero React re-renders
        if (percentRef.current) percentRef.current.textContent = `${v}%`;
        if (phaseRef.current) phaseRef.current.textContent = getPhaseText(v);
      },
      onComplete() {
        if (percentRef.current) percentRef.current.textContent = '100%';
        if (phaseRef.current) phaseRef.current.textContent = 'Ready to Drive.';
        loaderAnim();
      },
    });

    return () => tween.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loaderAnim = () => {
    const loader = loaderRef.current;
    const loaderPercent = percentRef.current;

    const tl = gsap.timeline({ onComplete: () => setIsLoaded(true) });

    tl.to(loaderPercent, { opacity: 0, duration: 0.5, ease: 'expo.out' })
      .to(phaseRef, { opacity: 0, duration: 0.5, ease: 'expo.out' }, "<")
      .to(nameRef, { opacity: 0, duration: 0.5, ease: 'expo.out' }, '<')
      .to(loader, { y: '-100%', ease: 'expo.out', duration: 1 });
  };

  return (
    <div ref={loaderRef} className="w-full h-screen flex items-center justify-center flex-col gap-4 bg-white z-50 fixed top-0 left-0">
      <div ref={percentRef} className="font-bebas text-4xl">
        0%
      </div>
      <p ref={phaseRef} className="font-elms text-sm md:text-xl text-gray-700 tracking-widest text-center px-6">
        Forging the aluminum chassis...
      </p>
      <h2 ref={nameRef} className="text-center w-full font-bold text-4xl font-uncial whitespace-normal md:whitespace-nowrap px-4">
        THE FERRARI 360
      </h2>
      <p className='text-base text-gray-400'>Ferrari Inspired Website Concept</p>
    </div>
  );
};

export default Loader;