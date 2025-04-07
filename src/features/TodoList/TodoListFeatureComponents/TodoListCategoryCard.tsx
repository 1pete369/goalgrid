import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { useCustomToast } from "@/hooks/useCustomToast"
import { Action, CategoryType, Todo } from "@/types/todoFeatureTypes"
import { getTodayDate } from "@/utils/basics"
import { deleteCategory } from "@/utils/categories"
import { deleteTodo, postTodo, toggleTodo } from "@/utils/categoryTodo"
import { formatDueDate } from "@/utils/validators/todoValidators"
import { ArrowUp, Calendar, Loader2, Trash2, X } from "lucide-react"
import {
  ActionDispatch,
  useState
} from "react"

type TodoListCategoryCardPropsType = {
  category: CategoryType
  // handleDeleteCategory : (categoryId: string) => Promise<void>
  dispatch: ActionDispatch<[action: Action]>
  state: CategoryType[]
}

export default function TodoListCategoryCard({
  category,
  dispatch,
  state
}: TodoListCategoryCardPropsType) {
  const { user } = useUserContext()
  const { showToast } = useCustomToast()
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false) // Track whether the dialog is open

  // const [todoNames, setTodoNames] = useState<{ [key: string]: string }>({})

  const [todoNames, setTodoNames] = useState<{ [key: string]: string }>(
    category.categoryTodos.reduce((acc, todo) => {
      acc[todo.id] = ""
      return acc
    }, {} as { [key: string]: string })
  )

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

  const handleTodoNameChange = (categoryId: string, value: string) => {
    setTodoNames((prev) => ({
      ...prev,
      [categoryId]: value // Update only the todoName for the specific category
    }))
  }

  const handleDeleteCategory = async (categoryId: string) => {
    setLoading(true)
    // const updatedState = state.filter((category) => category.id !== categoryId)
    const result = await deleteCategory(categoryId)
    if (result.success) {
      showToast("Category Deleted", 200)
      dispatch({ type: "DeleteCategory", categoryId })
    } else {
      showToast(result.message, result.status)
    }
    setLoading(false)
    setIsDialogOpen(false) // Close the dialog once done
  }

  function getDeadlineColor(deadline: string): string {
    const today = new Date()
    const dueDate = new Date(deadline)

    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)

    const timeDiff = dueDate.getTime() - today.getTime()
    const daysRemaining = timeDiff / (1000 * 60 * 60 * 24)

    if (daysRemaining < 0) {
      return "text-red-500 dark:text-red-300"
    } else if (daysRemaining <= 3) {
      return "text-orange-500 dark:text-orange-300"
    } else {
      return "text-gray-600 dark:text-gray-400"
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

  const handleAddTodo = async (categoryId: string) => {
    if (user !== null) {
      const todoName = (todoNames[categoryId] || "").trim() // Ensure it's always a string
      if (!todoName) return // Prevent adding empty todos

      const uid = user.uid
      const newTodo: Todo = createTodo(todoName, uid, categoryId)
      dispatch({ type: "AddTodo", todo: newTodo, categoryId })

      setTodoNames((prev) => ({
        ...prev,
        [categoryId]: "" // Reset input field after adding
      }))

      await postTodo(newTodo, user?.uid, categoryId)
    }
  }

  return (
    <Card
      className={`max-h-[350px] w-[240px] bg-[${category.categoryColor}] rounded-sm border-[1px] border-black p-4 text-black`}
      key={category.id}
      style={{ backgroundColor: category.categoryColor }}
    >
      <header className="flex justify-between items-center p-0">
        <div
          className={`font-semibold text-base w-full truncate  ${
            category.completed && "line-through"
          }`}
        >
          {category.name}
        </div>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {" "}
          {/* Control dialog open state */}
          <AlertDialogTrigger>
            <Trash2 size={14} className="text-black " />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the{" "}
                <span className="font-semibold inline-block text-black">
                  category
                </span>{" "}
                and all the todos in it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                onClick={() => handleDeleteCategory(category.id)}
                disabled={loading} // Disable the button while loading
              >
                {loading ? (
                  <span className="flex gap-1 items-center">
                    Deleting <Loader2 className="animate-spin" />
                  </span>
                ) : (
                  "Continue"
                )}{" "}
                {/* Show loading text */}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>
      <section className="flex gap-2 items-center border-b border-neutral-600 pb-2">
        <Calendar className="text-slate-700" size={14} />
        <span className={` text-xs ${getDeadlineColor(category.dueDate)}`}>
          {formatDueDate(category.dueDate)}
        </span>
      </section>
      <main className="flex flex-col gap-1 pt-2 select-none overflow-y-auto h-[200px] scroll-smooth">
        {category.categoryTodos.length > 0 ? (
          category.categoryTodos.map((todo) => {
            return (
              <div
                className="flex items-center justify-between hover:bg-black/5 rounded-md"
                key={todo.id}
              >
                <div className="flex items-center space-x-2 w-full ">
                  <Checkbox
                    id={todo.id}
                    onCheckedChange={() => handleToggleTodo(category.id, todo)}
                    checked={todo.completed}
                    className=" dark:border-black"
                    disabled={category.completed}
                  />
                  <label
                  
                    htmlFor={todo.id}
                    className={` w-full break-all text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      todo.completed && " line-through"
                    }`}
                  >
                    {todo.name}
                  </label>
                </div>
                <Button
                disabled={category.completed}
                  className="bg-transparent text-black hover:bg-transparent shadow-none w-1 h-auto"
                  onClickCapture={() => handleDeleteTodo(category.id, todo.id)}
                >
                  <X />
                </Button>
              </div>
            )
          })
        ) : (
          <p className="text-sm">No Todos yet!</p>
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
            onChange={(e) => handleTodoNameChange(category.id, e.target.value)}
            disabled={category.completed}
          />
          <Button type="submit" className="w-1 h-auto"  disabled={category.completed}>
            <ArrowUp />
          </Button>
        </form>
      </footer>
    </Card>
  )
}
