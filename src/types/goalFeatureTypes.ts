export type Goal = {
  id: string
  uid : string
  name: string
  description: string
  category : string
  createdAt : string
  duration : number
  habits: []
  progress: {
    totalCompleted: number
    completionRate: number
  }
  status: "active" | "completed"
}
