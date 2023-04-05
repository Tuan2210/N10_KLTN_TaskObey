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

//link doc timelinecalendar: https://howljs.github.io/react-native-calendar-kit/docs/intro
import { EventItem, MomentConfig, PackedEvent, RangeTime, TimelineCalendar } from '@howljs/calendar-kit';

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function ListScreen({navigation}) {
  const currentLoginUser = useSelector((state) => state.auth.login?.currentUser);
  const loginUserId = currentLoginUser?._id;

  const currentRegisterUser = useSelector((state) => state.auth.register?.currentUserRegister);
  const registerUserId = currentRegisterUser?._id;
  
  // const [userId, setUserId] = useState();
  // useEffect(() => {
  //   if(currentRegisterUser && !currentLoginUser)
  //     setUserId(registerUserId);
  //   if(!currentRegisterUser && currentLoginUser)
  //     setUserId(loginUserId)
  // }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentDate = new Date().toISOString().split("T")[0];
  const currentDay = currentDate.slice(8,10),
        currentMonth = currentDate.slice(5,7),
        currentYear = currentDate.slice(0,4),
        formatCurrentDate = currentDay +'/' +currentMonth +'/'  +currentYear;
  useEffect(()=> {
    console.log(new Date("2023-03-26 10:30:59"));
  })

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
  //   // if(registerUserId===undefined && loginUserId!==undefined)
  //   //   loadListNotFinishTasks(loginUserId, currentDate);
  //   // if(registerUserId!==undefined && loginUserId===undefined)
  //   //   loadListNotFinishTasks(loginUserId, currentDate);
    
  //   // loadListNotFinishTasks();
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

  // async function loadListNotFinishTasks(id, date) { //userId, currentDate
  //   // const res = await axios.get(`${url}/api/task/notFinishTasks/${id}/${date}`);
    
  //   await axios
  //     .get(`${url}/api/task/notFinishTasks/${id}/${date}`)
  //     .then((res) => {
  //       if(res.data.length===0) console.log('no data task in list');
  //       if(res.data.length > 0) {
  //         // console.log('res data');
  //         // console.log(res.data)
  //         {res.data.map((item, index) => {
  //           const itemDetail = {
  //             id: item._id,
  //             title: item.taskId.taskName,
  //             // start: event.start,
  //             // end: event.end,
  //             // color: "#A3C7D6",
  //             // description: "abc",
  //             // imageUrl: '',
  //             // dayTime: '',
  //             // status: '',
  //             // taskType: '',
  //             // priority: '',
  //             // reminderTime: ''
  //           }
  //           setObj(itemDetail);
  //           console.log(obj);
  //         })}
  //       };
  //     })
  // }

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

  const exampleEvents: EventItem[] = [
    {
      id: "1",
      title: "Event 1",
      start: "2023-03-25T09:00:05.313Z",
      end: "2023-03-25T12:00:05.313Z",
      color: "#A3C7D6",
    },
    {
      id: "2",
      title: "Event 2",
      start: "2023-03-25T11:00:05.313Z",
      end: "2023-03-25T14:00:05.313Z",
      color: "#B1AFFF",
    },
  ];
  // useEffect(()=>console.log(exampleEvents))

  MomentConfig.updateLocale("vi", {
    weekdaysShort: "Chủ nhật_Thứ 2_Thứ 3_Thứ 4_Thứ 5_Thứ 6_Thứ 7".split("_"),
  });

  //create task
  // {dataTasksList.map((item, index) => {
    
  // })}
  

  // const _onDragCreateEnd = (event: RangeTime) => {
  //   const randomId = Math.random().toString(36).slice(2, 10);
  //   const newEvent = {
  //     id: taskId,
  //     title: taskName,
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
  //   setEvents((prev) => [...prev, newEvent]);
  // };

  //edit task
  const [selectedEvent, setSelectedEvent] = useState();
  const _onLongPressEvent = (event: PackedEvent) => {
    setSelectedEvent(event);
  };
  const _onPressCancel = () => {
    setSelectedEvent(undefined);
  };
  const _onPressSubmit = () => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) => {
        if (ev.id === selectedEvent?.id) {
          return { ...ev, ...selectedEvent };
        }
        return ev;
      })
    );
    setSelectedEvent(undefined);
  };
  const _renderEditFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={_onPressCancel}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={_onPressSubmit}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // useEffect(() => {
  //   const dateNow = new Date("26-03-2023".replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
  //   console.log(dateNow);
    
  //   // console.log('evts', events);
  //   // console.log('selected evt', selectedEvent);
  // })

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "100%", height: "100%" }}>
        <TimelineCalendar
          key={'#'}
          viewMode="week"
          locale="vi"
          initialDate={new Date().toISOString().split("T")[0]}
          allowPinchToZoom
          allowDragToCreate
          // onDragCreateEnd={_onDragCreateEnd}
          dragCreateInterval={120}
          dragStep={20}
          events={events}
          onLongPressEvent={_onLongPressEvent}
          // onPressEvent={(data) => console.log(data)}
          selectedEvent={selectedEvent}
          onEndDragSelectedEvent={setSelectedEvent}
          // isShowHeader={false}
          theme={{
            //normal
            dayName: { color: "black", fontSize: 12 },
            dayNumber: { color: "black" },

            //today
            todayName: { color: "#09CBD0", fontSize: 13 },
            todayNumber: { color: "white" },
            todayNumberContainer: { backgroundColor: "#09CBD0" },

            //Saturday style
            saturdayName: { color: "blue", fontSize: 12 },
            saturdayNumber: { color: "blue" },

            //Sunday style
            sundayName: { color: "red", fontSize: 12 },
            sundayNumber: { color: "red" },

            //drag
            dragHourContainer: {
              backgroundColor: "#FFF",
              borderColor: "#001253",
            },
            dragHourText: { color: "#001253" },
            dragCreateItemBackgroundColor: "rgba(0, 18, 83, 0.2)",
          }}
          // Custom edit indicator
          EditIndicatorComponent={
            <View
              style={{ backgroundColor: "red", width: "100%", height: 16 }}
            />
          }
          // calendarWidth={widthScreen}
          // isShowHalfLine={false}
          // isLoading={true}
        />
        {selectedEvent && _renderEditFooter()}
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