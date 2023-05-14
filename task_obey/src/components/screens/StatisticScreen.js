import React, { useEffect, useMemo, useRef, useState } from "react";
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

import {BarChart, LineChart, PieChart, ProgressChart} from "react-native-chart-kit";
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
      loadListFinishTasks(registerUserId)
    }
    if (!currentRegisterUser && currentLoginUser) {
      setUserId(loginUserId);
      loadListNotFinishTasks(loginUserId);
      loadListFinishTasks(loginUserId)
    }
    console.log(showEventFinishItem)
    setDataTask([...showEventItem, ...showEventFinishItem])
    const result = setDayRenderOrders(dataTask) 
     setTotal(result);
    const resultP1 = task3MonthsPriority(dataTask, 1)
      setTaskPriority1(resultP1)
  }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [viewModelStatic, setViewModelStatic] = useState("")

  /////load all not finish tasks data
  const [eventsNotFinish, setEventsNotFinish] = useState([]);
  async function loadListNotFinishTasks(id) {
    try {
      const res = await axios.get(`${url}/api/task/notFinishTasks/${id}`, {
        timeout: 1000,
      });
      if (res.data.length === 0) console.log("no data task in list");
      if (res.data.length > 0) {
        // console.log(res.data);
        setEventsNotFinish(res.data);
        // console.log(eventsNotFinish)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const showEventItem = [];
  eventsNotFinish.forEach((evt) => {
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

  /////load all finish tasks data
  const [eventsFinish, setEventsFinish] = useState([]);
  async function loadListFinishTasks(userId) {
    await axios
      .get(`${url}/api/task/finishTasks/${userId}`, { timeout: 1000 })
      .then((res) => {
        if (res.data.length > 0) {
          // console.log(res.data)
          setEventsFinish(res.data);
        }
      });
  }
  const showEventFinishItem = [];
  eventsFinish.forEach((evt) => {
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

    showEventFinishItem.push({
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
  
  const [dataTask, setDataTask] = useState([])

  const [showLabels, setShowLabels] = useState(true);
  const [prevNumLabels, setPrevNumLabels] = useState(0);

  const [total, setTotal] = useState([])
  const [totalW, setTotalW] = useState([]);
  const setDayRenderOrders = (tasks) => {
    const currentDate = new Date();
    const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 2));
    threeMonthsAgo.setDate(1);
    threeMonthsAgo.setHours(0, 0, 0, 0);
  
    let doneCount = 0;
    let undoneCount = 0;
  
    tasks.forEach((task) => {
      const taskDate = new Date(task.start);
      taskDate.setHours(0, 0, 0, 0);
  
      if (taskDate >= threeMonthsAgo && taskDate.getMonth() <= 4) {
        if (task.status.toString() === "Hoàn thành") {
          doneCount++;
        } else { 
          undoneCount++;
        }
      }
    });
  
    return [doneCount, undoneCount];
  };
  /////
  const [taskPriority1, setTaskPriority1] = useState([])
  const task3MonthsPriority = (tasks, importanceLevel) => {
    const currentDate = new Date();
    const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 2));
    threeMonthsAgo.setDate(1);
    threeMonthsAgo.setHours(0, 0, 0, 0);
  
    let doneCount = 0;
    let undoneCount = 0;
  
    tasks.forEach((task) => {
      const taskDate = new Date(task.start);
      taskDate.setHours(0, 0, 0, 0);
  
      if (taskDate >= threeMonthsAgo && taskDate.getMonth() <= 4) {
        if (task.priority.toString() === importanceLevel.toString()) {
          if (task.status.toString() === "Hoàn thành") {
            doneCount++;
          } else { 
            undoneCount++;
          }
        }
      }
    });
  
    return [doneCount, undoneCount];
  };
  /////
  const setWeekRenderOrders = (tasks) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const dateTasks = tasks.filter((task) => {
        const taskDate = new Date(task.start);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === date.getTime();
      });
      result.push(dateTasks.length);
    }
    return result
  };
  const data = useMemo(() => ({
    labels: ['Hoàn thành', 'Chưa hoàn thành',],
    datasets: [
      {
        data: total,
      },
    ],
  }), [total]);  
  function BarChartScreen() {
    const moment = require('moment')
    console.log(showEventItem)
    console.log("ngang chan")
    console.log(showEventFinishItem)
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
      data={data}
      width={400}
      height={500}
      chartConfig={{
        backgroundColor: '#8009CBD0',
        backgroundGradientFrom: '#8009CBD0',
        backgroundGradientTo: '#09CBD0',
        decimalPlaces: 0,
        color: (opacity = 0.5) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 0.5) => `rgba(255, 255, 255, ${opacity})`,
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
  const dataPie = [
    {
    name: "Hoàn thành", 
    population: total[0],
    color: "#09CBD0",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }, 
  {
    name: "Chưa hoàn thành",
    population: total[1], 
    color: "#FF4040",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }]
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
  const dataPiePriority1 = [
    {
    name: "Hoàn thành", 
    population: taskPriority1[0],
    color: "#09CBD0",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }, 
  {
    name: "Chưa hoàn thành",
    population: taskPriority1[1], 
    color: "#FF4040",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }]
  
  function PieChartScreen() {
    return(  
    <View style ={{width: '100%', height: 300, flexDirection:'column' }}>
      <Text style={{ marginLeft: '10%',color: "#09CBD0" }}>Tổng công việc trong 3 tháng gần nhất:</Text>
      <View>
        <PieChart 
            data={dataPie}
            width={480}
            height={180}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[0, 5]}
            absolute
            >
  
          </PieChart></View>
      
            
      <Text style={{ marginLeft: '10%',color: "#09CBD0" }}>Theo mức độ ưu tiên 1:</Text>
      <View> 
        <PieChart 
            data={dataPiePriority1}
            width={480}
            height={180}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[0, 5]}
            absolute
            >
  
          </PieChart></View>    
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 0.15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop: "10%"
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
              placeholder="Chọn loại biểu đồ"
              selectedValue={viewModelStatic || "Chọn loại biểu đồ"}
              onValueChange={(itemValue, itemIndex) => 
                setViewModelStatic(itemValue)
                }>
                  <Picker.Item label="Chọn loại biểu đồ" value=""/>
                  <Picker.Item style={{fontSize: 18}}
                    label="Tròn"
                    value={"Pie"}/>
                  <Picker.Item style={{fontSize: 18}} 
                    label="Cột"
                    value={"Chart"}/>  
            </Picker>
          </View>
      </View>
      {/* <View
        style={{
          flex: 0.15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
          <View style={{flex: 0.4}}>
            <Text style={{ color: "#09CBD0" }}>Mức độ quan trọng:</Text>
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
                    label="1"
                    value={"1"}/>
                  <Picker.Item style={{fontSize: 18}} 
                    label="2"
                    value={"2"}/>
                  <Picker.Item style={{fontSize: 18}} 
                    label="3"
                    value={"3"}/>  
            </Picker>
          </View>
      </View> */}
      <View style={{alignSelf: 'center', marginTop: 30}}>
        {viewModelStatic === "Pie" && <PieChartScreen />}
        {viewModelStatic === "Chart" && <BarChartScreen />}
      </View>
    </View>  
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '98%',
    height: '100%',
    alignSelf: "center",  
    justifyContent: 'center',
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