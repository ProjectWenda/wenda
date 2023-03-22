import {
  faCheckCircle,
  faX,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useRecoilState } from "recoil";
import { editTaskToServer } from "../../domain/TaskUtils";
import { Task, DeleteTaskArgs, TaskStatus } from "../../schema/Task";
import { deleteTask } from "../../services/tasks";
import { userTasksState } from "../../store";
import IconButton from "../IconButton";

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

export default TaskItem;
