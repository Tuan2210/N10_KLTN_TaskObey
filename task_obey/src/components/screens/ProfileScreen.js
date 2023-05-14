import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";

import { url } from "../../redux/createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { logOut, logOutRegsiter } from "../../redux/apiRequest/authApiRequest";
import { changeUsername } from "../../redux/apiRequest/userApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar, Drawer } from "react-native-paper";

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

import axios from "axios";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function ProfileScreen() {
  const currentLoginUser = useSelector(
    (state) => state.auth.login?.currentUser
  );
  const loginUserId = currentLoginUser?._id;
  const refreshToken = currentLoginUser?.refreshToken;
  const loginUserNameAcc = currentLoginUser?.userName;

  const currentRegisterUser = useSelector(
    (state) => state.auth.register?.currentUserRegister
  );
  const registerUserId = currentRegisterUser?._id;
  const accessToken = currentRegisterUser?.token;
  const registerUserNameAcc = currentRegisterUser?.userName;

  useEffect(() => {
    if (currentRegisterUser && !currentLoginUser) {
      loadUserInfoById(registerUserId);
    }
    if (!currentRegisterUser && currentLoginUser) {
      loadUserInfoById(loginUserId);
    }
  }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      }
    } catch (error) {
      console.log(error);
    }
  }
  // useEffect(() => console.log(userInfo));
  //////

  const [isLoading, setIsLoading] = useState(false);
  //////handle update userName or pw
  const [txtUsername, setTxtUsername] = useState("");
  function checkUsername() {
    setIsLoading(true);
    window.setTimeout(function () {
      if (txtUsername === userInfo.userName) {
        setIsLoading(false);
        Alert.alert(
          "Thông báo",
          "Tên tài khoản bị trùng, vui lòng đặt tên khác!"
        );
      } else {
        handleChangeUserName();
      }
    }, 3000);
  }
  function handleChangeUserName() {
    setIsLoading(false);
    const account = {
      phoneNumber: userInfo.phoneNumber,
      userName: txtUsername,
    };
    changeUsername(account);
    setTxtUsername("");
    Alert.alert("Thông báo", "Hệ thống đã đổi tên tài khoản thành công!");
  }
  //////

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          height: "20%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <Avatar.Image
          source={require("../../../assets/avaUser-resize.gif")}
          size={210}
          style={styles.avatar}
        /> */}
        <Image
          source={require("../../../assets/avaUser-resize.gif")}
          resizeMode="contain"
          style={{ width: "45%" }}
        />
      </View>
      <View style={styles.form}>
        <Text style={styles.tittle}>Thông tin cá nhân</Text>
        <View style={styles.infoRow}>
          <TextInput
            editable={false}
            // placeholder="Số điện thoại"
            value={userInfo.phoneNumber}
            style={styles.StyleTextInput}
          />
        </View>
        <View style={styles.infoRow}>
          <TextInput
            placeholder="Tên tài khoản"
            style={styles.StyleTextInput}
            numberOfLines={1}
            onChangeText={(txt) => setTxtUsername(txt)}
            value={txtUsername}
          />
        </View>
        <View style={styles.infoRow}>
          <TextInput
            placeholder="Mật khẩu"
            style={styles.StyleTextInput}
            numberOfLines={1}
            // onChangeText={(txt) => }
          />
        </View>
        <View style={styles.columnButton}>
          {isLoading ? (
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ alignSelf: "center" }}>Hệ thống đang xử lý</Text>
              <Image
                source={require("../../../assets/loading-dots.gif")}
                style={{
                  resizeMode: "contain",
                  width: 50,
                  height: 50,
                  marginLeft: "3%",
                }}
              />
            </View>
          ) : (
            <View style={{ height: "40%" }}>
              <TouchableOpacity
                style={styles.btns}
                onPress={() => {
                  if (
                    txtUsername.length === 0 ||
                    txtUsername === "" ||
                    txtUsername === null
                  )
                    Alert.alert("Thông báo", "Vui lòng nhập tên tài khoản!");
                  else {
                    Alert.alert(
                      "Xác nhận",
                      "Bạn có muốn đổi tên tài khoản?",
                      [
                        {
                          text: "Đổi",
                          onPress: () => {
                            checkUsername();
                          },
                        },
                        {
                          text: "Hủy",
                          onPress: () => console.log("Hủy xóa"),
                          style: "cancel",
                        },
                      ],
                      { cancelable: false }
                    );
                  }
                }}
              >
                <Text style={styles.titleLabel}>Đổi tên tài khoản</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* <TouchableOpacity style={styles.btns}>
            <Text style={styles.titleLabel}>Đổi mật khẩu</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
  },
  btns: {
    // padding: 15,
    backgroundColor: "#09CBD0",
    borderRadius: 100,
    width: "65%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: "5%",
    alignSelf: "center",
  },
  box: {
    marginTop: "5%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 80,
    justifyContent: "center",
  },
  form: {
    flex: 0.99,
    alignSelf: "center",
  },
  tittle: {
    fontSize: 25,
    margin: "2%",
    fontWeight: "700",
    textAlign: "center",
    color: "#09CBD0",
  },
  avatar: {
    marginTop: "-7%",
    width: "50%",
    alignSelf: "center",
  },
  infoRow: {
    flex: 0.1099,
    flexDirection: "row",
    justifyContent: "space-around",
    margin: "4.8%",
    height: "35%",
  },
  columnButton: {
    flex: 0.4,
    flexDirection: "column",
    marginTop: "5%",
  },
  StyleTextInput: {
    backgroundColor: "#BCF4F5",
    alignSelf: "center",
    width: "85%",
    height: "120%",
    fontSize: 18,
    marginTop: 5,
    marginRight: 0,
    marginBottom: 5,
    marginLeft: 0,
    paddingLeft: 10,
    borderRadius: 15,
    borderColor: "black",
    borderWidth: 1,
  },
  titleLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});
