import React, { useEffect, useRef, useState } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl?raw';
import fragmentShader from './shaders/fragmentShader.glsl?raw';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './style.css';
import SpecsSection from './components/SpecsSection';
import CarouselSection from './components/CarouselSection';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollToPlugin);

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const mainRef = useRef(null);
  const canvasRef = useRef(null);
  const navLinksRef = useRef(null); // forwarded to Navbar → #nav-links div
  const carouselRef = useRef(null); // forwarded to CarouselSection via useImperativeHandle

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
      // Scope to <main> via ref — avoids global document.querySelectorAll
      images = mainRef.current.querySelectorAll('img');
      wrapper = carouselRef.current?.wrapperEl;
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

      // Reset hover when user scrolls — prevents effect freezing mid-scroll
      const onWheel = () => {
        resetHover();
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchstart', onTouchStart);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('wheel', onWheel, { passive: true });

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('wheel', onWheel);
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
      // All DOM nodes come from the forwarded ref — no document.querySelector
      const { slides, colorBtns, prevBtn, nextBtn, wrapperEl } = carouselRef.current ?? {};

      if (!slides?.length || !colorBtns?.length || !prevBtn || !nextBtn) return;

      wrapper = wrapperEl; // keep module-level wrapper in sync
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
          gsap.to(btn, {
            scale: i === currentIndex ? 1.2 : 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }

      const onNextClick = () => goToSlide(currentIndex + 1);
      const onPrevClick = () => goToSlide(currentIndex - 1);

      nextBtn.addEventListener('click', onNextClick);
      prevBtn.addEventListener('click', onPrevClick);
      colorBtns.forEach((btn, i) => btn.addEventListener('click', () => goToSlide(i)));

      goToSlide(0);

      return () => {
        nextBtn.removeEventListener('click', onNextClick);
        prevBtn.removeEventListener('click', onPrevClick);
        colorBtns.forEach((btn, i) => btn.removeEventListener('click', () => goToSlide(i)));
      };
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      updateImagePosition();
      renderer.render(scene, camera);
    }

    function initNavigation() {
      // Use forwarded ref to nav-links div — no document.querySelectorAll
      const navLinks = navLinksRef.current
        ? Array.from(navLinksRef.current.querySelectorAll('span[data-target]'))
        : [];

      const onLinkClick = (e) => {
        const target = e.currentTarget.getAttribute('data-target');
        if (target && locoScroll) {
          locoScroll.scrollTo(target);
        }
      };

      navLinks.forEach((link) => link.addEventListener('click', onLinkClick));

      return () => {
        navLinks.forEach((link) => link.removeEventListener('click', onLinkClick));
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
      {!isLoaded && <Loader setIsLoaded={setIsLoaded} />}
      <main ref={mainRef} data-scroll-container className="w-full relative">
        <Navbar ref={navLinksRef} />
        <div id="hero" className="relative w-full h-[60vh] md:h-screen">
          <img src="/colorsCar/red.webp" alt="Ferrari 360 red" fetchpriority="high" decoding="async" className="w-full object-cover h-[50vh] md:h-[85vh] object-bottom" />
          <h1 className="absolute bottom-[2%] md:bottom-[2.5%] left-0 text-center text-[3vmax] md:text-[16vh] w-full font-bold font-uncial whitespace-normal md:whitespace-nowrap px-4">
            THE FERRARI 360
          </h1>
        </div>
        <div id="description" className="w-full text-center px-6 md:px-8 py-12 md:py-32">
          <p className="w-11/12 md:w-8/12 mx-auto text-xl md:text-3xl font-elms text-gray-700 leading-relaxed font-light overflow-hidden">
            The Ferrari 360, introduced in 1999, marked a revolutionary leap with its all-aluminum chassis. Powered by a mid-mounted 3.6-liter V8 engine producing 395 horsepower, this Pininfarina-designed masterpiece delivered thrilling performance and ushered the iconic brand into the 21st century.
          </p>
        </div>
        <SpecsSection />
        <CarouselSection ref={carouselRef} />
        <Footer />
      </main>
      <canvas ref={canvasRef} id="canvas" className="fixed top-0 left-0 z-[-1] object-cover pointer-events-none"></canvas>
    </>
  );
}
