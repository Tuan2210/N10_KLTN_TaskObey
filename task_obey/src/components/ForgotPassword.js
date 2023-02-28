import React, { useEffect, useState } from "react";
import { Alert, Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, LogBox } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../redux/createInstance";

import { loginUserPhone, loginUserEmail } from "../redux/apiRequest/authApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

//link doc expo av: https://docs.expo.dev/versions/latest/sdk/av
import { Audio } from "expo-av";

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import Icon from 'react-native-vector-icons/Ionicons';

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

LogBox.ignoreLogs(["Possible Unhandled Promise Rejection"]);

export default function ForgotPassword() {
    
  return (
    <SafeAreaView style={{flex: 1}}>
      <Animatable.View animation="bounceInDown" style={styles.container}>
        <View style={styles.box}>
          <View style={styles.form}>
            <Text style={{fontSize: 18, color: "#09CBD0", fontWeight: "bold"}}>Quên / Đổi mật khẩu</Text>
            <Link to='/'>
            <Text style={styles.labels}>Trở về đăng nhập</Text>
            </Link>
          </View>
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#09CBD0',
    flex: 1
  },
  box: {
    marginTop: '20%',
    height: '100%',
    backgroundColor: "#fff" ,
    borderRadius: 80
  },
  form: {
    marginTop: '10%',
    alignItems: "center"
  },
  labels: {
    fontSize: 15,
    color: "#09CBD0",
    alignSelf: "center"
  },
});