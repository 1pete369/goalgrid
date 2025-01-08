import { CategoryType } from "@/types/todoFeatureTypes"
import axios from "axios"

export async function getCategories(uid: string) {
  try {
    const categories = (
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/get-categories/${uid}`
      )
    ).data
    console.log(categories)
    return categories.categories
  } catch (error) {
    console.log(error)
  }
}

export async function createCategory(category: CategoryType) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/create-category`,
      { category }
    )
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

export async function DeleteCategory(id: string) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/delete-category/${id}`
    )
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
