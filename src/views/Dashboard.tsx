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
import { Task, TaskStatus, taskToServer } from "../schema/Task";
import { AddTaskArgs, DeleteTaskArgs, EditTaskArgs } from "../schema/Task";
import { addTask, deleteTask, editTask, getTasks } from "../services/tasks";
import { Weekday } from "../schema/Weekday";
import { getWeekdayName } from "../domain/WeekdayUtils";
import { editTaskToServer, getTasksByDay } from "../domain/TaskUtils";

interface TaskItemProps {
  task: Task;
  uid: string;
  canEdit?: boolean;
}

const CONTENT_DIV_BASE_CLASSNAME = "bg-slate-800 p-2 min-h-20";
const CONTENT_TEXT_BASE_CLASSNAME = "cursor-pointer w-fit";

const TaskItem: React.FC<TaskItemProps> = ({ task, uid, canEdit }) => {
  const [taskList, setTaskListState] = useRecoilState(userTasksState);
  const [newContent, setNewContent] = React.useState("");
  const [editing, setEditing] = React.useState(false);

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
      setNewContent("");
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
        <p className={contentTextClassName} onClick={handleClick}>
          {task.content}
        </p>
        {editing && (
          <>
            <input
              onChange={(e) => setNewContent(e.target.value)}
              value={newContent}
            />
            <button onClick={handleEdit}>Save edits</button>
          </>
        )}
      </div>
      {canEdit && (
        <div className="bg-slate-700 rounded-b flex justify-between p-1">
          <button className="text-sm py-1 px-2" onClick={handleDelete}>
            X
          </button>
          <button
            className="text-sm py-1 px-2"
            onClick={() => setEditing(!editing)}
          >
            pencil icon
          </button>
        </div>
      )}
    </div>
  );
};

interface DayOfWeekListProps {
  dayOfWeek: Weekday;
  uid: string;
}

const DayOfWeekList: React.FC<DayOfWeekListProps> = ({ dayOfWeek, uid }) => {
  const [editingWeek, setEditingWeek] = React.useState(false);
  const weekTasks = useRecoilValue(weekTasksState);
  const dayTasks = getTasksByDay(weekTasks, dayOfWeek);
  return (
    <div className="w-52 mr-3 bg-zinc-700 p-2 rounded-lg h-3/4">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">{getWeekdayName(dayOfWeek)}</h2>
        <button
          onClick={() => setEditingWeek(!editingWeek)}
          className="py-1 px-2 text-sm"
        >
          edit
        </button>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        {dayTasks.map((t, ind) => (
          <TaskItem task={t} uid={uid} key={ind} canEdit={editingWeek} />
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [newTaskContent, setNewTaskContent] = React.useState("");
  const [newTaskDOW, setNewTaskDOW] = React.useState<Weekday>(0);
  const [userState, setUserState] = useRecoilState(authUserState);
  const [taskList, setTaskListState] = useRecoilState(userTasksState);
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
  };

  const dayOfWeekComponentsList = [];

  if (userState) {
    for (let i = 0; i < 7; i++) {
      dayOfWeekComponentsList.push(
        <DayOfWeekList dayOfWeek={i} key={i} uid={userState!.authUID} />
      );
    }
  }

  return (
    <div className="h-full">
      <h1>Dashboard</h1>
      <div className="flex gap-3 items-center mb-3">
        <input
          onChange={(e) => setNewTaskContent(e.target.value)}
          value={newTaskContent}
          className="rounded"
        />
        <select
          onChange={(e) => setNewTaskDOW(+e.target.value)}
          value={newTaskDOW}
          className="h-6 rounded"
        >
          <option value={0}>Sunday</option>
          <option value={1}>Monday</option>
          <option value={2}>Tuesday</option>
          <option value={3}>Wednesday</option>
          <option value={4}>Thursday</option>
          <option value={5}>Friday</option>
          <option value={6}>Saturday</option>
        </select>
        <button className="py-1 px-2" onClick={submitTask}>
          Submit
        </button>
      </div>
      <div className="flex h-5/6">{dayOfWeekComponentsList}</div>
    </div>
  );
};

export default Dashboard;
