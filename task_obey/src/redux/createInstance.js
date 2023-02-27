import axios from "axios";
import jwtDecode from "jwt-decode";

export const url = "https://taskobey-mobile-app-server.onrender.com";

export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwtDecode(user?.refreshToken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken({ refreshToken: user?.refreshToken });
                const refreshUser = {
                    ...user,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                };
                dispatch(stateSuccess(refreshUser));
                config.headers['token'] = 'Bearer ' + data.refreshToken;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );
    return newInstance;
};