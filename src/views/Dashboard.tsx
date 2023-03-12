import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authUserState } from "../domain/store";
import { Task, TaskStatus } from "../domain/Task";
import { addTask, deleteTask, editTask, getTasks } from "../services/tasks";

interface TaskItemProps {
  task: Task
}

const TaskItem : React.FC<TaskItemProps> = ({ task }) => {

  return <>
  </>
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [ userState, setUserState ] = useRecoilState(authUserState);
  const [ newTaskState, setNewTaskState ] = React.useState('');
  const [taskListState , setTaskListState ] = React.useState<Task[]>([]);

  const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)authuid\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  React.useEffect(() => {
    setUserState(cookieValue === '' ? null : { ...userState, authUID: cookieValue });
    if (cookieValue === '') {
      setUserState(null);
      navigate('/login');
    } else {
      setUserState({ authUID: cookieValue });
    }
  }, [cookieValue])

  React.useEffect(() => {
    const getTaskData = async () => {
      const tasks = await getTasks(userState!.authUID);
      setTaskListState(tasks);
    }
    getTaskData();
  }, [userState!.authUID]);

  const submitTask = async () => {
    const newTask = {
      content: newTaskState,
      status: TaskStatus.Completed,
    }
    const newTaskRes = await addTask(userState!.authUID, newTask);
    setTaskListState([... taskListState, newTaskRes]);
    setNewTaskState("");
  }

  const handleDelete = async (id: number) => {
    await deleteTask(userState!.authUID, id);
    const newListState = taskListState.filter(t => t.id !== id)
    setTaskListState(newListState);
  }

  // const handleEdit = async (id: number) => {
  //   const updatedTaskData : Partial<Task> = {
  //     content: 
  //   }
  //   await editTask(userState!.authUID, id, )
  // }

  return (
    <div>
      <h1>Dashboard</h1>
      <input onChange={(e) => setNewTaskState(e.target.value)} value={newTaskState}/>
      <button onClick={submitTask}>Submit</button>
      <ul>
        {taskListState.map((t, ind) => 
          <>
            <li key={ind}>{t.content}</li>
            <button onClick={() => handleDelete(t.id)}>X</button>
            {/* <button onClick={() => handleEdit(t.id)}>pencil icon</button> */}
          </>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;