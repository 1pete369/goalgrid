export type DailyRewardsResponseType = {
  rewardsClaimed: [
    {
      date: Date
      rewards?: string[]
      _id: string
    }
  ]
  numberOfCompletedTasks: number
  numberOfCompletedHabits: number
  todayNotesCount: number
  todayJournalsCount: number
}