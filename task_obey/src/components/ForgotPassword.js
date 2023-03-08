import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, LogBox, ScrollView } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch } from "react-redux";
import axios from "axios";
import { url } from "../redux/createInstance";

import { changePassword } from "../redux/apiRequest/userApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

//link doc expo av: https://docs.expo.dev/versions/latest/sdk/av
import { Audio } from "expo-av";

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA5 from "react-native-vector-icons/FontAwesome5";


//link npm: https://www.npmjs.com/package/react-native-phone-number-input
//link clip: https://www.youtube.com/watch?v=gtEUVndgIzU
//link code country: https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/types.ts#L252
//npm i react-native-phone-number-input
import PhoneInput from 'react-native-phone-number-input';

//new link firebase-expo-recaptcha: https://docs.expo.dev/versions/latest/sdk/firebase-recaptcha/
//link yt: https://www.youtube.com/watch?v=ePk0fjrNo6c
//npm i firebase@9.6.11
//npm i expo-firebase-recaptcha react-native-webview
import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha';
import { firebaseConfig } from "../config/firebase-config";
import firebase from 'firebase/compat/app';

//link doc: https://reactnavigation.org/docs/tab-based-navigation/
//npm i @react-navigation/native @react-navigation/bottom-tabs
//link clip: https://www.youtube.com/watch?v=_031dsQNy88
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;
const Tab = createMaterialTopTabNavigator();

