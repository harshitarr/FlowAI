import { HeartPlus } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      {/* Top border glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Main layout container.
          - Mobile: Vertical stack, centered items.
          - Desktop: Horizontal row, space-between, top-aligned items.
        */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:items-start">
          
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <a href="/" className="flex items-center gap-2">
              <div className="p-1 bg-secondary-foreground/20 rounded-md">
                <HeartPlus className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-xl font-bold font-mono">
                <span className="text-primary">Flow</span>.AI
              </span>
            </a>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Flow.AI - All rights reserved
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-12 text-sm md:grid-cols-3">
            <a
              href="/about"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </a>
            <a
              href="/contact"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
            <a
              href="/blog"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Blog
            </a>
            <a
              href="/help"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Help
            </a>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-md bg-background/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-muted-foreground">
              AI Assistant
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};
export default Footer;