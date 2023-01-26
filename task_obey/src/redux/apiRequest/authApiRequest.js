import axios from "axios";

import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "../authSlice";
import {url} from '../createInstance';

const registerUser = async (user, dispatch, navigate, setIsLoading) => {
  dispatch(registerStart());
  try {
    setIsLoading(true);
    await axios.post(`${url}/api/auth/register`, user);
    dispatch(registerSuccess());
    setIsLoading(false);
    navigate("/home");
  } catch (error) {
    console.log(error);
    dispatch(registerFailed());
    setIsLoading(false);
  }
};

const loginUser = async (user, dispatch, navigate, setIsLoading) => {
  dispatch(loginStart());
  try {
    setIsLoading(true);
    const res = await axios.post(`${url}/api/auth/login`, user, {
      withCredentials: true,
    });
    dispatch(loginSuccess(res.data));
    setIsLoading(false);
    navigate("/home");
  } catch (error) {
    dispatch(loginFailed());
    setIsLoading(false);
  }
};

export {registerUser, loginUser};