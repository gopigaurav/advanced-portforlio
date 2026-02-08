// @ts-nocheck
import React, { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Github,
  Linkedin,
  Briefcase,
  Terminal,
  Zap,
  ChevronRight,
} from "lucide-react";

/* ------------------ MAGNETIC BUTTON ------------------ */
const MagneticButton = ({ children, className = "" }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: x * 0.3, y: y * 0.3 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={pos}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ------------------ MAIN COMPONENT ------------------ */
export default function ModernDashboard() {
  const [tab, setTab] = useState("exp");

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  /* PARALLAX */
  const bgTextY = useTransform(scrollY, [0, 600], [0, -200]);
  const imageY = useTransform(scrollY, [0, 600], [0, -80]);

  /* STAGGER ANIMATION */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 overflow-hidden">
      {/* TOP SCROLL BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 origin-left"
        style={{ scaleX: progress }}
      />

      {/* GRID BACKGROUND */}
      <div
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(#1e293b 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="flex h-screen relative z-10">
        {/* SIDEBAR */}
        <aside className="w-24 lg:w-64 bg-white/5 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-16">
              <span className="text-blue-500">G</span>.
            </h1>

            {[
              { id: "exp", label: "Experience", icon: <Briefcase /> },
              { id: "tech", label: "Tech Stack", icon: <Terminal /> },
              { id: "work", label: "Projects", icon: <Zap /> },
            ].map((i) => (
              <button
                key={i.id}
                onClick={() => setTab(i.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl mb-2 transition
                ${
                  tab === i.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-500 hover:bg-white/5"
                }`}
              >
                {i.icon}
                <span className="hidden lg:block text-xs uppercase tracking-widest font-bold">
                  {i.label}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-6 flex flex-col items-center lg:items-start">
            <MagneticButton>
              <a href="#" className="hover:text-white">
                <Github />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="#" className="hover:text-white">
                <Linkedin />
              </a>
            </MagneticButton>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-20 relative">
          {/* HERO */}
          <section className="relative min-h-[90vh] flex items-center">
            {/* BACKGROUND TEXT */}
            <motion.h1
              style={{ y: bgTextY }}
              className="absolute text-[18rem] font-black text-white/5 tracking-tighter select-none"
            >
              WELCOME
            </motion.h1>

            {/* IMAGE */}
            <motion.img
              src="/me.png"
              alt="Gopal"
              style={{ y: imageY }}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute right-0 bottom-0 w-[420px] grayscale contrast-125"
            />

            {/* TEXT */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="relative z-10 max-w-2xl"
            >
              <motion.h1
                variants={item}
                className="text-8xl font-black text-white leading-none"
              >
                T C{" "}
                <span className="bg-gradient-to-br from-blue-400 to-indigo-600 text-transparent bg-clip-text">
                  GOPAL
                </span>
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-6 text-slate-400 uppercase tracking-widest"
              >
                Software Engineer • Cloud • Scale
              </motion.p>

              <motion.div
                variants={item}
                className="mt-10 flex gap-6"
              >
                <MagneticButton>
                  <button className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold">
                    Read My Work
                  </button>
                </MagneticButton>

                <MagneticButton>
                  <button className="px-8 py-4 rounded-full border border-white/20">
                    Watch Demos
                  </button>
                </MagneticButton>
              </motion.div>
            </motion.div>
          </section>

          {/* CONTENT */}
          <AnimatePresence mode="wait">
            {tab === "exp" && (
              <motion.section
                key="exp"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="p-10 rounded-3xl bg-white/5 border border-white/10"
                >
                  <h3 className="text-3xl font-black text-white uppercase italic">
                    Nike
                  </h3>
                  <p className="text-blue-400 font-mono">
                    Software Engineer II • 2025 – Present
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex gap-3">
                      <ChevronRight className="text-blue-500" />
                      Kafka + Lambda launch automation
                    </li>
                    <li className="flex gap-3">
                      <ChevronRight className="text-blue-500" />
                      OpenSearch batching APIs
                    </li>
                  </ul>
                </motion.div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
