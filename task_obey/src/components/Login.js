import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../redux/createInstance";

import { loginUser } from "../redux/apiRequest/authApiRequest";

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

export default function Login() {
  //splash-screen
  const splashscreen = useRef(new Animated.Value(0)).current;
  const [isVisible, setisVisible] = useState(true);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(splashscreen, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  useEffect(() => {
    let myTimeout = setTimeout(() => {
      setisVisible(false);
    }, 4000); //4s
    return () => clearTimeout(myTimeout);
  }, []);

  //sound effect: https://docs.expo.dev/versions/latest/sdk/audio/#sound
  // https://mixkit.co/free-sound-effects
  useEffect(() => {
    handlePlaySound();
  });
  const handlePlaySound = async () => {
    if (isVisible == true) {
      const audioObj = new Audio.Sound();

      try {
        // await audioObj.loadAsync(require("../../assets/sound_effects_splashscreen.mp3"));
        await audioObj.loadAsync(
          require("../../assets/mixkit-tick-tock-clock-timer-1045.wav")
        );
        // console.log(audioObj);
        await audioObj.playAsync();
      } catch (err) {
        console.log(err);
      }
    }
  };

  function showSplashScreen() {
    return (
      <Animated.View
        style={[
          {
            width: widthScreen,
            height: heightScreen,
            backgroundColor: "#09CBD0",
            alignItems: "center",
            justifyContent: "space-evenly",
          },
          { opacity: splashscreen },
        ]}
      >
        <Animated.Image
          style={[{ width: widthScreen, height: "32%", marginTop: '-5%' }]}
          source={require("../../assets/taskobey_line.png")}
          resizeMode="contain"
        />
        <Animated.Image
          style={[{ height: "40%", marginTop: "-28%" }]}
          source={require("../../assets/clock.gif")}
          resizeMode="contain"
        />
        <Animated.Image
        style={[{ marginTop: "-10%" }]}
          source={require("../../assets/loading.gif")}
          resizeMode="contain"
        />
        <View style={{flexDirection: "row", width: '100%', justifyContent: "center", marginTop: '-5%'}}>
          <Text style={{fontSize: 16, color: '#fff', fontWeight: "bold", marginRight: 10}}>Ứng dụng thực hiện bởi:</Text>
          <Text style={{fontSize: 16, color: '#fff', fontWeight: "bold"}}>
            Đinh Quang Tuấn{'\n'}
            Phùng Bùi Trọng Hiếu
          </Text>
        </View>
      </Animated.View>
    );
  }

  //show-hide-pw
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
  const togglePassword = () => {
    if (isSecureTextEntry) {
      setIsSecureTextEntry(false);
      return;
    }
    setIsSecureTextEntry(true);
  };

  //handle login
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    await axios
      .get(`${url}/api/user/userPhone/${phoneNumber.trim()}`)
      .then((res) => {
        if(res.data.length === 0) { //array null
          setIsLoading(false);
          Alert.alert('Thông báo', 'Hệ thống không tìm thấy SĐT đăng nhập, xin vui lòng thử lại!');
        }
        if(res.data.length > 0) { //array not null
          {res.data.map(async (userData, index) => {
            await axios
              .get(`${url}/api/user/userPW/${userData.phoneNumber}/${password.trim()}`)
              .then((res) => {
                if(!res.data){
                  setIsLoading(false);
                  Alert.alert('Thông báo', 'Mật khẩu đăng nhập không đúng, xin vui lòng thử lại!');
                }
                else {
                  const user = {
                    phoneNumber: phoneNumber.trim(),
                    password: password.trim(),
                  };
                  loginUser(user, dispatch, navigate, setIsLoading);
                  window.setTimeout(function () {
                    navigate("/home");
                    console.log("logined user:", user);
                  }, 1000);
                }
              });
          })}
        }
      });
  }

  function checkDataInputInfo() {
    setIsLoading(true);

    //write check regex & validation here

    handleLogin();
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {isVisible ? (
        showSplashScreen()
      ) : (
        // <FrmLogin />
        <Animatable.View animation="fadeInUp" style={styles.container}>
          <Image source={require("../../assets/img-header-login.png")} resizeMode="contain" style={{height: '30%'}}/>
          <View style={{alignItems: "center"}}>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={styles.styleInput}
                placeholder="Số điện thoại"
                maxLength={10}
                keyboardType="numeric"
                numberOfLines={1}
                onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                // value={phoneNumber}
              />
              <View style={{ justifyContent: "center", marginLeft: 10 }}>
                <Icon name="phone-portrait-outline" size={40} color="#09CBD0" />
              </View>
            </View>
            {/* <Text style={styles.errorMess}>{errorMessSDT}</Text> */}
            <View style={{ flexDirection: "row", marginTop: '5%' }}>
              <TextInput
                style={styles.styleInput}
                placeholder="Mật khẩu"
                numberOfLines={1}
                secureTextEntry={isSecureTextEntry}
                onChangeText={(password) => setPassword(password)}
                // value={passwordInput}
                // name="password"
              />
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  borderColor: "cyan",
                  borderWidth: 1,
                  borderStyle: "solid",
                  height: 40,
                  paddingLeft: 5,
                  paddingRight: 5,
                  marginLeft: 10,
                }}
                onPress={togglePassword}
              >
                {isSecureTextEntry ? (
                  <Icon name="eye-sharp" size={30} color="#09CBD0" />
                ) : (
                  <Icon name="eye-off-sharp" size={30} color="#09CBD0" />
                )}
              </TouchableOpacity>
            </View>
            {/* <Text style={styles.errorMess}>{errorMessPW}</Text> */}
          </View>
          {isLoading ? (
            <Text>Đang đăng nhập...</Text>
          ) : (
            <View style={{ flexDirection: "row", width: '80%', justifyContent: "space-around" }}>
              {/* <TouchableOpacity style={styles.btns}>
                <Text style={styles.labelBtns} onPress={() => navigation.navigate('TabBarBottom')}>Đăng nhập</Text>
              </TouchableOpacity> */}
              <TouchableOpacity style={styles.btns} onPress={checkDataInputInfo}>
                <Text style={styles.labelBtns}>Đăng nhập</Text>
              </TouchableOpacity>
              <Text style={styles.labels}>Hoặc</Text>
              <TouchableOpacity style={styles.btns}>
                <Text style={styles.labelBtns}>Google</Text>
                <Image source={require("../../assets/google-icon.png")} style={{marginLeft: 10}} />
              </TouchableOpacity>
            </View>
          )}
          <View>
            <Text style={styles.labels}>Bạn chưa có tài khoản?</Text>
            {/* <Text style={[styles.labels, {fontWeight: "bold", textDecorationLine: "underline"}]} onPress={() => navigation.navigate('Register')}>Đăng ký ngay</Text> */}
            <Link to='/register'>
              <Text style={[styles.labels, {fontWeight: "bold", textDecorationLine: "underline"}]}>
                Đăng ký ngay
              </Text>
            </Link>
          </View>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  styleInput: {
    backgroundColor: "rgba(211, 211, 211, 0.404)",
    width: '65%',
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  labels: {
    fontSize: 15,
    color: "#09CBD0",
    alignSelf: "center",
  },
});
