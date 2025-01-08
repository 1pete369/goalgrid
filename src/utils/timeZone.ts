import * as ctz from "countries-and-timezones"


export function getTimeZoneAndCountryCode() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the user's timezone
    // console.log("timezone", timezone);
    
    const timezoneData = ctz.getTimezone(timezone); // Get timezone data from the library
    // console.log("timezoneData", timezoneData);
  
    const data = { timezone: "", countryCode: "" }; // Initializing data object
  
    if (timezoneData && timezoneData.countries.length > 0) {
      data.timezone = timezone; // Set the timezone
      data.countryCode = timezoneData.countries[0]; // Set the country code based on the timezone
    } else {
      data.timezone = timezone
      data.countryCode = "US"; // Default to US if no country is found
    }
    return data; // Return the object with timezone and country code
  }
  
getTimeZoneAndCountryCode()