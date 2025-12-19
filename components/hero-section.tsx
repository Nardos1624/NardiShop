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
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: "rgb(255,182,193)"});
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
    const light = new THREE.DirectionalLight("rgb(255,182,193)", 1);
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
      .from(".hero-title span", { y: 100, opacity: 0, stagger: 0.1, duration: 1.5, filter: "blur(15px)" }, "-=1")
      .from(".hero-image-container", { scale: 0.8, opacity: 0, duration: 2, ease: "elastic.out(1, 0.5)" }, "-=1.5");
  }, { scope: container });

  return (
    <section 
      ref={container} 
      className="relative w-full h-screen flex items-center overflow-hidden bg-[#E0E0E0]"
    >
      {/* 3D Canvas Layer */}
      <div ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center w-full max-w-7xl mx-auto px-6 gap-12">
        
        <div className="hero-content flex flex-col items-start text-left gap-8">
          <div className="space-y-4">
            <h1 className="hero-title text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-zinc-900">
              <span className="inline-block" style={{ color: "rgb(255,182,193)" }}>Shop happy</span><br />
              <span className="inline-block">Shop</span> <br />
              <span className="inline-block" style={{ color: "rgb(255,182,193)" }}>NardiShop</span>
            </h1>
            
            <p className="hero-description max-w-[450px] text-zinc-600 text-lg md:text-xl leading-relaxed">
             Discover stylish products powered by quality and performance.
            </p>
          </div>

          <div className="hero-button">
            <Button 
              asChild 
              size="lg" 
              className="bg-zinc-900 text-white px-12 py-8 text-xl rounded-full font-bold transition-transform hover:scale-105"
              style={{ boxShadow: "0 0 20px rgba(255,182,193,0.5)" }}
            >
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>

        <div className="hero-image-container relative flex justify-center items-center">
            {/* Background glow using your requested color */}
        
            <div className="relative w-[600px] h-[300px] md:w-[500px] md:h-[500px] bg-[#212121] ">
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