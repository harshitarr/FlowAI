"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import TerminalOverlay from "@/components/TerminalOverlay";
import UserPrograms from "@/components/UserPrograms";
import { useInView, animate, motion } from "framer-motion";

function AnimatedCounter({ to, from = 0, suffix = "" }) {
  const ref = useRef(null);
  // Triggers the animation when the element is 100px from the viewport edge
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const node = ref.current;

      // Use framer-motion's animate function to count from 'from' to 'to'
      const controls = animate(from, to, {
        duration: 3.5, // Much slower for better visibility
        ease: "easeInOut", // Smoother easing
        onUpdate(value) {
          if (node) {
            // Update the element's text content on each animation frame
            node.textContent = Math.round(value).toLocaleString() + suffix;
          }
        },
      });

      // Cleanup function to stop the animation if the component unmounts
      return () => controls.stop();
    }
  }, [isInView, from, to, suffix]); // Re-run if these props change

  // Display the starting value initially with enhanced styling
  return (
    <span 
      ref={ref} 
      className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 tracking-tight"
    >
      {from}{suffix}
    </span>
  );
}

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden lg:mt-[-120px]">
      {/* HERO SECTION */}
      <section className="relative z-10 py-8 sm:py-12 md:py-14 lg:py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 sm:gap-y-10 lg:gap-x-10 items-center relative">

            {/* LEFT SIDE CONTENT */}
            <motion.div 
              className="lg:col-span-6 space-y-4 sm:space-y-5 relative sm:ml-4 md:ml-10 lg:ml-20 md:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* HEADING */}
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-foreground"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <span className="text-primary drop-shadow-sm">Glow</span> Up
                </motion.div>
                <motion.div 
                  className="pt-1 sm:pt-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Live Smarter
                </motion.div>
                <motion.div 
                  className="pt-1 sm:pt-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <span>With </span>
                  <span className="text-primary drop-shadow-sm">AI-Powered</span>
                </motion.div>
                <motion.div 
                  className="pt-1 sm:pt-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Fitness Plans
                </motion.div>
              </motion.h1>

              {/* DIVIDER */}
              <motion.div 
                className="h-px mx-auto md:mx-0 w-2/3 sm:w-1/2 bg-gradient-to-r from-primary via-secondary to-primary opacity-60"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              />

              {/* DESCRIPTION
              <motion.p 
                className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto md:mx-0 -mt-2 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Talk to our AI assistant and get personalized diet plans and workout routines designed just for you.
              </motion.p> */}

              {/* STATS */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-6 py-2 -mt-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {[
                  { value: 500, suffix: '+', label: 'ACTIVE USERS' },
                  { value: 3, suffix: ' min', label: 'GENERATION' },
                  { value: 100, suffix: '%', label: 'PERSONALIZED' },
                ].map((stat, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="hidden sm:block h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent opacity-60" />
                    )}
                    <motion.div 
                      className="flex flex-col items-center md:items-start group cursor-default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 1.4 + (i * 0.3) }} // Increased delay for better staggering
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-lg md:text-xl font-black tracking-tight transition-all duration-300 group-hover:scale-110">
                        <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground font-semibold transition-colors duration-300 group-hover:text-foreground">
                        {stat.label}
                      </div>
                    </motion.div>
                  </React.Fragment>
                ))}
              </motion.div>

              {/* BUTTON */}
              <motion.div 
                className="flex pt-3 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.2 }} // Delayed to appear after counters start
              >
                <Button
                  size="lg"
                  asChild
                  className="overflow-hidden bg-primary text-primary-foreground w-64 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 group"
                >
                  <a href="/generate-program" className="flex items-center justify-center font-mono relative">
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      Build Your Program
                    </span>
                    <ArrowRightIcon className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* RIGHT SIDE IMAGE */}
            <motion.div 
              className="lg:col-span-6 relative flex justify-center items-center mt-4 sm:mt-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div 
                className="relative w-[75%] sm:w-[65%] md:w-[60%] lg:w-[85%] aspect-[4/5] max-w-sm sm:max-w-md md:max-w-lg rounded-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src="/hero-image.svg"
                  alt="AI Fitness Coach"
                  className="absolute inset-0 w-full h-full object-contain object-center"
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
                
                {/* Subtle floating animation */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* Animated background elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-10 w-16 h-16 bg-secondary/5 rounded-full blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 
          }}
        />
      </section>

      <UserPrograms/>
    </div>
  );
};

export default HomePage;
