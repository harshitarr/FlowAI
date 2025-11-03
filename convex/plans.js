import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper function to get current authenticated user's clerkId
async function getCurrentUserClerkId(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null; // ✅ Return null instead of throwing error
  }
  return identity.subject; // This is the clerkId from Clerk
}

// Helper function to get current user document by clerkId
async function getCurrentUser(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  
  const clerkId = identity.subject;
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
}

// ✅ ORIGINAL: For authenticated frontend calls (profile page, etc.)
export const createPlan = mutation({
  args: {
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.number(),
              reps: v.number(),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
        })
      ),
    }),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // ✅ Get the authenticated user's clerkId from auth context
    const clerkId = await getCurrentUserClerkId(ctx);
    
    if (!clerkId) {
      throw new Error("User not authenticated");
    }
    
    // ✅ Verify user exists in our database
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not found or not authenticated");
    }
    
    console.log("Creating plan for clerkId:", clerkId);

    // Find and deactivate any existing active plans for this user
    const activePlans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", clerkId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Deactivate all existing active plans
    for (const plan of activePlans) {
      await ctx.db.patch(plan._id, { isActive: false });
    }

    // Create new plan with clerkId as userId
    const planData = {
      ...args,
      userId: clerkId, // ✅ Use clerkId from authentication context
    };

    const planId = await ctx.db.insert("plans", planData);
    return planId;
  },
});

// ✅ NEW: For Vapi HTTP calls that provide userId directly
export const createPlanWithUserId = mutation({
  args: {
    userId: v.string(), // ✅ Accept userId directly from HTTP call
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.number(),
              reps: v.number(),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
        })
      ),
    }),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    console.log("Creating plan for userId:", args.userId);

    // Find and deactivate any existing active plans for this user
    const activePlans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Deactivate all existing active plans
    for (const plan of activePlans) {
      await ctx.db.patch(plan._id, { isActive: false });
    }

    // Create new plan - args already contains userId
    const planId = await ctx.db.insert("plans", args);
    console.log("Plan created with ID:", planId);
    return planId;
  },
});

// ✅ FIXED: For authenticated frontend calls (profile page) - handles unauthenticated gracefully
export const getUserPlans = query({
  args: {}, // ✅ Empty args - gets clerkId from auth context
  handler: async (ctx, args) => {
    // ✅ Get the authenticated user's clerkId with proper error handling
    const clerkId = await getCurrentUserClerkId(ctx);
    
    if (!clerkId) {
      // ✅ Return empty array instead of throwing error
      console.log("No authenticated user - returning empty plans array");
      return [];
    }
    
    console.log("Fetching plans for clerkId:", clerkId);

    const plans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", clerkId))
      .order("desc")
      .collect();

    return plans;
  },
});

// ✅ Helper functions
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const getCurrentUserInfo = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

// ✅ FIXED: Handle unauthenticated users gracefully
export const getActivePlan = query({
  args: {},
  handler: async (ctx) => {
    const clerkId = await getCurrentUserClerkId(ctx);
    
    if (!clerkId) {
      // ✅ Return null instead of throwing error
      console.log("No authenticated user - returning null for active plan");
      return null;
    }
    
    const activePlan = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", clerkId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .unique();

    return activePlan;
  },
});

export const updatePlanStatus = mutation({
  args: {
    planId: v.id("plans"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const clerkId = await getCurrentUserClerkId(ctx);
    
    if (!clerkId) {
      throw new Error("User not authenticated");
    }
    
    // Verify the plan belongs to the authenticated user
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Plan not found");
    }
    
    if (plan.userId !== clerkId) {
      throw new Error("Unauthorized: Plan does not belong to user");
    }

    // If activating this plan, deactivate all other plans for this user
    if (args.isActive) {
      const otherActivePlans = await ctx.db
        .query("plans")
        .withIndex("by_user_id", (q) => q.eq("userId", clerkId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      for (const otherPlan of otherActivePlans) {
        if (otherPlan._id !== args.planId) {
          await ctx.db.patch(otherPlan._id, { isActive: false });
        }
      }
    }

    await ctx.db.patch(args.planId, { isActive: args.isActive });
    return args.planId;
  },
});

export const deletePlan = mutation({
  args: {
    planId: v.id("plans"),
  },
  handler: async (ctx, args) => {
    const clerkId = await getCurrentUserClerkId(ctx);
    
    if (!clerkId) {
      throw new Error("User not authenticated");
    }
    
    // Verify the plan belongs to the authenticated user
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Plan not found");
    }
    
    if (plan.userId !== clerkId) {
      throw new Error("Unauthorized: Plan does not belong to user");
    }

    await ctx.db.delete(args.planId);
    return args.planId;
  },
});
