// @ts-nocheck
import { AnimatePresence, motion } from "framer-motion";
import TimelineItem from "./TimeLine";

export default function Milestones({hoveredMilestoneLogo, milestoneRef, milestoneLogoY, setHoveredMilestoneLogo, isDarkMode}) {
    return (
      <section ref={milestoneRef} className="py-2 sm:py-8 relative overflow-hidden px-2 sm:px-6 min-h-[700px] md:min-h-[1100px] transition-all duration-700 w-full mb-12">
        <AnimatePresence>
          {hoveredMilestoneLogo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.8, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              style={{ y: milestoneLogoY }}
              className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
            >
              <img 
                src={hoveredMilestoneLogo} 
                alt="Symbol" 
                className="w-[50vw] h-auto object-contain filter invert opacity-40 blur-[2px]" 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-20">
            <h2 className="text-xl sm:text-3xl md:text-7xl font-black italic uppercase tracking-tighter mb-4">Milestones</h2>
            <div className="w-12 sm:w-24 h-1 bg-yellow-400 mx-auto opacity-50" />
          </div>
          <div className="relative">
            {/* Show vertical line only on screens >=700px */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-yellow-400/20" />
            <div className="space-y-24 sm:space-y-48 min-h-[400px] md:min-h-[600px]">
              <TimelineItem 
                side="left"
                company="NIKE"
                logoSrc= {isDarkMode ? "/symbols/nike_brown.png": "/symbols/nike_brown.png"}
                role="Software Engineer 2"
                date="Mar 2025 – Present | Bangalore"
                onHover={setHoveredMilestoneLogo}
                points={[
                  "Automated manual launch workflows using Kafka + AWS lambda to reduce product release time by over 25%, earning recognition from executive leadership.",
                  "Engineered a scalable AWS OpenSearch API supporting high-volume batch requests and removed the 10k record retrieval limit.",
                  "Built AWS CDK + Jenkins CI/CD pipelines for infrastructure and app deployments, improving deployment accuracy and reliability.",
                  "Architected secure API Gateway authentication, routing, and rate limiting using NestJS + AWS CDK.",
                  "Designed Performance testing pipelines using Artillery + Jenkins (smoke, load, spike, stress), ensuring stability across dynamic traffic."
                ]}
              />
              <TimelineItem 
                side="right"
                company="SHIPTHIS"
                logoSrc={isDarkMode ? "/symbols/no_back_shipthis_white.png" : "/symbols/no_back_shipthis_white.png"}
                role="Software Developer"
                date="Aug 2022 – Mar 2025 | Bangalore"
                onHover={setHoveredMilestoneLogo}
                points={[
                  "Developed full-stack features and microservices aligned with SOLID + SDLC, conducting code reviews and resolving complex production issues.",
                  "Led 3+ projects handling 10,000+ daily API calls, optimized REST APIs, increasing request throughput by 40%.",
                  "Developed Cargo Customs Declaration services end-to-end, driving a 60% increase in customer adoption.",
                  "Implemented automated CI/CD pipelines using GitHub Actions, Cypress, and Jest under TDD workflows.",
                  "Performed deep distributed-system debugging and managed deployments across GCP + Azure platforms."
                ]}
              />
            </div>
          </div>
        </div>
      </section>
    );
}