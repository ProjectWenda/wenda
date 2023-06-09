import * as React from "react";
import Modal from "./Modal";
import moment, { Moment } from "moment";
import tz from "moment-timezone";
import Field, { SelectField } from "./Field";
import {
  AddTaskArgs,
  DayTasks,
  Task,
  TaskStatus,
  getTaskStatusFromString,
  getTaskStatusString,
} from "../schema/Task";
import { mapEnum } from "../domain/codeUtils";
import { getTasksByDate } from "../domain/TaskUtils";
import { addTask } from "../services/tasks";
import { useRecoilState, useRecoilValue } from "recoil";
import { authUserState, tasksState } from "../store";

type AddTaskModalProps = {
  onClose: () => void;
  onSubmit: () => void;
};

const CONTENT_PLACEHOLDER = "New task content...";

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onSubmit }) => {
  const [tasks, setTasks] = useRecoilState(tasksState);
  const userState = useRecoilValue(authUserState);
  const [newTaskContent, setNewTaskContent] = React.useState<string>("");
  const [newTaskDate, setNewTaskDate] = React.useState<Moment>(moment());
  const [newTaskStatus, setNewTaskStatus] = React.useState<TaskStatus>(TaskStatus.ToDo);
  const taskStatusStrings = mapEnum(TaskStatus, (status: TaskStatus) =>
    getTaskStatusString(status)
  );

  const submitTask = React.useCallback(async () => {
    const normalizedDate = tz(newTaskDate, "America/New_York").set({ hour: 8, minute: 0 });
    const newTask: Partial<Task> = {
      content: newTaskContent,
      taskStatus: newTaskStatus,
      taskDate: normalizedDate,
    };
    const addArgs: AddTaskArgs = {
      uid: userState!.authUID,
      taskData: newTask,
    };
    const newTaskRes = await addTask(addArgs);
    if (newTaskRes) {
      const newDayTasks: DayTasks = {
        ...tasks,
        [newTaskRes.taskDate.format("YYYY-MM-DD")]: {
          tasks: [...getTasksByDate(tasks, newTaskDate), newTaskRes],
        },
      };
      setTasks(newDayTasks);
    }
    onSubmit();
  }, [newTaskContent, newTaskDate, tasks, userState, onSubmit, newTaskStatus]);

  const validSubmit = React.useMemo(() => newTaskContent !== "", [newTaskContent]);

  return (
    <Modal
      title="Add a task"
      onClose={onClose}
      onClickPrimary={submitTask}
      height="h-[8.5rem]"
      primaryClickDisabled={!validSubmit}
    >
      <div className="flex flex-col gap-2">
        <Field
          type="text"
          label="Task Content:"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          placeholder={CONTENT_PLACEHOLDER}
          autoFocus
        />
        <Field
          type="date"
          label="Task Date:"
          value={newTaskDate.format("YYYY-MM-DD")}
          onChange={(e) => setNewTaskDate(moment(e.target.value))}
        />
        <SelectField
          label="Task Status:"
          value={getTaskStatusString(newTaskStatus)}
          onChange={(e) => setNewTaskStatus(getTaskStatusFromString(e.target.value))}
          options={taskStatusStrings}
        />
      </div>
    </Modal>
  );
};

export default AddTaskModal;
