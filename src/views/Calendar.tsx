import { FC, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authUserState, combinedTasksState, tasksState } from "../store";
import { getTasks } from "../services/tasks";
import { ColorRing } from "react-loader-spinner";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ClassNamesGenerator, DayCellContentArg } from "@fullcalendar/core";

type Event = {
  title: string;
  date: string;
  id: string;
};

const Calendar: FC = () => {
  const auth = useRecoilValue(authUserState);
  const setTaskDays = useSetRecoilState(tasksState);
  const tasks = useRecoilValue(combinedTasksState);
  const [events, setEvents] = useState<Event[]>([]);
  const [fetching, setFetching] = useState(true);
  const [date, setDate] = useState(new Date());

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
        date: task.taskDate.format("YYYY-MM-DD"),
        id: task.taskID,
      }))
    );
  }, [tasks]);

  const generateDayCellClassNames: ClassNamesGenerator<DayCellContentArg> = (args: {
    date: Date;
    dayNumberText: string;
    isPast: boolean;
    isFuture: boolean;
    isToday: boolean;
    isOther: boolean;
  }) => {
    if (args.isOther) {
      return "bg-gray-200 dark:bg-zinc-700";
    }
    return "";
  };

  return !fetching ? (
    <div className="w-5/6">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="100%"
        events={events}
        eventClick={(e) => console.log(e.event, e.event.id, e.event.title)}
        dayCellClassNames={generateDayCellClassNames}
      />
    </div>
  ) : (
    <ColorRing />
  );
};

export default Calendar;
