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

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeicons from "react-native-vector-icons/FontAwesome";
import FontAwesome5icons from "react-native-vector-icons/FontAwesome5";
import AntDesignicons from "react-native-vector-icons/AntDesign";

//link doc react-native-big-calendar: https://github.com/acro5piano/react-native-big-calendar
import { Calendar } from 'react-native-big-calendar';

import moment from 'moment';
// import 'moment/locale/vi';
// moment.locale('vi');

// import dayjs from 'dayjs';
import 'dayjs/locale/vi';

//link doc timelinecalendar: https://howljs.github.io/react-native-calendar-kit/docs/intro
// import { EventItem, MomentConfig, PackedEvent, RangeTime, TimelineCalendar } from '@howljs/calendar-kit';

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function ListScreen({navigation}) {
  const currentLoginUser = useSelector((state) => state.auth.login?.currentUser);
  const loginUserId = currentLoginUser?._id;

  const currentRegisterUser = useSelector((state) => state.auth.register?.currentUserRegister);
  const registerUserId = currentRegisterUser?._id;
  
  const [userId, setUserId] = useState();
  useEffect(() => {
    if(currentRegisterUser && !currentLoginUser){
      setUserId(registerUserId);
      loadListNotFinishTasks(registerUserId, currentDate);
    }
    if(!currentRegisterUser && currentLoginUser){
      setUserId(loginUserId);
      loadListNotFinishTasks(loginUserId, currentDate);
    }

    // loadListNotFinishTasks();
  }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentDate = new Date().toISOString().split("T")[0];
  const currentDay = currentDate.slice(8,10),
        currentMonth = currentDate.slice(5,7),
        currentYear = currentDate.slice(0,4),
        formatCurrentDate = currentDay +'/' +currentMonth +'/'  +currentYear;
  // useEffect(()=> {
  //   console.log(currentDate);
  // })

  ////////load list tasks by userId & current date
  // const [dataTasksList, setDataTasksList] = useState([]);
  let dataTasksList = [];
  const [events, setEvents] = useState();
  const [obj, setObj] = useState({});
  const [taskId, setTaskId] = useState();
  const [taskName, setTaskName] = useState();
  const [dataDayTime, setDataDayTime] = useState();
  const [endTime, setEndTime] = useState();
  const [description, setDescription] = useState();
  const [status, setStatus] = useState();
  const [taskType, setTaskType] = useState();
  const [priority, setPriority] = useState();
  const [reminderTime, setReminderTime] = useState();

  // console.log('registeruserid',registerUserId);
  // console.log('loginuserid',loginUserId)

  // useEffect(() => {
  //   if(registerUserId!==undefined && loginUserId===undefined) 
  //     loadListNotFinishTasks(registerUserId, currentDate);
  // }, [registerUserId, currentDate]);
  
  // useEffect(() => {
  //   if(registerUserId===undefined && loginUserId!==undefined)
  //     loadListNotFinishTasks(loginUserId, currentDate);
  //   if(registerUserId!==undefined && loginUserId===undefined)
  //     loadListNotFinishTasks(registerUserId, currentDate);
    
  //   loadListNotFinishTasks();
  // }, []);

  // useEffect(() => {
  //   loadListNotFinishTasks();
  // }, [])
  // const loadListNotFinishTasks = async () => {
  //   if (registerUserId === undefined && loginUserId !== undefined) {
  //     // console.log(registerUserId);
  //     // console.log(loginUserId);
  //     // try {
  //     const res = await axios.get(`${url}/api/task/notFinishTasks/${loginUserId}/${currentDate}`);
  //     // setEvents(res.data)
  //     // console.log(events);
  //     const newEvent: EventItem[] = res.data.map((item, index) => ({
  //       id: item._id,
  //       title: item.taskId.taskName,
  //       start: item.dayTime,
  //       end: "2023-03-26T14:00:05.313Z",
  //       color: "#A3C7D6",
  //       description: item.description,
  //       imageUrl: '',
  //       dayTime: item.dayTime,
  //       status: item.status,
  //       taskType: item.taskType,
  //       priority: item.priority,
  //       reminderTime: item.reminderTime
  //     }));
  //     setEvents(newEvent)
  //     console.log(events);

  //     // {res.data.map((item, index) => {
  //     //     setTaskId(item._id);
  //     //     setTaskName(item.taskName);
  //     // })};
  //     // console.log(taskId);
  //     // console.log(taskName);
  //     // } catch (error) {
  //     //   console.log(error);
  //     // }
  //   }
  // };

  async function loadListNotFinishTasks(id, date) { //userId, currentDate
    // const res = await axios.get(`${url}/api/task/notFinishTasks/${id}/${date}`);
    try {
      const res = await axios.get(`${url}/api/task/notFinishTasks/${id}/${date}`);
      if(res.data.length === 0) console.log('no data task in list');
      if(res.data.length > 0) {
        console.log(res.data);
      };
    } catch (error) {
      console.log(error);
    }
    // await axios
    //   // .get(`${url}/api/task/notFinishTasks/${id}/${date}`)
    //   .get(`${url}/api/task/notFinishTasks/6432a67429d2ca71765afe4d/2023-04-27`)
    //   .then((res) => {
    //     if(res.data.length===0) console.log('no data task in list');
    //     if(res.data.length > 0) {
    //       // console.log('res data');
    //       console.log(res.data)
          
    //     };
    //   })
  }

  // {dataTasksList.map((item, index) => {
  //   // setTaskId(item._id);
  //   // setTaskName(item.taskId.taskName);
  //   const newEvent = {
  //     id: item._id,
  //     title: item.taskId.taskName,
  //     start: event.start,
  //     end: event.end,
  //     color: "#A3C7D6",
  //     description: "abc",
  //     imageUrl: '',
  //     dayTime: '',
  //     status: '',
  //     taskType: '',
  //     priority: '',
  //     reminderTime: ''
  //   };
  //   setEvents(newEvent);
  // })}
  ////////

  ////////load list taskDetails by taskId
  // console.log(taskId)
  // const dataTaskDetailsList = [];
  // useEffect(() => {
  //   loadListNotFinishTaskDetails(taskId);
  // }, [taskId]);
  // async function loadListNotFinishTaskDetails(id) { //taskId
  //   await axios
  //     .get(`${url}/api/task/notFinishTaskDetails/${id}`)
  //     .then((res) => {
  //       if(res.data.length===0) console.log('no data taskdetail in list');
  //       if(res.data.length > 0) {
  //         Object.keys(res.data).forEach(function (key) {
  //           const keyIndex = res.data[key];
  //           dataTaskDetailsList.push(keyIndex);
  //           // console.log('dataTaskDetailsList');
  //           // console.log(dataTaskDetailsList);
  //         });
  //       };
  //     })
  // }
  ////////

  const exampleEvents = [
    {
      title: 'Meeting',
      start: new Date(2023, 3, 25, 10, 0), //3 là tháng 4, vì tháng có bắt đầu từ 0 trong js
      end: new Date(2023, 3, 25, 10, 30),
    },
    {
      title: 'Coffee break',
      start: new Date(2023, 3, 28, 15, 45),
      end: new Date(2023, 3, 28, 16, 30),
    },
  ]


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "100%", height: "100%" }}>
        <Calendar 
          events={exampleEvents} 
          height={600} 
          weekStartsOn={1}
          locale='vi'
          headerContainerStyle={{height: '7%', borderBottomColor: '#09CBD0', borderBottomWidth: 2, borderStyle: "dashed"}}
          
        />
      </View>
      {/* <TouchableOpacity onPress={() => navigation.navigate("Ghi chú")} style={{width:'12%', alignItems: "center", position: "absolute", marginTop: '1%'}}>
        <AntDesignicons name="pluscircleo" size={45} color="#09CBD0" />
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    height: 85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    height: 45,
    paddingHorizontal: 24,
    backgroundColor: '#1973E7',
    justifyContent: 'center',
    borderRadius: 24,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  btnText: { fontSize: 16, color: '#FFF', fontWeight: 'bold' },
});