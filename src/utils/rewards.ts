import axios from "axios"

export async function getDailyRewardsStatus() {
  try {
    const response = await axios.get(`/api/rewards/`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}