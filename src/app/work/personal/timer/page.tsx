"use client"

import { useState } from "react";
import TaskTimer from "./TaskManager";

type Task = {
  id: number;
  name: string;
};

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");

  const addTask = () => {
    if (taskInput.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), name: taskInput }]);
    setTaskInput("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="container pt-20 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">⏱ Task Timers</h1>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter task name..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-l"
        />
        <button onClick={addTask} className="bg-blue-600 text-white px-4 py-2 rounded-r">Add</button>
      </div>

      {tasks.map((task) => (
        <TaskTimer
          key={task.id}
          taskName={task.name}
          onDelete={() => deleteTask(task.id)}
        />
      ))}
    </div>
  );
}
