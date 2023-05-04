import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
} from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../redux/createInstance";

import { SafeAreaView } from "react-native-safe-area-context";

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeicons from "react-native-vector-icons/FontAwesome";
import FontAwesome5icons from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";

import moment from "moment";
// import 'moment/locale/vi';
// moment.locale('vi');

// import dayjs from 'dayjs';
import "dayjs/locale/vi";

//link doc timelinecalendar: https://howljs.github.io/react-native-calendar-kit/docs/intro
// import { EventItem, MomentConfig, PackedEvent, RangeTime, TimelineCalendar } from '@howljs/calendar-kit';

//doc: https://github.com/react-native-picker/picker
import { Picker } from "@react-native-picker/picker";

import * as Notifications from "expo-notifications";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function Notification() {
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentDate = new Date().toISOString().split("T")[0];
  const currentDay = currentDate.slice(8, 10),
    currentMonth = currentDate.slice(5, 7),
    currentYear = currentDate.slice(0, 4),
    formatCurrentDate = currentDay + "/" + currentMonth + "/" + currentYear;

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
  const startDateTimeNotify = [];
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

  /////handle notification
  {
    showEventItem.map((e) => {
      startDateTimeNotify.push(e.start);
      // console.log(startDateTimeNotify);
    });
  }
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // const dateParts = startTime.split(", ")
  // const date = dateParts[0].split("/").reverse().join("-")
  // const time = dateParts[1].split(" ")[0].split("giờ").join(":").split("phút").join("")
  // const dateTimeStart = `${date}T${time}:00`
  // console.log("start bat đầu là" + startDateTimeNotify);

  const trigger = startDateTimeNotify;
  Notifications.scheduleNotificationAsync({
    content: {
      title: taskName,
      body: description,
      data: { data: "goes here" },
    },
    trigger,
  });
  /////

  //register
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
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }
}
