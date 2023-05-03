import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";

import { createAxios } from "../../redux/createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { logOut, logOutRegsiter } from "../../redux/apiRequest/authApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

import {Avatar, Drawer} from 'react-native-paper'
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
      {/* <Text>profile</Text> */}
      <View style={{width: "100%", height:"15%", justifyContent:'flex-start',}}>
          <Avatar.Image source={require("../../../assets/avaUser.gif")} 
            size={210} 
            style={styles.avatar}/>
      </View>
      <View style={styles.form}>
        <Text style={styles.tittle}>Thông tin cá nhân</Text>
        <View style={styles.infoRow}>
          {/* <Text style={styles.tittleInfo}>Tên tài khoản: </Text> */}
          <TextInput editable={false} placeholder="Tên tài khoản" style={styles.StyleTextInput}></TextInput>
        </View>
        <View style={styles.infoRow}>
          {/* <Text style={styles.tittleInfo}>Số điện thoại: </Text> */}
          <TextInput editable={false} placeholder="Số điện thoại" style={styles.StyleTextInput}></TextInput>
        </View>
        <View style={styles.infoRow}>
          {/* <Text style={styles.tittleInfo}>Mật khẩu: </Text> */}
          <TextInput editable={false} placeholder="Mật khẩu" style={styles.StyleTextInput}></TextInput>
        </View>
        <View style={styles.columnButton}>
        <TouchableOpacity style={styles.btns} 
          // onPress={handleLogout}
          >
          <Text style={styles.tittleLabel}>Cập nhật thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btns} onPress={handleLogout}>
          <Text style={styles.tittleLabel}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        </View>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'space-evenly'
  },
  btns: {
    // padding: 15,
    backgroundColor: "#09CBD0",
    borderRadius: 100,
    width: "70%",
    height: "40%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: "5%",
    alignSelf: 'center'
  },
  box: {
    marginTop: '5%',
    height: '100%',
    backgroundColor: "#fff",
    borderRadius: 80,
    justifyContent: "center"
  },
  form: {
    flex: 0.99,
    alignSelf: "center",
  },
  tittle: {
    flex: 0.11,
    fontSize: 23,
    margin: "5%",
    fontWeight:'700',
    textAlign:'center',
    color:"#09CBD0",
  },
  avatar:{
    marginTop: "-7%",
    height: "25%",
    width: "50%",
    alignSelf:'center'
  },
  tittleInfo: {
    textAlign:"left",
    color:"#09CBD0",  
    fontWeight: '500',
    fontSize:17,
    width: "40%",
    marginTop: "-0.25%"
  },
  infoRow: {
    flex: 0.1099,
    flexDirection:'row',
    justifyContent: "space-around",
    margin: "4.8%",
    height: "35%"
  },
  columnButton: {
    flex: 0.4,
    flexDirection: 'column',
    margin: "5%"
  },
  StyleTextInput: {
    backgroundColor: "#BCF4F5",
    alignSelf: "center",
    width: "95%",
    height: "127%",
    fontSize: 18,
    marginTop: 5,
    marginRight: 0,
    marginBottom: 5,
    marginLeft: 0,
    paddingLeft: 10,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth:1,
  },
  tittleLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff'
  },
});