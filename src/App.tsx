// @ts-nocheck
import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ArrowRight, X, Menu, Github, Linkedin, Monitor, BookOpen, Play, Pause, SkipForward } from 'lucide-react';
import Milestones from './components/Milestones';
import Hero from './components/Hero';
import GetInTouch from './components/GetInTouch';
import About from './components/About';

const Portfolio = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const horizontalSectionRef = useRef<HTMLDivElement | null>(null);
  const milestoneRef = useRef<HTMLDivElement | null>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [hoveredMilestoneLogo, setHoveredMilestoneLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  /* --- PLAYLIST CONFIGURATION --- */
  const playlist = useMemo(() => [
    { name: "Heros Tonight", artist: "NCS", src: "/music/Heros.mp3" },
    { name: "Mortals", artist: "NCS", src: "/music/Mortals.mp3" }
  ], []);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [showFindHim, setShowFindHim] = useState(false);

  // Toggle Play/Pause
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isSongPlaying) {
        audio.pause();
        setIsSongPlaying(false);
        setShowFindHim(false);
      } else {
        audio.play().catch((e: unknown) => console.error("Playback blocked", e));
        setIsSongPlaying(true);
        triggerFindHim();
      }
    }
  };

  const triggerFindHim = () => {
    setShowFindHim(true);
    setTimeout(() => setShowFindHim(false), 5000);
  };

  // Automatic Loop and Skip Logic
  const handleNextSong = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
  };

  // Effect to handle actual playback when the index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (isSongPlaying && audio) {
      audio.play().catch((e: unknown) => console.error(e));
      triggerFindHim();
    }
  }, [currentTrackIndex, isSongPlaying]);

  /* --- EXISTING ANIMATION LOGIC --- */
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });
  const cursorX = useSpring(0, { stiffness: 400, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 30 });
  
  const { scrollYProgress: globalScroll } = useScroll();
  const cursorScale = useTransform(globalScroll, [0, 0.1], [1, 0.33]); 
  const scaleX = useSpring(globalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const { scrollYProgress: milestoneScroll } = useScroll({
    target: milestoneRef,
    offset: ["start end", "end start"]
  });

  const rawY = useTransform(milestoneScroll, [0, 1], [-300, 300]);
  const milestoneLogoY = useSpring(rawY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY, mouseX, mouseY]);

  const portraitRotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const portraitRotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const portraitX = useTransform(mouseX, [-0.5, 0.5], [-40, 40]);
  const portraitY = useTransform(mouseY, [-0.5, 0.5], [-40, 40]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || isLoading) return;
    video.play().catch((err: unknown) => console.error("Video playback failed:", err));
    const ctx = canvas.getContext('2d');
    let animationFrame: number;

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx!.globalCompositeOperation = 'source-over';
      // Universal BG Color applied to Canvas
      ctx!.fillStyle = isDarkMode ? '#0a0a0a' : '#304d69'; 
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
    };

    const render = () => {
      if (video.readyState >= 2) {
        ctx!.save();
        ctx!.globalCompositeOperation = 'source-atop';
        ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx!.restore();
      }
      animationFrame = requestAnimationFrame(render);
    };

    initCanvas();
    render();
    window.addEventListener('resize', initCanvas);
    return () => {
      window.removeEventListener('resize', initCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [isDarkMode, isLoading]);

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isHoveringHero) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Adjusted lineWidth for smaller screens
    ctx.lineWidth = window.innerWidth < 768 ? 80 : 150; 
    ctx.beginPath();
    const prevX = (canvas.dataset && canvas.dataset.prevX) || undefined;
    const prevY = (canvas.dataset && canvas.dataset.prevY) || undefined;
    if (prevX && prevX !== "null") {
      ctx.moveTo(parseFloat(prevX), parseFloat(prevY));
    } else {
      ctx.moveTo(x, y);
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    if (canvas.dataset) {
      canvas.dataset.prevX = x.toString();
      canvas.dataset.prevY = y.toString();
    }
  };

  const handleMouseLeaveHero = () => {
    setIsHoveringHero(false);
    const canvas = canvasRef.current;
    if (canvas && canvas.dataset) {
      canvas.dataset.prevX = "null";
      canvas.dataset.prevY = "null";
    }
  };

  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalSectionRef });
  // Dynamic translate based on mobile (scroll vertical) vs desktop (horizontal)
  const xTranslate = useTransform(horizontalScroll, [0, 1], ["0%", "-66.6%"]);
  const welcomeScale = useTransform(globalScroll, [0, 0.2], [1, 1.3]);
  const welcomeOpacity = useTransform(globalScroll, [0, 0.15], [0.4, 0]);

  const scrollTo = (id: string) => {
    setIsNavOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`transition-colors duration-700 font-sans selection:bg-yellow-400 selection:text-black cursor-none overflow-x-hidden
        ${isDarkMode ? 'bg-[#0a0a0a] text-zinc-300' : 'bg-[#304d69] text-[#1a1a1a]'}
        min-h-screen flex flex-col`}
      style={{ minHeight: '100vh' }}
    >
      <video ref={videoRef} src="https://res.cloudinary.com/gopigaurav9/video/upload/coding_video.mp4" loop muted autoPlay playsInline style={{ display: 'none' }} className="hidden" />
      
      {/* PLAYLIST AUDIO SOURCE */}
      <audio 
        ref={audioRef} 
        src={playlist[currentTrackIndex].src} 
        onEnded={handleNextSong} 
      />

      {/* LOADING SCREEN */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            key="loader"
            exit={{ y: "-100%" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-[#304d69]'}`}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" className="md:w-[100px] md:h-[100px]">
                <motion.path
                  animate={{ 
                    d: [
                      "M 50,20 L 80,80 L 20,80 Z",
                      "M 20,20 L 80,20 L 80,80 L 20,80 Z",
                      "M 50,10 L 90,50 L 50,90 L 10,50 Z"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  stroke={isDarkMode ? "white" : "black"}
                  strokeWidth="2"
                />
              </svg>
              <p className={`mt-4 font-black tracking-[0.4em] uppercase text-[10px] md:text-xs ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNavOpen && (
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 ${
              isDarkMode 
              ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 text-white' 
              : 'bg-[#304d69] text-black'
            }`}
          >
            <button onClick={() => setIsNavOpen(false)} className="absolute top-6 right-6 md:top-10 md:right-10 p-2 md:p-4 hover:rotate-90 transition-transform">
              <X size={32} strokeWidth={3} className="md:w-12 md:h-12" />
            </button>
            <div className="flex flex-col gap-4 md:gap-8 text-center">
              {[ { label: 'EXP', id: 'exp' }, { label: 'PROJECTS', id: 'projects' }, { label: 'ABOUT ME', id: 'about' }, { label: 'ARTICLES', id: 'articles' } ].map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  onClick={() => scrollTo(item.id)}
                  className="text-4xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter hover:tracking-normal transition-all duration-500 hover:text-yellow-400"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-yellow-400 z-[1000] origin-left" style={{ scaleX }} />

      <nav className="fixed top-0 w-full z-[100] flex items-center justify-between px-1 sm:px-4 py-2 sm:py-4 md:py-8 mix-blend-difference">
        <div className="flex items-center gap-3 md:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black text-[10px] md:text-sm">TCG</div>
            <span className="hidden md:flex lg:flex font-bold uppercase tracking-tight text-white text-xs md:text-base">Gopal</span>
          </div>
          
          <div className="md:flex lg:flex items-center gap-1 border-l border-white/20 pl-1 md:pl-4 lg:pl-6">

            <SocialHoverImage
              href="https://github.com/gopigaurav"
              icon={Github}
              imgSrc="/images/github.png"
              alt="GitHub"
            />

            <SocialHoverImage
              href="https://www.linkedin.com/in/t-c-gopal-06a961166/"
              icon={Linkedin}
              imgSrc="/images/linkedin.png"
              alt="LinkedIn"
            />

            <SocialHoverImage
              href="https://leetcode.com/u/gopigaurav/"
              icon={Monitor}
              imgSrc="/images/leetcode.png"
              alt="LeetCode"
            />

          </div>

        </div>

        {/* --- DYNAMIC PLAYLIST PLAYER --- */}
        <div className="flex items-center gap-1 md:gap-2 bg-white/5 backdrop-blur-xl px-1.5 py-1.5 md:px-2 md:py-2 rounded-full border border-white/10 hover:border-yellow-400/50 transition-all duration-500">
          <button onClick={toggleMusic} className="flex items-center relative">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-colors duration-500 ${isSongPlaying ? 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'bg-white/10'}`}
            >
              <AnimatePresence mode="wait">
                {isSongPlaying ? (
                  <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Pause size={14} className="md:size-[18px] text-black fill-current" />
                  </motion.div>
                ) : (
                  <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Play size={14} className="md:size-[18px] text-white fill-current ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="ml-2 md:ml-3 overflow-hidden flex flex-col items-start w-16 md:w-24">
              <AnimatePresence mode="wait">
                {showFindHim ? (
                  <motion.span 
                    key="find"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-[7px] md:text-[9px] font-black uppercase text-yellow-400 whitespace-nowrap"
                  >
                    Find him ↓
                  </motion.span>
                ) : (
                  <motion.span 
                    key="track"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-[7px] md:text-[9px] font-black uppercase text-white truncate w-full"
                  >
                    {playlist[currentTrackIndex].name}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="text-[6px] md:text-[8px] opacity-40 uppercase font-bold text-white tracking-widest">
                {playlist[currentTrackIndex].artist}
              </span>
            </div>
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleNextSong(); }}
            className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <SkipForward size={12} className="md:w-4 md:h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 md:p-3 rounded-full bg-yellow-400 text-black shadow-lg">
            {isDarkMode ? <Sun size={16} className="md:w-5 md:h-5" /> : <Moon size={16} className="md:w-5 md:h-5" />}
          </button>
          <button onClick={() => setIsNavOpen(true)} className="p-2 md:p-3 rounded-full bg-white text-black shadow-lg hover:scale-110 transition-transform">
            <Menu size={16} className="md:w-5 md:h-5" />
          </button>
        </div>
      </nav>

      <Hero
        videoRef={videoRef} portraitRotateX={portraitRotateX} portraitRotateY={portraitRotateY} portraitX={portraitX} portraitY={portraitY} 
        welcomeScale={welcomeScale} welcomeOpacity={welcomeOpacity} setIsHoveringHero={setIsHoveringHero} canvasRef={canvasRef}
        isDarkMode={isDarkMode}
        handleMouseLeaveHero={handleMouseLeaveHero} handleCanvasMove={handleCanvasMove}
      />

      <div ref={horizontalSectionRef} id="exp" className="relative w-full overflow-x-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent transition-all duration-500 hover:scrollbar-thumb-yellow-300">
        <div className="flex flex-row w-[300vw] min-h-[60vh] transition-all duration-700 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent" style={{ scrollbarWidth: 'thin', height: '100%', minHeight: '60vh' }}>
          <div className="w-[100vw] min-h-[60vh] flex-shrink-0 flex flex-col items-center justify-center px-4 md:px-8 text-center">
            <div className="w-16 md:w-24 h-1.5 md:h-2 bg-yellow-400 mb-8 md:mb-12" />
            <h2 className="text-4xl sm:text-6xl md:text-[13rem] font-black uppercase italic tracking-tighter leading-[0.8] mb-8 md:mb-12">WORK<br/>EXP.</h2>
            <div className="flex flex-col items-center gap-4 md:gap-6">
              <p className="text-[10px] md:text-base max-w-xs md:max-w-md opacity-60 uppercase font-black tracking-[0.3em]">
                  Scroll horizontally to explore
              </p>
              <motion.div 
                  animate={{ y: [0, 10, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
              >
                <ArrowRight size={40} className="text-yellow-400 rotate-90 md:rotate-0" />
              </motion.div>
            </div>
          </div>
          <div className="w-[100vw] min-h-[60vh] flex-shrink-0 flex items-center justify-center">
            <ExperienceCard videoSrc="https://res.cloudinary.com/gopigaurav9/video/upload/Nike.mp4" year="2025 — PRESENT" company="NIKE" role="Software Engineer 2" details="Automating cloud infrastructure and optimizing high-scale data retrieval." isDarkMode={isDarkMode} />
          </div>
          <div className="w-[100vw] min-h-[60vh] flex-shrink-0 flex items-center justify-center">
            <ExperienceCard videoSrc="https://res.cloudinary.com/gopigaurav9/video/upload/logistics.mp4" year="2022 — 2025" company="SHIPTHIS" role="Software Developer" details="Building end-to-end logistics microservices and full-stack features." isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>

      <Milestones isDarkMode={isDarkMode} hoveredMilestoneLogo={hoveredMilestoneLogo} milestoneRef={milestoneRef} milestoneLogoY={milestoneLogoY} setHoveredMilestoneLogo={setHoveredMilestoneLogo} />

      {/* <section id="projects" className="min-h-[40vh] sm:min-h-[50vh] md:min-h-screen w-full flex items-center justify-center bg-black text-white px-2 sm:px-4">
        <h2 className="text-5xl sm:text-7xl md:text-9xl font-black italic opacity-20 text-center">PROJECTS</h2>
      </section> */}

      <About isDarkMode={isDarkMode} isSongPlaying={isSongPlaying}/>

      <GetInTouch isDarkMode={isDarkMode}/>

      <motion.div 
        className="hidden md:block fixed top-0 left-0 w-12 h-12 rounded-full border-2 border-yellow-400 pointer-events-none z-[9999] mix-blend-difference" 
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%', scale: cursorScale }} 
      />
    </div>
  );
};

interface ExperienceCardProps {
  videoSrc: string;
  year: string;
  company: string;
  role: string;
  details: string;
  isDarkMode: boolean;
}

const ExperienceCard = ({ videoSrc, year, company, role, details, isDarkMode }: ExperienceCardProps) => (
  <div className="w-full flex-shrink-0 relative flex overflow-hidden shadow-xl transition-all duration-700 min-h-[350px] md:min-h-[500px] lg:min-h-[600px] max-h-[90vh] aspect-video">
    <video src={videoSrc} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover object-center opacity-90 grayscale-[10%] z-0" style={{aspectRatio:'16/9'}} />
    <div className={`absolute inset-0 z-10 bg-gradient-to-t ${isDarkMode ? 'from-black/95 via-black/40 to-transparent' : 'from-black/60 via-transparent to-transparent'}`} />
    <div className="relative z-20 w-full h-full flex flex-col justify-end p-4 sm:p-8 md:p-24">
      <div className="w-full">
        <div className="h-1.5 md:h-2 w-16 md:w-24 bg-yellow-400 mb-6 md:mb-8" />
        <span className="text-yellow-400 font-black tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-sm block mb-3 md:mb-4 uppercase">{year}</span>
        <h3 className="text-4xl sm:text-6xl md:text-[6rem] font-black uppercase tracking-tighter leading-[0.8] md:leading-[0.75] mb-4 md:mb-6 text-white">{company}</h3>
        <h4 className="text-xl sm:text-3xl md:text-5xl font-bold uppercase italic mb-4 md:mb-6 text-white">{role}</h4>
        <p className="text-sm sm:text-lg md:text-2xl text-zinc-100 line-clamp-3 md:line-clamp-none">{details}</p>
      </div>
    </div>
  </div>
);

const SocialHoverImage = ({ href, icon: Icon, imgSrc, alt }) => {
  return (
    <div className="relative group inline-block">
      {/* Icon Link */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-yellow-400 transition-colors cursor-pointer p-1 lg:p-2 flex items-center justify-center"
      >
        <Icon size={13} />
      </a>

      {/* Hover Image Container */}
      <div className="
        /* FIX: Align to the start of the icon and remove the translate-x */
        absolute top-full left-0 mt-4
        opacity-0 scale-95 origin-left pointer-events-none
        group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
        transition-all duration-300 ease-out
        z-[9999]
      ">
        <div className="
          /* Use responsive widths that stay within viewport bounds */
          w-[85vw] 
          sm:w-[70vw] 
          md:w-[50vw] 
          lg:max-w-[600px]
          h-auto 
          relative
        ">
          <img
            src={imgSrc}
            alt={alt}
            /* object-contain ensures the screenshot isn't cropped */
            className="w-full h-auto object-contain rounded-xl shadow-2xl border-2 border-white/20"
          />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;