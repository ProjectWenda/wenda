import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authUserState } from "../domain/store";


const Dashboard = () => {
  const navigate = useNavigate();
  const [ userState, setUserState ] = useRecoilState(authUserState);
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

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;