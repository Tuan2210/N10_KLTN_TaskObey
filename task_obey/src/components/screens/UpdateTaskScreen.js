import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
import Feathericons from "react-native-vector-icons/Feather";

//doc: https://github.com/react-native-picker/picker
import { Picker } from "@react-native-picker/picker";

import AsyncStorage from "@react-native-async-storage/async-storage";

//doc: https://github.com/react-native-datetimepicker/datetimepicker#display-optional
//yt: https://www.youtube.com/watch?v=Imkw-xFFLeE
import DateTimePicker from "@react-native-community/datetimepicker";

// import PushNotification from "react-native-push-notification";
import moment from "moment";

//doc: https://github.com/APSL/react-native-keyboard-aware-scroll-view
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function UpdateTaskScreen(props) {
  const infoTaskBeforeUpdate = props;

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
      loadListNotFinishTasks(registerUserId);
    }
    if (!currentRegisterUser && currentLoginUser) {
      setUserId(loginUserId);
      loadListNotFinishTasks(loginUserId);
    }
  }, [currentRegisterUser, currentLoginUser]);

  const [isLoading, setIsLoading] = useState(false);
  const [marginTopSize, setMarginTopSize] = useState("-10%");

  //////handle read all data tasks
  const [events, setEvents] = useState([]);
  const [evtStart, setEvtStart] = useState("");
  async function loadListNotFinishTasks(id) {
    try {
      const res = await axios.get(`${url}/api/task/notFinishTasks/${id}`, {
        timeout: 4000,
      });
      if (res.data.length === 0) console.log("no data task in list");
      if (res.data.length > 0) {
        setEvents(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() =>
    events.forEach((e) => {
      // console.log(e.taskDetailId.startTime);
      setEvtStart(e.taskDetailId.startTime);
    })
  ),
    [events];
  //////

  //////handle start-date-time picker
  const currentDateVN = new Date().toISOString().split("T")[0];
  const currentDayVN = currentDateVN.slice(8, 10),
    currentMonthVN = currentDateVN.slice(5, 7),
    currentYearVN = currentDateVN.slice(0, 4),
    formatCurrentDateVN =
      currentDayVN + "/" + currentMonthVN + "/" + currentYearVN;
  const [startDate, setStartDate] = useState(infoTaskBeforeUpdate.props.start);
  const [startTime, setStartTime] = useState(new Date());
  const [inputStartTime, setInputStartTime] = useState("");
  const [modeStartDateTime, setModeStartDateTime] = useState("");
  const [showStartDateTime, setShowStartDateTime] = useState(false);
  const [displayStartDate, setDisplayStartDate] = useState(
    moment(infoTaskBeforeUpdate.props.start)
      .utcOffset("+0700")
      .format("D/M/YYYY")
  );
  const [displayStartTime, setDisplayStartTime] = useState(
    moment(infoTaskBeforeUpdate.props.start)
      .utcOffset("+0700")
      .format("HH [giờ] mm [phút]")
  );

  const onChangeStartDateTime = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    // setShowStartDateTime(Platform.OS === 'android');
    setStartDate(currentDate);

    let template = new Date(currentDate);
    const realCurrentDate1 = new Date();
    // setStartTime(currentDate);

    if (
      template.getDate() === realCurrentDate1.getDate() &&
      template.getMonth() === realCurrentDate1.getMonth() &&
      template.getFullYear() === realCurrentDate1.getFullYear() &&
      (realCurrentDate1.getHours() > template.getHours() ||
        (realCurrentDate1.getHours() === template.getHours() &&
          realCurrentDate1.getMinutes() >= template.getMinutes()))
    ) {
      setShowStartDateTime(false);
      setModeStartDateTime("");
      Alert.alert(
        "Thông báo",
        "Vui lòng đặt thời gian bắt đầu sau thời gian hiện tại!"
      );
    } else {
      let fDate1 =
        template.getDate() +
        "/" +
        (template.getMonth() + 1) +
        "/" +
        template.getFullYear();
      let fTime1 =
        template.getHours() + " giờ " + template.getMinutes() + " phút";

      const displayStartDateTime = fDate1 + ", " + fTime1;
      if (displayStartDateTime === evtStart) {
        //compare startDateTime of all tasks
        if (
          displayStartDateTime !==
          moment(infoTaskBeforeUpdate.props.start)
            .utcOffset("+0700")
            .format("D/M/YYYY, HH [giờ] mm [phút]")
        ) {
          //compare !=== startDateTime of task is chosen
          setShowStartDateTime(false);
          Alert.alert(
            "Thông báo",
            "Thời gian này đã được đặt, vui lòng đặt thời gian bắt đầu khác!"
          );
        }
      } else {
        setDisplayStartDate(fDate1);
        setDisplayStartTime(fTime1);
        setShowStartDateTime(false);
        setModeStartDateTime("");
        console.log(startDate);
        console.log("pick startDateTime:", fDate1 + ",\u00A0" + fTime1);
      }
    }
  };
  //////

  //////switch toggle
  // const [flag, setFlag] = useState(false); //default Không

  //////handle end-date-time picker
  const [endDate, setEndDate] = useState(infoTaskBeforeUpdate.props.end);
  const [endTime, setEndTime] = useState();
  const [endDateTime, setEndDateTime] = useState("");
  const [modeEndDateTime, setModeEndDateTime] = useState("");
  const [showEndDateTime, setShowEndDateTime] = useState(false);
  const [displayEndDate, setDisplayEndDate] = useState(
    moment(infoTaskBeforeUpdate.props.end)
      .utcOffset("+0700")
      .format("D/M/YYYY") === "Invalid date"
      ? "... / ... / ...."
      : moment(infoTaskBeforeUpdate.props.end)
          .utcOffset("+0700")
          .format("D/M/YYYY")
  );
  const [displayEndTime, setDisplayEndTime] = useState(
    moment(infoTaskBeforeUpdate.props.end)
      .utcOffset("+0700")
      .format("HH [giờ] mm [phút]") === "Invalid date"
      ? "... giờ ... phút"
      : moment(infoTaskBeforeUpdate.props.end)
          .utcOffset("+0700")
          .format("HH [giờ] mm [phút]")
  );

  const onChangeEndDateTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    // setShowStartDateTime(Platform.OS === 'android');
    setEndDate(currentDate);

    let template = new Date(currentDate);
    const realCurrentDate2 = new Date();

    // if (flag === true) {
    if (
      template.getDate() === startDate.getDate() &&
      template.getMonth() === startDate.getMonth() &&
      template.getFullYear() === startDate.getFullYear() &&
      ((template.getHours() <= startDate.getHours() &&
        template.getMinutes() <= startDate.getMinutes()) ||
        template.getTime() <= startDate.getTime())
    ) {
      setDisplayEndDate(displayStartDate);
      setDisplayEndTime("... giờ ... phút");
      setShowEndDateTime(false);
      setModeEndDateTime("");
      Alert.alert(
        "Thông báo",
        "Vui lòng đặt thời gian kết thúc sau thời gian bắt đầu"
      );
    } else {
      let fDate2 =
        template.getDate() +
        "/" +
        (template.getMonth() + 1) +
        "/" +
        template.getFullYear();
      let fTime2 =
        template.getHours() + " giờ " + template.getMinutes() + " phút";
      setDisplayEndDate(fDate2);
      setDisplayEndTime(fTime2);
      setEndDateTime(displayEndDate + ",\u00A0" + displayEndTime);
      setShowEndDateTime(false);
      setModeEndDateTime("");
      console.log(endDate);
      console.log("pick endDateTime:", fDate2 + ",\u00A0" + fTime2);
    }
    // } else {
    //   setDisplayEndDate("... / ... / ....");
    //   setDisplayEndTime("... giờ ... phút");
    //   setEndDateTime("");
    // }
  };
  //////

  const [txtInputTask, setTxtInputTask] = useState(
    infoTaskBeforeUpdate.props.title
  );
  const [txtInputDesc, setTxtInputDesc] = useState(
    infoTaskBeforeUpdate.props.description
  );

  //////handle add task-type
  const [selectedValue, setSelectedValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemValue, setNewItemValue] = useState("");
  const [taskTypeData, setTaskTypeData] = useState([
    "Cá nhân",
    "Học tập",
    "Gia đình",
    "Công ty",
    "Du lịch",
  ]);
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

  //////handle delete item task-type
  // const [itemToDelete, setItemToDelete] = useState();
  // const [modalVisibleDelTaskType, setModalVisibleDelTaskType] = useState(false);
  // function handleDeleteTaskType() {
  //   const newData = taskTypeData.filter((item) => item !== itemToDelete); //lọc bỏ item cần xóa khỏi newData
  //   setTaskTypeData(newData);
  //   AsyncStorage.setItem("taskTypeData", JSON.stringify(newData))
  //     .then(() => {
  //       setItemToDelete([0]);
  //       setModalVisibleDelTaskType(false);
  //       Alert.alert("Thông báo", "Đã xóa loại công việc!");
  //     })
  //     .catch((err) => {
  //       console.log("lỗi xóa:", err);
  //     });
  // }
  //////

  //load data task-type
  useEffect(() => {
    //update giá trị ban đầu của Picker từ mảng data
    setSelectedValue(taskTypeData[0]);
  }, [taskTypeData]);

  useEffect(() => {
    AsyncStorage.getItem("taskTypeData")
      .then((value) => {
        if (value) setTaskTypeData(JSON.parse(value));
      })
      .catch((err) => {
        console.log("lỗi khôi phục:", err);
      });
  }, []);
  //

  //////handle combobox picker & value mongodb
  const [taskType, setTaskType] = useState(infoTaskBeforeUpdate.props.taskType);
  const [priority, setPriority] = useState(infoTaskBeforeUpdate.props.priority);
  const [reminderTime, setReminderTime] = useState(
    infoTaskBeforeUpdate.props.reminderTime
  );
  const [repeat, setRepeat] = useState(infoTaskBeforeUpdate.props.repeat);
  // const [duration, setDuration] = useState('');
  const [deadline, setDeadline] = useState("");
  //////

  /////handle create task
  function handleUpdateTask() {
    setIsLoading(true);
    window.setTimeout;
    const newestCurrentDateTime = new Date(),
      newestHour = newestCurrentDateTime.getHours(),
      newestMinute = newestCurrentDateTime.getMinutes(),
      newestDate = newestCurrentDateTime.getDate(),
      newestMonth = newestCurrentDateTime.getMonth(),
      newestYear = newestCurrentDateTime.getFullYear();
    if (txtInputTask === "") {
      window.setTimeout(async function () {
        setIsLoading(false);
        Alert.alert("Thông báo", "Vui lòng nhập công việc!");
      }, 3000);
    }
    window.setTimeout(async function () {
      setIsLoading(false);
      apiUpdateTask("");
      Alert.alert("Thông báo", "Cập nhật công việc thành công!");
    }, 3000);
    // else if (displayStartTime === "... giờ ... phút") {
    //   window.setTimeout(async function () {
    //     setIsLoading(false);
    //     Alert.alert("Thông báo", "Vui lòng chọn khoảng thời gian bắt đầu!");
    //   }, 3000);
    // } else if (startDate !== infoTaskBeforeUpdate.props.start) {
    //   if (
    //     startDate.getDate() === newestDate &&
    //     startDate.getMonth() === newestMonth &&
    //     startDate.getFullYear() === newestYear &&
    //     startDate.getHours() === newestHour &&
    //     startDate.getMinutes() <= newestMinute
    //   ) {
    //     window.setTimeout(async function () {
    //       setIsLoading(false);
    //       Alert.alert(
    //         "Thông báo",
    //         "Vui lòng đặt thời gian bắt đầu sau thời gian hiện tại!"
    //       );
    //     }, 3000);
    //   }
    // } else if (endDate !== infoTaskBeforeUpdate.props.end) {
    //   if (
    //     // flag === true &&
    //     endDate.getDate() === newestDate &&
    //     endDate.getMonth() === newestMonth &&
    //     endDate.getFullYear() === newestYear &&
    //     endDate.getHours() <= newestHour &&
    //     endDate.getMinutes() <= newestMinute
    //   ) {
    //     window.setTimeout(async function () {
    //       setIsLoading(false);
    //       Alert.alert(
    //         "Thông báo",
    //         "Vui lòng đặt thời gian kết thúc sau thời gian hiện tại!"
    //       );
    //     }, 3000);
    //   }
    // } else if (
    //   // flag === true &&
    //   endDate.getDate() === startDate.getDate() &&
    //   endDate.getMonth() === startDate.getMonth() &&
    //   endDate.getFullYear() === startDate.getFullYear() &&
    //   endDate.getHours() <= startDate.getHours() &&
    //   endDate.getMinutes() <= startDate.getMinutes()
    // ) {
    //   window.setTimeout(async function () {
    //     setIsLoading(false);
    //     Alert.alert(
    //       "Thông báo",
    //       "Vui lòng đặt thời gian kết thúc sau thời gian bắt đầu!"
    //     );
    //   }, 3000);
    // } else if (
    //   // flag === true &&
    //   (endDate.getDate() < startDate.getDate() &&
    //     endDate.getMonth() === startDate.getMonth() &&
    //     endDate.getFullYear() === startDate.getFullYear()) ||
    //   (endDate.getMonth() < startDate.getMonth() &&
    //     endDate.getFullYear() === startDate.getFullYear()) ||
    //   endDate.getFullYear() < startDate.getFullYear()
    // ) {
    //   window.setTimeout(async function () {
    //     setIsLoading(false);
    //     Alert.alert(
    //       "Thông báo",
    //       "Vui lòng đặt thời gian kết thúc sau thời gian bắt đầu!"
    //     );
    //   }, 3000);
    // } else {
    //   if (
    //     // flag === false ||
    //     displayEndDate === "... / ... / ...." &&
    //     displayEndTime === "... giờ ... phút"
    //   ) {
    //     window.setTimeout(async function () {
    //       setIsLoading(false);
    //       apiUpdateTask("");
    //       setDeadline("");
    //       Alert.alert("Thông báo", "Cập nhật công việc thành công!");
    //     }, 3000);
    //   } else {
    //     window.setTimeout(async function () {
    //       setIsLoading(false);
    //       Alert.alert("Thông báo", "Cập nhật công việc thành công!");

    //       //detail duration
    //       const durationSeconds = Math.abs(
    //         (endDate.getTime() - startDate.getTime()) / 1000
    //       );
    //       let integerPartH, remainderPartM;
    //       let integerPartDay, remainderPartH;
    //       let integerPartW, remainderPartDay;

    //       if (durationSeconds >= 60 && durationSeconds < 3600) {
    //         //phút
    //         apiUpdateTask(
    //           Math.round(durationSeconds / 60).toString() + " phút"
    //         );
    //       } else if (durationSeconds >= 3600 && durationSeconds < 86400) {
    //         //giờ: 60x60
    //         const durationHours = durationSeconds / 3600;
    //         integerPartH = Math.round(durationHours);
    //         remainderPartM = Math.round(
    //           Math.abs((durationHours - integerPartH) * 60)
    //         );
    //         if (remainderPartM === 0)
    //           apiUpdateTask(integerPartH.toString() + " giờ");
    //         else
    //           apiUpdateTask(
    //             integerPartH.toString() +
    //               " giờ, " +
    //               remainderPartM.toString() +
    //               " phút"
    //           );
    //       } else if (durationSeconds >= 86400 && durationSeconds < 86400 * 7) {
    //         //ngày: 3600x24
    //         const durationDays = durationSeconds / 86400;
    //         integerPartDay = Math.round(durationDays);
    //         remainderPartH = Math.abs((durationDays - integerPartDay) * 24);

    //         integerPartH = Math.round(remainderPartH);
    //         remainderPartM = Math.round(
    //           Math.abs((remainderPartH - integerPartH) * 60)
    //         );
    //         if (remainderPartH === 0 && remainderPartM === 0)
    //           apiUpdateTask(integerPartDay.toString() + " ngày");
    //         apiUpdateTask(
    //           integerPartDay.toString() +
    //             " ngày, " +
    //             integerPartH.toString() +
    //             " giờ, " +
    //             remainderPartM.toString() +
    //             " phút"
    //         );
    //         // }
    //       } else if (durationSeconds >= 86400 * 7) {
    //         //tuần: 86400x7
    //         const durationWeeks = durationSeconds / (86400 * 7);
    //         integerPartW = Math.round(durationWeeks);
    //         remainderPartDay = Math.abs((durationWeeks - integerPartW) * 7);

    //         if (remainderPartDay === 0)
    //           apiUpdateTask(integerPartW.toString() + " tuần");
    //         else {
    //           remainderPartDay = Math.abs((durationWeeks - integerPartW) * 7);
    //           integerPartDay = Math.round(remainderPartDay);
    //           remainderPartH = Math.abs(
    //             (remainderPartDay - integerPartDay) * 24
    //           );

    //           integerPartH = Math.round(remainderPartH);
    //           remainderPartM = Math.round(
    //             Math.abs((remainderPartH - integerPartH) * 60)
    //           );

    //           apiUpdateTask(
    //             integerPartW.toString() +
    //               " tuần, " +
    //               integerPartDay.toString() +
    //               " ngày, " +
    //               integerPartH.toString() +
    //               " giờ, " +
    //               remainderPartM.toString() +
    //               " phút"
    //           );

    //           // setIsLoading(false);
    //           // setTxtInputTask("");
    //           // setTxtInputDesc("");
    //           // setDisplayStartDate(formatCurrentDateVN);
    //           // setDisplayStartTime("... giờ ... phút");
    //           // setDisplayEndDate("... / ... / ....");
    //           // setDisplayEndTime("... giờ ... phút");
    //         }
    //       }
    //     }, 3000);
    //   }
    // }
  }

  //handle update-task
  async function apiUpdateTask(duration) {
    const updateTask = {
      taskName: txtInputTask,
      description: txtInputDesc,
      taskType:
        taskType === infoTaskBeforeUpdate.props.taskType
          ? infoTaskBeforeUpdate.props.taskType
          : taskType,
      priority:
        priority === infoTaskBeforeUpdate.props.priority
          ? infoTaskBeforeUpdate.props.priority
          : priority,
      reminderTime:
        reminderTime === infoTaskBeforeUpdate.props.reminderTime
          ? infoTaskBeforeUpdate.props.reminderTime
          : reminderTime,
      repeat:
        repeat === infoTaskBeforeUpdate.props.repeat
          ? infoTaskBeforeUpdate.props.repeat
          : repeat,
      startTime: displayStartDate + ", " + displayStartTime,
      endTime: displayEndDate + ", " + displayEndTime,
      // duration: duration,
      // deadline: deadline,
    };
    await axios.put(
      `${url}/api/task/updateNotFinishTask/${infoTaskBeforeUpdate.props.id}/${infoTaskBeforeUpdate.props.taskDetail_id}/${infoTaskBeforeUpdate.props.schedule_id}`,
      updateTask,
      { timeout: 4000 }
    );
    // .then((task) => {
    // window.setTimeout(function () {
    // console.log(task.data);

    // }, 2000);
    // });
  }
  /////

  return (
    <ScrollView
      style={styles.container}
      // contentContainerStyle={{ height: flag ? "140%" : "125%" }}
      contentContainerStyle={{
        height: "100%",
        width: "100%",
        padding: "3%",
        justifyContent: "space-around",
      }}
    >
      {/* <View
      // style={{ width: "100%", height: flag ? "95%" : "92%", padding: "3%" }}
      // style={{ width: "100%", padding: "3%" }}
      > */}
      {/* tên cv */}
      <View style={{flexDirection: "row", width: '100%', alignItems: "center"}}>
        <TextInput
          style={[styles.styleInput, { borderRadius: 10, borderColor: "gray" }]}
          placeholder="Nhập tên công việc"
          numberOfLines={1}
          // autoFocus
          onChangeText={(txt) => setTxtInputTask(txt)}
          value={txtInputTask}
        />
        <View style={{marginLeft: '-11%', padding: '2%'}}>
          <TouchableOpacity onPress={() => setTxtInputTask('')}>
            <Feathericons name="delete" size={30} color="#09CBD0" />
          </TouchableOpacity>
        </View>
      </View>

      {/* mô tả */}
      <View style={{flexDirection: "row", width: '100%', height: '15%'}}>
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
        />
        <View style={{marginLeft: '-11%', padding: '2%', marginTop: '3%'}}>
          <TouchableOpacity onPress={() => setTxtInputDesc('')}>
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
              setItemToDelete(itemValue);
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
            <FontAwesomeicons name="plus-square" size={45} color="#09CBD0" />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => setModalVisibleDelTaskType(true)}>
            <Feathericons name="delete" size={45} color="#09CBD0" />
          </TouchableOpacity> */}
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
          <Picker.Item style={{ fontSize: 18 }} label="Không" value="Không" />
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
          onValueChange={(itemValue, itemIndex) => setReminderTime(itemValue)}
        >
          <Picker.Item style={{ fontSize: 18 }} label="Không" value="Không" />
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
            <TouchableOpacity style={styles.btn} onPress={handleAddNewTaskType}>
              <Text style={{ fontSize: 17, color: "#fff", fontWeight: "bold" }}>
                Thêm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ fontSize: 17, color: "#fff", fontWeight: "bold" }}>
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

      {showStartDateTime && (
        <DateTimePicker
          testID="dateTimePicker"
          show={showStartDateTime}
          mode={modeStartDateTime}
          value={startDate}
          minimumDate={new Date()}
          is24Hour={true}
          display="default"
          onChange={onChangeStartDateTime}
        />
      )}
      {showEndDateTime && (
        <DateTimePicker
          testID="dateTimePicker"
          show={showEndDateTime}
          mode={modeEndDateTime}
          value={endDate}
          minimumDate={new Date()}
          is24Hour={true}
          display="default"
          onChange={onChangeEndDateTime}
        />
      )}

      {isLoading ? (
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ alignSelf: "center" }}>Hệ thống đang cập nhật</Text>
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
          {/* <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setTxtInputTask("");
              setTxtInputDesc("");
              setTaskType("Cá nhân");
              setPriority("1");
              setReminderTime("Không");
              setRepeat("Không");
              // setDisplayStartDate(formatCurrentDateVN);
              // setDisplayStartTime("... giờ ... phút");
              // setDisplayEndDate("... / ... / ....");
              // setDisplayEndTime("... giờ ... phút");
            }}
          >
            <Text style={{ fontSize: 20, color: "#fff" }}>Đặt mặc định</Text>
          </TouchableOpacity> */}
        </View>
      )}
      {/* </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "90%",
    backgroundColor: "#fff",
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
  displayDateTime: {
    width: "45%",
    height: "60%",
    backgroundColor: "#BCF4F5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  btnDayTime: {
    alignSelf: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderColor: "#09CBD0",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 100,
    width: "50%",
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
