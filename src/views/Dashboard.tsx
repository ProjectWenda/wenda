import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { authUserState, loggedInState, userTasksState } from "../domain/store";
import { Task, TaskStatus } from "../domain/Task";
import { addTask, deleteTask, editTask, getTasks } from "../services/tasks";

interface TaskItemProps {
  task: Task;
  uid: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, uid }) => {
  const [taskList, setTaskListState] = useRecoilState(userTasksState);
  const [newContent, setNewContent] = React.useState(task.content);
  const [newStatus, setNewStatus] = React.useState(task.status);
  const [editing, setEditing] = React.useState(false);

  const handleDelete = async () => {
    await deleteTask(uid, task.id);
    setTaskListState((prev) => [...prev.filter((t) => t.id !== task.id)]);
  };

  const handleEdit = async () => {
    console.log(newStatus);
    const updatedTaskData: Partial<Task> = {
      content: newContent,
      status: newStatus,
    };
    const newTask: Task = {
      ...task,
      ...updatedTaskData,
    };
    const editRes = await editTask(uid, task.id, updatedTaskData);
    if (editRes !== null) {
      const newListState = taskList.map((t) =>
        t.id === task.id ? newTask : t
      );
      setTaskListState(newListState);
    }
  };

  return (
    <div>
      <li>{task.content}</li>
      <button onClick={handleDelete}>X</button>
      <button onClick={() => setEditing(!editing)}>pencil icon</button>
      {editing && (
        <>
          <input onChange={(e) => setNewContent(e.target.value)} />
          <input type="number" onChange={(e) => setNewStatus(e.target.valueAsNumber)} />
          <button onClick={handleEdit}>Save edits</button>
        </>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [newTaskState, setNewTaskState] = React.useState("");
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
    const newTask = {
      content: newTaskState,
      status: TaskStatus.Completed,
    };
    const newTaskRes = await addTask(userState!.authUID, newTask);
    setTaskListState((prev) => [...prev, newTaskRes]);
    setNewTaskState("");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <input
        onChange={(e) => setNewTaskState(e.target.value)}
        value={newTaskState}
      />
      <button onClick={submitTask}>Submit</button>
      <ul>
        {taskList.map(
          (t, ind) => (
            <TaskItem key={ind} task={t} uid={userState!.authUID} />
          )
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
