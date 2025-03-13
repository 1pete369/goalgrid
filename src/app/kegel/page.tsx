// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { formatTime } from "../../utils/formatTime"
// import { Howl } from "howler"

// type ExerciseType = "5sHold" | "10sHold" | "Flutter"

// const exerciseData = {
//   "5sHold": { duration: 5, rest: 5, name: "5s Hold" },
//   "10sHold": { duration: 10, rest: 5, name: "10s Hold" },
//   Flutter: { duration: 20, rest: 5, name: "Flutter" },
// }

// export default function KegelCounter() {
//   const [currentExercise, setCurrentExercise] = useState<ExerciseType | null>(null)
//   const [timeLeft, setTimeLeft] = useState(0)
//   const [isResting, setIsResting] = useState(false)
//   const [reps, setReps] = useState({ "5sHold": 0, "10sHold": 0, Flutter: 0 })
//   const [desiredReps, setDesiredReps] = useState<number>(1)
//   const [flutterState, setFlutterState] = useState<'Contraction' | 'Release' | null>(null)

//   const beepSound = new Howl({
//     src: ["/beep.mp3"], // Ensure you have the beep sound in the public directory
//     volume: 0.5,
//   })

//   useEffect(() => {
//     const storedReps = localStorage.getItem("kegelReps")
//     if (storedReps) {
//       setReps(JSON.parse(storedReps))
//     }
//   }, [])

//   useEffect(() => {
//     localStorage.setItem("kegelReps", JSON.stringify(reps))
//   }, [reps])

//   useEffect(() => {
//     let timer: NodeJS.Timeout
//     if (currentExercise && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prev) => prev - 1)
//       }, 1000)
//     } else if (timeLeft === 0 && currentExercise) {
//       beepSound.play() // Play beep sound when timer reaches 0
//       if (isResting) {
//         setIsResting(false)
//         setTimeLeft(exerciseData[currentExercise].duration)
//       } else {
//         if (currentExercise === "Flutter") {
//           // For Flutter, alternate between Contraction and Release every second
//           if (flutterState === 'Contraction') {
//             setFlutterState('Release')
//           } else {
//             setFlutterState('Contraction')
//           }
//         }

//         setReps((prev) => ({ ...prev, [currentExercise]: prev[currentExercise] + 1 }))
//         setIsResting(true)
//         setTimeLeft(exerciseData[currentExercise].rest)
//       }
//     }
//     return () => clearInterval(timer)
//   }, [currentExercise, timeLeft, isResting, flutterState])

//   const startExercise = (type: ExerciseType) => {
//     setCurrentExercise(type)
//     setTimeLeft(exerciseData[type].duration)
//     setIsResting(false)
//     if (type === 'Flutter') {
//       setFlutterState('Contraction') // Initialize Flutter state to 'Contraction'
//     }
//   }

//   const resetExercise = () => {
//     setCurrentExercise(null)
//     setTimeLeft(0)
//     setIsResting(false)
//     setFlutterState(null)
//   }

//   const resetAllReps = () => {
//     // setReps({ "5sHold": 0, "10sHold": 0, Flutter: 0 })
//   }

//   const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setDesiredReps(Number(e.target.value))
//   }

//   const setRepsForExercise = () => {
//     setReps((prev) => ({ ...prev, [currentExercise as ExerciseType]: desiredReps }))
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md bg-gray-800 text-gray-100">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center text-purple-400">Kegel Counter</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {Object.entries(exerciseData).map(([key, data]) => (
//             <Card key={key} className="overflow-hidden bg-gray-700">
//               <CardContent className="p-0">
//                 <Button
//                   className="w-full h-full py-6 rounded-none bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 text-white font-semibold text-lg"
//                   onClick={() => startExercise(key as ExerciseType)}
//                   disabled={currentExercise !== null}
//                 >
//                   {data.name}
//                   <span className="ml-2 bg-gray-800 text-purple-300 rounded-full px-2 py-1 text-xs">
//                     Reps: {reps[key as ExerciseType]}
//                   </span>
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}

//           {currentExercise && (
//             <div className="text-center">
//               <div className={`text-4xl font-bold mb-2 ${isResting ? 'text-red-500' : 'text-purple-400'}`}>
//                 {formatTime(timeLeft)}
//               </div>
//               <div className={`text-lg font-semibold ${isResting ? 'text-red-400' : 'text-indigo-400'}`}>
//                 {isResting ? "Rest" : (currentExercise === "Flutter" ? flutterState : exerciseData[currentExercise].name)}
//               </div>
//               <Button  className="mt-4 bg-red-600 hover:bg-red-700 text-white" onClick={resetExercise}>
//                 Stop
//               </Button>
//             </div>
//           )}

//           {/* <div className="mt-4 text-center">
//             <input
//               type="number"
//               value={desiredReps}
//               onChange={handleRepsChange}
//               className="p-2 rounded text-black"
//               min={1}
//               max={10}
//             />
//             <Button
//               className="ml-2 bg-green-600 hover:bg-green-700 text-white"
//               onClick={setRepsForExercise}
//             >
//               Set Reps
//             </Button>
//           </div> */}

//           <Button disabled className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white" onClick={resetAllReps}>
//             Reset All Reps
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

import React from 'react'

export default function page() {
  return (
    <div>
      Sample page
    </div>
  )
}
