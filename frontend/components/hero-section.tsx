"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HeroSection = () => {
  const container = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || typeof window === "undefined") return;

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: "#D4AF37" });
    const meshes: THREE.Mesh[] = [];

    for (let i = 0; i < 60; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        Math.random() * 15 - 2, 
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const scale = Math.random() * 1.2 + 0.3;
      mesh.scale.set(scale, scale, scale);
      scene.add(mesh);
      meshes.push(mesh);
    }
    const light = new THREE.DirectionalLight("#D4AF37", 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xE0E0E0, 0.3));

    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);
      meshes.forEach((m, i) => {
        m.rotation.x += 0.005;
        m.rotation.y += 0.005;
        m.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.from(".hero-content", { x: -50, opacity: 0, duration: 1.5 })
      .from(".hero-title > span", { y: 40, opacity: 0, stagger: 0.12, duration: 1, filter: "blur(10px)" }, "-=1")
      .from(".hero-image-container", { scale: 0.8, opacity: 0, duration: 2, ease: "elastic.out(1, 0.5)" }, "-=1.5");
  }, { scope: container });

  return (
    <section 
      ref={container} 
      className="relative w-full h-screen flex items-center overflow-hidden bg-[#281E18]"
    >
      {/* 3D Canvas Layer */}
      <div ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center w-full max-w-7xl mx-auto px-6 gap-12">
        
        <div className="hero-content flex flex-col items-start text-left gap-8">
          <div className="space-y-4">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.7)]" />
              Shopping, made joyful
            </div>
            <h1 className="hero-title flex flex-col items-start gap-3">
              <span className="block whitespace-nowrap text-[clamp(1.2rem,3vw,2rem)] font-bold tracking-[-0.04em] text-[#F5EBDD]">
                Click. Order. <span className="bg-linear-to-r from-amber-200 via-[#D4AF37] to-yellow-500 bg-clip-text font-extrabold text-transparent">Smile.</span>
              </span>
              <span className="inline-flex flex-wrap items-baseline gap-x-2 rounded-2xl border border-[#D4AF37]/20 bg-white/5 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.16)] backdrop-blur-sm sm:px-5">
                <span className="text-2xl font-semibold tracking-tight text-[#F5EBDD] sm:text-3xl">That’s</span>
                <span className="bg-linear-to-r from-amber-200 via-[#D4AF37] to-yellow-500 bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-5xl lg:text-6xl">
                  NardiShop<span className="text-[#D4AF37]">.</span>
                </span>
              </span>
            </h1>
            
            <p className="hero-description max-w-[450px] text-[#D8C9B8] text-lg leading-relaxed md:text-xl">
              Order your favorite brands in minutes, and we’ll deliver them to your door.
            </p>
          </div>

          <div className="hero-button">
            <Button 
              asChild 
              size="lg" 
              className="rounded-full bg-[#D4AF37] px-12 py-8 text-xl font-bold text-[#281E18] transition-transform hover:scale-105 hover:bg-amber-300"
              style={{ boxShadow: "0 0 20px rgba(212,175,55,0.5)" }}
            >
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>

        <div className="hero-image-container relative flex justify-center items-center">
            {/* Background glow using your requested color */}
        
            <div className="relative w-[600px] h-[300px] md:w-[500px] md:h-[500px] bg-[#281E18] ">
                <Image 
                  src="/placeholder/home-image.png" 
                  alt="Earpods" 
                  fill 
                  className="object-contain"
                  priority
                />
                
            </div>
            
        </div>
        
      </div>
      
    </section>
  );
};

export default HeroSection;