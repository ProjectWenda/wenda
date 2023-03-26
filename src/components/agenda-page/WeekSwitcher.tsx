import React from "react";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../IconButton";
import moment from "moment";
import { useRecoilState } from "recoil";
import { weekState } from "../../store";

const WeekSwitcher: React.FC = () => {
  const [week, setWeek] = useRecoilState(weekState);
  const weekTitle = React.useMemo(
    () => moment().week(week).day(0).format("DD MMM. YYYY"),
    [week]
  );

  const handleClick = React.useCallback(
    (left: boolean) => {
      left ? setWeek(week - 1) : setWeek(week + 1);
    },
    [week, setWeek]
  );

  return (
    <div className="flex gap-2 items-center">
      <IconButton className="select-none" icon={faArrowLeft} onClick={() => handleClick(true)} />
      <div>
        <span className="text-xl">Week of</span>
        <span className="text-xl font-bold"> {weekTitle}</span>
      </div>

      <IconButton className="select-none" icon={faArrowRight} onClick={() => handleClick(false)} />
    </div>
  );
};

export default WeekSwitcher;
