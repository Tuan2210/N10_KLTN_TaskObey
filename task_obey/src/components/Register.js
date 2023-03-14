import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";
import axios, { all } from "axios";
import { url } from "../redux/createInstance";

import { loginUserPhone, registerUser } from "../redux/apiRequest/authApiRequest";
// import { getUserName } from "../redux/apiRequest/userApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha';
import { firebaseConfig } from "../config/firebase-config";
import firebase from 'firebase/compat/app';

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import PhoneInput from "react-native-phone-number-input";

import Icon from 'react-native-vector-icons/Ionicons';
import IconFA5 from "react-native-vector-icons/FontAwesome5";

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();
const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [flagTabRegister, setFlagTabRegister] = useState(false);
  const [getPhoneNumber, setGetPhoneNumber] = useState("");

  //////////
  function VerifiedScreen() {
    //OTP from firebase
    const [number, setNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);
    const phoneInput = useRef(PhoneInput);
    const [flag, setFlag] = useState(false);


    //check phone number data input
    const [newNumber, setNewNumber] = useState('');
    
    let phoneNumber = number.trim();
    let regexPhoneNumberVN = /\+?(0|84)\d{9}/.test(phoneNumber);
    
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
            const allNumber = res.data.length
            console.log(allNumber)
            if(allNumber != 0) 
              Alert.alert('Thông báo', 'SĐT này đã được đăng ký! Vui lòng dùng số khác.');
            if(res.data.length==0) {
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
            setFlagTabRegister(true);
            setGetPhoneNumber(phoneNumber);
            Alert.alert("Thông báo", "Xác thực thành công. Vui lòng chuyển tab 'Đăng ký'");
          })
          .catch((error) => {
            console.log(error);
            Alert.alert("Thông báo", "Xác thực không thành công!");
          });
        console.log(otp);
      }
    };
    return(
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
            <Text style={[{textAlign:'center',opacity:0.6, fontSize:17, marginTop: 18 }]}>Bạn đã có tài khoản?</Text>
            <Link to="/">
              <Text style={{
                color: '#09CBD0',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: 10,
                fontSize: 20,
                }}>Đăng nhập ngay!</Text>
            </Link>
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
    )
  }

  function RegisterScreen(){
    //////////show-hide-pw
    const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
    const togglePassword = () => {
      if (isSecureTextEntry) {
        setIsSecureTextEntry(false);
        return;
      }
      setIsSecureTextEntry(true);
    };
    //////////handle register
    const [txtInputUserName, setTxtInputUserName] = useState("");
    const [txtInputPhone, setTxtInputPhone] = useState("");
    // const [txtInputEmail, setTxtInputEmail] = useState("");
    const [txtInputPW, setTxtInputPW] = useState("");
    const [userName, setUserName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    // const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);  

    // useEffect(() => {
    //   handleRegister(phoneNumber, email);
    // }, [phoneNumber, email]);

    // async function handleRegister(phoneNumber, email) {
    //   await axios //phone
    //     .get(`${url}/api/user/userPhone/${phoneNumber}`)
    //     .then(async (response) => {
    //       if (response.data.length > 0) { //array not null
    //         setIsLoading(false);
    //         Alert.alert("Thông báo", "SĐT đã được đăng ký!");
    //       }

    //       if (response.data.length === 0) { //array null
    //         await axios //email
    //           .get(`${url}/api/user/userEmail/${email}`)
    //           .then((res) => {
    //             if(res.data.length > 0) {
    //               setIsLoading(false);
    //               Alert.alert('Thông báo', 'Email đã được đăng ký!');
    //             }
    //             if(res.data.length === 0) {
    //               const newUser = {
    //                 userName: userName,
    //                 email: email,
    //                 phoneNumber: phoneNumber,
    //                 password: password,
    //               };
    //               registerUser(newUser, dispatch, navigate, setIsLoading);
    //               window.setTimeout(function () {
    //                 navigate("/home");
    //                 console.log("registered user:", newUser);
    //               }, 2000);
    //             }
    //           });
    //       }
    //     });
    // }

    //check regex special characters
    // let isSpecialChars = /^(?=[a-zA-Z0-9~@#$^*()_+=[\]{}|\\,.?: -]*$)(?!.*[<>'"/;`%])/;
    let isSpecialChars = /[$&+,:;=?@#|"'<>.^*(){}/%!-/`~]/;

    //check regex username
    const [star1, setStar1] = useState('*');
    const [errMessUserName, setErrorMessUserName] = useState('');
    function checkUserName() {
      setStar1('');
      if(txtInputUserName==='') setErrorMessUserName('Vui lòng nhập tên tài khoản!');
      else if(isSpecialChars.test(txtInputUserName)) setErrorMessUserName('Tên tài khoản không chứa ký tự đặc biệt!');
      else setErrorMessUserName('');
    }

    //check regex sdt
    const [star2, setStar2] = useState("*");
    const [errorMessSDT, setErrorMessSDT] = useState('');
    let isNum = /^\d+$/.test(txtInputPhone);
    let regexPhoneNumber = /\+?(0|84)\d{9}/.test(txtInputPhone);
    function checkPhoneNumber() {
      setStar2('');
      if(txtInputPhone === '')
        setErrorMessSDT('Vui lòng nhập số điện thoại!');
      else if(!isNum) setErrorMessSDT('Vui lòng nhập lại số điện thoại!');
      else if(txtInputPhone.length !== 10) setErrorMessSDT('Vui lòng nhập đủ 10 ký tự số!');
      else if(!regexPhoneNumber) setErrorMessSDT('SĐT không hợp lệ!');
      // setErrorMessSDT(errorMessSDT => errorMessSDT = '✅');
      else setErrorMessSDT('');
    }

    //check regex email
    // const [star3, setStar3] = useState("*");
    // const [errorMessEmail, setErrorMessEmail] = useState('');
    // let regexEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(txtInputEmail);
    // function checkEmail() {
    //   setStar3('');
    //   if(txtInputEmail === '')
    //     setErrorMessEmail('Vui lòng nhập email!');
    //   else if(!regexEmail) setErrorMessEmail('Email không hợp lệ!');
    //   else setErrorMessEmail('');
    // }

    //check input pw
    const [star4, setStar4] = useState("*");
    const [errorMessPW, setErrorMessPW] = useState('');
    function checkPW() {
      setStar4('');
      if(txtInputPW === '') setErrorMessPW('Vui lòng nhập mật khẩu!');
      else if(txtInputPW.length < 6) setErrorMessPW('Mật khẩu phải tối thiểu 6 ký tự!');
      else if(isSpecialChars.test(txtInputPW)) setErrorMessPW('Mật khẩu không chứa ký tự đặc biệt!');
      else {
        setErrorMessPW('');
        setIsLoading(true);
        
        setUserName(txtInputUserName);
        setPhoneNumber(txtInputPhone);
        // setEmail(txtInputEmail);
        setPassword(txtInputPW);
      }
    }

    //check data inputs
    function checkDataInputInfo() {
      checkUserName();
      checkPhoneNumber();
      // checkEmail();
      checkPW();
    }
    //////////

    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            display: !flagTabRegister ? "flex" : "none",
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
        <View 
          style={{ 
            display: flagTabRegister ? "flex" : "none", 
            width: "100%",
            height: '100%',
            padding: "5%", 
            backgroundColor: '#fff' 
          }}>
          <Image
            source={require("../../assets/img-header-register.jpg")}
            resizeMode="contain"
            style={{ height: "25%", alignSelf: "center" }}
          />
          <ScrollView
            style={{
              // backgroundColor: 'yellow',
              width: "70%",
              alignSelf: "center",
            }}
          >
            <Text style={{color: 'red'}}>{star1}</Text>
            <TextInput
              style={styles.styleInput}
              placeholder="Tên tài khoản"
              numberOfLines={1}
              onChangeText={(txt) => setTxtInputUserName(txt.trim())}
            />
            <Text style={styles.errMess}>{errMessUserName}</Text>
            <Text style={{color: 'red', marginBottom: '-3%'}}>{star2}</Text>
            <TextInput
              style={[styles.styleInput, { marginTop: "5%" }]}
              placeholder="Số điện thoại"
              maxLength={10}
              keyboardType="numeric"
              numberOfLines={1}
              onChangeText={(txt) => setTxtInputPhone(txt.trim())}
              // value={phoneNumber}
            />
            <Text style={styles.errMess}>{errorMessSDT}</Text>
            {/* <Text style={{color: 'red', marginBottom: '-3%'}}>{star3}</Text>
            <TextInput
              style={[styles.styleInput, { marginTop: "5%" }]}
              placeholder="Email"
              keyboardType="email-address"
              numberOfLines={1}
              onChangeText={(txt) => setTxtInputEmail(txt.trim())}
            />
            <Text style={styles.errMess}>{errorMessEmail}</Text> */}
            <Text style={{color: 'red', marginBottom: '-3%'}}>{star4}</Text>
            <View style={{ flexDirection: "row", alignSelf: "center", marginLeft: '-2%' }}>
              <TextInput
                style={[styles.styleInput, { marginTop: "7%", marginLeft: "-2%" }]}
                placeholder="Mật khẩu"
                numberOfLines={1}
                secureTextEntry={isSecureTextEntry}
                onChangeText={(txt) => setTxtInputPW(txt.trim())}
                // value={passwordInput}
                // name="password"
              />
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  height: 40,
                  paddingLeft: 5,
                  paddingRight: 5,
                  marginLeft: "-14%",
                  marginTop: "5%",
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
            {isLoading ? (
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ alignSelf: "center" }}>Đang tạo tài khoản</Text>
                <Image
                  source={require("../../assets/loading-dots.gif")}
                  style={{
                    resizeMode: "contain",
                    width: 50,
                    height: 50,
                    marginLeft: "3%",
                  }}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles.btns} onPress={checkDataInputInfo}>
                <Text style={styles.labelBtns}>Đăng ký</Text>
              </TouchableOpacity>
            )}
            <View style={{ marginTop: "5%" }}>
              <Text style={styles.labels}>Bạn đã có tài khoản?</Text>
              <Link to="/">
                <Text
                  style={[
                    styles.labels,
                    { fontWeight: "bold", textDecorationLine: "underline" },
                  ]}
                >
                  Đăng nhập ngay
                </Text>
              </Link>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
  return(
    <SafeAreaView style={{flex : 1 }}>
      <Animatable.View animation="bounceInDown" style={styles.container}>
      <View style={{flexDirection: "row", width: '100%', marginTop: '5%', justifyContent: "space-around", alignSelf: "center"}}>
          <Link to="/">
            <View style={{flexDirection: "row", justifyContent: "space-around"}}>
              <IconFA5 name="caret-left" size={26} color="#fff" />
              <Text style={[styles.labels, {color: '#fff', marginLeft: '2%'}]}>Trở về</Text>
            </View>
          </Link>
          <Text style={{fontSize: 15, color: "#fff", fontWeight: "bold", alignSelf: "center"}}>Đăng ký</Text>
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
                    } else if (route.name === "Đăng ký") {
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
                  tabBarInactiveTintColor: "#555"
                })}
              >
                <Tab.Screen name="Xác thực SĐT" component={VerifiedScreen} />
                <Tab.Screen name="Đăng ký" component={RegisterScreen} />
              </Tab.Navigator>
            </NavigationContainer>
          </View>
        </View>
      </Animatable.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09CBD0",
  },
  styleInput: {
    backgroundColor: "rgba(211, 211, 211, 0.404)",
    alignSelf: "center",
    width: "100%",
    height: 40,
    fontSize: 17,
    marginTop: 5,
    marginRight: 0,
    marginBottom: 5,
    marginLeft: 0,
    paddingLeft: 10,
  },
  errMess: {
    color: 'red',
    fontStyle: "italic",
    fontSize: 15,
  },
  btns: {
    alignSelf: "center",
    padding: 15,
    backgroundColor: "#09CBD0",
    borderRadius: 100,
    width: "45%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: '10%',
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
});
