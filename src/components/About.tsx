// @ts-nocheck
import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  ContactShadows,
  useGLTF,
  useAnimations,
  Environment,
} from '@react-three/drei';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';

/* --- 1. Sequential Multi-Character Controller --- */
function CharacterModel({ isSongPlaying }: { isSongPlaying: boolean }) {
  const getScale = () => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      // Granular scaling for better responsiveness
      if (w < 480) return 0.6;   // Small Mobile
      if (w < 768) return 0.8;   // Mobile/Tablet
      if (w < 1024) return 1.0;  // Laptop
      return 1.4;                // Large Desktop
    }
    return 1.2;
  };

  const modelRegistry = useMemo(() => ({
    dancing: [
      { url: "/models/dancing1.glb", scale: getScale(), position: [0, -2, 0] },
      { url: "/models/rallying.glb", scale: getScale(), position: [0, -2, 0] },
      { url: "/models/stand_greeting.glb", scale: getScale(), position: [0, -1.8, 0] },
    ],
    idle: [
      { url: "/models/sad_idle.glb", scale: getScale(), position: [0, -1.8, 0] },
    ]
  }), []);

  const [modelIndex, setModelIndex] = useState(0);
  const activeList = isSongPlaying ? modelRegistry.dancing : modelRegistry.idle;
  const activeConfig = activeList[modelIndex % activeList.length];

  const { scene, animations } = useGLTF(activeConfig.url);
  const { actions, names } = useAnimations(animations, scene);
  const [animIndex, setAnimIndex] = useState(0);

  useEffect(() => {
    setModelIndex(0);
    setAnimIndex(0);
  }, [isSongPlaying]);

  useEffect(() => {
    if (!actions || names.length === 0) return;
    const currentName = names[animIndex % names.length];
    actions[currentName]?.reset().fadeIn(0.5).play();

    const duration = isSongPlaying ? 6000 : 10000;
    const timer = setInterval(() => {
      setAnimIndex((prev) => prev + 1);
      setModelIndex((prev) => (prev + 1) % activeList.length);
    }, duration);

    return () => {
      actions[currentName]?.fadeOut(0.5);
      clearInterval(timer);
    };
  }, [animIndex, modelIndex, isSongPlaying, names, actions, activeList.length]);

  return (
    <primitive 
      key={activeConfig.url + modelIndex} 
      object={scene} 
      scale={activeConfig.scale} 
      position={activeConfig.position} 
      rotation={[0, -0.4, 0]} 
    />
  );
}

