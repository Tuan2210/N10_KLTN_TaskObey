import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  RefreshControl,
  LogBox,
  Alert,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../../redux/createInstance";
import UpdateTaskScreen from "./UpdateTaskScreen";

import { SafeAreaView } from "react-native-safe-area-context";

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeicons from "react-native-vector-icons/FontAwesome";
import FontAwesome5icons from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import Materialicons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityicons from "react-native-vector-icons/MaterialCommunityIcons";
import Feathericons from "react-native-vector-icons/Feather";

//link doc react-native-big-calendar: https://github.com/acro5piano/react-native-big-calendar
import { Calendar } from "react-native-big-calendar";

import moment from "moment";
// import 'moment/locale/vi';
// moment.locale('vi');

// import dayjs from 'dayjs';
import "dayjs/locale/vi";

//link doc timelinecalendar: https://howljs.github.io/react-native-calendar-kit/docs/intro
// import { EventItem, MomentConfig, PackedEvent, RangeTime, TimelineCalendar } from '@howljs/calendar-kit';

//doc: https://github.com/react-native-picker/picker
import { Picker } from "@react-native-picker/picker";

import { RadioGroup, RadioButton } from "react-native-flexi-radio-button";

import AsyncStorage from "@react-native-async-storage/async-storage";

// //doc: https://docs.expo.dev/versions/latest/sdk/notifications/
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ListScreen() {
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
    const interval = setInterval(() => {
      if (currentRegisterUser && !currentLoginUser) {
        setUserId(registerUserId);
        loadListNotFinishTasks(registerUserId);
      }
      if (!currentRegisterUser && currentLoginUser) {
        setUserId(loginUserId);
        loadListNotFinishTasks(loginUserId);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentDate = new Date().toISOString().split("T")[0];
  const currentDay = currentDate.slice(8, 10),
    currentMonth = currentDate.slice(5, 7),
    currentYear = currentDate.slice(0, 4),
    formatCurrentDate = currentDay + "/" + currentMonth + "/" + currentYear;
  // useEffect(()=> {
  //   console.log(currentDate);
  // })

  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = async () => {
    if (flagModalUpdate === false) setRefreshing(true);
    else setRefreshing(false);

    loadTaskTypeData();

    try {
      const res = await axios.get(`${url}/api/task/notFinishTasks/${userId}`, {
        timeout: 2500,
      });
      if (res.data.length === 0) console.log("no data task in list");
      if (res.data.length > 0) {
        setEvents(res.data);
        setRefreshing(false);
      }
    } catch (error) {
      console.log(error);
    }
    wait(4000).then(() => setRefreshing(false));
  };

  ////////load list tasks by userId & current date
  // const [dataTasksList, setDataTasksList] = useState([]);
  let dataTasksList = [];
  const [events, setEvents] = useState([]);

  async function loadListNotFinishTasks(id) {
    try {
      const res = await axios.get(`${url}/api/task/notFinishTasks/${id}`, {
        timeout: 2000,
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
  // const [startDateTimeNotify, setStartDateTimeNotify] = useState([]);
  const startDateTimeNotify = [];
  events.forEach((evt) => {
    // const start = evt.taskDetailId.startTime ? new Date(evt.taskDetailId.startTime) : null;
    // const end = evt.taskDetailId.endTime ? new Date(evt.taskDetailId.endTime) : null;
    // const deadline = evt.taskDetailId.scheduleId.deadline ? new Date(evt.taskDetailId.scheduleId.deadline) : null;
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

    // console.log(evt.taskDetailId.priority);

    showEventItem.push({
      id: evt._id,
      title: evt.taskName,
      description: evt.taskDetailId.description,
      start: start,
      end: end,
      initialDate: evt.initialDate,
      status: evt.status,
      finishDateTime: evt.finishDateTime,
      priority: evt.taskDetailId.priority,
      reminderTime: evt.taskDetailId.reminderTime,
      taskType: evt.taskDetailId.taskType,
      deadline: evt.taskDetailId.scheduleId.deadline,
      duration: evt.taskDetailId.scheduleId.duration,
      repeat: evt.taskDetailId.scheduleId.repeat,
      taskDetail_id: evt.taskDetailId._id,
      schedule_id: evt.taskDetailId.scheduleId._id,
    });
  });
  // useEffect(() => console.log(showEventItem))
  const eventColors = ["red", "orange", "#09CBD0"];

  // const renderEvent = (event) => {
  //   return (
  //     <TouchableOpacity
  //       style={{ backgroundColor: "red", margin: "2%" }}
  //       onPress={() => handlePressEvent(event)}
  //     >
  //       <Text>{event.title}</Text>
  //     </TouchableOpacity>
  //   );
  // };

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
  ////////

  ////////handle delete item evt task
  async function handleDeleteNotFinishTask(
    task_id,
    taskDetail_id,
    schedule_id
  ) {
    try {
      await axios.get(
        `${url}/api/task/deleteNotFinishTask/${task_id}/${taskDetail_id}/${schedule_id}`,
        {
          timeout: 4000,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  ////////

  ////handle previous-next
  const [dateCalendar, setDateCalendar] = useState(new Date());
  const handleNextWeek = () => {
    const nextWeek = new Date(dateCalendar.getTime() + 7 * 24 * 60 * 60 * 1000);
    setDateCalendar(nextWeek);
  };
  const handlePrevWeek = () => {
    const prevWeek = new Date(dateCalendar.getTime() - 7 * 24 * 60 * 60 * 1000);
    setDateCalendar(prevWeek);
  };
  //
  const handleNextDay = () => {
    const nextDay = new Date(dateCalendar.getTime() + 24 * 60 * 60 * 1000);
    setDateCalendar(nextDay);
  };
  const handlePrevDay = () => {
    const prevDay = new Date(dateCalendar.getTime() - 24 * 60 * 60 * 1000);
    setDateCalendar(prevDay);
  };
  //
  const handlePrev3Days = () => {
    const prevThreeDays = new Date(
      dateCalendar.getTime() - 3 * 24 * 60 * 60 * 1000
    );
    setDateCalendar(prevThreeDays);
  };
  const handleNext3Days = () => {
    const nextThreeDays = new Date(
      dateCalendar.getTime() + 3 * 24 * 60 * 60 * 1000
    );
    setDateCalendar(nextThreeDays);
  };
  //
  const handleNextMonth = () => {
    const nextMonth = new Date(
      dateCalendar.getFullYear(),
      dateCalendar.getMonth() + 1,
      dateCalendar.getDate()
    );
    setDateCalendar(nextMonth);
  };
  const handlePrevMonth = () => {
    const prevMonth = new Date(
      dateCalendar.getFullYear(),
      dateCalendar.getMonth() - 1,
      dateCalendar.getDate()
    );
    setDateCalendar(prevMonth);
  };
  ////

  ////handle view mode calendar
  const [viewModeCalendar, setViewModeCalendar] = useState("week");
  ////

  /////handle selected item evt
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  function handlePressEvent(event) {
    setSelectedEvent(event);
    console.log(event);
    setIsModalVisible(true);
  }
  function closeModal() {
    setSelectedEvent(null);
    setIsModalVisible(false);
  }
  /////

  /////handle filter
  const [modalFilter, setModalFilter] = useState(false);

  //load data task-type
  const [taskTypeData, setTaskTypeData] = useState([
    "Cá nhân",
    "Học tập",
    "Gia đình",
    "Công ty",
    "Du lịch",
  ]);
  function loadTaskTypeData() {
    AsyncStorage.getItem("taskTypeData")
      .then((value) => {
        if (value) setTaskTypeData(JSON.parse(value));
      })
      .catch((err) => {
        console.log("lỗi khôi phục:", err);
      });
  }
  useEffect(() => {
    loadTaskTypeData();
  }, []);

  const [filterTaskType, setFilterTaskType] = useState("");
  const [filterRepeat, setFilterRepeat] = useState("");
  const [filterReminderTime, setFilterReminderTime] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [activeColorPriority, setActiveColorPriority] = useState("");

  const [filterEventItem, setFilterEventItem] = useState(showEventItem);
  const [noFilterselectedIndex, setNoFilterSelectedIndex] = useState();
  const [noFilter, setNoFilter] = useState("");
  const [prioritySelectedIndex, setPrioritySelectedIndex] = useState();
  function handleFilter() {
    if (noFilter === "allDetailTasks") {
      // setFilterEventItem(showEventItem);
      filterEventItem.length = 0;
      console.log("hiện tất cả");
      setModalFilter(false);
    }
    // if(noFilter !== "allDetailTasks" && filterTaskType!== '' && filterRepeat!== '' && filterReminderTime!== '' && filterPriority!== ''){
    // }
    else {
      if (filterTaskType !== "") {
        setFilterEventItem(
          showEventItem.filter((item) => item.taskType === filterTaskType)
        );
        console.log("=====> filterTaskType:", filterTaskType);
        setModalFilter(false);
      }
      ///
      if (filterTaskType !== "" && filterRepeat !== "") {
        const filteredItems = showEventItem.reduce((acc, item) => {
          if (
            item.taskType === filterTaskType &&
            item.repeat === filterRepeat
          ) {
            acc.push(item);
          }
          return acc;
        }, []);
        if (filteredItems.length === 0) {
          setFilterEventItem(showEventItem);
          Alert.alert(
            "Thông báo",
            "Công việc lọc theo điều kiện này hiện không có!"
          );
        } else {
          setFilterEventItem(filteredItems);
          console.log(
            "=====> filterTaskType: " +
              filterTaskType +
              ", filterRepeat: " +
              filterRepeat
          );
        }
        setModalFilter(false);
      }
      ///
      if (filterTaskType !== "" && filterReminderTime !== "") {
        const filteredItems = showEventItem.reduce((acc, item) => {
          if (
            item.taskType === filterTaskType &&
            item.reminderTime === filterReminderTime
          ) {
            acc.push(item);
          }
          return acc;
        }, []);
        if (filteredItems.length === 0) {
          setFilterEventItem(showEventItem);
          Alert.alert(
            "Thông báo",
            "Công việc lọc theo điều kiện này hiện không có!"
          );
        } else {
          setFilterEventItem(filteredItems);
          console.log(
            "=====> filterTaskType: " +
              filterTaskType +
              ", filterReminderTime: " +
              filterReminderTime
          );
        }
        setModalFilter(false);
      }
      ///
      if (filterTaskType !== "" && filterPriority !== "") {
        const filteredItems = showEventItem.reduce((acc, item) => {
          if (
            item.taskType === filterTaskType &&
            item.priority === filterPriority
          ) {
            acc.push(item);
          }
          return acc;
        }, []);
        if (filteredItems.length === 0) {
          setFilterEventItem(showEventItem);
          Alert.alert(
            "Thông báo",
            "Công việc lọc theo điều kiện này hiện không có!"
          );
        } else {
          setFilterEventItem(filteredItems);
          console.log(
            "=====> filterTaskType: " +
              filterTaskType +
              ", filterPriority: " +
              filterPriority
          );
        }
        setModalFilter(false);
      }
    }
  }
  function handleCancelFilter() {
    setNoFilterSelectedIndex(-1);
    setPrioritySelectedIndex(-1);
    setFilterTaskType("");
    setFilterRepeat("");
    setFilterReminderTime("");
    setFilterPriority("");
    setModalFilter(false);
  }
  /////

  /////handle update task
  // const [modalUpdateTask, setModalUpdateTask] = useState(false);

  /////handle update status task
  async function handleUpdateStatusTask(task_id) {
    try {
      const currentFinishDateTime = moment()
        .utcOffset(7)
        .format("D/M/YYYY, HH [giờ] mm [phút]");
      const res = await axios.put(
        `${url}/api/task/updateStatusTask/${task_id}`,
        { finishDateTime: currentFinishDateTime },
        { timeout: 4000 }
      );
      if (res.data.length === 0) console.log("no data finish task");
      if (res.data.length > 0) {
        console.log(res.data);
        onRefresh();
        setIsModalVisible(false);
        Alert.alert(
          "Thông báo 🎉",
          "Chúc mừng bạn đã hoàn thành công việc này!"
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  /////

  /////==handle updateTaskScreen
  const [isLoading, setIsLoading] = useState(false);
  const [evtStart, setEvtStart] = useState("");
  useEffect(() =>
    events.forEach((e) => {
      setEvtStart(e.taskDetailId.startTime);
    })
  ),
    [events];
  const [txtInputTask, setTxtInputTask] = useState("");
  const [txtInputDesc, setTxtInputDesc] = useState("");

  //////handle add task-type
  const [selectedValue, setSelectedValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemValue, setNewItemValue] = useState("");
  useEffect(() => {
    //update giá trị ban đầu của Picker từ mảng data
    setSelectedValue(taskTypeData[0]);
  }, [taskTypeData]);
  function handleAddNewTaskType() {
    setTaskTypeData([...taskTypeData, newItemValue]);
    setSelectedValue(newItemValue);
    setModalVisible(false);

    AsyncStorage.setItem(
      "taskTypeData",
      JSON.stringify([...taskTypeData, newItemValue])
    )
      .then(() => {
        setModalVisible(false);
        Alert.alert("Thông báo", "Thêm loại công việc thành công!");
      })
      .catch((err) => {
        console.log("lỗi :", err);
      });
  }
  //////
  //////handle combobox picker & value mongodb
  const [taskType, setTaskType] = useState("Cá nhân");
  const [priority, setPriority] = useState("1");
  const [reminderTime, setReminderTime] = useState("Không");
  const [repeat, setRepeat] = useState("Không");
  // const [duration, setDuration] = useState('');
  const [deadline, setDeadline] = useState("");
  //////
  async function handleUpdateTask() {
    // setFlagModalUpdate(false);
    setIsLoading(true);
    if (txtInputTask === "") {
      window.setTimeout(function () {
        setIsLoading(false);
        Alert.alert("Thông báo", "Vui lòng nhập công việc!");
      }, 3000);
    }
    // apiUpdateTask("");
    const updateTask = {
      taskName: txtInputTask,
      description: txtInputDesc,
      taskType: taskType,
      priority: priority,
      reminderTime: reminderTime,
      repeat: repeat,
    };
    try {
      const res = await axios.put(
        `${url}/api/task/updateNotFinishTask/${selectedEvent.id}/${selectedEvent.taskDetail_id}/${selectedEvent.schedule_id}`,
        updateTask,
        { timeout: 2000 }
      );
      if (res.status === 200) {
        window.setTimeout(function () {
          setIsLoading(false);
          setFlagModalUpdate(false);
          Alert.alert("Thông báo", "Cập nhật công việc thành công!");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  }
  /////expo-notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    let isMounted = false;

    registerForPushNotificationsAsync().then((token) => {
      if (!isMounted) return;
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        if (!isMounted) return;
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      isMounted = true;
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  // useEffect(() => console.log("expoPushToken", expoPushToken));

  async function schedulePushNotification() {
    const startDateTimeTask = moment(
      displayStartDate + ", " + displayStartTime,
      "D/M/YYYY, HH [giờ] mm [phút]"
    ).toDate();
    switch (reminderTime) {
      case "Không":
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "TaskObey thông báo 📅",
            body: "Bạn có công việc '" + txtInputTask + "' cần làm!",
          },
          trigger: null,
        });
        break;
      case "Đúng giờ":
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "TaskObey thông báo 📅",
            body: "Bạn có công việc '" + txtInputTask + "' cần làm!",
          },
          trigger: { date: startDateTimeTask },
        });
        break;
      case "Trước 5 phút":
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "TaskObey thông báo 📅",
            body: "Bạn có công việc '" + txtInputTask + "' cần làm sau 5 phút!",
          },
          trigger: {
            date: startDateTimeTask.setMinutes(
              startDateTimeTask.getMinutes() - 5
            ),
          },
        });
        break;
      case "Trước 30 phút":
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "TaskObey thông báo 📅",
            body:
              "Bạn có công việc '" + txtInputTask + "' cần làm sau 30 phút!",
          },
          trigger: {
            date: startDateTimeTask.setMinutes(
              startDateTimeTask.getMinutes() - 30
            ),
          },
        });
        break;
      case "Trước 1 tiếng":
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "TaskObey thông báo 📅",
            body:
              "Bạn có công việc '" + txtInputTask + "' cần làm sau 1 tiếng!",
          },
          trigger: {
            date: startDateTimeTask.setMinutes(
              startDateTimeTask.getMinutes() - 60
            ),
          },
        });
        break;
      case "Trước 1 ngày":
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "TaskObey thông báo 📅",
            body: "Bạn có công việc '" + txtInputTask + "' cần làm ngày mai!",
          },
          trigger: {
            date: startDateTimeTask.setDate(startDateTimeTask.getDate() - 1),
          },
        });
        break;
      default:
        break;
    }
  }
  const [flagModalUpdate, setFlagModalUpdate] = useState(false);
  /////==

  return (
    <SafeAreaView style={styles.container}>
      <RefreshControl
        style={{ width: widthScreen, height: "80%" }}
        refreshing={flagModalUpdate === false ? refreshing : null}
        onRefresh={flagModalUpdate === false ? onRefresh : null}
      >
        <Calendar
          // style={{height: '70%'}}
          events={
            filterEventItem.length === 0 ? showEventItem : filterEventItem
          }
          height={800}
          weekStartsOn={1}
          locale="vi"
          headerContentStyle={{ alignItems: "center" }}
          headerContainerStyle={{
            height: "12%",
            borderBottomColor: "#09CBD0",
            borderBottomWidth: 2,
            borderStyle: "dashed",
          }}
          eventCellStyle={(event, start, end, isSelected) => {
            let backgroundColor;
            switch (event.priority) {
              case "1":
                backgroundColor = eventColors[0];
                break;
              case "2":
                backgroundColor = eventColors[1];
                break;
              case "3":
                backgroundColor = eventColors[2];
                break;
              default:
                break;
            }
            return {
              backgroundColor,
              borderRadius: 5,
              opacity: isSelected ? 0.8 : 1,
              borderRadius: 5,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "black",
              height: "auto",
              width: "auto",
              color: "#fff",
            };
          }}
          // renderEvent={renderEvent}
          onPressEvent={(ev) => handlePressEvent(ev)}
          date={dateCalendar}
          onChangeDate={(newDate) => setDateCalendar(newDate)}
          mode={viewModeCalendar}
          swipeEnabled={false}
          showTime={false}
          // hideHours={true}
          hourRowHeight={200}
          // ampm
          // overlapOffset={10} //ko chồng lên nhau

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
        {/* modal details info event */}
        {selectedEvent && (
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
                <View style={{ height: "75%", justifyContent: "space-around" }}>
                  {/* tên cv */}
                  <Text style={styles.txtModal}>
                    Tên công việc:{"\t\t"}
                    <Text style={{ fontSize: 15, color: "black" }}>
                      {selectedEvent.title}
                    </Text>
                  </Text>
                  {/* mô tả */}
                  <Text style={styles.txtModal}>
                    Mô tả:{"\n"}
                    <Text style={{ fontSize: 15, color: "black" }}>
                      {selectedEvent.description}
                    </Text>
                  </Text>
                  {/* ưu tiên, loại cv */}
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.txtModal}>
                      Ưu tiên:{"\u00A0"}
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        {selectedEvent.priority}
                      </Text>
                    </Text>
                    <Text style={styles.txtModal}>
                      Loại công việc:{"\u00A0"}
                      <Text style={{ fontSize: 15, color: "black" }}>
                        {selectedEvent.taskType}
                      </Text>
                    </Text>
                  </View>
                  {/* lời nhắc, loại lặp cv */}
                  {/* <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.txtModal}>
                      Lời nhắc:{"\u00A0"}
                      <Text style={{ fontSize: 20, color: "black" }}>
                        {selectedEvent.reminderTime}
                      </Text>
                    </Text>
                    <Text style={styles.txtModal}>
                      Loại lặp công việc:{"\u00A0"}
                      <Text style={{ fontSize: 18, color: "black" }}>
                        {selectedEvent.repeat}
                      </Text>
                    </Text>
                  </View> */}
                  {/* th.g bắt đầu */}
                  <Text style={styles.txtModal}>
                    Thời gian bắt đầu:{"\t"}
                    <Text style={{ fontSize: 15, color: "black" }}>
                      {moment(selectedEvent.start)
                        .utcOffset("+0700")
                        .format("D/M/YYYY, HH [giờ] mm [phút]")}
                    </Text>
                  </Text>
                  {/* th.g kết thúc */}
                  <Text style={styles.txtModal}>
                    Thời gian kết thúc:{"\t"}
                    <Text style={{ fontSize: 15, color: "black" }}>
                      {moment(selectedEvent.end)
                        .utcOffset("+0700")
                        .format("D/M/YYYY, HH [giờ] mm [phút]") ===
                      "Invalid date"
                        ? "Không"
                        : moment(selectedEvent.end)
                            .utcOffset("+0700")
                            .format("D/M/YYYY, HH [giờ] mm [phút]")}
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
                  {/* <Text style={styles.txtModal}>
                    Thời hạn:{"\u00A0"}
                    <Text style={{ fontSize: 18, color: "black" }}>
                      {selectedEvent.deadline === ""
                        ? "Không"
                        : moment(selectedEvent.duration)
                            .utcOffset("+0700")
                            .format("D/M/YYYY, HH [giờ] mm [phút]")}
                    </Text>
                  </Text> */}
                  {/* ngày tạo, trạng thái */}
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.txtModal}>
                      Ngày tạo:{"\u00A0"}
                      <Text style={{ fontSize: 15, color: "black" }}>
                        {selectedEvent.initialDate}
                      </Text>
                    </Text>
                    <Text style={styles.txtModal}>
                      Trạng thái:{"\u00A0"}
                      <Text style={{ fontSize: 15, color: "black" }}>
                        {selectedEvent.status}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={[styles.btnHandle, { width: "30%" }]}
                    onPress={() => {
                      Alert.alert(
                        "Xác nhận",
                        "Bạn có muốn xóa công việc này?",
                        [
                          {
                            text: "Xóa",
                            onPress: () => {
                              handleDeleteNotFinishTask(
                                selectedEvent.id,
                                selectedEvent.taskDetail_id,
                                selectedEvent.schedule_id
                              );
                              closeModal(); //close modal info evt
                              onRefresh();
                              console.log("Đã xóa cv");
                              Alert.alert("Thông báo", "Đã xóa công việc!");
                            },
                          },
                          {
                            text: "Hủy",
                            onPress: () => console.log("Hủy xóa"),
                            style: "cancel",
                          },
                        ],
                        { cancelable: false }
                      );
                    }}
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={25}
                      color="#fff"
                    />
                    <Text style={{ color: "#fff", fontSize: 15 }}>Xóa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnHandle, { width: "30%" }]}
                    onPress={() => {
                      setIsModalVisible(false);
                      setFlagModalUpdate(true);
                    }}
                  >
                    <Ionicons name="md-create-outline" size={25} color="#fff" />
                    <Text style={{ color: "#fff", fontSize: 15 }}>
                      Cập nhật
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnHandle, { width: "30%" }]}
                    onPress={() => handleUpdateStatusTask(selectedEvent.id)}
                  >
                    <Materialicons name="done" size={25} color="#fff" />
                    <Text style={{ color: "#fff", fontSize: 15 }}>
                      Hoàn thành
                    </Text>
                  </TouchableOpacity>
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
        {/* modal update info task */}
        {/* {modalUpdateTask && (
          <Modal
            visible={modalUpdateTask}
            animationType="slide"
            onRequestClose={closeModalUpdate}
            transparent
          > */}
        <SafeAreaView
          style={{
            display: flagModalUpdate ? "flex" : "none",
            // flex: 1,
            // height: 380,
            height: "90%",
            marginTop: "-10%",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            // padding: "3%",
            alignItems: "center",
          }}
        >
          <ScrollView
            style={{
              width: "95%",
              height: "90%",
              backgroundColor: "#fff",
            }}
            contentContainerStyle={{
              // height: "100%",
              height: 600,
              width: "100%",
              padding: "3%",
              justifyContent: "space-around",
            }}
          >
            {/* tên cv */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
              }}
            >
              <TextInput
                style={[
                  styles.styleInput,
                  { borderRadius: 10, borderColor: "gray" },
                ]}
                placeholder="Nhập tên công việc"
                numberOfLines={1}
                // autoFocus
                onChangeText={(txt) => setTxtInputTask(txt)}
                value={txtInputTask}
                keyboardShouldPersistTaps="handled"
              />
              <View style={{ marginLeft: "-11%", padding: "2%" }}>
                <TouchableOpacity onPress={() => setTxtInputTask("")}>
                  <Feathericons name="delete" size={30} color="#09CBD0" />
                </TouchableOpacity>
              </View>
            </View>

            {/* mô tả */}
            <View
              style={{ flexDirection: "row", width: "100%", height: "15%" }}
            >
              <TextInput
                style={[
                  styles.styleInput,
                  {
                    textAlignVertical: "top",
                    height: "80%",
                    marginTop: "3%",
                    borderRadius: 10,
                    borderColor: "gray",
                  },
                ]}
                placeholder="Nhập mô tả"
                numberOfLines={4}
                multiline
                onChangeText={(txt) => setTxtInputDesc(txt)}
                value={txtInputDesc}
                keyboardShouldPersistTaps="handled"
              />
              <View
                style={{
                  marginLeft: "-11%",
                  padding: "2%",
                  marginTop: "3%",
                }}
              >
                <TouchableOpacity onPress={() => setTxtInputDesc("")}>
                  <Feathericons name="delete" size={30} color="#09CBD0" />
                </TouchableOpacity>
              </View>
            </View>

            {/* loại cv */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                height: "8.5%",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "82%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#09CBD0" }}>Loại công việc:</Text>
                <Picker
                  style={{
                    width: "70%",
                    backgroundColor: "#BCF4F5",
                  }}
                  selectedValue={taskType}
                  onValueChange={(itemValue, itemIndex) => {
                    // setItemToDelete(itemValue);
                    setTaskType(itemValue);
                  }}
                >
                  {taskTypeData.map((item, index) => (
                    <Picker.Item
                      style={{ fontWeight: "bold", fontSize: 14 }}
                      key={index}
                      label={item}
                      value={item}
                    />
                  ))}
                </Picker>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // width: "25%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <FontAwesomeicons
                    name="plus-square"
                    size={45}
                    color="#09CBD0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* ưu tiên */}
            <View
              style={[
                styles.viewTwoColumns,
                { height: "8.5%", alignItems: "center" },
              ]}
            >
              <Text style={{ color: "#09CBD0" }}>Ưu tiên:</Text>
              <Picker
                style={{ width: "75.5%", backgroundColor: "#BCF4F5" }}
                selectedValue={priority}
                onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}
              >
                <Picker.Item
                  style={{ fontWeight: "bold", color: "red" }}
                  label="1"
                  value="1"
                />
                <Picker.Item
                  style={{ fontWeight: "bold", color: "orange" }}
                  label="2"
                  value="2"
                />
                <Picker.Item
                  style={{ fontWeight: "bold", color: "#09CBD0" }}
                  label="3"
                  value="3"
                />
              </Picker>
            </View>

            {/* lặp lại */}
            <View
              style={[
                styles.viewTwoColumns,
                { height: "8.5%", alignItems: "center" },
              ]}
            >
              <Text style={{ color: "#09CBD0" }}>Đặt lặp lại:</Text>
              <Picker
                style={{ width: "75.5%", backgroundColor: "#BCF4F5" }}
                selectedValue={repeat}
                onValueChange={(itemValue, itemIndex) => setRepeat(itemValue)}
              >
                <Picker.Item
                  style={{ fontSize: 18 }}
                  label="Không"
                  value="Không"
                />
                <Picker.Item
                  style={{ fontSize: 18 }}
                  label="Mỗi ngày"
                  value="Mỗi ngày"
                />
                <Picker.Item
                  style={{ fontSize: 18 }}
                  label="Mỗi tuần"
                  value="Mỗi tuần"
                />
                <Picker.Item
                  style={{ fontSize: 18 }}
                  label="Mỗi tháng"
                  value="Mỗi tháng"
                />
                <Picker.Item
                  style={{ fontSize: 18 }}
                  label="Mỗi năm"
                  value="Mỗi năm"
                />
              </Picker>
            </View>

            {/* lời nhắc */}
            <View
              style={[
                styles.viewTwoColumns,
                { height: "8.5%", alignItems: "center" },
              ]}
            >
              <Text style={{ color: "#09CBD0" }}>Đặt lời nhắc:</Text>
              <Picker
                style={{ width: "75.5%", backgroundColor: "#BCF4F5" }}
                selectedValue={reminderTime}
                onValueChange={(itemValue, itemIndex) =>
                  setReminderTime(itemValue)
                }
              >
                <Picker.Item
                  style={{ fontSize: 18 }}
                  label="Không"
                  value="Không"
                />
                <Picker.Item
                  style={{ fontSize: 18 }}
                  label="Đúng giờ"
                  value="Đúng giờ"
                />
                <Picker.Item
                  style={{ fontSize: 18 }}
                  label="Trước 5 phút"
                  value="Trước 5 phút"
                />
                <Picker.Item
                  style={{ fontSize: 18 }}
                  label="Trước 30 phút"
                  value="Trước 30 phút"
                />
                <Picker.Item
                  style={{ fontSize: 18 }}
                  label="Trước 1 tiếng"
                  value="Trước 1 tiếng"
                />
                <Picker.Item
                  style={{ fontSize: 18 }}
                  label="Trước 1 ngày"
                  value="Trước 1 ngày"
                />
              </Picker>
            </View>

            {/* modal thêm loại cv */}
            <Modal visible={modalVisible} animationType="slide" transparent>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.6)", // Màu đen bóng mờ
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    borderColor: "#09CBD0",
                    borderStyle: "solid",
                    borderWidth: 3,
                    width: "50%",
                    padding: 20,
                    borderRadius: 5,
                  }}
                >
                  <TextInput
                    placeholder="Nhập loại công việc mới"
                    style={{ fontSize: 15 }}
                    value={newItemValue}
                    onChangeText={(text) => setNewItemValue(text)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: "5%",
                    width: "40%",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={handleAddNewTaskType}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Thêm
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      Hủy
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* modal xóa loại cv */}
            {/* <Modal
                  visible={modalVisibleDelTaskType}
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
                    <View
                      style={{
                        backgroundColor: "white",
                        borderColor: "#09CBD0",
                        borderStyle: "solid",
                        borderWidth: 3,
                        width: "50%",
                        padding: 20,
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ fontSize: 15 }}>
                        Bạn có muốn xóa loại công việc này?
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: "5%",
                        width: "40%",
                        justifyContent: "space-around",
                      }}
                    >
                      <TouchableOpacity style={styles.btn} onPress={handleDeleteTaskType}>
                        <Text style={{ fontSize: 17, color: "#fff", fontWeight: "bold" }}>
                          Xóa
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => setModalVisibleDelTaskType(false)}
                      >
                        <Text style={{ fontSize: 17, color: "#fff", fontWeight: "bold" }}>
                          Hủy
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal> */}

            {isLoading ? (
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ alignSelf: "center" }}>
                  Hệ thống đang cập nhật
                </Text>
                <Image
                  source={require("../../../assets/loading-dots.gif")}
                  style={{
                    resizeMode: "contain",
                    width: 50,
                    height: 50,
                    marginLeft: "3%",
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                  marginTop: "2%",
                }}
              >
                <TouchableOpacity style={styles.btn} onPress={handleUpdateTask}>
                  <Text style={{ fontSize: 20, color: "#fff" }}>Cập nhật</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => setFlagModalUpdate(false)}
                >
                  <Text style={{ fontSize: 20, color: "#fff" }}>Hủy</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* </View> */}
          </ScrollView>
        </SafeAreaView>
        {/* </Modal>
        )} */}
      </RefreshControl>
      {/* mode view, refresh, filter, prev-next */}
      <View
        style={{
          height: "20%",
          width: "95%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            switch (viewModeCalendar) {
              case "week":
                handlePrevWeek();
                break;
              case "day":
                handlePrevDay();
                break;
              case "3days":
                handlePrev3Days();
                break;
              case "month":
                handlePrevMonth();
                break;
              default:
                break;
            }
          }}
          style={styles.btnPrevNext}
        >
          <FontAwesome5icons name="caret-left" size={30} color="#fff" />
          <Text style={{ color: "#fff" }}>Trở về</Text>
        </TouchableOpacity>
        <View
          style={{
            height: "100%",
            width: "60%",
            alignItems: "center",
            justifyContent: "space-around",
            // backgroundColor: "red",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Text style={{ color: "#09CBD0" }}>Xem lịch theo:</Text>
            <Picker
              style={{
                width: "55%",
                backgroundColor: "#BCF4F5",
                marginLeft: "3%",
              }}
              selectedValue={viewModeCalendar}
              onValueChange={(itemValue, itemIndex) =>
                setViewModeCalendar(itemValue)
              }
            >
              <Picker.Item style={{ fontSize: 15 }} label="Tuần" value="week" />
              <Picker.Item
                style={{ fontSize: 15 }}
                label="1 ngày"
                value="day"
              />
              <Picker.Item
                style={{ fontSize: 15 }}
                label="3 ngày"
                value="3days"
              />
              <Picker.Item
                style={{ fontSize: 15 }}
                label="Tháng"
                value="month"
              />
            </Picker>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity style={styles.btnHandle} onPress={onRefresh}>
              <Ionicons name="refresh" size={25} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 16 }}>Làm mới</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnHandle}
              onPress={() => setModalFilter(true)}
            >
              <Feather name="filter" size={25} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 16 }}>Lọc</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            switch (viewModeCalendar) {
              case "week":
                handleNextWeek();
                break;
              case "day":
                handleNextDay();
                break;
              case "3days":
                handleNext3Days();
                break;
              case "month":
                handleNextMonth();
                break;
              default:
                break;
            }
          }}
          style={styles.btnPrevNext}
        >
          <Text style={{ color: "#fff" }}>Tiếp</Text>
          <FontAwesome5icons name="caret-right" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* modal filter */}
      <Modal
        visible={modalFilter}
        // onRequestClose={closeModal}
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
          <View
            style={[
              styles.styleModal,
              { paddingLeft: "2%", paddingRight: "2%", width: "95%" },
            ]}
          >
            <View style={{ height: "90%", justifyContent: "space-around" }}>
              <Text
                style={[styles.txtModal, { fontSize: 17, fontWeight: "bold" }]}
              >
                Lọc công việc theo:
              </Text>
              {/* lọc loại cv */}
              <View style={styles.rowFilterModal}>
                <Text style={styles.txtModal}>Loại công việc:</Text>
                <Picker
                  style={{ width: "70%", backgroundColor: "#BCF4F5" }}
                  selectedValue={filterTaskType}
                  onValueChange={(itemValue, itemIndex) => {
                    setFilterTaskType(itemValue);
                  }}
                >
                  {taskTypeData.map((item, index) => (
                    <Picker.Item
                      style={{ fontWeight: "bold", fontSize: 14 }}
                      key={index}
                      label={item}
                      value={item}
                    />
                  ))}
                </Picker>
              </View>
              {/* lọc lặp lại */}
              <View style={styles.rowFilterModal}>
                <Text style={styles.txtModal}>Lặp lại:</Text>
                <Picker
                  style={{ width: "70%", backgroundColor: "#BCF4F5" }}
                  selectedValue={filterRepeat}
                  onValueChange={(itemValue, itemIndex) =>
                    setFilterRepeat(itemValue)
                  }
                >
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Không lọc"
                    value=""
                  />
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Không"
                    value="Không"
                  />
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Mỗi ngày"
                    value="Mỗi ngày"
                  />
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Mỗi tuần"
                    value="Mỗi tuần"
                  />
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Mỗi tháng"
                    value="Mỗi tháng"
                  />
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Mỗi năm"
                    value="Mỗi năm"
                  />
                </Picker>
              </View>
              {/* lọc lời nhắc */}
              <View style={styles.rowFilterModal}>
                <Text style={styles.txtModal}>Lời nhắc:</Text>
                <Picker
                  style={{ width: "70%", backgroundColor: "#BCF4F5" }}
                  selectedValue={filterReminderTime}
                  onValueChange={(itemValue, itemIndex) =>
                    setFilterReminderTime(itemValue)
                  }
                >
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Không lọc"
                    value=""
                  />
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Không"
                    value="Không"
                  />
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Đúng giờ"
                    value="Đúng giờ"
                  />
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Trước 5 phút"
                    value="Trước 5 phút"
                  />
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Trước 30 phút"
                    value="Trước 30 phút"
                  />
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Trước 1 tiếng"
                    value="Trước 1 tiếng"
                  />
                  <Picker.Item
                    style={{ fontSize: 18 }}
                    label="Trước 1 ngày"
                    value="Trước 1 ngày"
                  />
                </Picker>
              </View>
              {/* lọc ưu tiên */}
              <View style={styles.rowFilterModal}>
                <Text style={styles.txtModal}>Ưu tiên:</Text>
                <RadioGroup
                  size={25}
                  color="black"
                  activeColor={activeColorPriority}
                  style={{
                    flexDirection: "row",
                    width: "80%",
                    justifyContent: "space-between",
                  }}
                  selectedIndex={prioritySelectedIndex}
                  onSelect={(index, value) => {
                    if (index !== -1) {
                      setNoFilterSelectedIndex(-1);
                      setNoFilter("");
                    }
                    if (index === 0) {
                      setPrioritySelectedIndex(0);
                      setActiveColorPriority("black");
                    }
                    if (index === 1) {
                      setPrioritySelectedIndex(1);
                      setActiveColorPriority("red");
                    }
                    if (index === 2) {
                      setPrioritySelectedIndex(2);
                      setActiveColorPriority("orange");
                    }
                    if (index === 3) {
                      setPrioritySelectedIndex(3);
                      setActiveColorPriority("#09CBD0");
                    }
                    setFilterPriority(value);
                  }}
                >
                  <RadioButton value={""}>
                    <Text style={{ color: "black" }}>Không lọc</Text>
                  </RadioButton>
                  <RadioButton value={"1"}>
                    <Text style={{ color: "red" }}>1</Text>
                  </RadioButton>
                  <RadioButton value={"2"}>
                    <Text style={{ color: "orange" }}>2</Text>
                  </RadioButton>
                  <RadioButton value={"3"}>
                    <Text style={{ color: "#09CBD0" }}>3</Text>
                  </RadioButton>
                </RadioGroup>
              </View>
              {/* ko lọc, hiện tất cả */}
              <RadioGroup
                size={25}
                color="black"
                selectedIndex={noFilterselectedIndex}
                onSelect={(index, value) => {
                  setNoFilterSelectedIndex(0);
                  setNoFilter(value);
                  if (index !== -1) {
                    setPrioritySelectedIndex(0);
                    setActiveColorPriority("black");
                    setFilterPriority("");
                  }
                }}
                style={{
                  width: "100%",
                  height: "10%",
                  alignItems: "center",
                }}
              >
                <RadioButton value={"allDetailTasks"}>
                  <Text>Hiện tất cả</Text>
                </RadioButton>
              </RadioGroup>
            </View>
            <View
              style={{
                width: "35%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignSelf: "center",
                marginTop: "2%",
              }}
            >
              <TouchableOpacity
                onPress={handleFilter}
                style={{ alignItems: "center" }}
              >
                <Text
                  style={{ color: "#09CBD0", fontWeight: "bold", fontSize: 16 }}
                >
                  [ OK ]
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelFilter}
                style={{ alignItems: "center" }}
              >
                <Text
                  style={{ color: "red", fontWeight: "bold", fontSize: 16 }}
                >
                  [ Hủy ]
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: "100%",
    // height: 537,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  txtModal: {
    fontSize: 14,
    color: "#09CBD0",
  },
  btnPrevNext: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "15%",
    backgroundColor: "#09CBD0",
    borderRadius: 10,
  },
  btnHandle: {
    backgroundColor: "#09CBD0",
    flexDirection: "row",
    height: "100%",
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    padding: "2%",
    borderRadius: 10,
  },
  styleModal: {
    backgroundColor: "white",
    borderColor: "#09CBD0",
    borderStyle: "solid",
    borderWidth: 3,
    width: "88%",
    height: "55%",
    padding: 20,
    borderRadius: 20,
    justifyContent: "space-around",
  },
  rowFilterModal: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  styleInput: {
    alignSelf: "center",
    width: "100%",
    height: 40,
    fontSize: 17,
    marginTop: 5,
    marginRight: 0,
    marginBottom: 5,
    marginLeft: 0,
    paddingLeft: 10,
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 1,
  },
  viewTwoColumns: {
    width: "100%",
    height: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    alignSelf: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#09CBD0",
    borderRadius: 100,
    width: "40%",
  },
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  }
  // else {
  //   alert("Must use physical device for Push Notifications");
  // }

  return token;
}
