import moment from "moment";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  authUserState,
  loadingState,
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
  faPlusCircle,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useKeyPress } from "../hooks/useKeyPress";
import IconButton from "../components/IconButton";
import { authUser } from "../services/auth";
import { ColorRing } from "react-loader-spinner";

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
      taskID: task.taskID,
    };
    await deleteTask(deleteArgs);
    setTaskListState((prev) => [
      ...prev.filter((t) => t.taskID !== task.taskID),
    ]);
  };

  const handleEdit = async () => {
    const updatedProps: Partial<Task> = { content: newContent };
    const updatedTask = await editTaskToServer(task, uid, updatedProps);
    if (updatedTask !== null) {
      const newListState = taskList.map((t) =>
        t.taskID === task.taskID ? updatedTask : t
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
    if (task.taskStatus === TaskStatus.Completed) {
      const updatedProps: Partial<Task> = { taskStatus: TaskStatus.ToDo };
      const updatedTask = await editTaskToServer(task, uid, updatedProps);
      if (updatedTask !== null) {
        const newListState = taskList.map((t) =>
          t.taskID === task.taskID ? updatedTask : t
        );
        setTaskListState(newListState);
      }
    } else if (task.taskStatus === TaskStatus.ToDo) {
      const updatedProps: Partial<Task> = { taskStatus: TaskStatus.Completed };
      const updatedTask = await editTaskToServer(task, uid, updatedProps);
      if (updatedTask !== null) {
        const newListState = taskList.map((t) =>
          t.taskID === task.taskID ? updatedTask : t
        );
        setTaskListState(newListState);
      }
    }
  };

  const contentTextClassName =
    task.taskStatus === TaskStatus.Completed
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
              className="pl-1 rounded"
            />
            <IconButton icon={faCheckCircle} onClick={handleEdit} size="sm" />
          </div>
        ) : (
          <p className={contentTextClassName} onClick={handleClick}>
            {task.content}
          </p>
        )}
      </div>
      {canEdit && (
        <div className="bg-disc-light-blue rounded-b flex justify-end p-1 gap-2 shadow">
          <IconButton
            icon={editing ? faX : faPencil}
            size="sm"
            onClick={() => setEditing(!editing)}
          />
          <IconButton icon={faTrash} size="sm" onClick={handleDelete} />
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

  const stopAddingTask = () => {
    setAddingNewTask(false);
    setNewContent("");
  };

  const handleSubmit = async () => {
    const newTask: Partial<Task> = {
      content: newContent,
      taskStatus: TaskStatus.ToDo,
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
  useKeyPress(["Escape"], stopAddingTask);

  return (
    <div className="flex flex-col">
      <div className="rounded-t bg-slate-50 dark:bg-zinc-800 p-2 min-h-20 shadow">
        <input
          value={newContent}
          className="pl-1 rounded"
          onChange={(e) => setNewContent(e.target.value)}
          autoFocus
        />
      </div>
      <div className="bg-disc-light-blue rounded-b flex justify-end p-1 shadow gap-2">
        <IconButton icon={faCircleXmark} onClick={stopAddingTask} size="sm" />
        <IconButton icon={faCheckCircle} onClick={handleSubmit} size="sm" />
      </div>
    </div>
  );
};

interface NewTaskPromptProps {
  setAddingNewTask: React.Dispatch<React.SetStateAction<boolean>>;
  className: string;
}

const NewTaskPrompt: React.FC<NewTaskPromptProps> = ({
  setAddingNewTask,
  className,
}) => {
  return (
    <div
      className={`rounded h-8 opacity-40 bg-slate-50 dark:bg-zinc-800 p-2 min-h-20 shadow flex cursor-pointer ${className}`}
      onClick={() => setAddingNewTask(true)}
    >
      <FontAwesomeIcon icon={faPlusCircle} />
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
  const contClassName = `group w-full mr-1 first:ml-1 last:border-r-0 dark:border-x-neutral-500 bg-gray-200 dark:bg-zinc-700 ${
    isToday && "border-t-4 border-t-disc-blue"
  }`;

  return (
    <div className={contClassName}>
      <div
        className={`flex justify-between items-center bg-zinc-300 dark:bg-disc-dark-4 p-1 ${
          !isToday && "pt-2"
        }`}
      >
        <h2 className="text-lg ml-1 font-bold">{getWeekdayName(dayOfWeek)}</h2>
        <div className="flex gap-3 mr-1">
          <IconButton
            icon={faCirclePlus}
            size="sm"
            disabled={addingNewTask}
            onClick={!addingNewTask ? () => setAddingNewTask(true) : undefined}
          />
          <IconButton
            icon={editingDay ? faChevronUp : faChevronDown}
            onClick={() => setEditingDay(!editingDay)}
            size="sm"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-1 p-1">
        {dayTasks.map((t, ind) => (
          <TaskItem task={t} uid={uid} key={ind} canEdit={editingDay} />
        ))}
        {addingNewTask ? (
          <NewTaskForm
            setAddingNewTask={setAddingNewTask}
            dayOfWeek={dayOfWeek}
            uid={uid}
          />
        ) : (
          <NewTaskPrompt
            className="group-hover:visible invisible group-hover:animate-in group-hover:duration-300 group-hover:fade-in"
            setAddingNewTask={setAddingNewTask}
          />
        )}
      </div>
    </div>
  );
};

let didInit = false;

const Dashboard = () => {
  const navigate = useNavigate();
  const [newTaskContent, setNewTaskContent] = React.useState("");
  const [newTaskDOW, setNewTaskDOW] = React.useState<Weekday>(0);
  const [creatingItem, setCreatingItem] = React.useState(false);
  const [userState, setUserState] = useRecoilState(authUserState);
  const [_, setTaskListState] = useRecoilState(userTasksState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const loggedIn = useRecoilValue(loggedInState);
  const [searchParams, setSearchParams] = useSearchParams();

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

  useKeyPress(["Escape"], clearCreating);
  useKeyPress(["i"], () => setCreatingItem(true), null, true);

  return (
    <div className="h-full bg-zinc-100 dark:bg-zinc-800 rounded py-2 px-1 w-full flex flex-col">
      {!loading ? (
        <>
          <div className="flex gap-3 items-center mb-3">
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
                  className="rounded p-1"
                  placeholder="New task content.."
                  autoFocus
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
                <IconButton icon={faCheckCircle} onClick={submitTask} />
                <IconButton icon={faCircleXmark} onClick={clearCreating} />
              </div>
            )}
          </div>
          <div className="flex flex-1">{dayOfWeekComponentsList}</div>
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
