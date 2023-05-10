import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";

import { createAxios, url } from "../../redux/createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { logOut, logOutRegsiter } from "../../redux/apiRequest/authApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

import {Avatar, Drawer} from 'react-native-paper'
//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

import {BarChart, LineChart, PieChart} from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import moment from "moment";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function StatisticScreen() {
  const currentLoginUser = useSelector((state) => state.auth.login?.currentUser);
  const loginUserId = currentLoginUser?._id;
  const phoneLoginrUser = currentLoginUser?.phoneNumber;
  const refreshToken = currentLoginUser?.refreshToken;
  const loginUserNameAcc = currentLoginUser?.userName;

  const currentRegisterUser = useSelector((state) => state.auth.register?.currentUserRegister);
  const registerUserId = currentRegisterUser?._id;
  const phoneRegisterUser = currentRegisterUser?.phoneNumber;
  const accessToken = currentRegisterUser?.token;
  const registerUserNameAcc = currentRegisterUser?.userName;

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
  
  const [viewModelStatic, setViewModelStatic] = useState("Line")

  /////load all data tasks
  const [events, setEvents] = useState([]);
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
  // console.log('data la')
  // console.log(showEventItem)
  /////
  const [showLabels, setShowLabels] = useState(true);
  const [prevNumLabels, setPrevNumLabels] = useState(0);

  // const [taskDoneForDay, setTaskDoneForDay] = useState(0);
  // const [taskDoneForWeek, setTaskDoneForWeek] = useState(0);
  // const [taskDoneForMonth, setTaskDoneForMonth] = useState(0);
  
  // const [taskUnDoneForDay, setTaskUnDoneForDay] = useState(0);
  // const [taskUnDoneForWeek, setTaskUnDoneForWeek] = useState(0);
  // const [taskUnDoneForMonth, setTaskUnDoneForMonth] = useState(0);
  
  // const completedTasksByDay = showEventItem.reduce((result, task) => {
  //   if (task.status === 'Đã hoàn thành') {
  //     const date = task.initialDate.slice(0, 10); // Lấy ngày từ thuộc tính initialDate
  //     result[date] = (result[date] || 0) + 1; // Tăng số công việc hoàn thành của ngày đó lên 1
  //   }
  //   return result;
  // }, {});
  const setDayRenderOrders = (tasks) => {
    const newDate = new Date('2023-06-04T04:50:00.000Z');
    newDate.setHours(0, 0, 0, 0);

    const result = tasks.reduce((result, task) => {
      const timeTask = new Date(task.start);
      timeTask.setHours(0, 0, 0, 0);
      if (newDate.getTime() === timeTask.getTime()) {
        return [...result, task];
      }
      return result;
    }, []);
    console.log(result)
    // setDataCsv(result);
  };

  useEffect(() => {
    setDayRenderOrders(showEventItem)
  },[])

  function BarChartScreen() {
    const moment = require('moment')
    console.log(showEventItem)
    const months = showEventItem.map((item) => moment(item.initialDate).format('MMMM'))

    const uniqueMonths = months.filter((month, index, self) => {
      const currentMonth = moment().month(month);
      const previousMonth = currentMonth.clone().subtract(2, 'months');
      const nextMonth = currentMonth.clone().add(2, 'months');
    
      return (
        index === self.indexOf(month) &&
        !self.some((m, i) => {
          if (i !== index) {
            const otherMonth = moment().month(m);
            return (
              otherMonth.isBetween(previousMonth, nextMonth, 'month', '[]') ||
              otherMonth.isSame(currentMonth, 'month')
            );
          }
          return false;
        })
      );
    });
  
    uniqueMonths.sort((a, b) => moment().month(a) - moment().month(b));
    console.log(uniqueMonths);

    useEffect(() => {
      if (uniqueMonths.length === 1) {
        setShowLabels(false);
      } else if (prevNumLabels === 1 && uniqueMonths.length > 1) {
        setShowLabels(true);
      }
      setPrevNumLabels(uniqueMonths.length);
    }, [uniqueMonths]);
  

    return(
      <BarChart
      data={{
        labels: uniqueMonths,
        datasets: [
          {
            data: [
              5,6,1,
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
      showValues={true}
      showBarTops={true}
      fromZero={true}
      axis={{
        fromZero: true,
        inverted: true,
        showAxis: false,
        showGrid: false,
        showLabels: false,
        paddingRight: 0
      }}
      axisRight={{
        showAxis: true,
        showGrid: false,
        showLabels: true,
        renderTicks: () => <View />,
        label: uniqueMonths,
        labelStyle: {
          color: 'black',
          fontWeight: 'bold'
        }
      }}
      withVerticalLabels={showLabels} 
      >
      </BarChart>
    )
  }
  function LineChartScreen() {
    return(  
      <LineChart 
            data={{
              // labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                {
                  // data: dataTaskWeek,
                  data: 
                  [
                    5,6,1,0,2,1,0,7
                  ],
                  color: (opacity = 1) => `rgba(0, 150, 214, ${opacity})`, // Màu đường
                  strokeWidth: 3, // Độ dày đường
                  gradient: {
                    colors: ["#09CBD0", "#09CBD0"], // Màu gradient từ đường xuống trục x
                    start: { x: 1, y: 1 },
                    end: { x: 1, y: 1 },
                  },
                }
              ]
            }}
            fromZero={true}
            showBarTops={false}
            // yAxisLabel="Số công việc hòa"
            width={400}
            height={420}
            yAxisInterval={1}
            chartConfig={{
              yAxis: {
                drawAxisLine: false,
                drawGridLines: false,
                drawLabels: false,
                zeroLine: false,
              },
              xAxis: {
                drawAxisLine: false,
                drawGridLines: false,
                drawLabels: false,
                zeroLine: false,
              },
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 20,
              },
              propsForDots:{
                stroke: '#09CBD0',
                r: 0,
                strokeWidth: 0
              }
            }}
            bezier
            style={{
              marginVertical: 5, borderRadius: 5,
            }}
            yAxis={{
              color: "transparent", // Loại bỏ lưới trục y
              labelColor: "rgba(0, 0, 0, 0)", // Ẩn nhãn trục y
            }}
            xAxis={{
              color: "transparent", // Loại bỏ lưới trục x
              labelColor: "rgba(0, 0, 0, 0)", // Ẩn nhãn trục x
            }}
            >
  
          </LineChart>
    )
  }
  const [dataTaskWeek, setDataTaskWeek] = useState([]);

  // useEffect(() => {
  //   const today = moment().startOf('day')
  //   const taskCountByDay = showEventItem.reduce((result, task) =>{
  //     const taskDate = moment(task.start)
  //     if(taskDate.isAfter(today.subtract(1, 'week'))){
  //       const day = taskDate.format('ddd');
  //       result[day] = result[day] ? result[day] + 1 : 1;
  //     }
  //     return result
  //   }, {});
  //   setDataTaskWeek(Object.values(taskCountByDay));
  // }, [])

  // console.log(dataTaskWeek)
  return (
    <SafeAreaView style={styles.container}>
    <View style={{flex: 1}}>
    <View
        style={{
          flex: 0.3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
          <View style={{flex: 0.4}}>
            <Text style={{ color: "#09CBD0" }}>Loại biểu đồ:</Text>
          </View>
          <View style={{flex: 0.6,flexDirection: 'row', alignSelf:'center', justifyContent:'flex-start'}}>
            <Picker
              style={{
                width: "98%",
                backgroundColor: "#BCF4F5",
                marginLeft: "3%",
              }}
              selectedValue={viewModelStatic}
              onValueChange={(itemValue, itemIndex) => 
                setViewModelStatic(itemValue)
                }>
                  <Picker.Item style={{fontSize: 18}}
                    label="Ngày"
                    value={"Day"}/>
                  <Picker.Item style={{fontSize: 18}} 
                    label="Tuần"
                    value={"Week"}/>
                  <Picker.Item style={{fontSize: 18}} 
                    label="Tháng"
                    value={"Month"}/>  
            </Picker>
          </View>
      </View>
      <View
        style={{
          flex: 0.3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
          <View style={{flex: 0.4}}>
            <Text style={{ color: "#09CBD0" }}>Loại biểu đồ:</Text>
          </View>
          <View style={{flex: 0.6,flexDirection: 'row', alignSelf:'center', justifyContent:'flex-start'}}>
            <Picker
              style={{
                width: "98%",
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
      </View>
      {/* <View
        style={{
          flex: 0.3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
          <View style={{flex: 0.4}}>  
            <Text style={{ color: "#09CBD0" }}>Mức độ hoàn thành:</Text>
          </View>
          <View style={{flex: 0.6,flexDirection: 'row', alignSelf:'center', justifyContent:'flex-start'}}>
            <Picker
              style={{
                width: "98%",
                backgroundColor: "#BCF4F5",
                marginLeft: "3%",
              }}
              selectedValue={viewModelStatic}
              onValueChange={(itemValue, itemIndex) => 
                setViewModelStatic(itemValue)
                }>
                  <Picker.Item style={{fontSize: 18}}
                    label="Hoàn thành"
                    value={"Finish"}/>
                  <Picker.Item style={{fontSize: 18}} 
                    label="Chưa hoàn thành"
                    value={"Unfinish"}/>  
            </Picker>
          </View>
      </View> */}
      {viewModelStatic === "Line" && <LineChartScreen />}
      {viewModelStatic === "Chart" && <BarChartScreen />}
    </View>  
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '98%',
    height: '100%',
    alignSelf: "center",  
    backgroundColor: 'white'
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