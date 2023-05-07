import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";

import { createAxios } from "../../redux/createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { logOut, logOutRegsiter } from "../../redux/apiRequest/authApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

import {Avatar, Drawer} from 'react-native-paper'
//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

import {BarChart, LineChart, PieChart} from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function StatisticScreen() {
  const currentLoginUser = useSelector((state) => state.auth.login?.currentUser);
  const loginUserId = currentLoginUser?._id;

  const currentRegisterUser = useSelector((state) => state.auth.register?.currentUserRegister);
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

  /////load all data tasks
  async function loadListNotFinishTasks(id) {
    try {
      const res = await axios.get(`${url}/api/task/notFinishTasks/${id}`, {
        timeout: 4000,
      });
      if (res.data.length === 0) console.log("no data task in list");
      if (res.data.length > 0) {
        // console.log(res.data);
        setEvents(res.data);
        // console.log(events)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const showEventItem = [];
  events.forEach((evt) => {
    const start = moment(
      evt.taskDetailId.startTime,
      "D/M/YYYY, HH [giờ] mm [phút]"
    ).toDate();
    const end =
      evt.taskDetailId.endTime !== "... / ... / ...., ... giờ ... phút"
        ? moment(
            evt.taskDetailId.endTime,
            "D/M/YYYY, HH [giờ] mm [phút]"
          ).toDate()
        : null;

    showEventItem.push({
      id: evt._id,
      title: evt.taskName,
      description: evt.taskDetailId.description,
      start: start,
      end: end,
      initialDate: evt.initialDate,
      status: evt.status,
      priority: evt.taskDetailId.priority,
      reminderTime: evt.taskDetailId.reminderTime,
      taskType: evt.taskDetailId.taskType,
      deadline: evt.taskDetailId.scheduleId.deadline,
      duration: evt.taskDetailId.scheduleId.duration,
      repeat: evt.taskDetailId.scheduleId.repeat,
    });
  });
  // useEffect(() => console.log(showEventItem))
  /////
  
  const [viewModelStatic, setViewModelStatic] = useState("Line")

  return (
    <SafeAreaView style={styles.container}>
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 0.5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
          <Text style={{ color: "#09CBD0" }}>Biểu đồ xem:</Text>
          <Picker
            style={{
              width: "55%",
              backgroundColor: "#BCF4F5",
              marginLeft: "3%",
            }}
            selectedValue={viewModelStatic}
            onValueChange={(itemValue, itemIndex) => 
              setViewModelStatic(itemValue)
              }>
                <Picker.Item style={{fontSize: 18}}
                  label="Đường"
                  value={"Line"}/>
                <Picker.Item style={{fontSize: 18}} 
                  label="Cột"
                  value={"Chart"}/>  
          </Picker>
      </View>
      {/* <View
        style={{
          flex: 0.3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
          <Text style={{ color: "#09CBD0" }}>Mức độ:</Text>
          <Picker
            style={{
              width: "55%",
              backgroundColor: "#BCF4F5",
              marginLeft: "3%",
            }}
            selectedValue={viewModelStatic}
            onValueChange={(itemValue, itemIndex) => 
              setViewModelStatic(itemValue)
              }>
                <Picker.Item style={{fontSize: 18}}
                  label="Quan trọng"
                  value={"Line"}/>
                <Picker.Item style={{fontSize: 18}} 
                  label="Không quan trọng"
                  value={"Chart"}/>  
          </Picker>
      </View> */}
      {viewModelStatic === "Line" && <LineChartScreen />}
      {viewModelStatic === "Chart" && <BarChartScreen />}
      {/* <TouchableOpacity
        onPress={() => {
          switch (viewModelStatic){
            case "Line":
              LineChartScreen()
              break
            case "Pie":
              PieChartScreen()
              break
            default:
              break
          }
          }
        }
        >

      </TouchableOpacity> */}
    </View>  
    </SafeAreaView>
  );
};
function BarChartScreen() {
  return(
    <BarChart
    data={{
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [
            5,6,1,0,2,3
            // Math.random() * 100,
            // Math.random() * 100,
            // Math.random() * 100,
            // Math.random() * 100,
            // Math.random() * 100,
            // Math.random() * 100
          ]
        }
      ]
    }}
    width={400}
    height={420}
    // yAxisInterval={1}
    chartConfig={{
      backgroundColor: '#09CBD0',
      backgroundGradientFrom: '#09CBD0',
      backgroundGradientTo: '#09CBD0',
      decimalPlaces: 2,
      color: (opacity = 0.0) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 0.0) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 50,
      }
    }}
    verticalLabelRotation={50}
    >
    </BarChart>
  )
}
function LineChartScreen() {
  
  return(  
    <LineChart 
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [
                  5,6,1,0,2,1,0,7
                  // Math.random() * 100,
                  // Math.random() * 100,
                  // Math.random() * 100,
                  // Math.random() * 100,
                  // Math.random() * 100,
                  // Math.random() * 100
                ]
              }
            ]
          }}
          width={400}
          height={420}
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#09CBD0',
            backgroundGradientFrom: '#09CBD0',
            backgroundGradientTo: '#09CBD0',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 20,
            }
          }}
          bezier
          style={{
            marginVertical: 5, borderRadius: 5
          }}
          >

        </LineChart>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: "center",
    alignSelf: "center",  
  },
  btnPrevNext: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "15%",
    backgroundColor: "#09CBD0",
    borderRadius: 10,
  },
});