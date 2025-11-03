import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(), // ✅ This stores the actual clerkId
  }).index("by_clerk_id", ["clerkId"]),

  // ✅ NEW: Vapi user sessions for dynamic user identification
  vapi_sessions: defineTable({
    clerkId: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
    isActive: v.boolean(),
  }).index("by_clerk_id", ["clerkId"]),

  plans: defineTable({
    userId: v.string(), // ✅ Keep this! It stores the clerkId value
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.number(), // ✅ Keep as required number (not optional)
              reps: v.number(), // ✅ Keep as required number (not optional)
              // ✅ Removed optional fields that might cause AI validation issues
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
  })
    .index("by_user_id", ["userId"]) // ✅ Keep this index for userId queries
    .index("by_active", ["isActive"]),
});
