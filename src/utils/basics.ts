import * as ctz from "countries-and-timezones"
import { format } from "date-fns"

export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput

  const dateCreated = format(date, "MMM dd, yyyy")

  return dateCreated
}

export const subtractOneDay = (dateString: string) => {
  const date = new Date(dateString)
  date.setDate(date.getDate() - 1) // Subtract 1 day
  return date.toISOString().split("T")[0] // Format as YYYY-MM-DD
}


export function getTodayDate() {
  const todayDate = format(new Date(), 'yyyy-MM-dd');
  return todayDate;
}

export const getEndDate = (startDate: string, duration: string): string => {
  const start = new Date(startDate);
  const durationNumber = parseInt(duration, 10); // Convert string to number

  if (isNaN(durationNumber)) {
    throw new Error("Invalid duration: Must be a number in string format");
  }

  const end = new Date(start);
  end.setDate(start.getDate() + durationNumber); // Include the last active day

  return end.toISOString().split("T")[0]; // Format: YYYY-MM-DD
};



export const getYesterdayDate = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().split("T")[0]
}

export const getLastCompletedDate = (
  dailyTracking: Record<string, boolean>
) => {
  const completedDates = Object.keys(dailyTracking)
    .filter((date) => dailyTracking[date])
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort in descending order

  return completedDates[0] || null // Return the latest date, or null if none exist
}

export function formatDateOnDuration(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput

  const dateCreated = format(date, "MMM dd")
  return dateCreated
}

export function getTimeZoneAndCountryCode() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone // Get the user's timezone
  console.log("timezone", timezone)

  const timezoneData = ctz.getTimezone(timezone) // Get timezone data from the library
  console.log("timezoneData", timezoneData)

  const data = { timezone: "", countryCode: "" } // Initializing data object

  if (timezoneData && timezoneData.countries.length > 0) {
    data.timezone = timezone // Set the timezone
    data.countryCode = timezoneData.countries[0] // Set the country code based on the timezone
  } else {
    data.timezone = timezone
    data.countryCode = "US" // Default to US if no country is found
  }

  return data // Return the object with timezone and country code
}
