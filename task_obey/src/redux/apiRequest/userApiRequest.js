import axios from "axios";
import { url } from "../createInstance";
import {
    getUserNameStart,
    getUserNameSuccess,
    getUserNameFailed,
    changePassStart,
    changePassSuccess,
    changePassFailed,
} from "../userSlice";

// export const getUserName = async (dispatch, name) => {
//     dispatch(getUserNameStart);
//     try {
//         const res = await axios.get(`${url}/api/user/userName/${name}`);
//         // const res = await axios.get(`http://localhost:8000/api/user/userName/${name}`);
//         dispatch(getUserNameSuccess(res.data));

//         {res.data.map((userData, userIdex) => {
//             const infoName = userData.userName;
//             // console.log(infoName);
//         })}
//     } catch (error) {
//         dispatch(getUserNameFailed());
//     }
// }

export const changePassword = async (account, navigate, setSystemLine) => {
    // dispatch(changePassStart());
    try {
        await axios.post(`${url}/api/user/changePassword`, account, {
            withCredentials: true,
        });
        // dispatch(changePassSuccess());
        setSystemLine('');
        navigate('/home');
    } catch (error) {
        // dispatch(changePassFailed());
        console.log(error);
    }
};

export const changeUsername = async (account) => {
    // dispatch(changePassStart());
    try {
        await axios.post(`${url}/api/user/changeUsername`, account, {
            withCredentials: true,
        });
        // dispatch(changePassSuccess());
    } catch (error) {
        // dispatch(changePassFailed());
        console.log(error);
    }
};