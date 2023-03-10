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
        Alert.alert("Th??ng b??o", "Vui l??ng nh???p s??? ??i???n tho???i!");
      else if (phoneNumber.length !== 12)
        Alert.alert("Th??ng b??o", "Vui l??ng nh???p ????? 9 k?? t??? sau c???a s??? ??i???n tho???i!");
      else if (!regexPhoneNumberVN)
        Alert.alert("Th??ng b??o", "S??T kh??ng h???p l???!");
      else {
        await axios
          .get(`${url}/api/user/userPhone/${phoneNumVN}`)
          .then((res) => {
            const allNumber = res.data.length
            console.log(allNumber)
            if(allNumber != 0) 
              Alert.alert('Th??ng b??o', 'S??T n??y ???? ???????c ????ng k??! Vui l??ng d??ng s??? kh??c.');
            if(res.data.length==0) {
              try {
                const phoneProvider = new firebase.auth.PhoneAuthProvider();
                phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current).then(setVerificationId);
                console.log(number);
                setNumber(phoneNumber);
                setFlag(true);
              } catch (err) {
                console.log(err.message);
                Alert.alert("Th??ng b??o", "Vui l??ng nh???p l???i s?? ??i???n tho???i!");
              }
            }
          });
      }
    }

    const verifyOtp = () => {
      if (otp === "" || otp === undefined) Alert.alert("Th??ng b??o", "Vui l??ng nh???p m?? x??c th???c!");
      else if (otp.length !== 6) Alert.alert("Th??ng b??o", "Vui l??ng nh???p 6 k?? t???!");
      else {
        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(() => {
            setOtp("");
            setFlagTabRegister(true);
            setGetPhoneNumber(phoneNumber);
            Alert.alert("Th??ng b??o", "X??c th???c th??nh c??ng. Vui l??ng chuy???n tab '????ng k??'");
          })
          .catch((error) => {
            console.log(error);
            Alert.alert("Th??ng b??o", "X??c th???c kh??ng th??nh c??ng!");
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
              placeholder="S??? ??i???n tho???i"
              withShadow
              onChangeFormattedText={(text) => setNumber(text)}
              layout="first"
              autoFocus
              containerStyle={{
                width: "100%",
              }}
            />
            <Text style={[{textAlign:'center',opacity:0.6, fontSize:17, marginTop: 18 }]}>Ba??n ??a?? co?? ta??i khoa??n?</Text>
            <Link to="/">
              <Text style={{
                color: '#09CBD0',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: 10,
                fontSize: 20,
                }}>????ng nh????p ngay!</Text>
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
              <Text style={{ color: "#fff", fontWeight: "bold" }}>G???i m?? x??c th???c</Text>
            </TouchableOpacity>
          </View>
          <View style={{ display: flag ? "flex" : "none" }}>
            <TextInput
              placeholder="Nh???p m?? x??c th???c"
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
              <Text style={{ color: "#fff", fontWeight: "bold" }}>X??c nh???n m??</Text>
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
    //         Alert.alert("Th??ng b??o", "S??T ???? ???????c ????ng k??!");
    //       }

    //       if (response.data.length === 0) { //array null
    //         await axios //email
    //           .get(`${url}/api/user/userEmail/${email}`)
    //           .then((res) => {
    //             if(res.data.length > 0) {
    //               setIsLoading(false);
    //               Alert.alert('Th??ng b??o', 'Email ???? ???????c ????ng k??!');
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
      if(txtInputUserName==='') setErrorMessUserName('Vui l??ng nh???p t??n t??i kho???n!');
      else if(isSpecialChars.test(txtInputUserName)) setErrorMessUserName('T??n t??i kho???n kh??ng ch???a k?? t??? ?????c bi???t!');
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
        setErrorMessSDT('Vui l??ng nh???p s??? ??i???n tho???i!');
      else if(!isNum) setErrorMessSDT('Vui l??ng nh???p l???i s??? ??i???n tho???i!');
      else if(txtInputPhone.length !== 10) setErrorMessSDT('Vui l??ng nh???p ????? 10 k?? t??? s???!');
      else if(!regexPhoneNumber) setErrorMessSDT('S??T kh??ng h???p l???!');
      // setErrorMessSDT(errorMessSDT => errorMessSDT = '???');
      else setErrorMessSDT('');
    }

    //check regex email
    // const [star3, setStar3] = useState("*");
    // const [errorMessEmail, setErrorMessEmail] = useState('');
    // let regexEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(txtInputEmail);
    // function checkEmail() {
    //   setStar3('');
    //   if(txtInputEmail === '')
    //     setErrorMessEmail('Vui l??ng nh???p email!');
    //   else if(!regexEmail) setErrorMessEmail('Email kh??ng h???p l???!');
    //   else setErrorMessEmail('');
    // }

    //check input pw
    const [star4, setStar4] = useState("*");
    const [errorMessPW, setErrorMessPW] = useState('');
    function checkPW() {
      setStar4('');
      if(txtInputPW === '') setErrorMessPW('Vui l??ng nh???p m???t kh???u!');
      else if(txtInputPW.length < 6) setErrorMessPW('M???t kh???u ph???i t???i thi???u 6 k?? t???!');
      else if(isSpecialChars.test(txtInputPW)) setErrorMessPW('M???t kh???u kh??ng ch???a k?? t??? ?????c bi???t!');
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
            Vui l??ng x??c th???c s??? ??i???n tho???i tr?????c!
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
              placeholder="T??n t??i kho???n"
              numberOfLines={1}
              onChangeText={(txt) => setTxtInputUserName(txt.trim())}
            />
            <Text style={styles.errMess}>{errMessUserName}</Text>
            <Text style={{color: 'red', marginBottom: '-3%'}}>{star2}</Text>
            <TextInput
              style={[styles.styleInput, { marginTop: "5%" }]}
              placeholder="S??? ??i???n tho???i"
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
                placeholder="M???t kh???u"
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
                <Text style={{ alignSelf: "center" }}>??ang t???o t??i kho???n</Text>
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
                <Text style={styles.labelBtns}>????ng k??</Text>
              </TouchableOpacity>
            )}
            <View style={{ marginTop: "5%" }}>
              <Text style={styles.labels}>B???n ???? c?? t??i kho???n?</Text>
              <Link to="/">
                <Text
                  style={[
                    styles.labels,
                    { fontWeight: "bold", textDecorationLine: "underline" },
                  ]}
                >
                  ????ng nh???p ngay
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
              <Text style={[styles.labels, {color: '#fff', marginLeft: '2%'}]}>Tr??? v???</Text>
            </View>
          </Link>
          <Text style={{fontSize: 15, color: "#fff", fontWeight: "bold", alignSelf: "center"}}>????ng k??</Text>
        </View>
        <View style={styles.box}>
          <View style={styles.form}>
            <NavigationContainer>
              <Tab.Navigator
                tabBarPosition="bottom"
                initialRouteName="X??c th???c S??T"
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "X??c th???c S??T") {
                      iconName = "sms";
                      size = focused ? 24 : 20;
                      color = focused ? "#09CBD0" : "#555";
                    } else if (route.name === "????ng k??") {
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
                <Tab.Screen name="X??c th???c S??T" component={VerifiedScreen} />
                <Tab.Screen name="????ng k??" component={RegisterScreen} />
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
