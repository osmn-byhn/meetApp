import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
//Home.js importing
import Home from "../pages/Home";

//Account Pages importing
import Login from "../pages/accountPage/Login";
import Register from "../pages/accountPage/Register";
import MyAccount from "../pages/accountPage/MyAccount";

//Meet pages importing
import MeetChat from "../pages/meetPages/MeetChat";
import MeetRoom from "../pages/meetPages/MeetRoom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <MyAccount />,
  },
  {
    path: "/chat",
    element: <MeetChat />,
  },
  {
    path: "/room",
    element: <MeetRoom />,
  },
]);

export default router;
