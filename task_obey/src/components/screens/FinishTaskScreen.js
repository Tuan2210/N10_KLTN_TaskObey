import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../../redux/createInstance";

import { SafeAreaView } from "react-native-safe-area-context";

import moment from "moment";

export default function FinishTaskScreen() {
  const currentLoginUser = useSelector(
    (state) => state.auth.login?.currentUser
  );
  const loginUserId = currentLoginUser?._id;

  const currentRegisterUser = useSelector(
    (state) => state.auth.register?.currentUserRegister
  );
  const registerUserId = currentRegisterUser?._id;

  const [userId, setUserId] = useState();
  useEffect(() => {
    if (currentRegisterUser && !currentLoginUser) {
      setUserId(registerUserId);
      loadListNotFinishTasks(registerUserId);
    }
    if (!currentRegisterUser && currentLoginUser) {
      setUserId(loginUserId);
      loadListNotFinishTasks(loginUserId);
    }
  }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dataList, setDataList] = useState([]);
  // useEffect(() => {
  //   loadListNotFinishTasks(userId);
  // }, [userId]);

  async function loadListNotFinishTasks(userId) {
    await axios.get(`${url}/api/task/finishTasks/${userId}`).then((res) => {
      if (res.data.length > 0) {
        // {
        //   res.data.map((taskData, index) => {
        //     console.log(taskData);
        //     setDataTaskName(taskData.taskName);
        //     setDataDayTime(taskData.dayTime);
        //   });
        // }
        setDataList(res.data);
      }
    });
  }
  // useEffect(() => console.log(dataList));

  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  async function onRefresh() {
    setRefreshing(true);
    try {
      const res = await axios.get(`${url}/api/task/finishTasks/${userId}`, {
        timeout: 4000,
      });
      if (res.data.length === 0) console.log("no data finish-task in list");
      if (res.data.length > 0) {
        setDataList(res.data);
        setRefreshing(false);
      }
    } catch (error) {
      console.log(error);
    }
    wait(4000).then(() => setRefreshing(false));
  }

  /////handle sort newest finishDateTime
  const sortNewestFinishDateTime = dataList.sort((a, b) => {
    const dateA = moment(a.finishDateTime, "D/M/YYYY, HH [giờ] mm [phút]");
    const dateB = moment(b.finishDateTime, "D/M/YYYY, HH [giờ] mm [phút]");
    return dateB - dateA;
  });
  /////

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
          backgroundColor: "#fff",
        },
      ]}
    >
      <View style={{ padding: "5%" }}>
        <Text
          style={[
            activeItemFont,
            {
              fontSize: 20,
              // backgroundColor:"red",
              width: "100%",
              height: "85%",
            },
          ]}
        >
          {item.taskName}
        </Text>
        <Text
          style={{
            color: "#D4A055",
            fontSize: 16,
            fontWeight: "bold",
            alignSelf: "flex-end",
          }}
        >
          Ngày hoàn thành:{"\u00A0"}
          {item.finishDateTime}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>{dataTaskName}</Text>
        <Text>{dataDayTime}</Text> */}
      <FlatList
        key={"#"}
        // numColumns={2}
        data={sortNewestFinishDateTime}
        renderItem={({ item }) => {
          // const backgroundColor =
          //   item.id === selectedIdItemData ? "#fff" : "black";
          // const color = item.id === selectedIdItemData ? "black" : "#fff";
          return (
            <ItemData
              item={item}
              onPress={() => setSelectedIdItemData(item.id)}
              activeItemBg={{}}
              activeItemFont={{}}
              // viewImgItem={{ width: "auto", height: 100 }}
            />
          );
        }}
        style={{
          width: "100%",
          padding: "5%",
          paddingTop: 0,
          marginBottom: "4%",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BCF4F5",
  },
});
