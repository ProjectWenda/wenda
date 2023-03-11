import React from "react";
import { useRecoilValue } from "recoil";
import { loggedInState } from "../domain/store";
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
    //clear all cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    navigate("/login");
  };

  return (
    <div>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
};

export default Logout;