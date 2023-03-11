import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./views/Layout";
import Login from "./views/Login";
import { authLoader } from "./loaders/authLoader";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <div>I'm a dashboard.</div>,
        loader: authLoader,
      },
      {
        path: "about",
        element: <div>this is a public ABOUT page.</div>,
      },
      {
        path: "login",
        element: <Login />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
