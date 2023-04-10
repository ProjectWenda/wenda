import moment from "moment";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  authUserState,
  draggingState,
  loadingState,
  loggedInState,
  tasksState,
  weekState,
} from "../store";
import { DayTasks, EditOrderArgs } from "../schema/Task";
import { editOrder, getTasks } from "../services/tasks";
import { useKeyPress } from "../hooks/useKeyPress";
import { authUser } from "../services/auth";
import { ColorRing } from "react-loader-spinner";
import DayOfWeekList from "../components/agenda-page/DayOfWeekList";
import WeekSwitcher from "../components/agenda-page/WeekSwitcher";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { getTasksByDate } from "../domain/TaskUtils";
import { getWeekdayFromDay } from "../domain/WeekdayUtils";
import AddTaskDialog from "../components/AddTaskDialog";
import CreateItemButton from "../components/agenda-page/CreateItemButton";
import { Modal } from "antd";

let didInit = false;

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [userState, setUserState] = useRecoilState(authUserState);
  const [dayTasks, setDayTasksState] = useRecoilState(tasksState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const loggedIn = useRecoilValue(loggedInState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [dragging, setDragging] = useRecoilState(draggingState);
  const currentWeek = useRecoilValue(weekState);

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
      setDayTasksState(tasks);
    }
    setLoading(false);
  }, [loggedIn, userState, setDayTasksState]);

  React.useEffect(() => {
    if (!didInit) {
      didInit = true;
      tryLogin();
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [loggedIn]);

  const dayOfWeekComponentsList: Array<JSX.Element> = [];

  // we need to recheck userState here because
  // it's not guaranteed to be initialized
  if (userState) {
    for (let i = 0; i < 7; i++) {
      dayOfWeekComponentsList.push(<DayOfWeekList dayOfWeek={i} key={i} uid={userState.authUID} />);
    }
  }

  const onDragStart = () => {
    setDragging(true);
  };

  const onDragEnd = async (result: DropResult) => {
    setDragging(false);
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceDate = moment().week(currentWeek).day(getWeekdayFromDay(result.source.droppableId));
    const destinationDate = moment()
      .week(currentWeek)
      .day(getWeekdayFromDay(result.destination.droppableId));

    const sourceTasks = getTasksByDate(dayTasks, sourceDate);
    const destinationTasks = getTasksByDate(dayTasks, destinationDate);

    if (sourceDate.isSame(destinationDate, "date")) {
      const items = [...sourceTasks];
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      const newDayTasks: DayTasks = {
        ...dayTasks,
        [sourceDate.format("YYYY-MM-DD")]: {
          tasks: items,
        },
      };
      setDayTasksState(newDayTasks);

      // get the task before the newly reordered task if it exists
      const prevTaskID =
        result.destination.index > 0 ? items[result.destination.index - 1].taskID : "";

      // get the task after the newly reordered task if it exists
      const nextTaskID =
        result.destination.index < items.length - 1
          ? items[result.destination.index + 1].taskID
          : "";

      const args: EditOrderArgs = {
        uid: userState!.authUID,
        taskID: reorderedItem.taskID,
        initialDate: reorderedItem.taskDate.toISOString(),
        newDate: reorderedItem.taskDate.toISOString(),
        prevTaskID,
        nextTaskID,
      };

      await editOrder(args);
    } else {
      const sourceItems = [...sourceTasks];
      const destinationItems = [...destinationTasks];
      const reorderedItem = sourceItems.splice(result.source.index, 1)[0];
      const newDate = moment()
        .week(currentWeek)
        .day(getWeekdayFromDay(result.destination.droppableId));
      const updatedItem = { ...reorderedItem, taskDate: newDate };
      destinationItems.splice(result.destination.index, 0, updatedItem);

      const newDayTasks: DayTasks = {
        ...dayTasks,
        [sourceDate.format("YYYY-MM-DD")]: {
          tasks: sourceItems,
        },
        [destinationDate.format("YYYY-MM-DD")]: {
          tasks: destinationItems,
        },
      };
      setDayTasksState(newDayTasks);

      // get the task before the newly reordered task if it exists
      const prevTaskID =
        result.destination.index > 0 ? destinationItems[result.destination.index - 1].taskID : "";

      // get the task after the newly reordered task if it exists
      const nextTaskID =
        result.destination.index < destinationItems.length - 1
          ? destinationItems[result.destination.index + 1].taskID
          : "";

      const args: EditOrderArgs = {
        uid: userState!.authUID,
        taskID: reorderedItem.taskID,
        initialDate: reorderedItem.taskDate.toISOString(),
        newDate: newDate.toISOString(),
        prevTaskID,
        nextTaskID,
      };

      await editOrder(args);
    }
  };

  useKeyPress(["i"], () => setShowAddModal(true), null, true);

  return (
    <div className="bg-zinc-100 dark:bg-zinc-800 rounded py-2 px-1 flex flex-col w-dashboard min-w-[1000px]">
      {!loading ? (
        <>
          <div className="flex gap-3 items-center mb-3 justify-between ml-1">
            <CreateItemButton createItemAction={() => setShowAddModal(true)} />
            {/* {showAddModal && (
              <AddTaskModal
                onClose={() => setShowAddModal(false)}
                onSubmit={() => setShowAddModal(false)}
              />
            )} */}
            <Modal
              title="Add a task"
              centered
              closable={false}
              open={showAddModal}
              onCancel={() => setShowAddModal(false)}
            >
              <AddTaskDialog />
            </Modal>
            <WeekSwitcher />
            <div className="w-[8.5rem]"></div>
          </div>
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <div className="grid grid-cols-7 gap-1 h-full mx-1">{dayOfWeekComponentsList}</div>
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
