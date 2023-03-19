import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  authUserState,
  loggedInState,
  userTasksState,
  weekTasksState,
} from "../store";
import { Task, TaskStatus } from "../schema/Task";
import { AddTaskArgs, DeleteTaskArgs } from "../schema/Task";
import { addTask, deleteTask, getTasks } from "../services/tasks";
import { Weekday } from "../schema/Weekday";
import { getWeekdayName } from "../domain/WeekdayUtils";
import { editTaskToServer, getTasksByDay } from "../domain/TaskUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faCirclePlus,
  faCircleXmark,
  faPencil,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useKeyPress } from "../hooks/useKeyPress";

interface TaskItemProps {
  task: Task;
  uid: string;
  canEdit?: boolean;
}

const CONTENT_DIV_BASE_CLASSNAME =
  "bg-slate-50 dark:bg-zinc-800 p-2 min-h-20 shadow";
const CONTENT_TEXT_BASE_CLASSNAME = "cursor-pointer w-fit";

const TaskItem: React.FC<TaskItemProps> = ({ task, uid, canEdit }) => {
  const [taskList, setTaskListState] = useRecoilState(userTasksState);
  const [newContent, setNewContent] = React.useState(task.content);
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    if (!canEdit) {
      setEditing(false);
      setNewContent(task.content);
    }
  }, [canEdit]);

  const handleDelete = async () => {
    const deleteArgs: DeleteTaskArgs = {
      uid,
      taskID: task.id,
    };
    await deleteTask(deleteArgs);
    setTaskListState((prev) => [...prev.filter((t) => t.id !== task.id)]);
  };

  const handleEdit = async () => {
    const updatedProps: Partial<Task> = { content: newContent };
    const updatedTask = await editTaskToServer(task, uid, updatedProps);
    if (updatedTask !== null) {
      const newListState = taskList.map((t) =>
        t.id === task.id ? updatedTask : t
      );
      setTaskListState(newListState);
      setEditing(false);
      setNewContent(updatedTask.content);
    }
  };

  const contentDivClassName = canEdit
    ? `${CONTENT_DIV_BASE_CLASSNAME} rounded-t`
    : `${CONTENT_DIV_BASE_CLASSNAME} rounded`;

  const handleClick = async () => {
    if (task.status === TaskStatus.Completed) {
      const updatedProps: Partial<Task> = { status: TaskStatus.ToDo };
      const updatedTask = await editTaskToServer(task, uid, updatedProps);
      if (updatedTask !== null) {
        const newListState = taskList.map((t) =>
          t.id === task.id ? updatedTask : t
        );
        setTaskListState(newListState);
      }
    } else if (task.status === TaskStatus.ToDo) {
      const updatedProps: Partial<Task> = { status: TaskStatus.Completed };
      const updatedTask = await editTaskToServer(task, uid, updatedProps);
      if (updatedTask !== null) {
        const newListState = taskList.map((t) =>
          t.id === task.id ? updatedTask : t
        );
        setTaskListState(newListState);
      }
    }
  };

  const contentTextClassName =
    task.status === TaskStatus.Completed
      ? `${CONTENT_TEXT_BASE_CLASSNAME} line-through`
      : CONTENT_TEXT_BASE_CLASSNAME;

  return (
    <div className="flex flex-col">
      <div className={contentDivClassName}>
        {editing ? (
          <div className="flex items-center gap-1">
            <input
              onChange={(e) => setNewContent(e.target.value)}
              value={newContent}
            />
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="cursor-pointer text-sm"
              onClick={handleEdit}
            />
          </div>
        ) : (
          <p className={contentTextClassName} onClick={handleClick}>
            {task.content}
          </p>
        )}
      </div>
      {canEdit && (
        <div className="bg-disc-light-blue rounded-b flex justify-end p-1 shadow">
          <FontAwesomeIcon
            icon={editing ? faX : faPencil}
            className="text-sm py-1 px-2 cursor-pointer"
            onClick={() => setEditing(!editing)}
          />
          <FontAwesomeIcon
            icon={faTrash}
            className="text-sm py-1 px-2 cursor-pointer"
            onClick={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

interface NewTaskFormProps {
  setAddingNewTask: React.Dispatch<React.SetStateAction<boolean>>;
  dayOfWeek: Weekday;
  uid: string;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({
  setAddingNewTask,
  dayOfWeek,
  uid,
}) => {
  const [taskList, setTaskListState] = useRecoilState(userTasksState);
  const [newContent, setNewContent] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const stopAddingTask = () => {
    setAddingNewTask(false);
    setNewContent("");
  };

  const handleSubmit = async () => {
    const newTask: Partial<Task> = {
      content: newContent,
      status: TaskStatus.ToDo,
      taskDate: moment().day(dayOfWeek),
    };
    const addArgs: AddTaskArgs = {
      uid,
      taskData: newTask,
    };
    const newTaskRes = await addTask(addArgs);
    setTaskListState((prev) => [...prev, newTaskRes]);
    stopAddingTask();
  };

  useKeyPress(["Enter"], handleSubmit);

  // focus on input when component mounts
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col">
      <div className="rounded-t bg-slate-50 dark:bg-zinc-800 p-2 min-h-20 shadow">
        <input
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          ref={inputRef}
        />
      </div>
      <div className="bg-disc-light-blue rounded-b flex justify-end p-1 shadow gap-2">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="cursor-pointer text-sm"
          onClick={stopAddingTask}
        />
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="cursor-pointer text-sm"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};
interface DayOfWeekListProps {
  dayOfWeek: Weekday;
  uid: string;
}

const DayOfWeekList: React.FC<DayOfWeekListProps> = ({ dayOfWeek, uid }) => {
  const [editingDay, setEditingDay] = React.useState(false);
  const [addingNewTask, setAddingNewTask] = React.useState(false);
  const weekTasks = useRecoilValue(weekTasksState);
  const dayTasks = getTasksByDay(weekTasks, dayOfWeek);
  const isToday = moment().day() === dayOfWeek;
  const contClassName = `w-full mr-1 first:ml-1 last:border-r-0 dark:border-x-neutral-500 bg-gray-200 dark:bg-zinc-700 ${
    isToday && "border-t-4 border-t-disc-blue"
  }`;

  const addNewClassName = addingNewTask
    ? "text-sm opacity-40"
    : "text-sm cursor-pointer"

  return (
    <div className={contClassName}>
      <div
        className={`flex justify-between items-center bg-zinc-300 dark:bg-disc-dark-4 p-1 ${
          !isToday && "pt-2"
        }`}
      >
        <h2 className="text-lg ml-1 font-bold">{getWeekdayName(dayOfWeek)}</h2>
        <div className="flex gap-3 mr-1">
          <FontAwesomeIcon
            icon={faCirclePlus}
            className={addNewClassName}
            onClick={!addingNewTask ? () => setAddingNewTask(true) : undefined}
          />
          <FontAwesomeIcon
            icon={editingDay ? faChevronUp : faChevronDown}
            onClick={() => setEditingDay(!editingDay)}
            className="text-sm cursor-pointer"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-1 p-1">
        {dayTasks.map((t, ind) => (
          <TaskItem task={t} uid={uid} key={ind} canEdit={editingDay} />
        ))}
        {addingNewTask && (
          <NewTaskForm
            setAddingNewTask={setAddingNewTask}
            dayOfWeek={dayOfWeek}
            uid={uid}
          />
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [newTaskContent, setNewTaskContent] = React.useState("");
  const [newTaskDOW, setNewTaskDOW] = React.useState<Weekday>(0);
  const [creatingItem, setCreatingItem] = React.useState(false);
  const [userState, setUserState] = useRecoilState(authUserState);
  const [_, setTaskListState] = useRecoilState(userTasksState);
  const loggedIn = useRecoilValue(loggedInState);

  const cookieValue = document.cookie.replace(
    /(?:(?:^|.*;\s*)authuid\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  // check if the user has authuid cookie. if so, initialize userState with it.
  // otherwise, redirect to login
  React.useEffect(() => {
    setUserState(
      cookieValue === "" ? null : { ...userState, authUID: cookieValue }
    );
    if (cookieValue === "") {
      setUserState(null);
      navigate("/login");
    } else {
      setUserState({ authUID: cookieValue });
    }
  }, [cookieValue]);

  // if a user is authenticated, initialize their tasks into atomic state
  React.useEffect(() => {
    const fetchData = async () => {
      if (loggedIn) {
        const tasks = await getTasks(userState!.authUID);
        setTaskListState(tasks);
      }
    };
    fetchData();
  }, [loggedIn]);

  // submit a new task to the server
  const submitTask = async () => {
    const newTask: Partial<Task> = {
      content: newTaskContent,
      status: TaskStatus.ToDo,
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

  const dayOfWeekComponentsList = [];

  // we need to recheck userState here because
  // it's not guaranteed to be initialized
  if (userState) {
    for (let i = 0; i < 7; i++) {
      dayOfWeekComponentsList.push(
        <DayOfWeekList dayOfWeek={i} key={i} uid={userState!.authUID} />
      );
    }
  }

  const clearCreating = () => {
    setNewTaskContent("");
    setNewTaskDOW(0);
    setCreatingItem(false);
  };

  return (
    <div className="h-full bg-zinc-100 dark:bg-zinc-800 rounded py-2 px-1 w-full flex flex-col">
      <div className="flex gap-3 items-center mb-3">
        {!creatingItem ? (
          <div
            className="flex gap-2 bg-zinc-300 dark:bg-zinc-700 cursor-pointer p-1.5 rounded ml-2 items-center"
            onClick={() => setCreatingItem(true)}
          >
            <FontAwesomeIcon
              icon={faCirclePlus}
              className="hover:text-slate-300 rounded-full"
            />
            <p className="text-sm">Create item</p>
          </div>
        ) : (
          <div className="flex items-center gap-1 ml-1">
            <input
              onChange={(e) => setNewTaskContent(e.target.value)}
              value={newTaskContent}
              className="rounded p-1"
              placeholder="New task content.."
            />
            <select
              onChange={(e) => setNewTaskDOW(+e.target.value)}
              value={newTaskDOW}
              className="h-8 rounded"
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
            </select>
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="mx-2 cursor-pointer"
              onClick={submitTask}
            />
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="cursor-pointer"
              onClick={clearCreating}
            />
          </div>
        )}
      </div>
      <div className="flex flex-1">{dayOfWeekComponentsList}</div>
    </div>
  );
};

export default Dashboard;
