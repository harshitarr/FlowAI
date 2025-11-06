import React from 'react';
import { useUser } from '@clerk/clerk-react'; // or '@clerk/nextjs' for Next.js
import CornerElements from "./CornerElements";

const ProfileHeader = () => {
  // Get user data directly from Clerk
  const { user, isLoaded, isSignedIn } = useUser();

  // Loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="mb-10 relative backdrop-blur-md bg-black/5 border border-white/10 p-6 rounded-2xl">
        <CornerElements />
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/50 border-t-primary"></div>
          <span className="ml-2 text-muted-foreground font-mono">Loading user data...</span>
        </div>
      </div>
    );
  }

  // Return null if user not signed in (same as your original logic)
  if (!isSignedIn || !user) return null;

  // Different UI approach - Glassmorphism with neon accents
  return (
    <div className="mb-10 relative backdrop-blur-md bg-gradient-to-br from-white/5 via-primary/5 to-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl hover:shadow-primary/20 transition-all duration-500">
      <CornerElements />
      
      {/* Subtle glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative group">
          {user.imageUrl ? (
            <div className="relative w-24 h-24 overflow-hidden rounded-2xl border border-white/20 shadow-lg group-hover:border-primary/50 transition-all duration-300">
              <img
                src={user.imageUrl}
                alt={user.fullName || "Profile"}
                className="w-full h-full object-cover"
              />
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 group-hover:from-primary/20 transition-all duration-300"></div>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-white/20 shadow-lg group-hover:border-primary/50 transition-all duration-300">
              <span className="text-3xl font-bold text-primary drop-shadow-lg">
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          
          {/* Neon status indicator */}
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white/30 shadow-lg">
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40"></div>
            <div className="absolute inset-0.5 rounded-full bg-green-300 animate-pulse"></div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-sm">
              {user.fullName}
            </h1>
            
            {/* Glass status badge with neon accent */}
            <div className="inline-flex items-center backdrop-blur-sm bg-primary/10 border border-primary/30 rounded-full px-4 py-2 shadow-lg hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2 shadow-sm shadow-primary/50"></div>
              <p className="text-xs font-mono text-primary font-semibold tracking-wider">USER ACTIVE</p>
            </div>
          </div>
          
          {/* Neon gradient divider */}
          <div className="relative my-3">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            <div className="absolute inset-0 h-px bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 blur-sm"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary/60 shadow-sm shadow-primary/50"></div>
            <p className="text-muted-foreground font-mono text-sm">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
