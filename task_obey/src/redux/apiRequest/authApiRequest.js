import axios from "axios";

import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  logoutRegisterStart,
  logoutRegisterSuccess,
  logoutRegisterFailed,
  registerFailed,
  registerStart,
  registerSuccess,
} from "../authSlice";
import {url} from '../createInstance';

const registerUser = async (user, dispatch, navigate, setIsLoading) => {
  dispatch(registerStart());
  try {
    setIsLoading(true);
    const res = await axios.post(`${url}/api/auth/register`, user);
    dispatch(registerSuccess(res.data));
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

// const loginUserEmail = async (user, dispatch, navigate, setIsLoading) => {
//   dispatch(loginStart());
//   try {
//     setIsLoading(true);
//     const res = await axios.post(`${url}/api/auth/loginEmail`, user, {
//       withCredentials: true,
//     });
//     dispatch(loginSuccess(res.data));
//     setIsLoading(false);
//     navigate("/home");
//   } catch (error) {
//     dispatch(loginFailed());
//     setIsLoading(false);
//   }
// };

const logOutRegsiter= async (dispatch, navigate, id, token, axiosJWTLogout) => {
  dispatch(logoutRegisterStart());
  try {
    await axiosJWTLogout.post(`${url}/api/auth/logoutRegister`, id, token, {
      headers: { ['authorization']: `Bearer ${token}` },
    });
    dispatch(logoutRegisterSuccess());
    navigate("/"); //login
  } catch (error) {
    dispatch(logoutRegisterFailed());
  }
};

const logOut = async (dispatch, navigate, id, token, axiosJWTLogout) => {
  dispatch(logoutStart());
  try {
    await axiosJWTLogout.post(`${url}/api/auth/logout`, id, {
      headers: { ['authorization']: `Bearer ${token}` },
    });
    dispatch(logoutSuccess());
    // dispatch(clearSender());
    // dispatch(clearActor());
    navigate("/"); //login
  } catch (error) {
    dispatch(logoutFailed());
  }
};

export {registerUser, loginUserPhone, logOutRegsiter, logOut};