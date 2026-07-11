import React, { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl?raw';
import fragmentShader from './shaders/fragmentShader.glsl?raw';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './style.css';

gsap.registerPlugin(ScrollToPlugin);

export default function App() {
  const mainRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // --- STATE & GLOBALS ---
    let scene, camera, renderer;
    let planes = [];
    let images = [];
    let wrapper, wrapperBounds;
    let locoScroll;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let animationFrameId;

    function initLocomotiveScroll() {
      locoScroll = new LocomotiveScroll({
        el: mainRef.current,
        smooth: true
      });
    }

    function initThree() {
      scene = new THREE.Scene();
      const distance = 5;
      const fov = 2 * Math.atan((window.innerHeight / 2) / distance) * (180 / Math.PI);

      camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = distance;

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      window.addEventListener('resize', onWindowResize);
    }

    function addPlanes() {
      images = document.querySelectorAll("img");
      wrapper = document.getElementById("carsoule-wrapper");
      if (!wrapper) return;
      wrapperBounds = wrapper.getBoundingClientRect();

      images.forEach((img) => {
        const imgBoundings = img.getBoundingClientRect();
        const texture = new THREE.TextureLoader().load(img.src);
        const isCarousel = img.closest("#carsoule-wrapper") !== null;

        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uIsCarousel: { value: isCarousel ? 1.0 : 0.0 },
            uBounds: {
              value: new THREE.Vector4(
                wrapperBounds.left * renderer.getPixelRatio(),
                (window.innerHeight - wrapperBounds.bottom) * renderer.getPixelRatio(),
                wrapperBounds.right * renderer.getPixelRatio(),
                (window.innerHeight - wrapperBounds.top) * renderer.getPixelRatio()
              )
            },
            uMouse: { value: new THREE.Vector2(0, 1) },
            uHover: { value: 0 }
          },
          vertexShader,
          fragmentShader,
          transparent: true
        });

        const geometry = new THREE.PlaneGeometry(imgBoundings.width, imgBoundings.height);
        const plane = new THREE.Mesh(geometry, material);

        plane.position.set(
          imgBoundings.left - window.innerWidth / 2 + imgBoundings.width / 2,
          -imgBoundings.top + window.innerHeight / 2 - imgBoundings.height / 2,
          0
        );

        planes.push(plane);
        scene.add(plane);
      });
    }

    function initInteractions() {
      function handleInteraction(clientX, clientY) {
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        planes.forEach(plane => {
          const intersects = raycaster.intersectObject(plane);
          if (intersects.length > 0) {
            gsap.to(plane.material.uniforms.uMouse.value, {
              x: intersects[0].uv.x,
              y: intersects[0].uv.y,
              duration: 0.6,
              ease: "power3.out"
            });
            gsap.to(plane.material.uniforms.uHover, {
              value: 1.0,
              duration: 0.6,
              ease: "power3.out"
            });
          } else {
            gsap.to(plane.material.uniforms.uHover, {
              value: 0.0,
              duration: 0.6,
              ease: "power3.out"
            });
          }
        });
      }

      function resetHover() {
        planes.forEach(plane => {
          gsap.to(plane.material.uniforms.uHover, {
            value: 0.0,
            duration: 0.6,
            ease: "power3.out"
          });
        });
      }

      // Mouse Events
      const onMouseMove = (event) => {
        handleInteraction(event.clientX, event.clientY);
      };

      // Touch Events
      const onTouchStart = (event) => {
        if (event.touches.length > 0) {
          handleInteraction(event.touches[0].clientX, event.touches[0].clientY);
        }
      };

      const onTouchMove = (event) => {
        if (event.touches.length > 0) {
          handleInteraction(event.touches[0].clientX, event.touches[0].clientY);
        }
      };

      const onTouchEnd = () => {
        resetHover();
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchstart', onTouchStart);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
      };
    }

    function updateImagePosition() {
      if (!wrapper) return;
      wrapperBounds = wrapper.getBoundingClientRect();

      planes.forEach((plane, index) => {
        const img = images[index];
        if (!img) return;
        const imgBounding = img.getBoundingClientRect();

        plane.position.set(
          imgBounding.left - window.innerWidth / 2 + imgBounding.width / 2,
          -imgBounding.top + window.innerHeight / 2 - imgBounding.height / 2,
          0
        );
        plane.material.uniforms.uBounds.value.set(
          wrapperBounds.left * renderer.getPixelRatio(),
          (window.innerHeight - wrapperBounds.bottom) * renderer.getPixelRatio(),
          wrapperBounds.right * renderer.getPixelRatio(),
          (window.innerHeight - wrapperBounds.top) * renderer.getPixelRatio()
        );
      });
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function initCarousel() {
      const slides = document.querySelectorAll('.carsouel');
      const colorBtns = document.querySelectorAll('#clr-btns span');
      const prevBtn = document.querySelectorAll('.btns')[0];
      const nextBtn = document.querySelectorAll('.btns')[1];

      if (!slides.length || !colorBtns.length || !prevBtn || !nextBtn) return;

      let currentIndex = 0;

      function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;

        gsap.to(slides, {
          xPercent: -100 * currentIndex,
          duration: 1,
          ease: "power3.inOut"
        });

        colorBtns.forEach((btn, i) => {
          if (i === currentIndex) {
            gsap.to(btn, { scale: 1.2, duration: 0.3, ease: "power2.out" });
          } else {
            gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
          }
        });
      }

      const onNextClick = () => goToSlide(currentIndex + 1);
      const onPrevClick = () => goToSlide(currentIndex - 1);

      nextBtn.addEventListener('click', onNextClick);
      prevBtn.addEventListener('click', onPrevClick);

      colorBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => goToSlide(i));
      });

      goToSlide(0);

      return () => {
        nextBtn.removeEventListener('click', onNextClick);
        prevBtn.removeEventListener('click', onPrevClick);
        // We skip removing colorBtns event listeners for simplicity in cleanup
      };
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      updateImagePosition();
      renderer.render(scene, camera);
    }

    function initNavigation() {
      const navLinks = document.querySelectorAll('#nav-links > span');
      
      const onLinkClick = (e) => {
        const link = e.currentTarget;
        const target = link.getAttribute('data-target');
        if (target) {
          gsap.to(window, { duration: 1, scrollTo: target, ease: "power3.inOut" });
          if (locoScroll) {
            locoScroll.scrollTo(target);
          }
        }
      };

      navLinks.forEach((link) => {
        link.addEventListener('click', onLinkClick);
      });

      return () => {
        navLinks.forEach((link) => {
          link.removeEventListener('click', onLinkClick);
        });
      };
    }

    // --- BOOTSTRAP APP ---
    // Make sure DOM elements are ready before querying them
    const timer = setTimeout(() => {
      initLocomotiveScroll();
      initThree();
      addPlanes();
      const cleanupInteractions = initInteractions();
      initCarousel();
      const cleanupNavigation = initNavigation();
      animate();

      return () => {
        if (cleanupInteractions) cleanupInteractions();
        if (cleanupNavigation) cleanupNavigation();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onWindowResize);
      if (locoScroll) locoScroll.destroy();
      if (renderer) renderer.dispose();
      // clean up planes, textures, geometry, materials
      planes.forEach(plane => {
        if (plane.geometry) plane.geometry.dispose();
        if (plane.material) {
          if (plane.material.uniforms.uTexture.value) {
            plane.material.uniforms.uTexture.value.dispose();
          }
          plane.material.dispose();
        }
        scene.remove(plane);
      });
    };
  }, []);

  return (
    <>
      <main ref={mainRef} data-scroll-container className="w-full relative">
        <header className="w-full px-6 md:px-12 py-4 md:py-6 absolute top-0 z-10 left-0 flex items-center justify-between font-elms">
          <h1 className="font-bebas text-3xl md:text-4xl tracking-wider text-gray-100">
            SUPE-CAR
          </h1>
          <div id="nav-links" className="uppercase text-base font-semibold tracking-widest hidden md:flex gap-10 text-gray-800">
            <span data-target="#specs" className="group relative cursor-pointer overflow-hidden h-[1.2em] flex flex-col">
              <span className="block transition-transform duration-500 ease-in-out group-hover:-translate-y-full">specs</span>
              <span className="block absolute top-full left-0 text-red-600 transition-transform duration-500 ease-in-out group-hover:-translate-y-full">specs</span>
            </span>
            <span data-target="#car-carousel" className="group relative cursor-pointer overflow-hidden h-[1.2em] flex flex-col">
              <span className="block transition-transform duration-500 ease-in-out group-hover:-translate-y-full">colors</span>
              <span className="block absolute top-full left-0 text-red-600 transition-transform duration-500 ease-in-out group-hover:-translate-y-full">colors</span>
            </span>
            <span data-target="#footer" className="group relative cursor-pointer overflow-hidden h-[1.2em] flex flex-col">
              <span className="block transition-transform duration-500 ease-in-out group-hover:-translate-y-full">reviews</span>
              <span className="block absolute top-full left-0 text-red-600 transition-transform duration-500 ease-in-out group-hover:-translate-y-full">reviews</span>
            </span>
            <span data-target="#footer" className="group relative cursor-pointer overflow-hidden h-[1.2em] flex flex-col">
              <span className="block transition-transform duration-500 ease-in-out group-hover:-translate-y-full">contact</span>
              <span className="block absolute top-full left-0 text-red-600 transition-transform duration-500 ease-in-out group-hover:-translate-y-full">contact</span>
            </span>
          </div>
          <button className="bg-black/90 hover:bg-black px-4 md:px-6 py-2 md:py-3 rounded-2xl text-white font-semibold text-xs md:text-sm tracking-widest">
            BOOK DEMO
          </button>
        </header>
        <div id="hero" className="relative w-full h-[60vh] md:h-screen">
          <img src="/colorsCar/red.webp" alt="Ferrari 360 red" fetchpriority="high" decoding="async" className="w-full object-cover h-[50vh] md:h-[85vh] object-bottom" />
          <h1 className="absolute bottom-[2%] md:bottom-[2.5%] left-0 text-center text-[3vmax] md:text-[16vh] w-full font-bold font-uncial whitespace-normal md:whitespace-nowrap px-4">
            THE FERRARI 360
          </h1>
        </div>
        <div id="description" className="w-full text-center px-6 md:px-8 py-12 md:py-32">
          <p className="w-11/12 md:w-8/12 mx-auto text-xl md:text-3xl font-elms text-gray-700 leading-relaxed font-light">
            The Ferrari 360, introduced in 1999, marked a revolutionary leap with its all-aluminum chassis. Powered by a mid-mounted 3.6-liter V8 engine producing 395 horsepower, this Pininfarina-designed masterpiece delivered thrilling performance and ushered the iconic brand into the 21st century.
          </p>
        </div>
        <div id="specs" className="px-6 md:px-8 py-16 md:py-24 w-full max-w-7xl mx-auto flex flex-col gap-20 md:gap-32">
          <div className="wrapper w-full min-h-[45vh] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            <div className="left img w-full md:w-1/2 h-[35vh] md:h-full">
              <img src="/components/structure.webp" alt="Ferrari 360 structure" loading="lazy" decoding="async" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div className="right txt w-full md:w-1/2 text-center md:text-left flex flex-col justify-center gap-4 md:gap-6">
              <h2 className="text-5xl md:text-7xl font-bebas tracking-wide text-gray-900">The Structure</h2>
              <p className="text-lg md:text-2xl font-elms text-gray-600 leading-relaxed font-light">
                Developed with Alcoa, the 360's space-frame chassis is entirely aluminum, making it 40% stiffer and 28% lighter than its predecessor.
              </p>
            </div>
          </div>
          <div className="wrapper w-full min-h-[45vh] flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-16">
            <div className="left img w-full md:w-1/2 h-[35vh] md:h-full">
              <img src="/components/engine.webp" alt="Ferrari 360 engine" loading="lazy" decoding="async" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div className="right txt w-full md:w-1/2 text-center md:text-left flex flex-col justify-center gap-4 md:gap-6">
              <h2 className="text-5xl md:text-7xl font-bebas tracking-wide text-gray-900">The Engine</h2>
              <p className="text-lg md:text-2xl font-elms text-gray-600 leading-relaxed font-light">
                At its core lies a naturally aspirated 3.6-liter V8 engine, delivering 395 horsepower and an exhilarating 8,500 rpm redline.
              </p>
            </div>
          </div>
          <div className="wrapper w-full min-h-[45vh] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            <div className="left img w-full md:w-1/2 h-[35vh] md:h-full">
              <img src="/components/exhaust.webp" alt="Ferrari 360 exhaust" loading="lazy" decoding="async" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div className="right txt w-full md:w-1/2 text-center md:text-left flex flex-col justify-center gap-4 md:gap-6">
              <h2 className="text-5xl md:text-7xl font-bebas tracking-wide text-gray-900">The Exhaust</h2>
              <p className="text-lg md:text-2xl font-elms text-gray-600 leading-relaxed font-light">
                The variable back-pressure exhaust valves open at high RPMs, bypassing the silencers to unleash the iconic, high-pitched Ferrari V8 scream.
              </p>
            </div>
          </div>
          <div className="wrapper w-full min-h-[45vh] flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-16">
            <div className="left img w-full md:w-1/2 h-[35vh] md:h-full">
              <img src="/components/wheel.webp" alt="Ferrari 360 wheel" loading="lazy" decoding="async" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div className="right txt w-full md:w-1/2 text-center md:text-left flex flex-col justify-center gap-4 md:gap-6">
              <h2 className="text-5xl md:text-7xl font-bebas tracking-wide text-gray-900">The Wheels</h2>
              <p className="text-lg md:text-2xl font-elms text-gray-600 leading-relaxed font-light">
                Equipped with 18-inch five-spoke alloy wheels, the 360 houses robust Brembo ventilated disc brakes for exceptional stopping power and control.
              </p>
            </div>
          </div>
        </div>
        <div id="car-carousel" className="min-h-screen py-16 md:py-24 relative flex flex-col items-center justify-center z-0">
          <h2 className="text-4xl md:text-6xl font-bebas text-gray-900 mb-8 md:mb-16 tracking-wide uppercase">Select Your Finish</h2>
          <div id="carsoule-wrapper" className="w-11/12 md:w-8/12 h-[40vh] md:h-[60vh] mx-auto flex items-center relative z-10 overflow-hidden">
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
            <div className="btns absolute z-10 top-1/2 left-[2%] md:left-[5%] scale-150 md:scale-200 text-black md:text-white cursor-pointer mix-blend-difference">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-square drop-shadow-md" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                <path d="M10.205 12.456A.5.5 0 0 0 10.5 12V4a.5.5 0 0 0-.832-.374l-4.5 4a.5.5 0 0 0 0 .748l4.5 4a.5.5 0 0 0 .537.082" />
              </svg>
            </div>
            <div className="btns absolute z-10 top-1/2 right-[2%] md:right-[5%] -scale-x-150 scale-y-150 md:-scale-x-200 md:scale-y-200 text-black md:text-white cursor-pointer mix-blend-difference">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-square drop-shadow-md" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                <path d="M10.205 12.456A.5.5 0 0 0 10.5 12V4a.5.5 0 0 0-.832-.374l-4.5 4a.5.5 0 0 0 0 .748l4.5 4a.5.5 0 0 0 .537.082" />
              </svg>
            </div>
          </div>
          <div id="clr-btns" className="flex flex-wrap justify-center w-fit items-center gap-4 md:gap-6 mt-12 md:mt-16 px-4">
            <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-red-500 cursor-pointer border-2 md:border-4 border-white"></span>
            <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-green-500 cursor-pointer border-2 md:border-4 border-white"></span>
            <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-orange-500 cursor-pointer border-2 md:border-4 border-white"></span>
            <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-500 cursor-pointer border-2 md:border-4 border-white"></span>
            <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gray-900 cursor-pointer border-2 md:border-4 border-white"></span>
          </div>
        </div>
        <footer id="footer" className="w-full h-[30vh]">
          <img src="/footer.webp" alt="The FERRARI 360" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </footer>
      </main>
      <canvas ref={canvasRef} id="canvas" className="fixed top-0 left-0 z-[-1] object-cover pointer-events-none"></canvas>
    </>
  );
}
