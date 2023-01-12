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
        }
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
        getUserNPhoneStart: (state) => {
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
    }
})

export const {
  getUserNameStart,
  getUserNameSuccess,
  getUserNameFailed,
  getUserNPhoneStart,
  getUserPhoneSuccess,
  getUserPhoneFailed,
} = userSlice.actions;

export default userSlice.reducer;