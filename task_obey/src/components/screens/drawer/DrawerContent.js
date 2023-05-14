import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";

import { createAxios, url } from "../../../redux/createInstance";
import { logoutSuccess } from "../../../redux/authSlice";
import { logOut, logOutRegsiter } from "../../../redux/apiRequest/authApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

import { DrawerContentScrollView } from "@react-navigation/drawer";
import {Avatar, Drawer} from 'react-native-paper'

//link fix after config file babel.config.js
//https://docs.expo.dev/versions/latest/sdk/reanimated/

//link yt style drawer: https://www.youtube.com/watch?v=ayxRtBHw754

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeicons from "react-native-vector-icons/FontAwesome";
import MaterialCommunityicons from "react-native-vector-icons/MaterialCommunityIcons";

import axios from "axios";

export default function DrawerContent(props) {
  const currentLoginUser = useSelector((state) => state.auth.login?.currentUser);
  const loginUserId = currentLoginUser?._id;
  const refreshToken = currentLoginUser?.refreshToken;
  // const loginUserNameAcc = currentLoginUser?.userName;

  const currentRegisterUser = useSelector((state) => state.auth.register?.currentUserRegister);
  const registerUserId = currentRegisterUser?._id;
  const accessToken = currentRegisterUser?.token;
  // const registerUserNameAcc = currentRegisterUser?.userName;

  const [userNameAcc, setUserNameAcc] = useState();
  useEffect(() => {
    const interval = setInterval(() => {
      if(currentRegisterUser && !currentLoginUser) {
        loadUserInfoById(registerUserId);
      }
      if(!currentRegisterUser && currentLoginUser) {
        loadUserInfoById(loginUserId);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentRegisterUser, currentLoginUser]);

  // useEffect(() => {
    // console.log('accessToken:', accessToken);
    // console.log('refreshToken:', refreshToken);
    // console.log(currentLoginUser);
    // console.log(currentRegisterUser);
  // })

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // let axiosJWTLogout = createAxios(currentLoginUser, dispatch, logoutSuccess);
  // let axiosJWTLogoutRegistered = createAxios(currentRegisterUser, dispatch, logoutSuccess);

  //handle logout
  function handleLogout() {
    if(currentRegisterUser){
      const axiosJWTLogoutRegistered = createAxios(currentRegisterUser, dispatch, logoutSuccess);
      logOutRegsiter(dispatch, navigate, registerUserId, accessToken);
    }
    if(currentLoginUser){
      const axiosJWTLogout = createAxios(currentLoginUser, dispatch, logoutSuccess);
      logOut(dispatch, navigate, loginUserId, refreshToken);
    }
  }

  //handle active tab drawer
  const [activeBgHomeTabDrawer, setActiveBgHomeTabDrawer] = useState('#09CBD0');
  const [activeFontHomeTabDrawer, setActiveFontHomeTabDrawer] = useState('#fff');
  const [activeIconHome, setActiveIconHome] = useState('md-home');
  function handleActiveHomeTabDrawer() {
    setActiveBgHomeTabDrawer("#09CBD0");
    setActiveFontHomeTabDrawer("#fff");
    setActiveIconHome("md-home");

    setActiveBgProfileTabDrawer("#fff");
    setActiveFontProfileTabDrawer("black");
    setActiveIconProfile("user-o");

    setActiveBgStatisticTabDrawer('#fff');
    setActiveFontStatisticTabDrawer('black');
  }

  const [activeBgStatisticTabDrawer, setActiveBgStatisticTabDrawer] = useState("#fff");
  const [activeFontStatisticTabDrawer, setActiveFontStatisticTabDrawer] = useState("black");
  function handleActiveStatisticTabDrawer() {
    setActiveBgStatisticTabDrawer("#09CBD0");
    setActiveFontStatisticTabDrawer("#fff");

    setActiveBgHomeTabDrawer("#fff");
    setActiveFontHomeTabDrawer("black");
    setActiveIconHome("md-home-outline");

    setActiveBgProfileTabDrawer("#fff");
    setActiveFontProfileTabDrawer("black");
    setActiveIconProfile("user-o");
  }

  const [activeBgProfileTabDrawer, setActiveBgProfileTabDrawer] = useState("#fff");
  const [activeFontProfileTabDrawer, setActiveFontProfileTabDrawer] = useState("black");
  const [activeIconProfile, setActiveIconProfile] = useState('user-o');
  function handleActiveProfileTabDrawer() {
    setActiveBgProfileTabDrawer("#09CBD0");
    setActiveFontProfileTabDrawer("#fff");
    setActiveIconProfile("user");

    setActiveBgHomeTabDrawer("#fff");
    setActiveFontHomeTabDrawer("black");
    setActiveIconHome("md-home-outline");

    setActiveBgStatisticTabDrawer('#fff');
    setActiveFontStatisticTabDrawer('black');
  }
  
  //////handle load user-info by id
  const [userInfo, setUserInfo] = useState("");
  async function loadUserInfoById(userId) {
    try {
      const res = await axios.get(`${url}/api/user/userInfo/${userId}`, {
        timeout: 1000,
      });
      if (res.data.length === 0) console.log("no user data");
      if (res.data.length > 0) {
        setUserInfo(res.data[0]);
        setUserNameAcc(res.data[0].userName);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // useEffect(() => console.log(userInfo));
  //////

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} style={{ flex: 1 }}>
        {/* header drawer */}
        <View style={{ flexDirection: "row", width: "100%" }}>
          <Avatar.Image source={require("../../../../assets/avaUser.gif")} size={150} style={{ marginLeft: "-10%", marginTop: "-10%" }} />
          <View style={{ marginTop: "3%", marginLeft: "-10%" }}>
            <View>
              <Text style={{ fontSize: 17, color: "gray" }}>Xin chào,</Text>
              <Text style={{ fontSize: 17, color: "#09CBD0", fontWeight: "bold" }}>{userNameAcc}</Text>
            </View>
            <Text style={{ fontSize: 15, color: "gray", marginTop: "5%" }}>Hôm nay bạn làm gì?</Text>
          </View>
        </View>

        {/* content drawer */}
        <View
          style={{
            width: "100%",
            borderTopColor: "#f4f4f4",
            borderTopWidth: 2,
            marginTop: "-5%",
            paddingTop: "3%",
            paddingLeft: "5%",
            paddingRight: "5%",
          }}
        >
          {/* tab drawer Home */}
          <TouchableOpacity
            style={[styles.btns, {backgroundColor: activeBgHomeTabDrawer}]}
            onPress={() => {
              handleActiveHomeTabDrawer();
              props.navigation.navigate("Trang chủ");
            }}
          >
            <Ionicons name={activeIconHome} color={activeFontHomeTabDrawer} size={30} />
            <Text style={[styles.lblBtns, { color: activeFontHomeTabDrawer }]}>Trang chủ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btns, {backgroundColor: activeBgStatisticTabDrawer}]}
            onPress={() => {
              handleActiveStatisticTabDrawer();
              props.navigation.navigate("Thống kê");
            }}
          >
            <MaterialCommunityicons name="chart-line" color={activeFontStatisticTabDrawer} size={30} />
            <Text style={[styles.lblBtns, { color: activeFontStatisticTabDrawer }]}>Thống kê</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btns, {backgroundColor: activeBgProfileTabDrawer}]}
            onPress={() => {
              handleActiveProfileTabDrawer();
              props.navigation.navigate("Thông tin cá nhân");
            }}
          >
            <FontAwesomeicons name={activeIconProfile} color={activeFontProfileTabDrawer} size={30} />
            <Text style={[styles.lblBtns, { color: activeFontProfileTabDrawer }]}>Thông tin cá nhân</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* footer drawer */}
      <Drawer.Section style={styles.bottomDrawer}>
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <MaterialIcons name="logout" color="#fff" size={30} />
          <Text style={styles.lblBtnLogout}>Đăng xuất</Text>
        </TouchableOpacity>
      </Drawer.Section>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomDrawer: {
    marginBottom: 15,
    borderColor: "#f4f4f4",
    borderTopWidth: 2,
    padding: 10,
  },
  infoHeaderDrawer: {
    fontSize: 14,
    color: "gray",
  },
  btns: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    padding: 10,
    paddingTop: '7%',
    paddingBottom: '7%'
  },
  lblBtns: {
    marginLeft: "5%",
    fontSize: 18,
  },
  btnLogout: {
    alignSelf: "center",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
  },
  lblBtnLogout: {
    marginLeft: "10%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});