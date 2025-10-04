"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import TerminalOverlay from "@/components/TerminalOverlay";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden mt-[-60px]">
      {/* HERO SECTION */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 sm:gap-y-12 lg:gap-x-12 items-center relative">

            {/* CORNER DECORATION */}
            <div className="absolute -top-4 left-2 sm:left-4 md:left-10 w-16 h-16 sm:w-24 sm:h-24 border-l-2 border-t-2 border-border" />

            {/* LEFT SIDE CONTENT */}
            <div
              className="
                lg:col-span-6 
                space-y-5 sm:space-y-6 
                relative 
                sm:ml-4 md:ml-10 lg:ml-30 
                text-center sm:text-center md:text-left lg:text-left
              "
            >
              {/* HEADING */}
              <h1
                className="
                  text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                  font-bold tracking-tight leading-tight text-foreground
                "
              >
                <div><span>Transform</span></div>
                <div><span className="text-primary">Your Body</span></div>
                <div className="pt-1 sm:pt-2"><span>With Advanced</span></div>
                <div className="pt-1 sm:pt-2">
                  <span>AI</span><span className="text-primary"> Technology</span>
                </div>
              </h1>

              {/* DIVIDER */}
              <div className="h-px mx-auto md:mx-0 w-2/3 sm:w-1/2 bg-gradient-to-r from-primary via-secondary to-primary opacity-60" />

              {/* DESCRIPTION */}
              <p
                className="
                  text-sm sm:text-base md:text-lg lg:text-xl 
                  text-muted-foreground 
                  max-w-md sm:max-w-lg md:max-w-xl 
                  mx-auto md:mx-0
                "
              >
                Talk to our AI assistant and get personalized diet plans and workout routines
                designed just for you.
              </p>

              {/* STATS */}
              <div
                className="
                  flex flex-col sm:flex-row 
                  sm:items-center 
                  justify-center md:justify-start
                  gap-4 sm:gap-6 md:gap-8 
                  py-3 sm:py-4 
                  font-mono
                "
              >
                <div className="flex flex-col items-center md:items-start">
                  <div className="text-lg sm:text-xl md:text-2xl text-primary">500+</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider">ACTIVE USERS</div>
                </div>

                <div className="hidden sm:block h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

                <div className="flex flex-col items-center md:items-start">
                  <div className="text-lg sm:text-xl md:text-2xl text-primary">3 min</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider">GENERATION</div>
                </div>

                <div className="hidden sm:block h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

                <div className="flex flex-col items-center md:items-start">
                  <div className="text-lg sm:text-xl md:text-2xl text-primary">100%</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider">PERSONALIZED</div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center md:justify-start">
                <Button
                  size="lg"
                  asChild
                  className="
                    overflow-hidden 
                    bg-primary text-primary-foreground 
                    px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-6
                    text-sm sm:text-base md:text-lg 
                    font-medium 
                    transition-transform transform hover:scale-105
                  "
                >
                  <a href="/generate-program" className="flex items-center font-mono">
                    Build Your Program
                    <ArrowRightIcon className="ml-2 size-4 sm:size-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="lg:col-span-6 relative flex justify-center items-center mt-4 sm:mt-0">
              <div className="relative w-[75%] sm:w-[65%] md:w-[70%] lg:w-full aspect-[4/5] max-w-sm sm:max-w-md md:max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero-image.svg"
                  alt="AI Fitness Coach"
                  fill
                  className="object-contain object-center drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* TERMINAL OVERLAY - SMOOTH SLIDE-IN */}
            <div className="w-full flex justify-center md:justify-end lg:justify-end mt-6 md:mt-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: "100%" }}       // Start completely off-screen to the right
                animate={{ opacity: 1, x: 0 }}            // Slide smoothly into place
                transition={{
                  duration: 1.4,                          // Slightly longer for smoothness
                  ease: "easeInOut",                       // Clean, professional easing
                  delay: 0.6,                              // Appears after hero section loads
                }}
                className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-auto"
              >
                <TerminalOverlay />
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
