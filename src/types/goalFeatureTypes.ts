export type Goal = {
  id: string
  uid : string
  name: string
  goalColor : string
  description: string
  category : string
  createdAt : string
  deadline : string
  duration : string
  habits: []
  progress: {
    totalCompleted: number
    completionRate: number
  }
  status: "active" | "completed"
}
