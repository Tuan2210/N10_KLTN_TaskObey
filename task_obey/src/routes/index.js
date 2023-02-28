import Login from "../components/Login";
import ForgotPassword from "../components/ForgotPassword";
import Register from "../components/Register";
import Home from "../components/Home";

export const publicRoutes = [
  { path: "/", component: Login },
  { path: "/forgotPW", component: ForgotPassword },
  { path: "/register", component: Register },
  { path: "/home", component: Home },
];