/* --- 2. Main About Component --- */
export default function About({ isDarkMode, isSongPlaying }: { isDarkMode: boolean; isSongPlaying: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  // Use scroll for parallax on the character
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const characterYParallax = useTransform(scrollYProgress, [0, 1], [1, -1]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  const skillGroups = [
    { label: "Programming", items: ["TypeScript", "JavaScript", "Python", "Node.js", "Java", "C++", "React", "Angular", "Flask", "FastAPI", "NestJS"] },
    { label: "Cloud & DevOps", items: ["GCP", "AWS", "Azure", "Kubernetes", "Docker", "CI/CD", "GitHub Actions", "Terraform", "AWS CDK"] },
    { label: "Databases & Tools", items: ["PostgreSQL", "MongoDB", "Redis", "DynamoDB", "Kafka", "Splunk", "Puppeteer", "Cypress"] },
    { label: "Architecture & AI", items: ["Microservices", "Event-driven systems", "API Design", "DSA", "Deep Learning", "Machine Learning"] }
  ];

  return (
    <section
      id="about"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative min-h-[100dvh] w-full flex flex-col justify-center overflow-hidden transition-colors duration-1000 ${
        isDarkMode ? "bg-[#0a0a0a]" : "bg-[#517394]"
      } px-4 sm:px-8 md:px-12 lg:px-24 py-8 md:py-16 xl:py-24 2xl:py-32`}
    >
      {/* 1. FULL WIDTH BACKGROUND 3D STAGE */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 35 }}>
          <ambientLight intensity={isDarkMode ? 0.5 : 1} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <Suspense fallback={null}>
            <motion.group
              style={{
                // Responsively adjust X position based on screen width
                x: useTransform(smoothX, [-0.5, 0.5], [window?.innerWidth < 1024 ? 0 : 4, window?.innerWidth < 1024 ? 0 : 2]), 
                y: characterYParallax,
              }}
            >
              <CharacterModel isSongPlaying={isSongPlaying} />
            </motion.group>
            <ContactShadows opacity={0.5} scale={20} blur={2.5} position={[0, -2, 0]} far={10} />
            {/* <Environment preset="night" /> */}
          </Suspense>
        </Canvas>
      </div>

      {/* 2. ATMOSPHERIC OVERLAYS */}
      <div className={`absolute inset-0 z-[1] pointer-events-none ${
        isDarkMode 
        ? "bg-gradient-to-b lg:bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" 
        : "bg-gradient-to-b lg:bg-gradient-to-r from-[#F2F0EA] via-[#F2F0EA]/50 to-transparent"
      }`} />

      {/* 3. MAIN CONTENT */}
      <div className="relative z-10 w-full mt-10 lg:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Heading, Bio, Stats */}
          <div className="flex flex-col gap-6 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                   animate={{ width: [0, 60] }}
                   className="h-[1px] bg-yellow-400" 
                />
                <span className="text-yellow-400 font-black tracking-[0.3em] uppercase text-[10px]">
                  Innovating since 2020
                </span>
              </div>

              <h2 className={`text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] mb-8 ${
                isDarkMode ? "text-white" : "text-[#1a1a1a]"
              }`}>
                {isSongPlaying ? "LIVING THE\nRHYTHM." : "CRAFTING\nSYSTEMS."}
              </h2>

              <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">
                <div className="w-full max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
                  <p className={`text-xl lg:text-2xl font-black italic mb-4 flex items-center gap-3 ${
                      isDarkMode ? "text-white" : "text-blue-600"
                  }`}>
                      <span className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black not-italic text-sm">G</span>
                      T C Gopal
                  </p>
                  <div className={`text-base lg:text-lg leading-relaxed font-medium space-y-4 ${
                    isDarkMode ? "text-zinc-400" : "text-slate-600"
                  } pb-10 xl:pb-20 2xl:pb-28`}> 
                    <p>
                      Results-driven Software Engineer with 4+ years of hands-on experience building scalable, high-performance applications and distributed systems.
                    </p>
                    <p>
                      Specialized in end-to-end solution design across the full SDLC, with strong expertise in microservices, cloud-native architectures, and automation.
                    </p>
                    <p>
                      Proven track record of improving product release efficiency through workflow automation and optimized deployment pipelines.
                    </p>
                    <p>
                      Experienced in engineering scalable APIs capable of handling high-volume data and thousands of daily requests.
                    </p>
                    <p>
                      Hands-on expertise in building robust CI/CD pipelines that enhance deployment reliability, accuracy, and speed.
                    </p>
                    <p>
                      Strong background in developing enterprise-grade services, focusing on performance, security, and maintainability.
                    </p>
                    <p>
                      Broad technical skill set across modern frontend and backend development, leveraging AWS, GCP, and Azure.
                    </p>
                    <p>
                      Deep experience with event-driven systems, DevOps practices, and infrastructure automation using Kubernetes and Terraform.
                    </p>
                    <p>
                      Recognized as a proactive problem solver who takes ownership, drives continuous improvements, and delivers measurable business impact.
                    </p>
                    <p>
                      Passionate about translating complex requirements into efficient digital solutions and continuously growing in scalable, high-availability system design.
                    </p>
                  </div>
                </div>

                {/* Vertical Stat Counters */}
                <div className="flex flex-row lg:flex-col gap-8 lg:gap-6 border-l lg:border-l-2 border-white/10 pl-6">
                    <div className="flex flex-col">
                        <span className="text-3xl lg:text-4xl font-black text-yellow-400">04+</span>
                        <span className="text-[10px] uppercase font-bold opacity-40">Years Exp</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl lg:text-4xl font-black text-yellow-400">50+</span>
                        <span className="text-[10px] uppercase font-bold opacity-40">Projects</span>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Skills Matrix */}
          <div className="flex flex-col gap-4 lg:gap-6 items-center w-full max-w-xl mx-auto lg:mx-0">
            {skillGroups.map((group, idx) => (
              <motion.div 
                key={group.label}
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                transition={{ delay: 0.1 + (idx * 0.05) }}
                className={`group p-5 lg:p-6 rounded-2xl lg:rounded-3xl border transition-all duration-500 backdrop-blur-md w-full opacity-50 ${
                  isDarkMode 
                  ? "bg-white/[0.05] border-white/5 hover:border-yellow-400/30" 
                  : "bg-white/70 border-slate-200 shadow-lg"
                }`}
              >
                <div className="flex justify-between items-center mb-3 opacity-100">
                  <h4 className="text-[20px] lg:text-[11px] font-black uppercase tracking-widest text-black-400">
                    {group.label}
                  </h4>
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map(item => (
                    <span key={item} className={`text-[10px] lg:text-xs font-bold px-2 py-1 rounded-md ${
                      isDarkMode ? "bg-white/5 text-zinc-300" : "bg-zinc-100 text-zinc-600"
                    }`}>
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FOOTER SCROLL DECORATION - Responsive visibility */}
      <div className="absolute bottom-6 left-6 right-6 hidden xl:flex items-center justify-between z-20 opacity-20 pointer-events-none select-none">
         <div className="text-[10px] font-black uppercase tracking-[0.5em]">Scalable Solutions</div>
         <div className="h-[1px] flex-grow mx-10 bg-white/20" />
         <div className="text-[10px] font-black uppercase tracking-[0.5em]">High Performance Code</div>
      </div>

      {/* 5. MASSIVE BACKGROUND TYPE - Scaled for mobile */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none select-none z-[-1] overflow-hidden">
          <motion.h1 
            style={{ x: useTransform(smoothX, [-0.5, 0.5], [-50, 50]) }}
            className={`text-[40vw] lg:text-[35vw] leading-none font-black opacity-[0.02] whitespace-nowrap ${
              isDarkMode ? "text-white" : "text-blue-900"
            }`}
          >
            {isSongPlaying ? "RHYTHM BEATS CODE" : "SYSTEM ARCHITECT"}
          </motion.h1>
      </div>
    </section>
  );
}