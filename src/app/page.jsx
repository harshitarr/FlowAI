"use client";

import { SignedOut, SignedIn, SignInButton, SignOutButton } from "@clerk/nextjs";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <h1>Homepage</h1>

      {/* Show SignInButton when user is signed out */}
      <SignedOut>
        <SignInButton />
      </SignedOut>

      {/* Show SignOutButton when user is signed in */}
      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </div>
  );
};

export default HomePage;
