import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, LogBox, Switch } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../redux/createInstance";

import { loginUserPhone } from "../redux/apiRequest/authApiRequest";

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

export default function Login() {
  //////////splash-screen
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
  //////////

  //////////show-hide-pw
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
  const togglePassword = () => {
    if (isSecureTextEntry) {
      setIsSecureTextEntry(false);
      return;
    }
    setIsSecureTextEntry(true);
  };
  //////////

  //switch toggle
  const [flag, setFlag] = useState(false); //default phone number

  //////////handle login
  const user = useSelector((state) => state.auth.login?.currentUser);
  const registeredUser = useSelector((state) => state.auth.register?.currentUserRegister);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [txtInputPhone, setTxtInputPhone] = useState("");
  // const [txtInputEmail, setTxtInputEmail] = useState("");
  const [txtInputPW, setTxtInputPW] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useEffect(() => {
  //   handleLoginEmail(email, password);
  // }, [email, password]);
  
  // async function handleLoginEmail(email, pw) {
  //   await axios
  //     .get(`${url}/api/user/userEmail/${email}`)
  //     .then((res) => {
  //       if(res.data.length === 0) { //array null
  //         setIsLoading(false);
  //         Alert.alert('Thông báo', 'Hệ thống không tìm thấy email đăng nhập, xin vui lòng thử lại!');
  //       }
  //       if(res.data.length > 0) { //array not null
  //         {res.data.map(async (userData, index) => {
  //           await axios
  //             .get(`${url}/api/user/userPwByEmail/${userData.email}/${pw}`)
  //             .then((res) => {
  //               if(!res.data){
  //                 setIsLoading(false);
  //                 Alert.alert('Thông báo', 'Mật khẩu đăng nhập không đúng, xin vui lòng thử lại!');
  //               }
  //               else {
  //                 const user = {
  //                   email: email,
  //                   password: pw,
  //                 };
  //                 loginUserEmail(user, dispatch, navigate, setIsLoading);
  //                 window.setTimeout(function () {
  //                   navigate("/home");
  //                   console.log("logined user:", user);
  //                 }, 1500);
  //               }
  //             });
  //         })}
  //       }
  //     });
  // }

  useEffect(() => {
    handleLoginPhone(phoneNumber, password);
  }, [phoneNumber, password]);

  async function handleLoginPhone(phoneNumber, pw) {
    await axios
      .get(`${url}/api/user/userPhone/${phoneNumber}`)
      .then((res) => {
        if(res.data.length === 0) { //array null
          setIsLoading(false);
          Alert.alert('Thông báo', 'Hệ thống không tìm thấy SĐT đăng nhập, xin vui lòng thử lại!');
        }
        if(res.data.length > 0) { //array not null
          {res.data.map(async (userData, index) => {
            await axios
              .get(`${url}/api/user/userPwByPhone/${userData.phoneNumber}/${pw}`)
              .then((res) => {
                if(!res.data){
                  setIsLoading(false);
                  Alert.alert('Thông báo', 'Mật khẩu đăng nhập không đúng, xin vui lòng thử lại!');
                }
                else {
                  const user = {
                    phoneNumber: phoneNumber,
                    password: pw,
                  };
                  loginUserPhone(user, dispatch, navigate, setIsLoading);
                  window.setTimeout(function () {
                    navigate("/home");
                    console.log("logined user:", user);
                  }, 1500);
                }
              });
          })}
        }
      });
  }

  //check regex sdt
  const [errorMessSDT, setErrorMessSDT] = useState('');
  let isNum = /^\d+$/.test(txtInputPhone);
  let regexPhoneNumber = /\+?(0|84)\d{9}/.test(txtInputPhone);
  function checkPhoneNumber() {
    if(txtInputPhone === '')
      setErrorMessSDT('Vui lòng nhập số điện thoại!');
    else if(!isNum) setErrorMessSDT('Vui lòng nhập lại số điện thoại!');
    else if(txtInputPhone.length !== 10) setErrorMessSDT('Vui lòng nhập đủ 10 ký tự số!');
    else if(!regexPhoneNumber) setErrorMessSDT('SĐT không hợp lệ!');
    // setErrorMessSDT(errorMessSDT => errorMessSDT = '✅');
    else setErrorMessSDT('');
  }

  //check regex email
  // const [errorMessEmail, setErrorMessEmail] = useState('');
  // let regexEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(txtInputEmail);
  // function checkEmail() {
  //   if(txtInputEmail === '')
  //     setErrorMessEmail('Vui lòng nhập email!');
  //   else if(!regexEmail) setErrorMessEmail('Email không hợp lệ!');
  //   else setErrorMessEmail('');
  // }

  //check input pw
  const [errorMessPW, setErrorMessPW] = useState('');
  function checkPW() {
    if(txtInputPW === '') setErrorMessPW('Vui lòng nhập mật khẩu!');
    else if(txtInputPW.length < 6) setErrorMessPW('Mật khẩu phải tối thiểu 6 ký tự!');
    else {
      setErrorMessPW('');
      setIsLoading(true);
      
      // if(flag===false) setPhoneNumber(txtInputPhone);
      // if(flag===true) setEmail(txtInputEmail);

      setPhoneNumber(txtInputPhone);
      setPassword(txtInputPW);
    }
  }

  //check data inputs
  function checkDataInputInfo() {
    // if(flag===false) { //phone number
      checkPhoneNumber();
      checkPW();
    // }
    // if(flag===true) { //email
    //   checkEmail();
    //   checkPW();
    // }
  }

  useEffect(() => {
    if(user) {
      showSplashScreen();
      window.setTimeout(function () {
        navigate("/home");
        console.log("logined user:", user);
      }, 4000); //4s
    }
    if(registeredUser) {
      showSplashScreen();
      window.setTimeout(function () {
        navigate("/home");
        console.log("registered user:", registeredUser);
      }, 4000); //4s
    };
  }, []);
  //////////

  return (
    <SafeAreaView style={{flex: 1}}>
      {isVisible ? (
        showSplashScreen()
      ) : (
        // <FrmLogin />
        <Animatable.View animation="fadeInUp" style={styles.container}>
          <Image source={require("../../assets/img-header-login.png")} resizeMode="contain" style={{height: '30%'}}/>
          <View style={{width: '70%'}}>
            <View style={{ flexDirection: "row", alignSelf: "center", display: !flag ? 'flex' : 'none' }}>
              <TextInput
                style={styles.styleInput}
                placeholder="Số điện thoại"
                maxLength={10}
                keyboardType="numeric"
                numberOfLines={1}
                onChangeText={(text) => setTxtInputPhone(text.trim())}
                // value={phoneNumber}
              />
              <View style={{ justifyContent: "center", marginLeft: 10 }}>
                <Icon name="phone-portrait-outline" size={40} color="#09CBD0" />
              </View>
            </View>
            {/* <View style={{ flexDirection: "row", alignSelf: "center", display: flag ? 'flex' : 'none' }}>
              <TextInput
                style={styles.styleInput}
                placeholder="Email"
                keyboardType="email-address"
                numberOfLines={1}
                onChangeText={(text) => setTxtInputEmail(text.trim())}
              />
              <View style={{ justifyContent: "center", marginLeft: 10 }}>
                <Icon name="mail-outline" size={40} color="#09CBD0" />
              </View>
            </View> */}
            <Text style={[styles.errMess, {display: !flag ? 'flex' : 'none'}]}>{errorMessSDT}</Text>
            {/* <Text style={[styles.errMess, {display: flag ? 'flex' : 'none'}]}>{errorMessEmail}</Text> */}
            <View style={{ flexDirection: "row", alignSelf: "center", marginTop: '5%' }}>
              <TextInput
                style={styles.styleInput}
                placeholder="Mật khẩu"
                numberOfLines={1}
                secureTextEntry={isSecureTextEntry}
                onChangeText={(text) => setTxtInputPW(text.trim())}
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
            <Text style={styles.errMess}>{errorMessPW}</Text>
            {/* <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: '2%'}}>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: '48%'}}>
                <Text style={{fontSize: 16, color: '#09CBD0'}}>SĐT</Text>
                <Switch
                  trackColor={{false: '#09CBD0', true: '#09CBD0'}}
                  thumbColor={'#fff9c4'}
                  style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], marginLeft: '-4%' }}
                  value={flag}
                  onValueChange={(value) => {
                    setFlag(value);
                    setErrorMessSDT('');
                    setErrorMessEmail('');
                  }}
                />
                <Text style={{fontSize: 16, color: '#09CBD0'}}>Email</Text>
              </View>
              <Link to='/forgotPW'>
                <Text style={[styles.labels, {fontWeight: "bold", textDecorationLine: "underline"}]}>
                  Bạn quên mật khẩu?
                </Text>
              </Link>
            </View> */}
          </View>
          {isLoading ? (
            <View style={{flexDirection: "row", alignSelf: "center", justifyContent: "center"}}>
              <Text style={{alignSelf: "center"}}>Đang đăng nhập</Text>
              <Image 
                source={require('../../assets/loading-dots.gif')}
                style={{resizeMode: "contain", width: 50, height: 50, marginLeft: '3%'}}
              />
            </View>
          ) : (
            <View style={{ flexDirection: "row"}}>
              <TouchableOpacity style={styles.btns} onPress={checkDataInputInfo}>
                <Text style={styles.labelBtns}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          )}
          <View>
            <Text style={styles.labels}>Bạn chưa có tài khoản?</Text>
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
    width: '82%',
    height: 40,
    fontSize: 17,
    paddingLeft: 10,
  },
  errMess: {
    color: 'red',
    fontStyle: "italic",
    fontSize: 15,
    // marginLeft: '-70%'
  },
  btns: {
    padding: 15,
    backgroundColor: "#09CBD0",
    borderRadius: 100,
    width: "50%",
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