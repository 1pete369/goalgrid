import { isToday, isTomorrow, format } from 'date-fns';


export function validateTodoCategoryDueDate(dueDate: string) {
  const today = new Date()

  const [selectedYear, selectedMonth, selectedDay] = dueDate.split("-").map(Number)

  const [minYear, minMonth, minDay] = [
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  ]

  console.log(minYear,minMonth,minDay)
  console.log("dueDate",dueDate)


  if (selectedYear>minYear || (selectedYear===minYear && selectedMonth>minMonth) ||(selectedYear === minYear && selectedMonth === minMonth && selectedDay >= minDay)) {
    return ""
  }
  return "Due Date must be today or after!"
}


export const formatDueDate = (dueDate : string) => {
  const due = new Date(dueDate);

  if (isToday(due)) {
    return "Today";
  } else if (isTomorrow(due)) {
    return "Tomorrow";
  } else {
    return format(due, 'MMM dd, yyyy'); // e.g., Dec 18
  }
};