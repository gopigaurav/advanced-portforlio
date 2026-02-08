// @ts-nocheck
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

const textRevealVariants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1], // Smooth out-expo easing
    },
  },
};

export default function Hero({isDarkMode, videoRef, portraitRotateX, portraitRotateY, portraitX, portraitY, welcomeScale, welcomeOpacity, setIsHoveringHero, canvasRef, handleMouseLeaveHero, handleCanvasMove}) {
    const [hasScratched, setHasScratched] = useState(false);

  const onInteraction = (e) => {
    if (!hasScratched) setHasScratched(true);
    handleCanvasMove(e);
  };
    return (
      <section id="hero" className="relative w-full overflow-hidden flex flex-col justify-center items-center px-4 sm:px-8 md:px-20 min-h-[300px] md:min-h-[600px] max-h-[90vh] aspect-video transition-all duration-700" style={{ perspective: "1000px", aspectRatio: '16/9', maxHeight: '90vh' }}>

        {/* 3D Portrait Layer */}
        <motion.div 
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ 
                rotateX: portraitRotateX, 
                rotateY: portraitRotateY,
                x: portraitX,
                y: portraitY,
                transformStyle: "preserve-3d"
            }}
        >
          <motion.div style={{ scale: welcomeScale, opacity: welcomeOpacity }} className="absolute flex items-center justify-center pointer-events-none">
              <h2 
                className={`text-[10vw] md:text-[8vw] md:text-[10vw] font-black italic select-none drop-shadow-lg ${isDarkMode ? 'text-yellow-300 mix-blend-screen' : 'text-emerald-600 mix-blend-multiply'}`}
              >WELCOME</h2>
            </motion.div>
          <img 
            src="/images/sketch_no_back.png" 
            alt="Portrait" 
            className="h-[50vw] sm:h-[60vw] md:h-[45vw] w-auto object-contain grayscale brightness-90 object-bottom transform scale-110 drop-shadow-2xl" 
          />
        </motion.div>
        
        {/* Interaction Canvas */}
<canvas
        ref={canvasRef}
        onMouseEnter={() => setIsHoveringHero(true)}
        onMouseLeave={handleMouseLeaveHero}
        onMouseMove={onInteraction}
        onTouchStart={() => {
          setIsHoveringHero(true);
          setHasScratched(true);
        }}
        onTouchEnd={handleMouseLeaveHero}
        onTouchMove={e => {
          if (!e.touches || e.touches.length === 0) return;
          const touch = e.touches[0];
          onInteraction({ clientX: touch.clientX, clientY: touch.clientY });
        }}
        className="absolute inset-0 z-20 w-full h-full block"
        style={{ pointerEvents: 'auto', aspectRatio: '16/9', maxHeight: '90vh' }}
      />

      {/* 3. BOTTOM RIGHT INTIMATION TEXT */}
      <AnimatePresence>
  {!hasScratched && (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: 1.5 }}
      // Responsive adjustments: 
      // bottom-6 (mobile) -> bottom-10 (desktop)
      // right-4 (mobile) -> right-10 (desktop)
      // py-1 px-3 (smaller overall padding)
      className="absolute bottom-6 right-4 sm:bottom-10 sm:right-10 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-md py-1 px-3 sm:py-2 sm:px-4 rounded-full border border-white/10 shadow-2xl pointer-events-none"
    >
      <p className="text-[8px] sm:text-[10px] text-white/90 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold">
        Scratch here
      </p>
      
      {/* Smaller pulsing indicator dot */}
      <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
      </span>
    </motion.div>
  )}
</AnimatePresence>

{/* Content Overlay */}
<div className="relative z-30 w-full max-w-7xl mx-auto h-full flex flex-col justify-end pb-8 lg:pb-10 sm:pb-20 pointer-events-none">
            <motion.div 
            className="flex flex-col items-start pointer-events-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            >
            {/* 1. REVEALING HEADING - Smaller and Responsive */}
            <h1
                className="font-black italic tracking-tighter uppercase leading-[0.85] mb-4 sm:mb-6 drop-shadow-xl text-left"
                style={{
                fontSize: 'clamp(1.5rem, 6vw, 3.5rem)', // Reduced size: min 1.5rem, max 3.5rem
                background: 'linear-gradient(135deg, #f8fafc 30%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.05em',
                fontWeight: 900,
                }}
            >
                {/* Row 1: "I'M" */}
                <span className="block overflow-hidden h-fit">
                <motion.span variants={textRevealVariants} className="block">
                    I&apos;M
                </motion.span>
                </span>
                
                {/* Row 2: "T C GOPAL" */}
                <span className="block overflow-hidden h-fit">
                <motion.span 
                    variants={textRevealVariants} 
                    className="block text-emerald-400"
                    style={{ WebkitTextFillColor: 'initial' }}
                >
                    T C GOPAL
                </motion.span>
                </span>
            </h1>

            {/* 2. BUTTON ENTRANCE - Adjusted size to match text */}
            <motion.div
                variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { delay: 1, duration: 0.6, ease: "easeOut" } 
                }
                }}
            >
                <button className="group relative overflow-hidden text-white hover:text-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold uppercase text-[9px] sm:text-[11px] tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] hover:-translate-y-1 active:scale-95">
                <span className="relative z-10 flex items-center gap-2"
                    onClick={() => {
                        window.open('https://res.cloudinary.com/gopigaurav9/image/upload/resume.pdf');
                    }}
                >
                    Resume Download
                    <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                    ↓
                    </motion.span>
                </span>
                
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                
                <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ 
                    repeat: Infinity, 
                    duration: 3.5, 
                    ease: "linear",
                    repeatDelay: 1.5 
                    }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                />
                </button>
            </motion.div>
            </motion.div>
        </div>
      </section>
    )
}