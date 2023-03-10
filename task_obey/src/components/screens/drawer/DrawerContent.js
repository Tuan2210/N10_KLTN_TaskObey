import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { DrawerContentScrollView } from "@react-navigation/drawer";
import {Avatar, Drawer} from 'react-native-paper'

//link fix after config file babel.config.js
//https://docs.expo.dev/versions/latest/sdk/reanimated/

//link yt style drawer: https://www.youtube.com/watch?v=ayxRtBHw754

import { useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";

import { createAxios } from "../../../redux/createInstance";
import { logoutSuccess } from "../../../redux/authSlice";
import { logOut } from "../../../redux/apiRequest/authApiRequest";

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function DrawerContent(props) {
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const userId = currentUser?._id;
  const refreshToken = currentUser?.refreshToken;
  const userNameAcc = currentUser?.userName;
  const currentPhone = currentUser?.phoneNumber;
  const currentEmail = currentUser?.email;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let axiosJWTLogout = createAxios(currentUser, dispatch, logoutSuccess);

  function handleLogout() {
    if(!currentUser) navigate('/'); //handle logout when user want to logout after register
    else logOut(dispatch, navigate, userId, refreshToken, axiosJWTLogout);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} style={{flex: 1}}>
        <View>
          <View style={{flexDirection: "row", width: "100%"}}>
            <Avatar.Image
              source={require("../../../../assets/avaUser.gif")}
              size={150}
              style={{ marginLeft: "-10%", marginTop: "-10%" }}
            />
            <View style={{marginTop: '3%', marginLeft: '-7%'}}>
              <View style={{marginBottom: '5%'}}>
                  <Text style={{fontSize: 18, color: '#09CBD0', fontWeight: "bold"}}>{userNameAcc}</Text>
              </View>
              <View style={{flexDirection: "row"}}>
                  <Text style={styles.infoHeaderDrawer}>SĐT: {'\u00A0'}{'\u00A0'}</Text>
                  <Text style={[styles.infoHeaderDrawer, {color: '#09CBD0'}]}>{currentPhone}!</Text>
              </View>
              <View style={{flexDirection: "row"}}>
                  <Text style={styles.infoHeaderDrawer}>Email: </Text>
                  <Text style={[styles.infoHeaderDrawer, {color: '#09CBD0'}]}>{currentEmail}!</Text>
              </View>
            </View>
          </View>
          <View 
            style={{
              width: '100%',
              borderTopColor: '#f4f4f4',
              borderTopWidth: 2,
              marginTop: '-5%'
            }}>
            <Text>content</Text>
          </View>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawer}>
        <TouchableOpacity style={styles.btns} onPress={handleLogout}>
          <MaterialIcons name="logout" color="#fff" size={30} />
          <Text style={styles.labelBtns}>Đăng xuất</Text>
        </TouchableOpacity>
      </Drawer.Section>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomDrawer: {
    marginBottom: 15,
    borderColor: "#f4f4f4",
    borderTopWidth: 2,
    padding: 10,
  },
  infoHeaderDrawer: {
    fontSize: 14,
    color: 'gray'
  },
  btns: {
    alignSelf: "center",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    backgroundColor: "#09CBD0",
    padding: 10
  },
  labelBtns: {
    marginLeft: '10%',
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});