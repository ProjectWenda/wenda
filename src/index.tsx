import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  }
])

root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);
