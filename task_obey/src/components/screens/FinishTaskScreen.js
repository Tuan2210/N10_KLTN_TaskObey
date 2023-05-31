import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../../redux/createInstance";

import { SafeAreaView } from "react-native-safe-area-context";

import moment from "moment";

import { Picker } from "@react-native-picker/picker";

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
      loadListFinishTasks(registerUserId);
    }
    if (!currentRegisterUser && currentLoginUser) {
      setUserId(loginUserId);
      loadListFinishTasks(loginUserId);
    }
  }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dataList, setDataList] = useState([]);

  async function loadListFinishTasks(userId) {
    await axios
      .get(`${url}/api/task/finishTasks/${userId}`, { timeout: 1000 })
      .then((res) => {
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

  //////handle refresh
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
        timeout: 2000,
      });
      if (res.data.length === 0) console.log("no data finish-task in list");
      if (res.data.length > 0) {
        setDataList(res.data);
        setRefreshing(false);
      }
    } catch (error) {
      console.log(error);
    }
    wait(2500).then(() => setRefreshing(false));
  }
  //////

  //////handle sort
  const [sortNewOld, setSortNewOld] = useState("Gần đây nhất");
  const sortedData =
    sortNewOld === "Gần đây nhất"
      ? dataList.sort((a, b) => {
          //handle sort newest DESC finishDateTime
          const dateA = moment(
            a.finishDateTime,
            "D/M/YYYY, HH [giờ] mm [phút]"
          );
          const dateB = moment(
            b.finishDateTime,
            "D/M/YYYY, HH [giờ] mm [phút]"
          );
          return dateB - dateA;
        })
      : dataList.sort((a, b) => {
          //handle sort oldest ASC finishDateTime
          const dateA = moment(
            a.finishDateTime,
            "D/M/YYYY, HH [giờ] mm [phút]"
          );
          const dateB = moment(
            b.finishDateTime,
            "D/M/YYYY, HH [giờ] mm [phút]"
          );
          return dateA - dateB;
        });
  //////

  let sliceDay, sliceTime;
  const [time, setTime] = useState();
  const [selectedItemData, setSelectedItemData] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  function closeModal() {
    setSelectedItemData(null);
    setIsModalVisible(false);
  }
  const ItemData = ({ item, onPress, activeItemBg, activeItemFont }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        activeItemBg,
        {
          width: "100%",
          height: 200,
          justifyContent: "space-around",
          marginTop: "3%",
          marginBottom: "3%",
          borderRadius: 20,
          // borderColor: "#AEEEEE",
          // borderWidth: 2,
          borderStyle: "solid",
          backgroundColor: "#fff",
        },
      ]}
    >
      <View style={{ padding: "5%", paddingBottom: 0 }}>
        <View style={{ width: "100%", height: "80%" }}>
          <Text
            style={[
              activeItemFont,
              {
                fontSize: 18,
                width: "100%",
                fontWeight: "bold",
              },
            ]}
          >
            {item.taskName}
          </Text>
          <Text
            style={[
              activeItemFont,
              {
                fontSize: 15,
                width: "100%",
                color: "#444444",
              },
            ]}
          >
            {item.taskDetailId.description}
          </Text>
        </View>
        <Text
          style={{
            color: "#D4A055",
            fontSize: 14,
            fontWeight: "bold",
            alignSelf: "flex-end",
          }}
        >
          Thời gian hoàn thành:{"\u00A0"}
          {item.finishDateTime}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          height: "15%",
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          borderBottomColor: "#09CBD0",
          borderBottomWidth: 2,
          borderBottomStyle: "solid",
        }}
      >
        <Text>Lọc công việc hoàn thành theo:</Text>
        <Picker
          style={{
            width: "45%",
            backgroundColor: "#BCF4F5",
          }}
          selectedValue={sortNewOld}
          onValueChange={(itemValue, itemIndex) => setSortNewOld(itemValue)}
        >
          <Picker.Item
            style={{ fontSize: 15 }}
            label="Gần đây nhất"
            value="Gần đây nhất"
          />
          <Picker.Item
            style={{ fontSize: 15 }}
            label="Cũ nhất"
            value="Cũ nhất"
          />
        </Picker>
      </View>
      <FlatList
        key={"#"}
        // numColumns={2}
        data={sortedData}
        renderItem={({ item }) => {
          // const backgroundColor =
          //   item.id === selectedIdItemData ? "#fff" : "black";
          // const color = item.id === selectedIdItemData ? "black" : "#fff";
          return (
            <ItemData
              item={item}
              onPress={() => {
                setSelectedItemData(item);
                console.log(item);
                setIsModalVisible(true);
              }}
              activeItemBg={{}}
              activeItemFont={{}}
              // viewImgItem={{ width: "auto", height: 100 }}
            />
          );
        }}
        style={{
          width: "100%",
          paddingLeft: "5%",
          paddingRight: "5%",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {selectedItemData && (
        <Modal
          visible={isModalVisible}
          onRequestClose={closeModal}
          animationType="slide"
          transparent
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.styleModal}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.txtModal}>
                  Ưu tiên:{"\t"}
                  <Text style={{ fontSize: 15, color: "black" }}>
                    {selectedItemData.taskDetailId.priority}
                  </Text>
                </Text>
                <Text style={styles.txtModal}>
                  Loại công việc:{"\t"}
                  <Text style={{ fontSize: 15, color: "black" }}>
                    {selectedItemData.taskDetailId.taskType}
                  </Text>
                </Text>
              </View>
              <Text style={styles.txtModal}>
                Thời gian bắt đầu:{"\t"}
                <Text style={{ fontSize: 15, color: "black" }}>
                  {selectedItemData.taskDetailId.startTime}
                </Text>
              </Text>
              <Text style={styles.txtModal}>
                Thời gian kêt thúc:{"\t"}
                <Text style={{ fontSize: 15, color: "black" }}>
                  {selectedItemData.taskDetailId.endTime ===
                  "... / ... / ...., ... giờ ... phút"
                    ? "Không"
                    : selectedItemData.taskDetailId.endTime}
                </Text>
              </Text>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* <Text style={styles.txtModal}>
                  Ngày tạo:{"\t"}
                  <Text style={{ fontSize: 15, color: "black" }}>
                    {selectedItemData.initialDate}
                  </Text>
                </Text> */}
                <Text style={styles.txtModal}>
                  Trạng thái:{"\t"}
                  <Text style={{ fontSize: 15, color: "black" }}>
                    {selectedItemData.status}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={closeModal}
                style={{ alignItems: "center" }}
              >
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  [ Đóng ]
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BCF4F5",
  },
  styleModal: {
    backgroundColor: "white",
    borderColor: "#09CBD0",
    borderStyle: "solid",
    borderWidth: 3,
    width: "90%",
    height: "50%",
    padding: 20,
    borderRadius: 20,
    justifyContent: "space-around",
  },
  txtModal: {
    fontSize: 14,
    color: "#09CBD0",
  },
});
