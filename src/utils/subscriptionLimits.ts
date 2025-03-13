export const subscriptionLimits = {
  free: {
    habits: 3,          // Limit to 3 habits (good for trying out)
    categories: 2,      // Limit to 2 categories (manageable for personal organization)
    goals: 3,           // Limit to 3 goals (keep it focused for free users)
    notes: 5,           // Limit to 5 notes (basic functionality)
    journals: 2,        // Limit to 2 journals (good for note-taking and daily logging)
    tasks: 5            // Limit to 5 tasks (manageable to get users started)
  },
  personal: {
    habits: 20,         // More habits allowed (start tracking more habits)
    categories: 8,     // More categories (better for organizing habits, goals, etc.)
    goals: 20,          // More goals to work on (supports personal progress)
    notes: 5,          // More space for notes (encourages users to document more)
    journals: 5,        // Additional journal entries (better for personal growth)
    tasks: 20           // More tasks (enables better task management)
  },
  community: {
    habits: 50,         // Substantial increase for community-level tracking
    categories: 30,     // More categories to structure tasks, goals, etc.
    goals: 100,         // Greater number of goals (supports serious progress tracking)
    notes: 100,         // Plenty of room for notes (better for active users)
    journals: 10,       // Larger space for journaling (encourages consistent updates)
    tasks: 50           // Large number of tasks (supports a high level of task management)
  }
  // premium: {
  //   habits: 200,
  //   categories: 100,
  //   goals: 500,
  //   notes: 500,
  //   journals: 20,
  //   tasks: 100,
  // },
  // diamond: {
  //   habits: Infinity,
  //   taskCategories: Infinity,
  //   goals: Infinity,
  //   friends: Infinity,
  // },
} as const;

export type SubscriptionPlan = keyof typeof subscriptionLimits
export type ResourceType = keyof (typeof subscriptionLimits)["free"]
