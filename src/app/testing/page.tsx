// "use client"

// import { useUserContext } from "@/contexts/UserDataProviderContext"
// import axios from "axios"
// import { useEffect, useState } from "react"
// import io, { Socket } from "socket.io-client"

// let socket: Socket

// const Home = () => {
//   const [message, setMessage] = useState("")
//   const [messages, setMessages] = useState<any[]>([])
//   const { user } = useUserContext()

//   useEffect(() => {
//     // Connect to the server when the component mounts
//     socket = io("https://goal-grid-render.onrender.com") // Make sure this matches your server URL

//     // Listen for incoming chat messages
//     socket.on("chatMessage", (message: any) => {
//       setMessages((prevMessages) => [...prevMessages, message])
//     })

//     async function loadMessages() {
//         const roomName = "redis-check"
//         const response= await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chats/get-messages/${roomName}`)
//         const messagesFetched= response.data.data
//         setMessages(messagesFetched)
//     }
//     loadMessages()

//     // Cleanup when the component is unmounted
//     return () => {
//       socket.disconnect()
//     }
//   }, [])

//   const sendMessage = () => {
//     if (message.trim()) {
//       const socket = io("https://goal-grid-render.onrender.com")

//       const messageData={
//         message,
//         uid: user?.uid, // User ID
//         roomName: "redis-check", // Room Name (if applicable)
//         type: "public", // "public" or "private"
//         mediaUrl: "", // Media URL (optional)
//         mediaType: "none" // Media Type (image, video, none)
//       }

//       socket.emit("sendMessage",messageData)
//       setMessage("")
//     }
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <h1 className="text-4xl font-bold text-blue-600 mb-8">Real-time Chat App</h1>

//       <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
//         <div className="mb-4">
//           <h2 className="text-2xl font-semibold">Messages</h2>
//           <div className="max-h-60 overflow-y-auto mt-2">
//             {messages.map((msg, index) => (
//               <div key={index} className="p-2 my-2 bg-gray-200 rounded-lg">
//                 {msg.message}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={sendMessage}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Home


'use client';

// import { useState } from 'react';

// const MultiVideoPlayer = () => {
//   const [videos, setVideos] = useState<File[]>([]);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files) {
//       setVideos(Array.from(files));
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-4 pt-20">
//       <input 
//         type="file" 
//         multiple 
//         accept="video/*" 
//         onChange={handleFileChange} 
//         className="mb-4 border p-2 rounded"
//       />
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
//         {videos.map((video, index) => (
//           <video 
//             key={index} 
//             controls 
//             muted autoPlay
//             preload="metadata" 
//             className="w-full h-auto rounded shadow-lg"
//           >
//             <source src={URL.createObjectURL(video)} type={video.type} />
//           </video>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MultiVideoPlayer;

import { useState, useEffect } from "react";
import { format, addDays, subWeeks, addWeeks, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Task {
  id: number;
  title: string;
  date: string;
}

const tasks: Task[] = [
  { id: 1, title: "Workout", date: format(new Date(), "yyyy-MM-dd") },
  { id: 2, title: "Code 2 hours", date: format(new Date(), "yyyy-MM-dd") },
  { id: 3, title: "Read 10 pages", date: format(addDays(new Date(), -1), "yyyy-MM-dd") },
  { id: 4, title: "Write blog post", date: format(addDays(new Date(), -1), "yyyy-MM-dd") },
];

const TaskCalendar: React.FC = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFilteredTasks(tasks.filter((task) => task.date === selectedDate));
      setLoading(false);
    }, 800);
  }, [selectedDate]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  return (
    <div className="p-4 shadow-md rounded-lg w-full max-w-md mx-auto pt-24 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevWeek} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300">
          <ChevronLeft className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{format(currentWeekStart, "MMM yyyy")}</h2>
        <button onClick={handleNextWeek} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300">
          <ChevronRight className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>
      </div>

      <div className="flex space-x-2 justify-between overflow-x-auto">
        {[...Array(7)].map((_, index) => {
          const date = format(addDays(currentWeekStart, index), "yyyy-MM-dd");
          const day = format(addDays(currentWeekStart, index), "EEE");
          const dayNum = format(addDays(currentWeekStart, index), "d");

          return (
            <button
              key={date}
              className={`flex flex-col items-center p-2 rounded-lg transition text-gray-900 dark:text-white ${
                selectedDate === date ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => handleDateClick(date)}
            >
              <span className="text-sm">{day}</span>
              <span className="text-lg font-bold">{dayNum}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks on {format(new Date(selectedDate), "PPP")}</h3>
        {loading ? (
          <div className="mt-2 space-y-2">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="h-12 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse w-full"></div>
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {filteredTasks.map((task) => (
              <li key={task.id} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-900 dark:text-white">
                {task.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-500">No tasks for this date.</p>
        )}
      </div>
    </div>
  );
};

export default TaskCalendar;
