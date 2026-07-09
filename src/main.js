import './style.css'
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl?raw';
import fragmentShader from './shaders/fragmentShader.glsl?raw';
import gsap from 'gsap';


const scroll = new LocomotiveScroll({
    el: document.querySelector('main'),
    smooth: true
});

// --- THREE.JS BASIC SETUP ---

// 1. Create Scene, Camera, and Renderer
const scene = new THREE.Scene();
const distance = 5;

const fov = 2 * Math.atan((window.innerHeight / 2) / distance) * (180 / Math.PI);

const camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = distance;

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Taking images and adding it in plane geometry
const images = document.querySelectorAll("img");
const planes = [];

// For overflow-hidden of other images in carousel
const wrapper = document.getElementById("carsoule-wrapper");
const wrapperBounds = wrapper.getBoundingClientRect();

images.forEach((img) => {
    const imgBoundings = img.getBoundingClientRect();
    const texture = new THREE.TextureLoader().load(img.src);
    // Check if this image is inside the carousel
    const isCarousel = img.closest("#carsoule-wrapper") !== null;

    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    texture.generateMipmaps = false;
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTexture: {
                value: texture
            },
            uIsCarousel: { value: isCarousel ? 1.0 : 0.0 },
            uBounds: {
                value: new THREE.Vector4(
                    wrapperBounds.left,
                    window.innerHeight - wrapperBounds.bottom,
                    wrapperBounds.right,
                    window.innerHeight - wrapperBounds.top
                )
            },
            uMouse: {
                value: new THREE.Vector2(0, 1)
            },
            uHover: {
                value: 0
            }
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
})

function updateImagePosition() {
    // Recalculate wrapper bounds on every frame so it updates when scrolling!
    const wrapperBounds = wrapper.getBoundingClientRect();

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
        )
    })
}

// 3. Handle Window Resizing
window.addEventListener('resize', () => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

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
});

// --- CAROUSEL LOGIC ---
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
    
    // Initialize
    goToSlide(0);
}

initCarousel();

// 4. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    updateImagePosition();
    renderer.render(scene, camera);
}

// Start animation
animate();
