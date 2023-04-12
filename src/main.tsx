import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./views/AuthLayout";
import Login from "./views/Login";
import "./index.css";
import { RecoilRoot } from "recoil";
import Dashboard from "./views/Dashboard";
import { StyleProvider } from "@ant-design/cssinjs";

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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <StyleProvider hashPriority="high"> */}
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    {/* </StyleProvider> */}
  </React.StrictMode>
);
