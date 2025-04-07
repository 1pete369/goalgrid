export type CategoryType = {
  uid: string
  name: string
  id: string
  dueDate: string
  categoryTodos: Todo[]
  categoryColor: string
  createdAt: string
  completed : boolean
} 

export type Todo = {
  id: string
  uid: string
  name: string
  completed: boolean
  createdAt: string
  categoryId: string
  // status: "completed" | "pending" | "overdue"
}

export type FetchedTodo = {
  _id: string
  id: string
  uid: string
  date: string
  name: string
  completed: boolean
  createdAt: string
  // status: string
  __v: number
}

type AddCategory = {
  type: "AddCategory"
  category: CategoryType
}

type DeleteCategory = {
  type: "DeleteCategory"
  categoryId: string
}

type LoadCategories = {
  type: "LoadCategories"
  categories: CategoryType[]
}

type MarkDone = {
  type: "MarkDone"
  categoryId: string
}

type AddTodo = {
  type: "AddTodo"
  todo: Todo
  categoryId: string
}

type LoadTodos = {
  type: "LoadTodos"
  todos: FetchedTodo[]
}

type CheckTodo = {
  type: "CheckTodo"
  todoId: string
  categoryId: string
}

type DeleteTodo = {
  type: "DeleteTodo"
  todoId: string
  categoryId: string
}

export type Action =
  | AddTodo
  | CheckTodo
  | DeleteTodo
  | LoadTodos
  | AddCategory
  | DeleteCategory
  | LoadCategories
  | MarkDone
