import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div>
      <div className="flex container gap-3 bg-light-gray max-w-none">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="flex container">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
