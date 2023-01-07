import Login from "../components/Login";
import Register from "../components/Register";
import Home from "../components/Home";

export const publicRoutes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/home", component: Home },
];