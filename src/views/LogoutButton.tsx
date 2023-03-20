import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authUserState, loggedInState } from "../store";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
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

  return (
    <div>
      <button className="text-white bg-disc-blue px-2 py-1" onClick={handleClick}>Logout</button>
    </div>
  );
};

export default LogoutButton;
