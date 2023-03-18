import React from "react";
import { useRecoilValue } from "recoil";
import { loggedInState } from "../store";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const loggedIn = useRecoilValue(loggedInState);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn]);

  const handleClick = () => {
    document.cookie = "authuid" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT"; // delete authuid cookie
    navigate("/login");
  };

  return (
    <div>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
};

export default Logout;
