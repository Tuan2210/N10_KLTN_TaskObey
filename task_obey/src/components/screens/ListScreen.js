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
  
  const [userId, setUserId] = useState();
  useEffect(() => {
    if(currentRegisterUser && !currentLoginUser)
      setUserId(registerUserId);
    if(!currentRegisterUser && currentLoginUser)
      setUserId(loginUserId)
  }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dataList, setDataList] = useState([]);
  const [dataTaskName, setDataTaskName] = useState();
  const [dataDayTime, setDataDayTime] = useState();
  useEffect(() => {
    loadListNotFinishTasks(userId);
  }, [userId]);

  async function loadListNotFinishTasks(userId) {
    await axios
      .get(`${url}/api/task/notFinishTasks/${userId}`)
      .then((res) => {
        if(res.data.length > 0) {
          // {res.data.map((taskData, index) => {
          //   console.log(taskData);
          //   setDataTaskName(taskData.taskName);
          //   setDataDayTime(taskData.dayTime);
          // })}
          setDataList(res.data);
        };
      })
  }

  let sliceDay, sliceTime;
  const [time, setTime] = useState();
  const [selectedIdItemData, setSelectedIdItemData] = useState(null);
  const ItemData = ({ item, onPress, activeItemBg, activeItemFont }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        activeItemBg,
        {
          width: "100%",
          height: 200,
          alignSelf: "center",
          justifyContent: "space-around",
          // marginLeft: "3%",
          marginTop: "4%",
          borderRadius: 20,
          borderColor: "#09CBD0",
          borderWidth: 1.2,
          borderStyle: "solid",
        },
      ]}
    >
      <View style={{ padding: '5%' }}>
        <Text 
          style={[
            activeItemFont, 
            { 
              fontSize: 20, 
              // backgroundColor:"red", 
              width: '100%',
              height: '85%'
            }]}
        >
          {item.taskName}
        </Text>
        <Text
          style={{
            color: "#D4A055",
            fontSize: 16,
            fontWeight: "bold",
            alignSelf: "flex-end"
          }}
        >
          {
            [
              sliceDay = (new Date(item.dayTime)).toLocaleDateString(),', ',
              sliceTime = (new Date(item.dayTime)).toLocaleTimeString()
            ]
          }
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  MomentConfig.updateLocale("vi", {
    weekdaysShort: "Chủ nhật_Thứ 2_Thứ 3_Thứ 4_Thứ 5_Thứ 6_Thứ 7".split("_"),
  });

  //create task
  const [events, setEvents] = useState([]);
  const _onDragCreateEnd = (event: RangeTime) => {
    const randomId = Math.random().toString(36).slice(2, 10);
    const newEvent = {
      id: randomId,
      title: randomId,
      start: event.start,
      end: event.end,
      color: "#A3C7D6",
      description: "abc",
      imageUrl: '',
      dayTime: '',
      status: '',
      taskType: '',
      priority: '',
      reminderTime: ''
    };
    setEvents((prev) => [...prev, newEvent]);
  };

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
      {/* <Text>{dataTaskName}</Text>
        <Text>{dataDayTime}</Text> */}

      {/* <FlatList
          key={"#"}
          // numColumns={2}
          data={dataList}
          renderItem={({ item }) => {
            // const backgroundColor =
            //   item.id === selectedIdItemData ? "#fff" : "black";
            // const color = item.id === selectedIdItemData ? "black" : "#fff";
            return (
              <ItemData
                item={item}
                onPress={() => setSelectedIdItemData(item.id)}
                activeItemBg={{  }}
                activeItemFont={{  }}
                // viewImgItem={{ width: "auto", height: 100 }}
              />
            );
          }}
          style={{
            width: '100%', 
            height: '100%',
            padding: '5%'
          }}
        /> */}
      
      <View style={{ width: "100%", height: "100%" }}>
        <TimelineCalendar
          viewMode="week"
          locale="vi"
          initialDate={new Date().toISOString().split("T")[0]}
          allowPinchToZoom
          allowDragToCreate
          onDragCreateEnd={_onDragCreateEnd}
          dragCreateInterval={120}
          dragStep={20}
          events={events}
          onLongPressEvent={_onLongPressEvent}
          onPressEvent={(data) => console.log(data)}
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