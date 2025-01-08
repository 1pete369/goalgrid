"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ArrowUp, Calendar, Plus, Trash2, X } from "lucide-react"
import { ChangeEvent, useEffect, useReducer, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Action, CategoryType, Todo } from "@/types/todoFeatureTypes"
import { getTodayDate } from "@/utils/basics"
import {
  createCategory,
  DeleteCategory,
  getCategories
} from "@/utils/categories"
import { deleteTodo, postTodo, toggleTodo } from "@/utils/categoryTodo"
import {
  formatDueDate,
  validateTodoCategoryDueDate
} from "@/utils/validators/todoValidators"

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
      case "MarkDone" : 
    default:
      return state
  }
}

const createTodo = (name: string, uid: string, categoryId: string): Todo => {
  const todo: Todo = {
    id: crypto.randomUUID(),
    uid: uid,
    name: name,
    completed: false,
    createdAt: getTodayDate(),
    categoryId: categoryId
  }
  return todo
}

export default function TodoFeature() {

  const { user } = useUserContext()

  const [categoryName, setCategoryName] = useState("")
  const [categoryDueDate, setCategoryDueDate] = useState("")
  const [dueDateError, setDueDateError] = useState("")
  const [canAddCategory, setCanAddCategory] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [listColor, setListColor] = useState("#e5ffe6")

  const [todoNames, setTodoNames] = useState<{ [key: string]: string }>({})

  const [state, dispatch] = useReducer(reducer, [])

  useEffect(() => {
    if (categoryName !== "" && categoryDueDate !== "" && dueDateError === "") {
      setCanAddCategory(true)
    } else {
      setCanAddCategory(false)
    }
  }, [categoryName, categoryDueDate])

  useEffect(() => {
    async function fetchCategories() {
      if(user!==null){
        const categories = await getCategories(user.uid)
        dispatch({ type: "LoadCategories", categories })
      }
    }
    fetchCategories()
  }, [user])

  const handleAddTodo = async (categoryId: string) => {
    if (user !== null) {
      const todoName = todoNames[categoryId].trim()
      if (todoName === "") return
      const uid = user.uid
      const newTodo: Todo = createTodo(todoName, uid, categoryId)
      dispatch({ type: "AddTodo", todo: newTodo, categoryId: categoryId })

      await postTodo(newTodo, user?.uid, categoryId)

      setTodoNames((prev) => ({
        ...prev,
        [categoryId]: ""
      }))
    }
  }

  const handleToggleTodo = async (categoryId: string, todo: Todo) => {
    console.log("Toggle Todo - categoryId:", categoryId, "todoId:", todo.id)
    dispatch({ type: "CheckTodo", todoId: todo.id, categoryId })

    const { completed } = todo
    const status = completed === true ? false : true

    await toggleTodo(categoryId, todo.id, status)
  }

  const handleDeleteTodo = async (categoryId: string, todoId: string) => {
    dispatch({ type: "DeleteTodo", categoryId, todoId })
    await deleteTodo(todoId, categoryId)
  }

  const handleCategoryName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newcategoryName = e.target.value.trim()
    setCategoryName(newcategoryName)
  }

  const handleCategoryDueDate = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newdueDate = e.target.value
    console.log("date changed", newdueDate)
    setCategoryDueDate(newdueDate)
    const error = validateTodoCategoryDueDate(newdueDate)
    if (error !== "") {
      setDueDateError(error)
    } else {
      setDueDateError(error)
    }
  }

  const handleAddNewCategory = async () => {
    if (user !== null) {
      if (categoryName.trim() === "") return
      const categoryObject: CategoryType = {
        id: crypto.randomUUID(),
        uid: user?.uid,
        name: categoryName,
        createdAt: getTodayDate(),
        dueDate: categoryDueDate,
        categoryTodos: [],
        categoryColor: listColor,
        completed : false
      }
      dispatch({ type: "AddCategory", category: categoryObject })
      await createCategory(categoryObject)
      setCategoryName("")
      setCategoryDueDate("")
      setIsDialogOpen(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const updatedState = state.filter((category) => category.id !== categoryId)
    dispatch({ type: "DeleteCategory", categoryId })
    await DeleteCategory(categoryId)
  }

  const handleColorChange = (value: string) => {
    setListColor(value)
  }

  const handleTodayDate = () => {
    const todayDate = getTodayDate()
    setCategoryDueDate(todayDate)
  }

  const handleTodoNameChange = (categoryId: string, value: string) => {
    setTodoNames((prev) => ({
      ...prev,
      [categoryId]: value // Update only the todoName for the specific category
    }))
  }

  if (user === null) return <div className="h-screen w-full flex justify-center items-center"><p className="">Loading...</p></div>

  return (
    <div className="container min-h-[cal(100vh)] md:px-24 p-4 pt-6 min-w-full">
      <header className="text-4xl font-semibold my-3">
        Hello, {user?.personalInfo.name.split(" ")[0]}!
        <p className="text-lg text-neutral-500">Create Todos here!</p>
      </header>
      <section>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold text-lg">
              <Plus />
              Add new List!
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new Category!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col">
              <div className="">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  onChange={(e) => handleCategoryName(e)}
                />
              </div>
              <div className="">
                <Label htmlFor="due-date" className="text-right">
                  Due Date
                </Label>
                <div className="flex gap-4">
                  <Input
                    id="due-date"
                    type="date"
                    className="col-span-3"
                    onChange={(e) => handleCategoryDueDate(e)}
                    value={categoryDueDate}
                  />
                  <Button
                    className="bg-black/5 text-black hover:bg-black/10"
                    onClick={handleTodayDate}
                  >
                    Today
                  </Button>
                </div>
                {dueDateError !== "" && (
                  <p className="text-error text-sm">{dueDateError}</p>
                )}
              </div>
              <div className="mt-4">
                <RadioGroup
                  value={listColor}
                  onValueChange={handleColorChange}
                  className="flex gap-4"
                >
                  <div className="flex items-center">
                    <RadioGroupItem
                      id="#e5ffe6"
                      value="#e5ffe6"
                      className=" hidden"
                    />
                    <label
                      htmlFor="#e5ffe6"
                      className={`h-6 w-6 cursor-pointer rounded-sm bg-[#e5ffe6] ${
                        listColor === "#e5ffe6" && "border-2 border-black"
                      }`}
                    ></label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem
                      id="#fff6e7"
                      value="#fff6e7"
                      className=" hidden"
                    />
                    <label
                      htmlFor="#fff6e7"
                      className={`h-6 w-6 cursor-pointer rounded-sm bg-[#fff6e7] ${
                        listColor === "#fff6e7" && "border-2 border-black"
                      }`}
                    ></label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem
                      id="#f3e4f7"
                      value="#f3e4f7"
                      className=" hidden"
                    />
                    <label
                      htmlFor="#f3e4f7"
                      className={`h-6 w-6 cursor-pointer rounded-sm bg-[#f3e4f7] ${
                        listColor === "#f3e4f7" && "border-2 border-black"
                      }`}
                    ></label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem
                      id="#edbbb4"
                      value="#edbbb4"
                      className=" hidden"
                    />
                    <label
                      htmlFor="#edbbb4"
                      className={`h-6 w-6 cursor-pointer rounded-sm bg-[#edbbb4] ${
                        listColor === "#edbbb4" && "border-2 border-black"
                      }`}
                    ></label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem
                      id="#ececec"
                      value="#ececec"
                      className=" hidden"
                    />
                    <label
                      htmlFor="#ececec"
                      className={`h-6 w-6 cursor-pointer rounded-sm bg-[#ececec] ${
                        listColor === "#ececec" && "border-2 border-black"
                      }`}
                    ></label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={!canAddCategory}
                type="submit"
                className="w-[200px] mx-auto"
                onClick={handleAddNewCategory}
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
      <div className="min-h-[600px] rounded-sm shadow-sm mt-4 flex flex-wrap justify-center md:justify-normal gap-4">
        {Array.isArray(state) && state.length > 0 ? (
          state.map((category: CategoryType) => {
            return (
              <div
                className={`w-[250px] max-h-[350px] bg-[${category.categoryColor}] rounded-sm border-[1px] border-black p-4`}
                key={category.id}
              >
                <header className="flex justify-between items-center p-0">
                  <div className="font-semibold text-lg">{category.name}</div>
                  <Button
                    className="bg-transparent shadow-none hover:bg-transparent w-1 h-auto"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="text-neutral-500" />
                  </Button>
                </header>
                <section className="flex gap-2 items-center border-b border-neutral-600 pb-2">
                  <Calendar className="text-neutral-500" size={14} />
                  <p className="text-neutral-600 text-sm">
                    {formatDueDate(category.dueDate)}
                  </p>
                </section>
                <main className="flex flex-col gap-1 pt-2 select-none overflow-y-auto h-[200px] scroll-smooth">
                  {category.categoryTodos.length > 0 ? (
                    category.categoryTodos.map((todo) => {
                      return (
                        <div
                          className="flex items-center justify-between hover:bg-black/5 rounded-md"
                          key={todo.id}
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={todo.id}

                              onCheckedChange={() =>
                                handleToggleTodo(category.id, todo)
                              }
                              checked={todo.completed}
                            />
                            <label
                              htmlFor={todo.id}
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                todo.completed && " line-through"
                              }`}
                            >
                              {todo.name}
                            </label>
                          </div>
                          <Button
                            className="bg-transparent text-black hover:bg-transparent shadow-none w-1 h-auto"
                            onClickCapture={() =>
                              handleDeleteTodo(category.id, todo.id)
                            }
                          >
                            <X />
                          </Button>
                        </div>
                      )
                    })
                  ) : (
                    <p>No Todos yet!</p>
                  )}
                </main>
                <footer>
                  <form
                    action=""
                    onSubmit={(e) => {
                      e.preventDefault() // Prevent the default form submission behavior
                      handleAddTodo(category.id) // Pass event and category.id
                    }}
                    className="mt-4 flex items-center gap-2"
                  >
                    <Input
                      className=" bg-white shadow-none"
                      value={todoNames[category.id] || ""}
                      onChange={(e) =>
                        handleTodoNameChange(category.id, e.target.value)
                      }
                    />
                    <Button type="submit" className="w-1 h-auto">
                      <ArrowUp />
                    </Button>
                  </form>
                </footer>
              </div>
            )
          })
        ) : (
          <p>No categories found. Add a new one!</p>
        )}
      </div>
    </div>
  )
}
