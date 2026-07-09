import './style.css'
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl?raw';
import fragmentShader from './shaders/fragmentShader.glsl?raw';
import gsap from 'gsap';


// --- STATE & GLOBALS ---
let scene, camera, renderer;
let planes = [];
let images = [];
let wrapper, wrapperBounds;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function initLocomotiveScroll() {
    new LocomotiveScroll({
        el: document.querySelector('main'),
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
        canvas: document.getElementById("canvas"),
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener('resize', onWindowResize);
}

function addPlanes() {
    images = document.querySelectorAll("img");
    wrapper = document.getElementById("carsoule-wrapper");
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
                        wrapperBounds.left,
                        window.innerHeight - wrapperBounds.bottom,
                        wrapperBounds.right,
                        window.innerHeight - wrapperBounds.top
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
    window.addEventListener('mousemove', (event) => {
        handleInteraction(event.clientX, event.clientY);
    });

    // Touch Events
    window.addEventListener('touchstart', (event) => {
        if (event.touches.length > 0) {
            handleInteraction(event.touches[0].clientX, event.touches[0].clientY);
        }
    });

    window.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            handleInteraction(event.touches[0].clientX, event.touches[0].clientY);
        }
    });

    window.addEventListener('touchend', () => {
        resetHover();
    });
}

function updateImagePosition() {
    wrapperBounds = wrapper.getBoundingClientRect();

    planes.forEach((plane, index) => {
        const img = images[index];
        const imgBounding = img.getBoundingClientRect();
        
        plane.position.set(
            imgBounding.left - window.innerWidth / 2 + imgBounding.width / 2,
            -imgBounding.top + window.innerHeight / 2 - imgBounding.height / 2,
            0
        );
        plane.material.uniforms.uBounds.value.set(
            wrapperBounds.left,
            window.innerHeight - wrapperBounds.bottom,
            wrapperBounds.right,
            window.innerHeight - wrapperBounds.top
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
    
    let currentIndex = 0;
    
    function goToSlide(index) {
        if(index < 0) index = slides.length - 1;
        if(index >= slides.length) index = 0;
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
    
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    
    colorBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => goToSlide(i));
    });
    
    goToSlide(0);
}

function animate() {
    requestAnimationFrame(animate);
    updateImagePosition();
    renderer.render(scene, camera);
}

// --- BOOTSTRAP APP ---
initLocomotiveScroll();
initThree();
addPlanes();
initInteractions();
initCarousel();
animate();
