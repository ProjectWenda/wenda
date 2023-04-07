import { FC, useEffect, useState } from "react";
import { Calendar as ReactCalendar, dateFnsLocalizer, Event } from "react-big-calendar";
import withDragAndDrop, { withDragAndDropProps } from "react-big-calendar/lib/addons/dragAndDrop";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import addHours from "date-fns/addHours";
import startOfHour from "date-fns/startOfHour";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authUserState, combinedTasksState, tasksState } from "../store";
import { getTasks } from "../services/tasks";
import { ColorRing } from "react-loader-spinner";

const Calendar: FC = () => {
  const auth = useRecoilValue(authUserState);
  const setTaskDays = useSetRecoilState(tasksState);
  const tasks = useRecoilValue(combinedTasksState);
  const [events, setEvents] = useState<Event[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (auth?.authUID) {
      const fetchData = async () => {
        const data = await getTasks(auth.authUID);
        setTaskDays(data);
        setFetching(false);
      };
      fetchData();
    }
  }, [auth]);

  useEffect(() => {
    setEvents(
      tasks.map((task) => ({
        title: task.content,
        start: task.taskDate.toDate(),
        end: task.taskDate.toDate(),
      }))
    );
  }, [tasks]);

  const onEventResize: withDragAndDropProps["onEventResize"] = (data) => {
    const { start, end } = data;

    setEvents((currentEvents) => {
      const firstEvent = {
        start: new Date(start),
        end: new Date(end),
      };
      return [...currentEvents, firstEvent];
    });
  };

  const onEventDrop: withDragAndDropProps["onEventDrop"] = (data) => {
    console.log(data);
  };

  return !fetching ? (
    <DnDCalendar
      defaultView="month"
      events={events}
      className="flex-1 max-w-[1250px] border-none rounded-lg"
      localizer={localizer}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      views={{ month: true }}
      resizable
    />
  ) : (
    <ColorRing />
  );
};

const locales = {
  "en-US": enUS,
};
const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1);
const now = new Date();
const start = endOfHour(now);
const end = addHours(start, 2);
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(ReactCalendar);

export default Calendar;
