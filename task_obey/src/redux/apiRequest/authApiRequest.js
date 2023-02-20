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

const loginUserPhone = async (user, dispatch, navigate, setIsLoading) => {
  dispatch(loginStart());
  try {
    setIsLoading(true);
    const res = await axios.post(`${url}/api/auth/loginPhone`, user, {
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

const loginUserEmail = async (user, dispatch, navigate, setIsLoading) => {
  dispatch(loginStart());
  try {
    setIsLoading(true);
    const res = await axios.post(`${url}/api/auth/loginEmail`, user, {
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


const logOut = async (dispatch, navigate, id, accessToken, axiosJWT) => {
  dispatch(logoutStart());
  try {
    await axiosJWT.post(`${url}/api/auth/logout`, id, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(logoutSuccess());
    // dispatch(clearSender());
    // dispatch(clearActor());
    navigate("/"); //login
  } catch (error) {
    dispatch(logoutFailed());
  }
};

export {registerUser, loginUserPhone, loginUserEmail, logOut};