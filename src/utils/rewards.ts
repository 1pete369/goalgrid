import axios from "axios"

export async function getDailyRewardsStatus(uid: string) {
  try {
    const response = await axios.get(`/api/rewards/${uid}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}
