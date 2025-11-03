import React from 'react';
import { useUser } from '@clerk/clerk-react'; // or '@clerk/nextjs' for Next.js
import CornerElements from "./CornerElements";

const ProfileHeader = () => {
  // Get user data directly from Clerk
  const { user, isLoaded, isSignedIn } = useUser();

  // Loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="mb-10 relative backdrop-blur-sm border border-border p-6">
        <CornerElements />
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground font-mono">Loading user data...</span>
        </div>
      </div>
    );
  }

  // Return null if user not signed in (same as your original logic)
  if (!isSignedIn || !user) return null;

  // Your exact original component design - ZERO changes to the UI code
  return (
    <div className="mb-10 relative backdrop-blur-sm border border-border  p-6">
      <CornerElements />

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          {user.imageUrl ? (
            <div className="relative w-24 h-24 overflow-hidden rounded-lg">
              <img
                src={user.imageUrl}
                alt={user.fullName || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background"></div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-foreground">{user.fullName}</span>
            </h1>
            <div className="flex items-center bg-cyber-terminal-bg backdrop-blur-sm border border-border rounded px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></div>
              <p className="text-xs font-mono text-primary">USER ACTIVE</p>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50 my-2"></div>
          <p className="text-muted-foreground font-mono">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
