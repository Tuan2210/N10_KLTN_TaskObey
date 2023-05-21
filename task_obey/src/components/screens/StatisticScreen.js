import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Image, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
      loadDataCountTasksByDay(registerUserId);
      loadDataCountTasksByMonth(registerUserId);
    }
    if (!currentRegisterUser && currentLoginUser) {
      setUserId(loginUserId);
      loadListNotFinishTasks(loginUserId);
      loadListFinishTasks(loginUserId)
      loadDataCountTasksByDay(loginUserId);
      loadDataCountTasksByMonth(loginUserId);
    }  
    // console.log(showEventFinishItem)
    // setDataTask([...showEventItem, ...showEventFinishItem])
    
  }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [viewModelStatic, setViewModelStatic] = useState("")

  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const res = await axios.get(`${url}/api/task/notFinishTasks/${userId}`, {
        timeout: 1000,
      });
      if (res.data.length === 0) console.log("no data task in list");
      if (res.data.length > 0) {
        // console.log(res.data);
        setEventsNotFinish(res.data);
        // console.log(eventsNotFinish)
      }
      await axios
      .get(`${url}/api/task/finishTasks/${userId}`, { timeout: 1000 })
      .then((res) => {
        if (res.data.length > 0) {
          // console.log(res.data)
          setEventsFinish(res.data);
          setRefreshing(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
    wait(1000).then(() => setRefreshing(false))
  };

  //////data count not-finish + finish tasks by the day
  const [dataCountTasksByDay, setDataCountTasksByDay] = useState([]);
  async function loadDataCountTasksByDay(user_id) {
    try {
      const res = await axios.get(`${url}/api/task/countTaskByTheDay/${user_id}/${numberOfDay}/${numberOfMonth}/${numberOfYear}`, {
        timeout: 2000,
      });
      if (res.data.length === 0) console.log("empty data");
      if (res.data.length > 0) {
        setDataCountTasksByDay(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // useEffect(() => console.log('dataCountTasksByDay', dataCountTasksByDay));
  //////

  //////data count not-finish + finish tasks by the month
  const [dataCountTasksByMonth, setDataCountTasksByMonth] = useState([]);
  async function loadDataCountTasksByMonth(user_id) {
    try {
      const res = await axios.get(`${url}/api/task/countTaskByTheMonth/${user_id}/${numberOfMonth}/${numberOfYear}`, {
        timeout: 2000,
      });
      if (res.data.length === 0) console.log("empty data");
      if (res.data.length > 0) {
        setDataCountTasksByMonth(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // useEffect(() => console.log('dataCountTasksByMonth', dataCountTasksByMonth));
  //////

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
  
  // const [dataTask, setDataTask] = useState([])
  const dataTask = [];
  dataTask.push([showEventItem, showEventFinishItem]) //dataTask includes: [ arr[0]:showEventItem, arr[1]:showEventFinishItem ]
  const [countTask, setCountTask] = useState([])
  useEffect(() => {
    // const interval = setInterval(() => {
      const result = setDayRenderOrders(dataTask) 
      setCountTask(result) 
    // }, 3000);
    // return () => clearInterval(interval);
    
    // // console.log(dataTask)

    // console.log(result)
    // //    setTotal(result);
    
    // //   const resultP1 = task3MonthsPriority(dataTask, 1)
    // //     setTaskPriority1(resultP1)
  }, [])

  const setDayRenderOrders = (tasks) => {
    //check all data here
    // tasks.forEach((task) => {
    //   // console.log(task[0]) //list not finish
      
    //   // console.log(task[1]) //list finish
    //   // console.log(task[1].status) //undefined
    //   // task[1].forEach((t1) => {
    //   //   console.log(t1.status) //status finish
    //   // })
    // })

    const currentDate = new Date();
    const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 2));
    threeMonthsAgo.setDate(1);
    threeMonthsAgo.setHours(0, 0, 0, 0);
  
    let doneCount = 0;
    let undoneCount = 0;
  
    tasks.forEach((task) => {
      const taskDate = new Date(task.start);
      taskDate.setHours(0, 0, 0, 0);
  
      task[1].forEach((t1) => {
          if (t1.status === "Hoàn thành") {
            doneCount++;
            // console.log(t1.status) //without condition if, it's console log output: status hoàn thành, ok
          } 
        })
        task[0].forEach((t0) => {
          if (t0.status === "Chưa hoàn thành") {
            undoneCount++;
            // console.log(undoneCount)
          } 
        })
    });
  
    return [doneCount, undoneCount]; // [0, 0]
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
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    datasets: [{
      data: [20, 45, 28, 80, 99, 43, 22, 55, 67, 77, 35, 65, 88, 45, 22, 90, 33, 27, 52, 67, 38, 55, 77, 29, 12, 53, 67, 88, 99, 25, 48]
    }]
    // datasets: [
    //   {
    //     data: dataTask,
    //   },
    // ],
  }), []);  
  function BarChartScreen() {
    // const moment = require('moment')
    // console.log(showEventItem)
    // console.log("ngang chan")
    // console.log(showEventFinishItem)
    // const months = showEventItem.map((item) => moment(item.initialDate).format('MMMM'))

    // const uniqueMonths = months.filter((month, index, self) => {
    //   const currentMonth = moment().month(month);
    //   const previousMonth = currentMonth.clone().subtract(2, 'months');
    //   const nextMonth = currentMonth.clone().add(2, 'months');
    
    //   return (
    //     index === self.indexOf(month) &&
    //     !self.some((m, i) => {
    //       if (i !== index) {
    //         const otherMonth = moment().month(m);
    //         return (
    //           otherMonth.isBetween(previousMonth, nextMonth, 'month', '[]') ||
    //           otherMonth.isSame(currentMonth, 'month')
    //         );
    //       }
    //       return false;
    //     })
    //   );
    // });
  
    // uniqueMonths.sort((a, b) => moment().month(a) - moment().month(b));
    // console.log(uniqueMonths);

    // useEffect(() => {
    //   if (uniqueMonths.length === 1) {
    //     setShowLabels(false);
    //   } else if (prevNumLabels === 1 && uniqueMonths.length > 1) {
    //     setShowLabels(true);
    //   }
    //   setPrevNumLabels(uniqueMonths.length);
    // }, [uniqueMonths]);
  
    return(
    <View style ={{width: '95%', flexDirection:'column' }}>
      <View style={[styles.infoRow, {width: widthScreen * 0.85}]}>
        <View style={{flex:0.5, justifyContent: 'center'}}>
          <Text style={styles.titleLabel}>Tháng:</Text>
        </View>
        <Picker
          style={{
            width: "30%",
            backgroundColor: "#BCF4F5",
            // marginLeft: "3%",
          }}
          selectedValue={selectedMonth}
          onValueChange={handleMonthChange}>
          {months.map((month) => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>
        <View style={{flex:0.5, justifyContent: 'center'}}>
          <Text style={styles.titleLabel}>Năm:</Text>
        </View>
        <Picker
          style={{
            width: "35%",
            backgroundColor: "#BCF4F5",
            // marginLeft: "3%",
          }}
          selectedValue={selectedYear}
          onValueChange={handleYearChange}>
          {years.map((year) => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
      </View>
      <ScrollView horizontal={true}>
      <BarChart
      data={data}
      width={800}
      height={heightScreen * 0.5}
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
      verticalLabelRotation={0}
      showValues={true}
      showBarTops={true}
      fromZero={true}
      // axis={{
      //   fromZero: true,
      //   inverted: true,
      //   showAxis: false,
      //   showGrid: false,
      //   showLabels: false,
      //   paddingRight: 0
      // }}
      // axisRight={{
      //   showAxis: true,
      //   showGrid: false,
      //   showLabels: true,
      //   renderTicks: () => <View />,
      //   // label: uniqueMonths,
      //   labelStyle: {
      //     color: 'black',
      //     fontWeight: 'bold'
      //   }
      // }}
      // withVerticalLabels={showLabels} 
      >
      </BarChart></ScrollView></View>
    )
  }
  const dataPie = [
    {
    name: "Hoàn thành", 
    population: 
    // 10,
    countTask[0],
    color: "#09CBD0",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }, 
  {
    name: "Chưa hoàn thành",
    population: 
    // 11,
    countTask[1], 
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

  const months = ["1","2","3","4","5", "6", "7","8","9","10","11","12", ]
  const years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", ]
  
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2023');

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };
  function PieChartScreen() {
    return(  
    <View style ={{width: '100%', height: '50%', flexDirection:'column' }}>
      <View style={[styles.infoRow, {width: widthScreen * 0.85, alignSelf: 'center'}]}>
        <View style={{flex:0.45, justifyContent: 'center'}}>
          <Text style={styles.titleLabel}>Tháng:</Text>
        </View>
        <Picker
          style={{
            width: "30%",
            backgroundColor: "#BCF4F5",
            // marginLeft: "3%",
          }}
          selectedValue={selectedMonth}
          onValueChange={handleMonthChange}>
          {months.map((month) => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>
        <View style={{flex:0.38, justifyContent: 'center'}}>
          <Text style={styles.titleLabel}>Năm:</Text>
        </View>
        <Picker
          style={{
            width: "30%",
            backgroundColor: "#BCF4F5",
            // marginLeft: "3%",
          }}
          selectedValue={selectedYear}
          onValueChange={handleYearChange}>
          {years.map((year) => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
      </View>
      {/* <View
        style={{
          flex: 0.1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop: "10%"
        }}
      >
        <View style={{flex: 0.2}}>
              <Text style={{ color: "#09CBD0" }}>Chọn loại thống kê:</Text>
        </View>
        
      </View> */}
      <View style={{flex: 0.5}}>
        <PieChart 
            data={dataPie}
            width={480}
            height={180}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[25, 0]}
            absolute
            >
          </PieChart></View>
      {/* <Text style={{ marginLeft: '10%',color: "#09CBD0" }}>Theo mức độ ưu tiên 1:</Text>
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
  
          </PieChart></View>     */}
      </View>
    )
  }
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowCharts(true);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <RefreshControl
        style={{ width: widthScreen, height: "80%" }}
        refreshing={refreshing}
        onRefresh={onRefresh}>
          <View style={styles.form}>
            <Text style={styles.tittle}>Thống kê công việc</Text>  
            <View style={[styles.infoRow, {width: widthScreen * 0.9, alignSelf: 'center'}]}>
              <Picker
                style={{
                  width: '100%',
                  backgroundColor: "#BCF4F5",
                }}
                placeholder="Chọn loại biểu đồ"
                selectedValue={viewModelStatic || "Chọn loại biểu đồ"}
                onValueChange={(itemValue, itemIndex) => 
                  setViewModelStatic(itemValue)
                  }>
                    <Picker.Item label="Chọn loại biểu đồ" value=""/>
                    <Picker.Item style={{fontSize: 18}}
                      label="Tổng số công việc theo tháng"
                      value={"Pie"}/>
                    <Picker.Item style={{fontSize: 18}} 
                      label="Số ngày trong tháng"
                      value={"Chart"}/>  
              </Picker>
            </View>
            <View style={styles.form}>
              {showCharts && (
              <>
                {viewModelStatic === "Pie" && <PieChartScreen />}
                {viewModelStatic === "Chart" && <BarChartScreen />}
              </>
            )}
            </View>
          </View>
      </RefreshControl>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignSelf: "center",  
    // justifyContent: 'space-evenly',
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
  tittle: {
    fontSize: 20,
    margin: "2%",
    fontWeight: "700",
    textAlign: "center",
    color: "#09CBD0",
  },
  titleLabel: {
    // fontSize: 20,
    margin: 5,
    fontWeight: "bold",
    color: "#09CBD0",
  },
  form: {
    flex: 0.99,
    alignSelf: "center",
  },
  infoRow: {
    // flex: 0.1099,
    flexDirection: "row",
    // justifyContent: "space-around",
    margin: "4.8%",
    // height: "35%",
  },
});