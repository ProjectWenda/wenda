import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./views/AuthLayout";
import Login from "./views/Login";
import "./index.css";
import { RecoilRoot } from "recoil";
import Dashboard from "./views/Dashboard";
import Calendar from "./views/Calendar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "about",
        element: <div>this is a public ABOUT page.</div>,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);
