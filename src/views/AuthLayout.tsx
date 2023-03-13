import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div>
      <div className="flex bg-light-gray max-w-none h-16 items-center">
        <div className="flex justify-center gap-x-5 items-center h-full h-3/4 ml-2.5">
          <Link to="/" className="text-2xl text-white hover:text-slate-400 bg-zinc-800 p-2 rounded">Home</Link>
          <Link to="/about" className="text-2xl text-white hover:text-slate-400 bg-zinc-800 p-2 rounded">About</Link>
        </div>
      </div>
      <div className="flex container m-5">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
