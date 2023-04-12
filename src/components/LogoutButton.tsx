import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authUserState, loggedInState } from "../store";
import { useNavigate } from "react-router-dom";
import { Typography } from "antd";

interface LogoutButtonProps {
  userName?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ userName }) => {
  const setUserState = useSetRecoilState(authUserState);
  const loggedIn = useRecoilValue(loggedInState);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn]);

  const handleClick = () => {
    document.cookie = "authuid" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT"; // delete authuid cookie
    setUserState(null);
    navigate("/login");
  };

  return !userName ? (
    <button
      className="text-white bg-disc-blue px-2 py-1 text-sm"
      onClick={handleClick}
    >
      Logout
    </button>
  ) : (
    <div className="flex items-center gap-2">
      <button
        className="text-white bg-disc-blue px-2 py-1 text-sm"
        onClick={handleClick}
      >
        Logout
      </button>
      <Typography.Text className="text-sm break-keep">@{userName}</Typography.Text>
    </div>
  );
};

export default LogoutButton;
