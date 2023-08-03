import { faCheckCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useRecoilState } from "recoil";
import { editTaskToServer, getTasksByDate } from "../../domain/TaskUtils";
import { Task, DeleteTaskArgs, TaskStatus, DayTasks } from "../../schema/Task";
import { deleteTask } from "../../services/tasks";
import { tasksState } from "../../store";
import IconButton from "../IconButton";
import { motion } from "framer-motion";
import { useKeyPress } from "../../hooks/useKeyPress";
import { Draggable } from "@hello-pangea/dnd";
import { Input, Typography } from "antd";

interface TaskItemProps {
  task: Task;
  uid: string;
  index: number;
}

const CONTENT_DIV_BASE_CLASSNAME =
  "bg-slate-50 dark:bg-zinc-800 p-2 min-h-20 shadow rounded mb-1 mx-1";
const CONTENT_TEXT_BASE_CLASSNAME = "w-fit cursor-pointer overflow-hidden text-ellipsis";

const TaskItem: React.FC<TaskItemProps> = ({ task, uid, index }) => {
  const [dayTasks, setDayTasks] = useRecoilState(tasksState);
  const [newContent, setNewContent] = React.useState(task.content);
  const [editing, setEditing] = React.useState(false);
  const [hoveringTask, setHoveringTask] = React.useState(false);
  const { taskDate } = React.useMemo(() => task, [task]);

  const handleDelete = async () => {
    const newDayTasks: DayTasks = {
      ...dayTasks,
      [taskDate.format("YYYY-MM-DD")]: {
        tasks: getTasksByDate(dayTasks, taskDate).filter((t) => t.taskID !== task.taskID),
      },
    };
    setDayTasks(newDayTasks);
    const deleteArgs: DeleteTaskArgs = {
      uid,
      taskID: task.taskID,
    };
    await deleteTask(deleteArgs);
  };

  const handleEdit = React.useCallback(async () => {
    if (!editing) return;
    const updatedProps: Partial<Task> = { content: newContent };
    const updatedTask = { ...task, ...updatedProps };
    const newDayTasks: DayTasks = {
      ...dayTasks,
      [taskDate.format("YYYY-MM-DD")]: {
        tasks: getTasksByDate(dayTasks, taskDate).map((t) =>
          t.taskID === task.taskID ? updatedTask : t
        ),
      },
    };
    setEditing(false);
    setNewContent(updatedTask.content);
    setDayTasks(newDayTasks);
    await editTaskToServer(task, uid, updatedProps);
  }, [task, newContent, dayTasks, uid, editing, taskDate, getTasksByDate]);

  const checkTask = React.useCallback(async () => {
    const newStatus =
      task.taskStatus === TaskStatus.Completed ? TaskStatus.ToDo : TaskStatus.Completed;
    const updatedProps: Partial<Task> = { taskStatus: newStatus };
    const updatedTask = { ...task, ...updatedProps };
    const newDayTasks: DayTasks = {
      ...dayTasks,
      [taskDate.format("YYYY-MM-DD")]: {
        tasks: getTasksByDate(dayTasks, taskDate).map((t) =>
          t.taskID === task.taskID ? updatedTask : t
        ),
      },
    };
    setDayTasks(newDayTasks);
    await editTaskToServer(task, uid, updatedProps);
  }, [task, dayTasks, getTasksByDate, taskDate, uid]);

  const handleClick = React.useCallback(() => {
    if (task.taskStatus === TaskStatus.Completed || task.taskStatus === TaskStatus.ToDo) {
      checkTask();
    }
  }, [task.taskStatus, checkTask]);

  const cancelEditing = React.useCallback(() => {
    if (!editing) return;
    setEditing(false);
    setNewContent(task.content);
  }, [editing]);

  const contentTextClassName =
    task.taskStatus === TaskStatus.Completed
      ? `${CONTENT_TEXT_BASE_CLASSNAME} line-through opacity-50`
      : CONTENT_TEXT_BASE_CLASSNAME;

  const deleteButtonVariants = {
    shown: { opacity: 1, transition: { duration: 0.25 } },
    hidden: { opacity: 0, transition: { duration: 0.05 } },
  };

  useKeyPress(["Enter"], handleEdit);
  useKeyPress(["Escape"], cancelEditing);

  return (
    <Draggable draggableId={task.taskID} index={index}>
      {(draggableProvided) => (
        <motion.div
          onHoverStart={() => setHoveringTask(true)}
          onHoverEnd={() => setHoveringTask(false)}
          className={CONTENT_DIV_BASE_CLASSNAME}
          onDoubleClick={() => setEditing(true)}
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
        >
          {editing ? (
            <div className="flex items-center gap-1">
              <Input
                onChange={(e) => setNewContent(e.target.value)}
                value={newContent}
                className="pl-1 rounded dark:bg-zinc-700 bg-white w-11/12"
                autoFocus
              />
              <IconButton
                icon={faCheckCircle}
                onClick={handleEdit}
                size="sm"
                className="dark:text-white text-black"
              />
            </div>
          ) : (
            <div
              className="flex justify-between items-center"
              {...draggableProvided.dragHandleProps}
            >
              <Typography.Text className={contentTextClassName} onClick={handleClick}>
                {task.content}
              </Typography.Text>
              <motion.div
                animate={hoveringTask ? "shown" : "hidden"}
                variants={deleteButtonVariants}
              >
                <IconButton
                  icon={faTrash}
                  className="text-zinc-500"
                  size="sm"
                  onClick={handleDelete}
                />
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </Draggable>
  );
};

export default TaskItem;
