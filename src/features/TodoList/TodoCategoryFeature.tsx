"use client"

import { useEffect, useReducer, useRef, useState } from "react"

import Greetings from "@/AppComponents/Greetings"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import TodoCategoryCardSkeleton from "@/skeletons/TodoCategorySkeleton"
import { Action, CategoryType } from "@/types/todoFeatureTypes"
import { getCategories, updateCategory } from "@/utils/categories"
import TodoListCategoryCard from "./TodoListFeatureComponents/TodoListCategoryCard"
import TodoListCategoryFeatureForm from "./TodoListFeatureComponents/TodoListCategoryFeatureForm"
import { useCustomToast } from "@/hooks/useCustomToast"
import { getTodayDate } from "@/utils/basics"

function reducer(state: CategoryType[], action: Action): CategoryType[] {
  switch (action.type) {
    case "LoadCategories":
      return action.categories
    case "AddCategory":
      return [...state, action.category]
    case "DeleteCategory":
      return state.filter((category) => category.id !== action.categoryId)
    case "AddTodo":
      return state.map((category) => {
        if (category.id === action.categoryId) {
          return {
            ...category,
            categoryTodos: [...category.categoryTodos, action.todo]
          }
        }
        return category
      })

    case "CheckTodo":
      return state.map((category) => {
        if (category.id === action.categoryId) {
          return {
            ...category,
            categoryTodos: category.categoryTodos.map((todo) => {
              if (todo.id === action.todoId) {
                return { ...todo, completed: !todo.completed }
              }
              return todo
            })
          }
        }
        return category
      })

    case "DeleteTodo":
      return state.map((category) => {
        if (category.id === action.categoryId) {
          return {
            ...category,
            categoryTodos: category.categoryTodos.filter(
              (todo) => todo.id !== action.todoId
            )
          }
        }
        return category
      })
    case "MarkDone":
    default:
      return state
  }
}

export default function TodoFeature() {
  const { user } = useUserContext()

  const [categoryName, setCategoryName] = useState("")
  const [categoryDueDate, setCategoryDueDate] = useState("")
  const [dueDateError, setDueDateError] = useState("")
  const [canAddCategory, setCanAddCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useCustomToast()

  const [state, dispatch] = useReducer(reducer, [])
  const handleCategoryLoading = useRef(false)

  useEffect(() => {
    if (categoryName !== "" && categoryDueDate !== "" && dueDateError === "") {
      setCanAddCategory(true)
    } else {
      setCanAddCategory(false)
    }
  }, [categoryName, categoryDueDate, dueDateError])

  const updateCategoriesStatus = async (categories: CategoryType[]) => {
    if (categories.length <= 0) return

    const todayISO = new Date().toISOString().split("T")[0]

    const lastUpdate = JSON.parse(
      localStorage.getItem("isCategoriesStatusUpdated") || "{}"
    )
    if (lastUpdate.date === todayISO) {
      console.log("Categories are already updated today.")
      return
    }

    const todayDate = new Date(getTodayDate())

    const categoriesToUpdate = categories.map((category: CategoryType) => {
      return (new Date(category.dueDate) < todayDate) && category.completed!==true
        ? { ...category, completed: true }
        : category
    })

    const updatedCategories = categoriesToUpdate.filter(
      (category) => category.completed === true
    )

    if (updatedCategories.length === 0) {
      localStorage.setItem(
        "isCategoriesStatusUpdated",
        JSON.stringify({ date: todayISO })
      )
      return
    }

    try {
      await Promise.all(
        updatedCategories.map((category) => updateCategory(category.id))
      )

      localStorage.setItem(
        "isCategoriesStatusUpdated",
        JSON.stringify({ date: todayISO })
      )
    } catch (error) {
      console.error("❌ Failed to update habits in the database:", error)
    }
  }

  useEffect(() => {
    async function fetchCategories() {
      if (user !== null && !handleCategoryLoading.current) {
        setLoading(true)
        console.log("categories loading")
        const result = await getCategories(user.uid)
        if (result.success) {
          const categories = result.data
          dispatch({ type: "LoadCategories", categories })
          updateCategoriesStatus(categories)
          handleCategoryLoading.current = true
        } else {
          showToast(result.message, result.status)
        }
        setLoading(false)
      }
    }
    fetchCategories()
  }, [user])

  if (user === null) return <FullPageLoading />
  return (
    <div className="container min-h-[calc(100vh-64px)] md:px-16 pt-20 p-4 pb-4">
      <header className="flex md:flex-row gap-2 md:gap-4 md:items-center justify-between">
        <Greetings feature="todos" />
        <TodoListCategoryFeatureForm
          setCategoryName={setCategoryName}
          setCategoryDueDate={setCategoryDueDate}
          setDueDateError={setDueDateError}
          categoryName={categoryName}
          categoryDueDate={categoryDueDate}
          dueDateError={dueDateError}
          canAddCategory={canAddCategory}
          dispatch={dispatch}
        />
      </header>
      <div className="min-h-[600px] rounded-sm shadow-sm mt-4 flex flex-wrap justify-center md:justify-normal gap-4">
        {loading ? (
          <TodoCategoryCardSkeleton />
        ) : Array.isArray(state) && state.length > 0 ? (
          state.map((category: CategoryType, i) => {
            return (
              <TodoListCategoryCard
                key={i}
                category={category}
                dispatch={dispatch}
                state={state}
              />
            )
          })
        ) : (
          <p>No categories found. Add a new one!</p>
        )}
      </div>
    </div>
  )
}
