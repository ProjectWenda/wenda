import { Weekday } from "../schema/Weekday";

export const getWeekdayName = (day: Weekday) : string => {
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