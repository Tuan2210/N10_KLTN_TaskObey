import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, RefreshControl, ScrollView, LogBox } from "react-native";
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

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export default function ListScreen({navigation}) {
  const currentLoginUser = useSelector((state) => state.auth.login?.currentUser);
  const loginUserId = currentLoginUser?._id;

  const currentRegisterUser = useSelector((state) => state.auth.register?.currentUserRegister);
  const registerUserId = currentRegisterUser?._id;
  
  const [userId, setUserId] = useState();
  useEffect(() => {
    if(currentRegisterUser && !currentLoginUser){
      setUserId(registerUserId);
      loadListNotFinishTasks(registerUserId);
    }
    if(!currentRegisterUser && currentLoginUser){
      setUserId(loginUserId);
      loadListNotFinishTasks(loginUserId);
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

  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const res = await axios.get(`${url}/api/task/notFinishTasks/${userId}`, {timeout: 4000});
      if(res.data.length === 0) console.log('no data task in list');
      if(res.data.length > 0) {
        setEvents(res.data);
        setRefreshing(false);
      };
    } catch (error) {
      console.log(error);
    }
    wait(4000).then(() => setRefreshing(false));
  };


  ////////load list tasks by userId & current date
  // const [dataTasksList, setDataTasksList] = useState([]);
  let dataTasksList = [];
  const [events, setEvents] = useState([]);
  const [obj, setObj] = useState({});
  const [taskId, setTaskId] = useState();
  const [taskName, setTaskName] = useState();
  // const [dataDayTime, setDataDayTime] = useState();
  const [initialDate, setInitialDate] = useState();
  const [description, setDescription] = useState();
  const [status, setStatus] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
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

  async function loadListNotFinishTasks(id) { //userId, currentDate
    // const res = await axios.get(`${url}/api/task/notFinishTasks/${id}/${date}`);
    try {
      const res = await axios.get(`${url}/api/task/notFinishTasks/${id}`, {timeout: 4000});
      if(res.data.length === 0) console.log('no data task in list');
      if(res.data.length > 0) {
        // console.log(res.data);
        setEvents(res.data);
        // console.log(events)
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

  // useEffect(() => {
  //   events.forEach(event => {
  //     // console.log('initialDate', event.initialDate);
  //     // console.log('startTime', event.taskDetailId.startTime);
  //     // console.log('endTime', event.taskDetailId.endTime);
  //     // console.log('duration', event.taskDetailId.scheduleId.duration);
  //     setTaskId(event._id);
  //     setTaskName(event.taskName);
  //     setDescription(event.taskDetailId.description);
  //     setInitialDate(event.initialDate);
  //     setStartTime(event.taskDetailId.startTime);
  //     setEndTime(event.taskDetailId.endTime);
  //   });
  // }, [events]);

  const showEventItem = [];
  const [bgColorItem, setBgColorItem] = useState('');
  events.forEach(evt => {
    // const start = evt.taskDetailId.startTime ? new Date(evt.taskDetailId.startTime) : null;
    // const end = evt.taskDetailId.endTime ? new Date(evt.taskDetailId.endTime) : null;
    // const deadline = evt.taskDetailId.scheduleId.deadline ? new Date(evt.taskDetailId.scheduleId.deadline) : null;
    const start = moment(evt.taskDetailId.startTime, 'D/M/YYYY, HH [giờ] mm [phút]').toDate();
    const end = evt.taskDetailId.endTime!=="... / ... / ...., ... giờ ... phút" ? moment(evt.taskDetailId.endTime, 'D/M/YYYY, HH [giờ] mm [phút]').toDate() : null;

    // let bgColorItem = '';
    // switch (evt.taskDetailId.priority) {
    //   case 1:
    //     setBgColorItem('red');
    //     break;
    //   case 2:
    //     setBgColorItem('orange');
    //     break;
    //   case 3:
    //     setBgColorItem('#09CBD0');
    //     break;
    //   default:
    //     break;
    // }

    // console.log(evt.taskDetailId.priority);

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
    })
  })
  // useEffect(() => console.log(showEventItem))


  // const exampleEvents = [
  //   {
  //     id: 1,
  //     title: 'Meeting',
  //     description: 'abc',
  //     start: new Date(2023, 3, 25, 10, 0), //3 là tháng 4, vì tháng có bắt đầu từ 0 trong js
  //     end: new Date(2023, 3, 25, 10, 30),
  //     color: '#09CBD0',
  //   },
  //   {
  //     id: 2,
  //     title: 'Coffee break',
  //     description: 'def',
  //     start: new Date(2023, 3, 28, 15, 45),
  //     end: new Date(2023, 3, 28, 16, 30),
  //     color: '#09CBD0',
  //   },
  //   // {
  //   //   title: 'all day event',
  //   //   start: "2023-4-28T00:00:00.000Z",
  //   //   end: "2023-4-28T00:00:00.000Z", // same date as `start`
  //   // },
  // ]
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  function handlePressEvent(event) {
    setSelectedEvent(event);
    setIsModalVisible(true);
  }

  function closeModal() {
    setSelectedEvent(null);
    setIsModalVisible(false);
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
      >
        <View style={{ width: widthScreen, height: heightScreen }}>
          <Calendar
            events={showEventItem}
            height={600}
            weekStartsOn={1}
            locale='vi'
            headerContainerStyle={{height: '6%', borderBottomColor: '#09CBD0', borderBottomWidth: 2, borderStyle: "dashed"}}
            // eventCellStyle={}
            onPressEvent={(ev) => handlePressEvent(ev)}
            // eventCellStyle={({ event, index, color }) => {
            //   return {
            //     backgroundColor: eventColors[index % eventColors.length],
            //     opacity: 0.8,
            //     borderRadius: 5,
            //     borderColor: 'transparent'
            //   };
            // }}
            // onDayPress={onDayPress}
            // markedDates={items}
            // pastScrollRange={50}
            // futureScrollRange={50}
            // horizontal={true}
            // pagingEnabled={true}
            // // calendarWidth={300}
            // theme={{
            //   backgroundColor: '#ffffff',
            //   calendarBackground: '#ffffff',
            //   textSectionTitleColor: '#b6c1cd',
            //   selectedDayBackgroundColor: '#00adf5',
            //   selectedDayTextColor: '#ffffff',
            //   todayTextColor: '#00adf5',
            //   dayTextColor: '#2d4150',
            //   textDisabledColor: '#d9e1e8',
            //   dotColor: '#00adf5',
            //   selectedDotColor: '#ffffff',
            //   arrowColor: 'orange',
            //   disabledArrowColor: '#d9e1e8',
            //   monthTextColor: 'blue',
            //   indicatorColor: 'blue',
            //   textDayFontFamily: 'monospace',
            //   textMonthFontFamily: 'monospace',
            //   textDayHeaderFontFamily: 'monospace',
            //   textDayFontWeight: '300',
            //   textMonthFontWeight: 'bold',
            //   textDayHeaderFontWeight: '300',
            //   textDayFontSize: 16,
            //   textMonthFontSize: 16,
            //   textDayHeaderFontSize: 16
            // }}
          />
          {selectedEvent && (
            <Modal
              visible={isModalVisible}
              onRequestClose={closeModal}
              animationType="slide"
              transparent
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{
                    backgroundColor: 'white',
                    borderColor: '#09CBD0',
                    borderStyle: "solid",
                    borderWidth: 3,
                    width: '75%',
                    height: '50%',
                    padding: 20,
                    borderRadius: 5,
                    justifyContent:  "space-around"
                 }}>
                  <View style={{height: '90%', justifyContent: "space-around"}}>
                    {/* tên cv */}
                    <Text style={styles.txtModal}>
                      Tên công việc:{'\t\t'}
                      <Text style={{fontSize: 20, color: 'black'}}>{selectedEvent.title}</Text>
                    </Text>
                    {/* mô tả */}
                    <Text style={styles.txtModal}>
                      Mô tả:{'\n'}
                      <Text style={{fontSize: 20, color: 'black'}}>{selectedEvent.description}</Text>
                    </Text>
                    {/* ưu tiên, loại cv */}
                    <View style={{width: '100%', flexDirection: "row", justifyContent: "space-between"}}>
                      <Text style={styles.txtModal}>
                        Ưu tiên:{'\u00A0'}
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>{selectedEvent.priority}</Text>
                      </Text>
                      <Text style={styles.txtModal}>
                        Loại công việc:{'\u00A0'}
                        <Text style={{fontSize: 18, color: 'black'}}>{selectedEvent.taskType}</Text>
                      </Text>
                    </View>
                    {/* lời nhắc, loại lặp cv */}
                    <View style={{width: '100%', flexDirection: "row", justifyContent: "space-between"}}>
                      <Text style={styles.txtModal}>
                        Lời nhắc:{'\u00A0'}
                        <Text style={{fontSize: 20, color: 'black'}}>{selectedEvent.reminderTime}</Text>
                      </Text>
                      <Text style={styles.txtModal}>
                        Loại lặp công việc:{'\u00A0'}
                        <Text style={{fontSize: 18, color: 'black'}}>{selectedEvent.repeat}</Text>
                      </Text>
                    </View>
                    {/* th.g bắt đầu */}
                    <Text style={styles.txtModal}>
                      Thời gian bắt đầu:{'\t'}
                      <Text style={{fontSize: 18, color: 'black'}}>{moment(selectedEvent.start).utcOffset('+0700').format('D/M/YYYY, HH [giờ] mm [phút]')}</Text>
                    </Text>
                    {/* th.g kết thúc */}
                    <Text style={styles.txtModal}>
                      Thời gian kết thúc:{'\t'}
                      <Text style={{fontSize: 18, color: 'black'}}>
                        {selectedEvent.end===null ?
                          'Không' : moment(selectedEvent.end).utcOffset('+0700').format('D/M/YYYY, HH [giờ] mm [phút]')
                        }
                      </Text>
                    </Text>
                    {/* th.g lượng */}
                    {/* <Text style={styles.txtModal}>
                      Thời lượng:{'\t'}
                      <Text style={{fontSize: 18, color: 'black'}}>
                        {selectedEvent.duration==='' ?
                          'Không' : moment(selectedEvent.duration).utcOffset('+0700').format('D/M/YYYY, HH [giờ] mm [phút]')
                        }
                      </Text>
                    </Text> */}
                    {/* thời hạn */}
                    <Text style={styles.txtModal}>
                      Thời hạn:{'\u00A0'}
                      <Text style={{fontSize: 18, color: 'black'}}>
                        {selectedEvent.deadline==='' ?
                          'Không' : moment(selectedEvent.duration).utcOffset('+0700').format('D/M/YYYY, HH [giờ] mm [phút]')
                        }
                      </Text>
                    </Text>
                    {/* ngày tạo, trạng thái */}
                    <View style={{width: '100%', flexDirection: "row", justifyContent: "space-between"}}>
                      <Text style={styles.txtModal}>
                        Ngày tạo:{'\u00A0'}
                        <Text style={{fontSize: 15, color: 'black'}}>{selectedEvent.initialDate}</Text>
                      </Text>
                      <Text style={styles.txtModal}>
                        Trạng thái:{'\u00A0'}
                        <Text style={{fontSize: 15, color: 'black'}}>{selectedEvent.status}</Text>
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={{alignItems: "center"}}
                  >
                    <Text style={{color: 'red', fontWeight: "bold"}}>[ Đóng ]</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </ScrollView>
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
  txtModal: {
    fontSize: 16,
    color: '#09CBD0'
  }
});