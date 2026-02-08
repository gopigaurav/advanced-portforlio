import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Torus } from '@react-three/drei';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import * as THREE from 'three';

function FollowLight({ isDarkMode }: { isDarkMode: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const x = (state.mouse.x * state.viewport.width) / 2;
    const y = (state.mouse.y * state.viewport.height) / 2;
    if (lightRef.current) lightRef.current.position.set(x, y, 3.5);
  });
  return (
    <pointLight 
      ref={lightRef} 
      intensity={isDarkMode ? 150 : 80} // Boosted light intensity
      distance={30} 
      decay={1.2} // Slower decay for a bigger reach
      color={isDarkMode ? "#ffffff" : "#4f46e5"} 
    />
  );
}

function HeroShape({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <Float speed={4} rotationIntensity={2} floatIntensity={2}>
      <Torus args={[1, 0.4, 64, 128]}>
        <MeshDistortMaterial
          color={isDarkMode ? "#1a1a1a" : "#f8fafc"} 
          speed={4} distort={0.4} metalness={1} roughness={0.05}
          emissive={isDarkMode ? "#000000" : "#222"}
          emissiveIntensity={0.01}
        />
      </Torus>
    </Float>
  );
}

export default function GetInTouch({ isDarkMode, isVisible = true }: { isDarkMode: boolean, isVisible?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Adjusted spring for a slightly "heavier", more organic feel
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 120 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 120 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedField(type);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const bgStyle = isDarkMode ? 'bg-[#030303]' : 'bg-[#61dafbaa]';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8 }}
          className={`relative min-h-screen w-full ${bgStyle} transition-colors duration-700 flex flex-col items-center justify-center px-6 py-8 overflow-hidden`}
        >
          {/* ENHANCED MOUSE SPOTLIGHT */}
          {/* Increased radius to 1200px and adjusted color stops for a massive, brighter aura */}
          <motion.div 
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: useTransform(
                [smoothX, smoothY],
                ([x, y]) => isDarkMode 
                  ? `radial-gradient(1200px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.12), transparent 70%)`
                  : `radial-gradient(1200px circle at ${x}px ${y}px, rgba(79, 70, 229, 0.18), transparent 70%)`
              ),
            }}
          />

          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="h-[300px] md:h-[350px] w-full z-20"
          >
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.01} />
              <Suspense fallback={null}>
                <HeroShape isDarkMode={isDarkMode} />
                <FollowLight isDarkMode={isDarkMode} />
              </Suspense>
            </Canvas>
          </motion.div>

          <div className="max-w-5xl w-full z-30 text-center -mt-8">
            <motion.h2 
              initial={{ letterSpacing: "0.2em", opacity: 0 }}
              animate={{ letterSpacing: "-0.05em", opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`text-6xl md:text-8xl font-black tracking-tighter mb-12 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}
            >
              LET'S CHAT.
            </motion.h2>
            
            <div className="flex flex-col items-center gap-8">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full justify-center">
                <motion.div 
                  onClick={() => copyToClipboard('gopigaurav9@gmail.com', 'email')}
                  whileHover={{ scale: 1.02, backgroundColor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(79,70,229,0.03)" }}
                  className={`cursor-pointer px-8 py-4 rounded-2xl transition-all duration-300 border backdrop-blur-sm
                    ${isDarkMode ? 'border-zinc-800 hover:border-zinc-500 text-white' : 'border-zinc-300 hover:border-indigo-500 text-black'}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] mb-1 opacity-50">
                    {copiedField === 'email' ? 'Copied!' : 'Email'}
                  </p>
                  <p className="text-lg md:text-2xl font-semibold">gopigaurav9@gmail.com</p>
                </motion.div>

                <motion.div 
                  onClick={() => copyToClipboard('+91 9876543210', 'phone')}
                  whileHover={{ scale: 1.02, backgroundColor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(79,70,229,0.03)" }}
                  className={`cursor-pointer px-8 py-4 rounded-2xl transition-all duration-300 border backdrop-blur-sm
                    ${isDarkMode ? 'border-zinc-800 hover:border-zinc-500 text-white' : 'border-zinc-300 hover:border-indigo-500 text-black'}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] mb-1 opacity-50">
                    {copiedField === 'phone' ? 'Copied!' : 'Contact'}
                  </p>
                  <p className="text-lg md:text-2xl font-semibold">+91 9538924775</p>
                </motion.div>
              </div>

              <div className="mt-8 space-y-4">
                <p className={`max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
                  Based in India, but building for the world. Whether you have a groundbreaking idea 
                  to develop or a challenging problem to solve, <span className={isDarkMode ? 'text-white' : 'text-indigo-600'}>I'm ready to bring it to life.</span>
                </p>
                <p className={`text-sm tracking-widest uppercase opacity-60 font-bold ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  Dream big • Build fast • Scale global
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}