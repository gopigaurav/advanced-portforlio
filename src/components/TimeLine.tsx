// @ts-nocheck
import { motion } from "framer-motion";

const TimelineItem = ({ side, company, logoSrc, role, date, points, onHover }) => {
  const isLeft = side === 'left';
  return (
    <div 
      className={`relative flex items-center justify-between w-full ${isLeft ? 'flex-row-reverse' : 'flex-row'} px-2 sm:px-6`}
      onMouseEnter={() => onHover(logoSrc)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="w-full md:w-[45%] max-w-xl flex flex-col"
      >
        <div className={`mb-4 ${isLeft ? 'text-right' : 'text-left'}`}>
            <h3 className="text-lg sm:text-2xl md:text-4xl font-black text-yellow-400">{company}</h3>
            <p className="text-xs sm:text-lg md:text-xl font-bold italic opacity-90 uppercase">{role}</p>
            <span className="text-[10px] sm:text-xs font-black tracking-widest opacity-50 block mt-1">{date}</span>
        </div>
        <ul className={`space-y-4 ${isLeft ? 'items-end' : 'items-start'} break-words whitespace-normal`}> 
          {points.map((point, i) => (
            <li key={i} className={`flex items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base opacity-100 leading-relaxed p-1 ${isLeft ? 'flex-row-reverse text-right' : 'flex-row text-left'} break-words whitespace-normal`}> 
              {/* Show dot only on md and up */}
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0 hidden md:inline-block" />
              {point}
            </li>
          ))}
        </ul>
      </motion.div>
      {/* Show circle only on md and up */}
      <motion.div 
        initial={{ scale: 0 }} 
        whileInView={{ scale: 1 }} 
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }} 
        className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 flex-col items-center z-10" 
      >
          <div className="w-10 h-10 rounded-full bg-black border-4 border-yellow-400 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          </div>
      </motion.div>
      <div className="hidden md:block w-[45%]" />
    </div>
  );
};

export default TimelineItem