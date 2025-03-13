"use client";

import { useUserContext } from "@/contexts/UserDataProviderContext";
import { getHabits } from "@/utils/habits";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Types
interface Habit {
  id: string;
  name: string;
  category: string;
  duration: number;
  streak?: {
    current: number;
    best: number;
  };
  progress?: {
    totalCompleted: number;
    completionRate: number;
  };
  dailyTracking?: Record<string, boolean>;
}

// Colors for Charts
const COLORS = ["#22C55E", "#E11D48"]; // Green & Red for Completion

const HabitInsights = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { user } = useUserContext();

  useEffect(() => {
    if (user) {
      async function loadHabits() {
        try {
          const habitsData = await getHabits(user?.uid as string);
          setHabits(habitsData || []);
        } catch (error) {
          console.error("Error fetching habits:", error);
          setHabits([]);
        }
      }
      loadHabits();
    }
  }, [user]);

  if (!habits.length) return <p className="text-center text-gray-500">Loading insights...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">📊 Habit Insights</h2>

      {/* Grid Layout for Compact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {habits.map((habit) => {
          const completionRate = habit?.progress?.completionRate || 0;
          const weeklyData = Object.entries(habit.dailyTracking || {}).map(([date, completed]) => ({
            date,
            completed: completed ? 1 : 0,
          }));

          return (
            <div key={habit.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              {/* Habit Name */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{habit.name}</p>
                <p className="text-xs text-gray-500">{habit.category}</p>
              </div>

              {/* Streak & Progress */}
              <div className="flex justify-between mt-2">
                <div className="text-center">
                  <p className="text-sm text-gray-500">🔥 Streak</p>
                  <p className="text-lg font-bold text-blue-500">{habit?.streak?.current || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">🏆 Best</p>
                  <p className="text-lg font-bold text-green-500">{habit?.streak?.best || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">✅ Completion</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{completionRate.toFixed(0)}%</p>
                </div>
              </div>

              {/* Completion Rate Pie Chart */}
              <div className="flex justify-center mt-2">
                <ResponsiveContainer width={80} height={80}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Completed", value: completionRate },
                        { name: "Remaining", value: 100 - completionRate },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
                      dataKey="value"
                    >
                      <Cell fill={COLORS[0]} />
                      <Cell fill={COLORS[1]} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly Progress Bar Chart */}
              <div className="mt-3">
                <ResponsiveContainer width="100%" height={50}>
                  <BarChart data={weeklyData}>
                    <XAxis hide dataKey="date" />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#22C55E" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitInsights;
