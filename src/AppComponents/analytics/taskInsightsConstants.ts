export const barChartConfig = {
    completed: { label: "Completed", color: "#22C55E" },
    total: { label: "Total", color: "#3B82F6" },
    missedTasks: { label: "Missed Tasks", color: "#EF4444" }
  }

 export const barChartConfigOfPriorityData = {
    completedTasks: { label: "Completed", color: "#22C55E" },
    totalTasks: { label: "Total", color: "#3B82F6" },
    missedTasks: { label: "Missed Tasks", color: "#EF4444" }
  }

  // Keep days mapping separate
 export const dayLabels = {
    short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    full: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
  }
 export const areaChartConfig = {
    totalDuration: { label: "Total Duration", color: "#3B82F6" }, // Blue for total duration
    completedDuration: { label: "Completed Duration", color: "#22C55E" }, // Green for completed duration
    averageDuration: { label: "Average Duration", color: "#af57db" } // Yellow for average duration
  }

 export const pieChartConfig = {
    completed: {
      label: "Completed",
      color: "#22C55E" // Tailwind Green-500
    },
    active: {
      label: "Active",
      color: "#3B82F6" // Tailwind Blue-500
    },
    abandoned: {
      label: "Abandoned",
      color: "#EF4444" // Tailwind Red-500
    }
  }