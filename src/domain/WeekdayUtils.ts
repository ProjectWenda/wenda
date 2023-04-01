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
  console.log(day);
  switch (day) {
    case "Sunday":
      return Weekday.Sunday;
    case "Monday":
      return Weekday.Monday;
    case "Tuesday":
      return Weekday.Tuesday;
    case "Wednesday":
      return Weekday.Wednesday;
    case "Thursday":
      return Weekday.Thursday;
    case "Friday":
      return Weekday.Friday;
    case "Saturday":
      return Weekday.Saturday;
    default:
      return Weekday.Sunday;
  }
}

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