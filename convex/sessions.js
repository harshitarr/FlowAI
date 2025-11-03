import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a session for the current user making Vapi calls
export const createVapiSession = mutation({
  args: { 
    clerkId: v.string(),
    timestamp: v.number()
  },
  handler: async (ctx, args) => {
    // Store the current user's session for Vapi calls
    // This expires after 10 minutes
    const expiresAt = Date.now() + (10 * 60 * 1000);
    
    console.log("Creating Vapi session for clerkId:", args.clerkId);
    
    // Remove any existing sessions for this user (clean slate)
    const existingSessions = await ctx.db
      .query("vapi_sessions")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .collect();
    
    for (const session of existingSessions) {
      await ctx.db.delete(session._id);
    }
    
    // Create new session
    const sessionId = await ctx.db.insert("vapi_sessions", {
      clerkId: args.clerkId,
      createdAt: args.timestamp,
      expiresAt,
      isActive: true
    });
    
    console.log("Vapi session created successfully:", sessionId);
    return { success: true, sessionId };
  },
});

// Get the most recent active user session
export const getCurrentVapiUser = query({
  args: {},
  handler: async (ctx) => {
    console.log("Looking for active Vapi user session...");
    
    // Find the most recent active session
    const activeSessions = await ctx.db
      .query("vapi_sessions")
      .filter((q) => 
        q.and(
          q.eq(q.field("isActive"), true),
          q.gt(q.field("expiresAt"), Date.now())
        )
      )
      .order("desc")
      .take(1);
    
    if (activeSessions.length === 0) {
      console.log("No active Vapi sessions found");
      return null;
    }
    
    const session = activeSessions[0];
    console.log("Found active session for clerkId:", session.clerkId);
    return { clerkId: session.clerkId };
  },
});

// Clean up expired sessions (optional - for maintenance)
export const cleanupExpiredSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    const expiredSessions = await ctx.db
      .query("vapi_sessions")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();
    
    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
    }
    
    console.log("Cleaned up expired sessions:", expiredSessions.length);
    return { cleaned: expiredSessions.length };
  },
});

// Get all active sessions (for debugging)
export const getAllActiveSessions = query({
  args: {},
  handler: async (ctx) => {
    const activeSessions = await ctx.db
      .query("vapi_sessions")
      .filter((q) => 
        q.and(
          q.eq(q.field("isActive"), true),
          q.gt(q.field("expiresAt"), Date.now())
        )
      )
      .collect();
    
    return activeSessions;
  },
});

// Deactivate session for a specific user (optional)
export const deactivateUserSession = mutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    const userSessions = await ctx.db
      .query("vapi_sessions")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .collect();
    
    for (const session of userSessions) {
      await ctx.db.patch(session._id, { isActive: false });
    }
    
    console.log("Deactivated sessions for clerkId:", args.clerkId);
    return { deactivated: userSessions.length };
  },
});
