import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../redux/createInstance";

import { registerUser } from "../redux/apiRequest/authApiRequest";
// import { getUserName } from "../redux/apiRequest/userApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import Icon from 'react-native-vector-icons/Ionicons';

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function Register() {
  const user = useSelector((state) => state.auth.login?.currentUser);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  
  //////////handle register
  const [txtInputUserName, setTxtInputUserName] = useState("");
  const [txtInputPhone, setTxtInputPhone] = useState("");
  const [txtInputEmail, setTxtInputEmail] = useState("");
  const [txtInputPW, setTxtInputPW] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);  

  useEffect(() => {
    handleRegister(phoneNumber, email);
  }, [phoneNumber, email]);

  async function handleRegister(phoneNumber, email) {
    await axios //phone
      .get(`${url}/api/user/userPhone/${phoneNumber}`)
      .then(async (response) => {
        if (response.data.length > 0) { //array not null
          setIsLoading(false);
          Alert.alert("Thông báo", "SĐT đã được đăng ký!");
        }

        if (response.data.length === 0) { //array null
          await axios //email
            .get(`${url}/api/user/userEmail/${email}`)
            .then((res) => {
              if(res.data.length > 0) {
                setIsLoading(false);
                Alert.alert('Thông báo', 'Email đã được đăng ký!');
              }
              if(res.data.length === 0) {
                const newUser = {
                  userName: userName,
                  email: email,
                  phoneNumber: phoneNumber,
                  password: password,
                  refreshToken: '',
                };
                registerUser(newUser, dispatch, navigate, setIsLoading);
                window.setTimeout(function () {
                  navigate("/home");
                  console.log("registered user:", newUser);
                }, 2000);
              }
            });
        }
      });
  }

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
  const [star3, setStar3] = useState("*");
  const [errorMessEmail, setErrorMessEmail] = useState('');
  let regexEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(txtInputEmail);
  function checkEmail() {
    setStar3('');
    if(txtInputEmail === '')
      setErrorMessEmail('Vui lòng nhập email!');
    else if(!regexEmail) setErrorMessEmail('Email không hợp lệ!');
    else setErrorMessEmail('');
  }

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
      setEmail(txtInputEmail);
      setPassword(txtInputPW);
    }
  }

  //check data inputs
  function checkDataInputInfo() {
    checkUserName();
    checkPhoneNumber();
    checkEmail();
    checkPW();
  }
  //////////

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/img-header-register.jpg")}
        resizeMode="contain"
        style={{ height: "30%", alignSelf: "center" }}
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
        <Text style={{color: 'red', marginBottom: '-3%'}}>{star3}</Text>
        <TextInput
          style={[styles.styleInput, { marginTop: "5%" }]}
          placeholder="Email"
          keyboardType="email-address"
          numberOfLines={1}
          onChangeText={(txt) => setTxtInputEmail(txt.trim())}
        />
        <Text style={styles.errMess}>{errorMessEmail}</Text>
        <View style={{ flexDirection: "row", alignSelf: "center", marginLeft: '-2%' }}>
          <Text style={{color: 'red'}}>{star4}</Text>
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
              marginTop: "3%",
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
});
