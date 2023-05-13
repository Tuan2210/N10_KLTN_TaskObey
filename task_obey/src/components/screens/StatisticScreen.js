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
    }
    if (!currentRegisterUser && currentLoginUser) {
      setUserId(loginUserId);
      loadListNotFinishTasks(loginUserId);
    }
    const result = setDayRenderOrders(showEventItem)
     setTotal(result);
  }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [viewModelStatic, setViewModelStatic] = useState("")

  /////load all data tasks
  const [events, setEvents] = useState([]);
  async function loadListNotFinishTasks(id) {
    try {
      const res = await axios.get(`${url}/api/task/notFinishTasks/${id}`, {
        timeout: 1000,
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
        if (task.status === "Hoàn thành") {
          doneCount++;
        } else {
          undoneCount++;
        }
      }
    });
  
    return [doneCount, undoneCount];
  };
  
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
    // console.log('ket qua 7 ngay lien tiep la');
    // console.log(result);
    // setDataCsv(result);
    return result
  }; // const filterData = async () => {
  //   const resultDay = await setDayRenderOrders(showEventItem);
  //   const resultWeek = setWeekRenderOrders(showEventItem);
  //   total(resultDay);
  //   totalW(resultWeek);
  // };
  // useEffect(() => {
  //   filterData();
  // }, []);
  // useEffect(() => {
  
  //   },[])  
  // useEffect(() => { 
  //   const result = setWeekRenderOrders(showEventItem);
  //   setTotalW(result)
  //   console.log('list cac cong viec la  ') 
  //   console.log(totalW)
  // }, []);  
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
      // yAxisInterval={1}
      chartConfig={{
        backgroundColor: '#8009CBD0',
        backgroundGradientFrom: '#8009CBD0',
        backgroundGradientTo: '#09CBD0',
        decimalPlaces: 0,
        color: (opacity = 0.0) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 0.2) => `rgba(255, 255, 255, ${opacity})`,
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
    color: "#8009CBD0",
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
  function PieChartScreen() {
    return(  
    <View style ={{width: '100%', height: 300, flexDirection:'row' }}>
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
  
          </PieChart></View></View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
    <View style={{flex: 1}}>
    {/* <View
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
      </View> */}
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
      <View style={{alignSelf: 'center'}}>
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