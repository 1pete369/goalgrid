import { LogIn, CheckCircle, ClipboardList, FileText, BookOpen, Repeat, Flame, MessageSquare, ThumbsUp, Users, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type RewardTask = {
  task: string;
  reward: number;
  icon: LucideIcon; // Correct type for React components
};

type Rewards = {
  free: RewardTask[];
  personal: RewardTask[];
  community: RewardTask[];
};

export const dailyRewards: Rewards = {
  free: [
    { task: "Login to the app", reward: 1, icon: LogIn  },
    { task: "Complete 1 task", reward: 1, icon: CheckCircle  },
    { task: "Complete 3 tasks", reward: 2, icon: ClipboardList  },
    { task: "Write 1 note", reward: 1, icon: FileText  },
    { task: "Write 1 journal entry", reward: 1, icon: BookOpen  },
    { task: "Complete 1 habit", reward: 1, icon: Repeat  },
    { task: "Complete 3 habits", reward: 2, icon: Flame  },
    // { task: "Check streaks", reward: 1, icon: Flame  },
    // { task: "Comment on a post", reward: 1, icon: MessageSquare  },
    // { task: "React to 5 community posts", reward: 1, icon: ThumbsUp  },
  ],
  personal: [
    { task: "Login to the app", reward: 2, icon: LogIn  },
    { task: "Complete 1 task", reward: 2, icon: CheckCircle  },
    { task: "Complete 3 tasks", reward: 3, icon: ClipboardList  },
    { task: "Write 1 note", reward: 2, icon: FileText  },
    { task: "Write 1 journal entry", reward: 2, icon: BookOpen  },
    { task: "Complete 1 habit", reward: 2, icon: Repeat  },
    { task: "Complete 3 habits", reward: 3, icon: Flame  },
    // { task: "Check streaks", reward: 2, icon: Flame  },
    // { task: "Comment on a post", reward: 2, icon: MessageSquare  },
    // { task: "React to 5 community posts", reward: 2, icon: ThumbsUp  },
  ],
  community: [
    { task: "Login to the app", reward: 3, icon: LogIn  },
    { task: "Complete 1 task", reward: 3, icon: CheckCircle  },
    { task: "Complete 3 tasks", reward: 5, icon: ClipboardList  },
    { task: "Write 1 note", reward: 3, icon: FileText  },
    { task: "Write 1 journal entry", reward: 3, icon: BookOpen  },
    { task: "Complete 1 habit", reward: 3, icon: Repeat  },
    { task: "Complete 3 habits", reward: 5, icon: Flame  },
    // { task: "Check streaks", reward: 3, icon: Flame  },
    // { task: "Comment on a post", reward: 3, icon: MessageSquare  },
    // { task: "React to 5 community posts", reward: 3, icon: ThumbsUp  },
  ],
};
