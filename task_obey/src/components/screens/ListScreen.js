import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../../redux/createInstance";

import { SafeAreaView } from "react-native-safe-area-context";

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function ListScreen() {
  const currentLoginUser = useSelector((state) => state.auth.login?.currentUser);
  const loginUserId = currentLoginUser?._id;

  const currentRegisterUser = useSelector((state) => state.auth.register?.currentUserRegister);
  const registerUserId = currentRegisterUser?._id;
  
  const [userId, setUserId] = useState();
  useEffect(() => {
    if(currentRegisterUser && !currentLoginUser)
      setUserId(registerUserId);
    if(!currentRegisterUser && currentLoginUser)
      setUserId(loginUserId)
  }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dataList, setDataList] = useState([]);
  const [dataTaskName, setDataTaskName] = useState();
  const [dataDayTime, setDataDayTime] = useState();
  useEffect(() => {
    loadListNotFinishTasks(userId);
  }, [userId]);

  async function loadListNotFinishTasks(userId) {
    await axios
      .get(`${url}/api/task/notFinishTasks/${userId}`)
      .then((res) => {
        if(res.data.length > 0) {
          // {res.data.map((taskData, index) => {
          //   console.log(taskData);
          //   setDataTaskName(taskData.taskName);
          //   setDataDayTime(taskData.dayTime);
          // })}
          setDataList(res.data);
        };
      })
  }

  let sliceDay, sliceTime;
  const [time, setTime] = useState();
  const [selectedIdItemData, setSelectedIdItemData] = useState(null);
  const ItemData = ({ item, onPress, activeItemBg, activeItemFont }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        activeItemBg,
        {
          width: "100%",
          height: 200,
          alignSelf: "center",
          justifyContent: "space-around",
          // marginLeft: "3%",
          marginTop: "4%",
          borderRadius: 20,
          borderColor: "#09CBD0",
          borderWidth: 1.2,
          borderStyle: "solid",
        },
      ]}
    >
      <View style={{ padding: '5%' }}>
        <Text 
          style={[
            activeItemFont, 
            { 
              fontSize: 20, 
              // backgroundColor:"red", 
              width: '100%',
              height: '85%'
            }]}
        >
          {item.taskName}
        </Text>
        <Text
          style={{
            color: "#D4A055",
            fontSize: 16,
            fontWeight: "bold",
            alignSelf: "flex-end"
          }}
        >
          {
            [
              sliceDay = (new Date(item.dayTime)).toLocaleDateString(),', ',
              sliceTime = (new Date(item.dayTime)).toLocaleTimeString()
            ]
          }
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* <Text>{dataTaskName}</Text>
        <Text>{dataDayTime}</Text> */}
        <FlatList
          key={"#"}
          // numColumns={2}
          data={dataList}
          renderItem={({ item }) => {
            // const backgroundColor =
            //   item.id === selectedIdItemData ? "#fff" : "black";
            // const color = item.id === selectedIdItemData ? "black" : "#fff";
            return (
              <ItemData
                item={item}
                onPress={() => setSelectedIdItemData(item.id)}
                activeItemBg={{  }}
                activeItemFont={{  }}
                // viewImgItem={{ width: "auto", height: 100 }}
              />
            );
          }}
          style={{
            width: '100%', 
            height: '100%',
            padding: '5%'
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});