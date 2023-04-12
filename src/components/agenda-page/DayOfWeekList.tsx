import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import React from "react";
import { Droppable, DroppableProvided } from "@hello-pangea/dnd";
import { useRecoilValue } from "recoil";
import { getTasksByDate } from "../../domain/TaskUtils";
import { getWeekdayName } from "../../domain/WeekdayUtils";
import { Weekday } from "../../schema/Weekday";
import { draggingState, tasksState, weekState } from "../../store";
import IconButton from "../IconButton";
import NewTaskForm from "./NewTaskForm";
import NewTaskPrompt from "./NewTaskPrompt";
import TaskItem from "./TaskItem";
import { Typography } from "antd";

interface DayOfWeekListProps {
  dayOfWeek: Weekday;
  uid: string;
}

const DayOfWeekList: React.FC<DayOfWeekListProps> = ({ dayOfWeek, uid }) => {
  const [addingNewTask, setAddingNewTask] = React.useState(false);
  const week = useRecoilValue(weekState);
  const dayTasks = useRecoilValue(tasksState);
  const dragging = useRecoilValue(draggingState);

  const date = React.useMemo(() => moment().week(week).day(dayOfWeek), [week, dayOfWeek]);

  const dayOfWeekTasks = React.useMemo(() => getTasksByDate(dayTasks, date), [dayTasks, date]);

  const isToday = React.useMemo(() => moment().isSame(date, "date"), [date]);

  const contClassName = React.useMemo(
    () => `group w-full bg-gray-200 dark:bg-zinc-700 ${isToday && "border-t-4 border-t-disc-blue"}`,
    [isToday]
  );

  const dayOfMonthString = React.useMemo(() => {
    return `, ${date.format("MMM. DD")}`;
  }, [date]);

  return (
    <div className={contClassName}>
      <div
        className={`flex justify-between items-center bg-zinc-300 dark:bg-disc-dark-4 p-1 ${
          !isToday && "pt-2"
        }`}
      >
        <div className="text-lg flex gap-0">
          <Typography.Text className="ml-1 font-bold">{getWeekdayName(dayOfWeek)}</Typography.Text>
          <Typography.Text>{dayOfMonthString}</Typography.Text>
        </div>
        <div className="flex gap-3 mr-1">
          <IconButton
            icon={faCirclePlus}
            size="sm"
            disabled={addingNewTask}
            onClick={!addingNewTask ? () => setAddingNewTask(true) : undefined}
          />
        </div>
      </div>
      <Droppable droppableId={getWeekdayName(dayOfWeek)} type="COLUMN">
        {(droppableProvided: DroppableProvided) => (
          <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
            <div className="flex flex-col mt-2">
              {dayOfWeekTasks.map((t, index) => (
                <TaskItem task={t} index={index} uid={uid} key={t.taskID} />
              ))}
            </div>

            {addingNewTask ? (
              <NewTaskForm setAddingNewTask={setAddingNewTask} dayOfWeek={dayOfWeek} uid={uid} />
            ) : !dragging ? (
              <NewTaskPrompt
                className="group-hover:visible invisible group-hover:animate-in group-hover:duration-300 group-hover:fade-in mx-1"
                setAddingNewTask={setAddingNewTask}
              />
            ) : null}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DayOfWeekList;
