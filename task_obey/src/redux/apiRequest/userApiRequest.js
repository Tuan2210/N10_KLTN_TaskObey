import axios from "axios";
import { url } from "../createInstance";
import {getUserNameStart, getUserNameSuccess, getUserNameFailed} from '../userSlice';

export const getUserName = async (dispatch, name) => {
    dispatch(getUserNameStart);
    try {
        const res = await axios.get(`${url}/api/user/userName/${name}`);
        // const res = await axios.get(`http://localhost:8000/api/user/userName/${name}`);
        dispatch(getUserNameSuccess(res.data));

        const existUserName = res.data.userName;
        console.log(res.data);
    } catch (error) {
        dispatch(getUserNameFailed());
    }
}