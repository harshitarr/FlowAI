"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden mt-[-50px]">
      {/* HERO SECTION */}
      <section className="relative z-10 py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative">
            
            {/* CORNER DECORATION */}
            <div className="absolute -top-6 left-0 sm:left-4 md:left-10 w-24 h-24 sm:w-32 sm:h-32 border-l-2 border-t-2 border-border" />

            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-7 space-y-6 relative ml-0 sm:ml-8 md:ml-16">
              
              {/* HEADING */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                <div>
                  <span className="text-foreground">Transform</span>
                </div>
                <div>
                  <span className="text-primary">Your Body</span>
                </div>
                <div className="pt-1 sm:pt-2">
                  <span className="text-foreground">With Advanced</span>
                </div>
                <div className="pt-1 sm:pt-2">
                  <span className="text-foreground">AI</span>
                  <span className="text-primary"> Technology</span>
                </div>
              </h1>

              {/* DIVIDER */}
              <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />

              {/* DESCRIPTION */}
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground w-full sm:w-3/4">
                Talk to our AI assistant and get personalized diet plans and workout routines
                designed just for you
              </p>

              {/* STATS */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-6 sm:gap-8 py-4 font-mono">
                <div className="flex flex-col items-start sm:items-center">
                  <div className="text-xl sm:text-2xl text-primary">500+</div>
                  <div className="text-xs uppercase tracking-wider">ACTIVE USERS</div>
                </div>

                {/* Separator */}
                <div className="hidden sm:block h-10 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

                <div className="flex flex-col items-start sm:items-center">
                  <div className="text-xl sm:text-2xl text-primary">3min</div>
                  <div className="text-xs uppercase tracking-wider">GENERATION</div>
                </div>

                {/* Separator */}
                <div className="hidden sm:block h-10 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

                <div className="flex flex-col items-start sm:items-center">
                  <div className="text-xl sm:text-2xl text-primary">100%</div>
                  <div className="text-xs uppercase tracking-wider">PERSONALIZED</div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  asChild
                  className="overflow-hidden bg-primary text-primary-foreground px-6 py-4 sm:px-8 sm:py-5 text-base sm:text-lg font-medium transition-transform transform hover:scale-105"
                >
                  <a href="/generate-program" className="flex items-center font-mono">
                    Build Your Program
                    <ArrowRightIcon className="ml-2 size-5" />
                  </a>
                </Button>
              </div>

              

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
