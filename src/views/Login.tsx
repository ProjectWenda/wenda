import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loggedInState } from "../store";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const redirectUrl = import.meta.env.VITE_DISCORD_AUTH_REDIRECT;
  const loggedIn = useRecoilValue(loggedInState);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loggedIn) {
      navigate('/');
    }
  }, [loggedIn])

  return (
    <div>
      <Link to={redirectUrl}>
        <button>Login with Discord</button>
      </Link>
    </div>
  );
};

export default Login;