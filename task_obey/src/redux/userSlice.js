import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        sender: {
            user: null,
        },
        user: {
            isFetching: false,
            error: false,
            success: false,
            userName: null,
            phoneNumber: null
        },
        changePass: {
            isFetching: false,
            error: false,
            success: false,
        },
    },
    reducers: {
        getUserNameStart: (state) => {
            state.user.isFetching = true;
        },
        getUserNameSuccess: (state, action) => {
            state.user.isFetching = false;
            state.user.userName = action.payload;
        },
        getUserNameFailed: (state) => {
            state.user.isFetching = false;
            state.user.error = true;
        },
        getUserPhoneStart: (state) => {
            state.user.isFetching = true;
        },
        getUserPhoneSuccess: (state, action) => {
            state.user.isFetching = false;
            state.user.phoneNumber = action.payload;
        },
        getUserPhoneFailed: (state) => {
            state.user.isFetching = false;
            state.user.error = true;
        },
        changePassStart: (state) => {
            state.changePass.isFetching = true;
        },
        changePassSuccess: (state) => {
            state.changePass.isFetching = false;
            state.changePass.success = true;
            state.changePass.error = false;
        },
        changePassFailed: (state) => {
            state.changePass.isFetching = false;
            state.changePass.success = false;
            state.changePass.error = true;
        },
    }
})

export const {
  getUserNameStart,
  getUserNameSuccess,
  getUserNameFailed,
  getUserPhoneStart,
  getUserPhoneSuccess,
  getUserPhoneFailed,
  changePassStart,
  changePassSuccess,
  changePassFailed,
} = userSlice.actions;

export default userSlice.reducer;