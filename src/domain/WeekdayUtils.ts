import { Weekday } from "../schema/Weekday";

export const getFullWeekdayName = (day: Weekday) : string => {
  switch (day) {
    case Weekday.Sunday:
      return "Sunday";
    case Weekday.Monday:
      return "Monday";
    case Weekday.Tuesday:
      return "Tuesday";
    case Weekday.Wednesday:
      return "Wednesday";
    case Weekday.Thursday:
      return "Thursday";
    case Weekday.Friday:
      return "Friday";
    case Weekday.Saturday:
      return "Saturday";
    default:
      return "Unknown";
  }
}

export const getWeekdayFromDay = (day: string) : Weekday => {
  switch (day) {
    case "Sun":
      return Weekday.Sunday;
    case "Mon":
      return Weekday.Monday;
    case "Tue":
      return Weekday.Tuesday;
    case "Wed":
      return Weekday.Wednesday;
    case "Thu":
      return Weekday.Thursday;
    case "Fri":
      return Weekday.Friday;
    case "Sat":
      return Weekday.Saturday;
    default:
      return Weekday.Sunday;
  }
}

export const getWeekdayName = (day: Weekday) : string => {
  switch (day) {
    case Weekday.Sunday:
      return "Sun";
    case Weekday.Monday:
      return "Mon";
    case Weekday.Tuesday:
      return "Tue";
    case Weekday.Wednesday:
      return "Wed";
    case Weekday.Thursday:
      return "Thu";
    case Weekday.Friday:
      return "Fri";
    case Weekday.Saturday:
      return "Sat";
    default:
      return "Unknown";
  }
}