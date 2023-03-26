import { Weekday } from "../schema/Weekday";

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