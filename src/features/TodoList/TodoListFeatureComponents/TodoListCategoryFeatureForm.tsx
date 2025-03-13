import React, {
  ActionDispatch,
  ChangeEvent,
  SetStateAction,
  useState
} from "react"

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
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { validateTodoCategoryDueDate } from "@/utils/validators/todoValidators"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Action, CategoryType } from "@/types/todoFeatureTypes"
import { getTodayDate } from "@/utils/basics"
import { createCategory } from "@/utils/categories"
import MainAddButton from "@/AppComponents/MainAddButton"
import { delay } from "@/utils/delay"
import { useCustomToast } from "@/hooks/useCustomToast"
import { getResourceCount } from "@/utils/resource-limits"

type TodoListFeatureFormPropsType = {
  setCategoryName: React.Dispatch<SetStateAction<string>>
  setCategoryDueDate: React.Dispatch<SetStateAction<string>>
  setDueDateError: React.Dispatch<SetStateAction<string>>
  categoryName: string
  categoryDueDate: string
  dueDateError: string
  canAddCategory: boolean
  dispatch: ActionDispatch<[action: Action]>
}

export default function TodoListCategoryFeatureForm({
  setCategoryName,
  setCategoryDueDate,
  setDueDateError,
  categoryName,
  categoryDueDate,
  dueDateError,
  canAddCategory,
  dispatch
}: TodoListFeatureFormPropsType) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [listColor, setListColor] = useState("#e5ffe6")
  const [loading, setLoading] = useState(false)
  const { showToast } = useCustomToast()

  const { user } = useUserContext()

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
      setLoading(true)
      const resourceResult = await getResourceCount(
        user?.uid as string,
        "categories"
      )
      if (resourceResult.success) {
        if (categoryName.trim() === "") return
        const categoryObject: CategoryType = {
          id: crypto.randomUUID(),
          uid: user?.uid,
          name: categoryName,
          createdAt: getTodayDate(),
          dueDate: categoryDueDate,
          categoryTodos: [],
          categoryColor: listColor,
          completed: false
        }
        dispatch({ type: "AddCategory", category: categoryObject })
        const result = await createCategory(categoryObject)
        if (result.success) {
          showToast("Category created!", 200)
        } else {
          showToast(result.message, result.status)
        }
      } else {
        showToast("Limit Reached. upgrate plan!", resourceResult.status)
      }
      setCategoryName("")
      setCategoryDueDate("")
      setLoading(false)
      setIsDialogOpen(false)
    }
  }

  const handleColorChange = (value: string) => {
    setListColor(value)
  }

  const handleTodayDate = () => {
    const todayDate = getTodayDate()
    setCategoryDueDate(todayDate)
    setDueDateError("")
  }

  return (
    <section>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="font-semibold text-base flex items-center">
            <Plus />
            Add
            <p className="hidden md:flex">new Category!</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-4">
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
                <Button className="" onClick={handleTodayDate}>
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
                className="flex gap-4 flex-wrap justify-between"
              >
                {[
                  { color: "#ffebee", border: "border-red-600" }, // Soft Pinkish Red
                  { color: "#fce4ec", border: "border-pink-600" }, // Pastel Pink
                  { color: "#e3f2fd", border: "border-blue-600" }, // Light Sky Blue
                  { color: "#e8f5e9", border: "border-green-600" }, // Soft Mint Green
                  { color: "#fff3e0", border: "border-orange-600" }, // Light Orange
                  { color: "#ede7f6", border: "border-purple-600" }, // Light Lavender
                  { color: "#ffccbc", border: "border-red-500" }, // Warm Peach
                  { color: "#f0f4c3", border: "border-yellow-600" }, // Soft Yellow-Green
                  { color: "#cfd8dc", border: "border-gray-600" } // Neutral Gray
                ].map(({ color, border }) => (
                  <div key={color} className="flex items-center">
                    <RadioGroupItem
                      id={color}
                      value={color}
                      className="hidden"
                    />
                    <label
                      htmlFor={color}
                      className={`h-6 w-6 cursor-pointer rounded-md transition-all duration-300
            ${
              listColor === color
                ? `border-2 ${border} scale-110 shadow-lg`
                : "border border-gray-400 dark:border-gray-600"
            }
          `}
                      style={{ backgroundColor: color }} // ✅ This fixes the issue!
                    ></label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={!canAddCategory || loading}
              type="submit"
              className="w-[200px] mx-auto"
              onClick={handleAddNewCategory}
            >
              {loading ? (
                <p className="flex gap-1 items-center">
                  Adding <Loader2 className="animate-spin" />
                </p>
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