LogBox.ignoreLogs(["Possible Unhandled Promise Rejection"]);

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [flagTabNewPW, setFlagTabNewPW] = useState(false);
  const [getPhoneNumber, setGetPhoneNumber] = useState("");

  //create tab react-native
  function VerifiedScreen() {
    //OTP firebase
    const [number, setNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);
    const phoneInput = useRef(PhoneInput);
    const [flag, setFlag] = useState(false);
    
    //check phone number data
    const [newNumber, setNewNumber] = useState('');
    useEffect(() => {
      if(newNumber.length>1) {
        const phoneVN = "0" + newNumber.slice(3, 12);
        console.log('phoneVN:', phoneVN);
        handleCheckPhoneData(phoneVN);
      }
    }, [newNumber]);
    async function handleCheckPhoneData(phoneNumVN) {
      if (phoneNumber === "" || phoneNumber === undefined)
        Alert.alert("Thông báo", "Vui lòng nhập số điện thoại!");
      else if (phoneNumber.length !== 12)
        Alert.alert("Thông báo", "Vui lòng nhập đủ 9 ký tự sau của số điện thoại!");
      else if (!regexPhoneNumberVN)
        Alert.alert("Thông báo", "SĐT không hợp lệ!");
      else {
        await axios
          .get(`${url}/api/user/userPhone/${phoneNumVN}`)
          .then((res) => {
            if(res.data.length===0) Alert.alert('Thông báo', 'SĐT này chưa được đăng ký!');
            if(res.data.length>0) {
              try {
                const phoneProvider = new firebase.auth.PhoneAuthProvider();
                phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current).then(setVerificationId);
                console.log(number);
                setNumber(phoneNumber);
                setFlag(true);
              } catch (err) {
                console.log(err.message);
                Alert.alert("Thông báo", "Vui lòng nhập lại só điện thoại!");
              }
            }
          });
      }
    }

    let phoneNumber = number.trim();
    let regexPhoneNumberVN = /\+?(0|84)\d{9}/.test(phoneNumber);
    

    const verifyOtp = () => {
      if (otp === "" || otp === undefined) Alert.alert("Thông báo", "Vui lòng nhập mã xác thực!");
      else if (otp.length !== 6) Alert.alert("Thông báo", "Vui lòng nhập 6 ký tự!");
      else {
        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(() => {
            setOtp("");
            setFlagTabNewPW(true);
            setGetPhoneNumber(phoneNumber);
            Alert.alert("Thông báo", "Xác thực thành công. Vui lòng chuyển tab 'Mật khẩu mới'");
          })
          .catch((error) => {
            console.log(error);
            Alert.alert("Thông báo", "Xác thực không thành công!");
          });
        console.log(otp);
      }
    };

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-around",
          alignItems: "center",
          borderTopColor: "#09CBD0",
          borderStyle: "solid",
          borderTopWidth: 1,
        }}
      >
        <View style={{ width: "90%" }}>
          <View style={{ display: !flag ? "flex" : "none" }}>
            <PhoneInput
              ref={phoneInput}
              defaultValue={number}
              defaultCode="VN"
              placeholder="Số điện thoại"
              withShadow
              onChangeFormattedText={(text) => setNumber(text)}
              layout="first"
              autoFocus
              containerStyle={{
                width: "100%",
              }}
            />
            <TouchableOpacity
              style={{
                marginTop: 30,
                backgroundColor: "#09CBD0",
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
              }}
              onPress={() => setNewNumber(number)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Gửi mã xác thực</Text>
            </TouchableOpacity>
          </View>
          <View style={{ display: flag ? "flex" : "none" }}>
            <TextInput
              placeholder="Nhập mã xác thực"
              onChangeText={setOtp}
              keyboardType="number-pad"
              autoComplete="tel"
              style={{
                height: 50,
                padding: 15,
                fontSize: 18,
                shadowColor: "rgba(0,0,0, .4)", // IOS
                shadowOffset: { height: 1, width: 1 }, // IOS
                shadowOpacity: 1, // IOS
                shadowRadius: 1, //IOS
                elevation: 2, // Android
                backgroundColor: "#fff",
              }}
            />
            <TouchableOpacity
              style={{
                marginTop: 30,
                backgroundColor: "#09CBD0",
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
              }}
              onPress={verifyOtp}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Xác nhận mã</Text>
            </TouchableOpacity>
          </View>
          <View>
            <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig}/>
          </View>
        </View>
      </View>
    );
  }
  function RenewPWScreen() {
    //show-hide-pw
    const [isSecureNewPW, setIsSecureNewPW] = useState(true);
    const toggleNewPW = () => {
      if (isSecureNewPW) {
        setIsSecureNewPW(false);
        return;
      }
      setIsSecureNewPW(true);
    };
    const [isSecureConfirmNewPW, setIsSecureConfirmNewPW] = useState(true);
    const toggleConfirmNewPW = () => {
      if (isSecureConfirmNewPW) {
        setIsSecureConfirmNewPW(false);
        return;
      }
      setIsSecureConfirmNewPW(true);
    };

    const [passwordInputNewPW, setPasswordInputNewPW] = useState("");
    const [passwordInputConfirmNewPW, setPasswordInputConfirmNewPW] = useState("");
    const [systemLine, setSystemLine] = useState('');
    // function checkNewPW() {
      
    // }
    // function checkConfirmNewPW() {
      
    // }
    function checkDataInputs() {
      setSystemLine('Hệ thống đang xử lý...');
      if(passwordInputNewPW === "" || passwordInputConfirmNewPW === "") {
        setSystemLine('');
        Alert.alert("Thông báo", "Vui lòng nhập chỗ trống!");
      }
      else {
        if (passwordInputNewPW.length < 6 || passwordInputConfirmNewPW.length < 6) {
          setSystemLine('');
          Alert.alert("Thông báo", "Vui lòng nhập tối thiểu 6 ký tự mật khẩu!");
        }
        else {
          if (!passwordInputNewPW.includes(passwordInputConfirmNewPW)) {
            setSystemLine('');
            Alert.alert("Thông báo", "Mật khẩu nhập lại không khớp với mật khẩu mới!");
          }
          else {
            // CHANGE PASSWORD
            //+84944302210
            const phoneTabNewPW = "0" + getPhoneNumber.slice(3, 12); //lấy chuỗi từ ký tự thứ 3 là 9, đến ký tự thứ 12 là sau số 0 cuối
            const account = {
              phoneNumber: phoneTabNewPW.trim(),
              password: passwordInputConfirmNewPW,
            };
            changePassword(account, navigate, setSystemLine);
            window.setTimeout(function () {
              navigate("/home");
              console.log(account);
            }, 2000);
          }
        }
      }
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          borderTopColor: "#09CBD0",
          borderStyle: "solid",
          borderTopWidth: 1,
        }}
      >
        <View
          style={{
            display: !flagTabNewPW ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            width: "100%",
            height: "100%",
          }}
        >
          <Image source={require("../../assets/stop.gif")} style={{ height: "60%", width: "50%" }}/>
          <Text
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: 16,
              backgroundColor: "#fff",
              marginTop: "-5%",
              paddingTop: "2%",
            }}
          >
            Vui lòng xác thực số điện thoại trước!
          </Text>
        </View>
        <View style={{ display: flagTabNewPW ? "flex" : "none", width: "80%", padding: "5%" }}>
          <ScrollView>
            <View style={styles.viewIputsPW}>
              <TextInput
                placeholder="Mật khẩu mới"
                secureTextEntry={isSecureNewPW}
                value={passwordInputNewPW}
                onChangeText={(txt) => setPasswordInputNewPW(txt.trim())}
                style={[
                  styles.txtInputsNewPW,
                  {
                    shadowColor: "rgba(0,0,0, .4)", // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    elevation: 2, // Android
                  },
                ]}
              />
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  height: 55,
                  paddingLeft: 5,
                  paddingRight: 5,
                  marginLeft: -46,
                  marginTop: "-10%",
                }}
                onPress={toggleNewPW}
              >
                {isSecureNewPW ? (
                  <Icon name="eye-sharp" size={30} color="#09CBD0" />
                ) : (
                  <Icon name="eye-off-sharp" size={30} color="#09CBD0" />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.viewIputsPW}>
              <TextInput
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={isSecureConfirmNewPW}
                value={passwordInputConfirmNewPW}
                onChangeText={(txt) => setPasswordInputConfirmNewPW(txt.trim())}
                style={[
                  styles.txtInputsNewPW,
                  {
                    shadowColor: "rgba(0,0,0, .4)", // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    elevation: 2, // Android
                  },
                ]}
              />
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  height: 55,
                  paddingLeft: 5,
                  paddingRight: 5,
                  marginLeft: -46,
                  marginTop: "-10%",
                }}
                onPress={toggleConfirmNewPW}
              >
                {isSecureConfirmNewPW ? (
                  <Icon name="eye-sharp" size={30} color="#09CBD0" />
                ) : (
                  <Icon name="eye-off-sharp" size={30} color="#09CBD0" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={{color: 'red', fontSize: 15, fontStyle: "italic"}}>{systemLine}</Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#09CBD0",
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                marginTop: '10%'
              }}
              onPress={() => checkDataInputs()}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Xác nhận</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
    
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animatable.View animation="bounceInDown" style={styles.container}>
        <View style={{flexDirection: "row", width: '100%', marginTop: '5%', justifyContent: "space-around", alignSelf: "center"}}>
          <Link to="/">
            <View style={{flexDirection: "row", justifyContent: "space-around"}}>
              <IconFA5 name="caret-left" size={26} color="#fff" />
              <Text style={[styles.labels, {color: '#fff', marginLeft: '2%'}]}>Trở về</Text>
            </View>
          </Link>
          <Text style={{fontSize: 15, color: "#fff", fontWeight: "bold", alignSelf: "center"}}>Quên / Đổi mật khẩu</Text>
        </View>
        <View style={styles.box}>
          <View style={styles.form}>
            <NavigationContainer>
              <Tab.Navigator
                tabBarPosition="bottom"
                initialRouteName="Xác thực SĐT"
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Xác thực SĐT") {
                      iconName = "sms";
                      size = focused ? 24 : 20;
                      color = focused ? "#09CBD0" : "#555";
                    } else if (route.name === "Mật khẩu mới") {
                      iconName = focused ? "lock-open" : "lock";
                      size = focused ? 22 : 20;
                      color = focused ? "#09CBD0" : "#555";
                    }
                    return <IconFA5 name={iconName} size={size} color={color} />;
                  },
                  tabBarStyle: {
                    width: widthScreen - 100,
                    height: 60,
                  },
                  tabBarItemStyle: {
                    padding: 5,
                    alignItems: "center"
                  },
                  tabBarActiveTintColor: "#09CBD0",
                  // tabBarActiveBackgroundColor: "#09CBD0",
                  tabBarInactiveTintColor: "#555",
                  // tabBarInactiveBackgroundColor: "#09CBD0",
                  // headerTitleAlign: "center",
                  // headerTitleStyle: {
                  //   color: "#09CBD0",
                  // },
                })}
              >
                <Tab.Screen name="Xác thực SĐT" component={VerifiedScreen} />
                <Tab.Screen name="Mật khẩu mới" component={RenewPWScreen} />
              </Tab.Navigator>
            </NavigationContainer>
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
    marginTop: '5%',
    height: '100%',
    backgroundColor: "#fff",
    borderRadius: 80,
    justifyContent: "center"
  },
  form: {
    alignSelf: "center",
    // width: widthScreen,
    height: '75%',
    alignItems: "center",
    marginBottom: '20%'
  },
  labels: {
    fontSize: 15,
    color: "#09CBD0",
    alignSelf: "center"
  },
  viewIputsPW: {
    width: '100%',
    flexDirection: "row"
  },
  txtInputsNewPW: {
    height: 55,
    width: '100%',
    padding: 15,
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: '10%'
  }
});