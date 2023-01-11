import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";

import { loginUser, registerUser } from "../redux/apiRequest/authApiRequest";
import { getUserName } from "../redux/apiRequest/userApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";
import axios from "axios";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function Register() {
  const user = useSelector((state) => state.auth.login?.currentUser);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  
  // const handleLogin = (phoneNumber, password) => {
  //   const registeredUser = {
  //     phoneNumber: phoneNumber,
  //     password: password,
  //   };
  //   loginUser(registeredUser, dispatch, navigate, setIsLoading);
  // };

  // useEffect(() => {
  //   if (user) {
  //     navigate("/home");
  //   }
  // });

  function checkDataInputInfo() {
    //write check regex & validation here

    const newUser = {
      userName: userName.trim(),
      phoneNumber: phoneNumber.trim(),
      password: password.trim()
    }
    getUserName(dispatch, newUser.userName);
    registerUser(newUser, dispatch, navigate, setIsLoading);
    window.setTimeout(function () {
      navigate("/home");
      console.log(newUser);
    }, 1000);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>register</Text>
      <TextInput 
        style={styles.styleInput} 
        placeholder="Tên tài khoản" 
        numberOfLines={1} 
        onChangeText={(userName) => setUserName(userName)}
      />
      <TextInput
        style={styles.styleInput}
        placeholder="Số điện thoại"
        maxLength={10}
        keyboardType="numeric"
        numberOfLines={1}
        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
        // value={phoneNumber}
      />
      <TextInput
        style={styles.styleInput}
        placeholder="Mật khẩu"
        numberOfLines={1}
        // secureTextEntry={isSecureTextEntry}
        onChangeText={(password) => setPassword(password)}
        // value={passwordInput}
        // name="password"
      />
      {isLoading ? (
        <Text>Đang tạo tài khoản...</Text>
      ) : (
        <TouchableOpacity style={styles.btns} onPress={checkDataInputInfo}>
          <Text style={styles.labelBtns}>Đăng ký</Text>
        </TouchableOpacity>
      )}
      <Link to="/">
        <Text style={[styles.labels, { fontWeight: "bold", textDecorationLine: "underline" }]}>
          Đăng nhập ngay
        </Text>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  styleInput: {
    backgroundColor: "rgba(211, 211, 211, 0.404)",
    width: "65%",
    height: 40,
    fontSize: 17,
    marginTop: 5,
    marginRight: 0,
    marginBottom: 5,
    marginLeft: 0,
    paddingLeft: 10,
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
  labelBtns: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  labels: {
    fontSize: 15,
    color: "#09CBD0",
    alignSelf: "center",
  },
});
