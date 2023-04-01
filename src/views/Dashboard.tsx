import moment from "moment";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  authUserState,
  draggingState,
  loadingState,
  loggedInState,
  userTasksState,
  weekState,
  weekTasksState,
} from "../store";
import { Task, TaskStatus } from "../schema/Task";
import { AddTaskArgs } from "../schema/Task";
import { addTask, getTasks } from "../services/tasks";
import { Weekday } from "../schema/Weekday";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCirclePlus,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useKeyPress } from "../hooks/useKeyPress";
import IconButton from "../components/IconButton";
import { authUser } from "../services/auth";
import { ColorRing } from "react-loader-spinner";
import DayOfWeekList from "../components/agenda-page/DayOfWeekList";
import WeekSwitcher from "../components/agenda-page/WeekSwitcher";
import { DragDropContext, Droppable, DroppableProvided, DropResult } from "@hello-pangea/dnd";
import { getTasksByDay, getTasksByNotDay } from "../domain/TaskUtils";
import { getFullWeekdayName, getWeekdayFromDay } from "../domain/WeekdayUtils";

let didInit = false;

const Dashboard = () => {
  const navigate = useNavigate();
  const [newTaskContent, setNewTaskContent] = React.useState("");
  const [newTaskDOW, setNewTaskDOW] = React.useState<Weekday>(0);
  const [creatingItem, setCreatingItem] = React.useState(false);
  const [userState, setUserState] = useRecoilState(authUserState);
  const [taskList, setTaskListState] = useRecoilState(userTasksState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const loggedIn = useRecoilValue(loggedInState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [dragging, setDragging] = useRecoilState(draggingState);
  const weekTasks = useRecoilValue(weekTasksState);
  const currentWeek = useRecoilValue(weekState);
  const getDayTasks = (dayOfWeek: Weekday) => getTasksByDay(weekTasks, moment().week(currentWeek).day(dayOfWeek));
  const getRestOfWeekTasks = (dayOfWeek: Weekday) => getTasksByNotDay(weekTasks, moment().week(currentWeek).day(dayOfWeek));

  const cookieValue = document.cookie.replace(
    /(?:(?:^|.*;\s*)authuid\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  const tryLogin = React.useCallback(async () => {
    if (!loggedIn) {
      const code = searchParams.get("code");
      if (code) {
        const newAuthUID = await authUser(code);
        if (newAuthUID) {
          document.cookie = `authuid=${newAuthUID};max-age=604800;`;
          setUserState({ authUID: newAuthUID });
          navigate("/");
        }
      } else {
        navigate("/login");
      }
    } else if (loggedIn && cookieValue !== userState!.authUID) {
      document.cookie = "authuid" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      setUserState(null);
      navigate("/login");
    }
  }, [searchParams, loggedIn, userState, cookieValue, setUserState, navigate]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    if (loggedIn) {
      const tasks = await getTasks(userState!.authUID);
      setTaskListState(tasks);
    }
    setLoading(false);
  }, [loggedIn, userState, setTaskListState]);

  React.useEffect(() => {
    if (!didInit) {
      didInit = true;
      tryLogin();
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [loggedIn]);

  // submit a new task to the server
  const submitTask = async () => {
    const newTask: Partial<Task> = {
      content: newTaskContent,
      taskStatus: TaskStatus.ToDo,
      taskDate: moment().day(newTaskDOW),
    };
    const addArgs: AddTaskArgs = {
      uid: userState!.authUID,
      taskData: newTask,
    };
    const newTaskRes = await addTask(addArgs);
    setTaskListState((prev) => [...prev, newTaskRes]);
    setNewTaskContent("");
    setNewTaskDOW(0);
    setCreatingItem(false);
  };

  const dayOfWeekComponentsList: Array<JSX.Element> = [];

  // we need to recheck userState here because
  // it's not guaranteed to be initialized
  if (userState) {
    for (let i = 0; i < 7; i++) {
      dayOfWeekComponentsList.push(
        <DayOfWeekList dayOfWeek={i} key={i} uid={userState.authUID} />
      );
    }
  }

  const onDragStart = () => {
    setDragging(true);
  };

  const onDragEnd = (result: DropResult) => {
    setDragging(false);
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceDay : Weekday = getWeekdayFromDay(result.source.droppableId);
    const destinationDay : Weekday = getWeekdayFromDay(result.destination.droppableId);

    if (sourceDay === destinationDay) {
      const dayTasks = getDayTasks(sourceDay);
      const restOfWeekTasks = getRestOfWeekTasks(sourceDay);
    
      const items = [...dayTasks];
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      console.log('dayTasks', dayTasks, 'restOfWeekTasks', restOfWeekTasks, 'items', items);
      console.log('setting', [...items, ...restOfWeekTasks])

      setTaskListState([...items, ...restOfWeekTasks]);
    } else {
      const sourceDayTasks = getDayTasks(sourceDay);
      const destinationDayTasks = getDayTasks(destinationDay);
      const restOfWeekTasks = taskList.filter(t => t.taskDate.day() !== sourceDay && t.taskDate.day() !== destinationDay);
      const reorderedItem = sourceDayTasks.splice(result.source.index, 1)[0];
      const newDate = moment().day(destinationDay);
      const updatedItem = {...reorderedItem, taskDate: newDate};
      destinationDayTasks.splice(result.destination.index, 0, updatedItem);
      setTaskListState([...destinationDayTasks, ...sourceDayTasks, ...restOfWeekTasks]);
    }
  };
  const clearCreating = () => {
    setNewTaskContent("");
    setNewTaskDOW(0);
    setCreatingItem(false);
  };

  useKeyPress(["Escape"], clearCreating);
  useKeyPress(["i"], () => setCreatingItem(true), null, true);

  return (
    <div className="h-full bg-zinc-100 dark:bg-zinc-800 rounded py-2 px-1 w-full flex flex-col">
      {!loading ? (
        <>
          <div className="flex gap-3 items-center mb-3 justify-between">
            {!creatingItem ? (
              <div
                className="flex gap-2 bg-zinc-300 dark:bg-zinc-700 cursor-pointer p-1.5 rounded shadow ml-2 items-center"
                onClick={() => setCreatingItem(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" ? setCreatingItem(true) : null
                }
                title="ctrl+i"
              >
                <FontAwesomeIcon
                  icon={faCirclePlus}
                  className="hover:text-slate-300 rounded-full"
                  size="sm"
                />
                <p className="text-sm">Create item</p>
              </div>
            ) : (
              <div className="flex items-center gap-1 ml-1">
                <input
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  value={newTaskContent}
                  className="rounded p-1 dark:bg-zinc-700 bg-white"
                  placeholder="New task content.."
                  autoFocus
                />
                <select
                  onChange={(e) => setNewTaskDOW(+e.target.value)}
                  value={newTaskDOW}
                  className="h-8 rounded dark:bg-zinc-700 bg-white"
                >
                  <option value={0}>Sunday</option>
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                </select>
                <IconButton icon={faCheckCircle} onClick={submitTask} />
                <IconButton icon={faCircleXmark} onClick={clearCreating} />
              </div>
            )}
            <WeekSwitcher />
            <div className="w-[107.406px]"></div> 
          </div>
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <div className="flex flex-1">
              {dayOfWeekComponentsList}
            </div>
          </DragDropContext>
        </>
      ) : (
        <div className="flex grow items-center justify-center">
          <ColorRing />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
