import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";

import { createAxios } from "../../redux/createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { logOut, logOutRegsiter } from "../../redux/apiRequest/authApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function ProfileScreen() {
  const currentLoginUser = useSelector((state) => state.auth.login?.currentUser);
  const loginUserId = currentLoginUser?._id;
  const phoneLoginrUser = currentLoginUser?.phoneNumber;
  const refreshToken = currentLoginUser?.refreshToken;
  const loginUserNameAcc = currentLoginUser?.userName;

  const currentRegisterUser = useSelector((state) => state.auth.register?.currentUserRegister);
  const registerUserId = currentRegisterUser?._id;
  const phoneRegisterUser = currentRegisterUser?.phoneNumber;
  const accessToken = currentRegisterUser?.token;
  const registerUserNameAcc = currentRegisterUser?.userName;

  const [userNameAcc, setUserNameAcc] = useState();
  useEffect(() => {
    if(currentRegisterUser && !currentLoginUser)
      setUserNameAcc(registerUserNameAcc);
    if(!currentRegisterUser && currentLoginUser)
      setUserNameAcc(loginUserNameAcc);
  }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let axiosJWTLogout = createAxios(currentLoginUser, dispatch, logoutSuccess);
  let axiosJWTLogoutRegistered = createAxios(currentRegisterUser, dispatch, logoutSuccess);

  //handle logout
  function handleLogout() {
    if(currentRegisterUser)
      logOutRegsiter(dispatch, navigate, registerUserId, accessToken, axiosJWTLogoutRegistered);
    if(currentLoginUser)
      logOut(dispatch, navigate, loginUserId, refreshToken, axiosJWTLogout);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>profile</Text>
      <TouchableOpacity style={styles.btns} onPress={handleLogout}>
        <Text style={styles.labelBtns}>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btns: {
    padding: 15,
    backgroundColor: "#09CBD0",
    borderRadius: 100,
    width: "40%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});