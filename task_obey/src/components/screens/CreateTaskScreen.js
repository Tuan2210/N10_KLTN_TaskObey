import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
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

//doc: https://github.com/react-native-picker/picker
import { Picker } from "@react-native-picker/picker";

//doc: https://github.com/react-native-datetimepicker/datetimepicker#display-optional
//yt: https://www.youtube.com/watch?v=Imkw-xFFLeE
import DateTimePicker from "@react-native-community/datetimepicker";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function CreateTaskScreen() {
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

  const [isLoading, setIsLoading] = useState(false);

  //////handle start-date-time picker
  const currentDateVN = new Date().toISOString().split("T")[0];
  const currentDayVN = currentDateVN.slice(8,10),
        currentMonthVN = currentDateVN.slice(5,7),
        currentYearVN = currentDateVN.slice(0,4),
        formatCurrentDateVN = currentDayVN +'/' +currentMonthVN +'/'  +currentYearVN;
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [inputStartTime, setInputStartTime] = useState('');
  const [modeStartDateTime, setModeStartDateTime] = useState('');
  const [showStartDateTime, setShowStartDateTime] = useState(false);
  const [displayStartDate, setDisplayStartDate] = useState(formatCurrentDateVN);
  const [displayStartTime, setDisplayStartTime] = useState("... giờ ... phút");

  const onChangeStartDateTime = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    // setShowStartDateTime(Platform.OS === 'android');
    setStartDate(currentDate);

    let template = new Date(currentDate);
    const realCurrentDate1 = new Date();
    // setStartTime(currentDate);
      
    if((template.getDate()===realCurrentDate1.getDate() && template.getMonth()===realCurrentDate1.getMonth() && template.getFullYear()===realCurrentDate1.getFullYear()) 
        && ((realCurrentDate1.getHours()>template.getHours()) || (realCurrentDate1.getHours()===template.getHours() && realCurrentDate1.getMinutes()>=template.getMinutes()))
      ){
        setShowStartDateTime(false);
        setModeStartDateTime("");
        Alert.alert('Thông báo', 'Vui lòng đặt thời gian bắt đầu sau thời gian hiện tại!');
      }
      else {
      let fDate1 = template.getDate() + '/' + (template.getMonth()+1) + '/' + template.getFullYear();
      let fTime1 = template.getHours() + ' giờ ' + template.getMinutes() + ' phút';
      setDisplayStartDate(fDate1);
      setDisplayStartTime(fTime1);
      setShowStartDateTime(false);
      setModeStartDateTime("");
      console.log(startDate);
      console.log('pick startDateTime:', fDate1 +",\u00A0" +fTime1);
    }
  }
  //////

  //////switch toggle
  const [flag, setFlag] = useState(false); //default Không

  //////handle end-date-time picker
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState();
  const [endDateTime, setEndDateTime] = useState("");
  const [modeEndDateTime, setModeEndDateTime] = useState("");
  const [showEndDateTime, setShowEndDateTime] = useState(false);
  const [displayEndDate, setDisplayEndDate] = useState("... / ... / ....");
  const [displayEndTime, setDisplayEndTime] = useState("... giờ ... phút");

  const onChangeEndDateTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    // setShowStartDateTime(Platform.OS === 'android');
    setEndDate(currentDate);

    let template = new Date(currentDate);
    const realCurrentDate2 = new Date();

    if((template.getDate()===startDate.getDate() && template.getMonth()===startDate.getMonth() && template.getFullYear()===startDate.getFullYear())
        && (template.getHours()<=startDate.getHours() && template.getMinutes()<=startDate.getMinutes() || (template.getTime()<=startDate.getTime()))
      ) {
      setDisplayEndDate(displayStartDate);
      setDisplayEndTime('... giờ ... phút');
      setShowEndDateTime(false);
      setModeEndDateTime("");
      Alert.alert('Thông báo', 'Vui lòng đặt thời gian kết thúc sau thời gian bắt đầu');
    }

    else {
      let fDate2 = template.getDate() + '/' + (template.getMonth()+1) + '/' + template.getFullYear();
      let fTime2 = template.getHours() + ' giờ ' + template.getMinutes() + ' phút';
      setDisplayEndDate(fDate2)
      setDisplayEndTime(fTime2);
      setEndDateTime(fDate2 +",\u00A0" +fTime2)
      setShowEndDateTime(false);
      setModeEndDateTime("");
      console.log(endDate);
      console.log('pick endDateTime:', fDate2 +",\u00A0" +fTime2);
    }

  }
  //////

  const [txtInputTask, setTxtInputTask] = useState('');
  const [txtInputDesc, setTxtInputDesc] = useState('');

  //////handle combobox picker & value mongodb
  const [taskType, setTaskType] = useState('Cá nhân');
  const [priority, setPriority] = useState('1');
  const [reminderTime, setReminderTime] = useState('Không');
  const [repeat, setRepeat] = useState('Không');
  // const [duration, setDuration] = useState('');
  const [deadline, setDeadline] = useState('');
  //////
  
  function handleCreateTask() {
    const newestCurrentDateTime = new Date(), newestHour = newestCurrentDateTime.getHours(), newestMinute = newestCurrentDateTime.getMinutes(),
          newestDate = newestCurrentDateTime.getDate(), newestMonth = newestCurrentDateTime.getMonth(), newestYear = newestCurrentDateTime.getFullYear();
    if(txtInputTask==='') Alert.alert('Thông báo', 'Vui lòng nhập công việc!');
    else if(txtInputDesc==='') Alert.alert('Thông báo', 'Vui lòng nhập mô tả!');
    else if(displayStartTime==='... giờ ... phút')
      Alert.alert('Thông báo', 'Vui lòng chọn khoảng thời gian bắt đầu!');
    
    // else if(endDate===undefined || endTime===undefined) 
    //   Alert.alert('Thông báo', 'Vui lòng chọn khoảng thời gian bắt đầu!');
    else if((startDate.getDate()===newestDate && startDate.getMonth()===newestMonth && startDate.getFullYear()===newestYear) 
            && (startDate.getHours()===newestHour && startDate.getMinutes()===newestMinute)
            ) {
      Alert.alert('Thông báo', 'Vui lòng đặt thời gian bắt đầu sau thời gian hiện tại!');
    }
    else if(flag===true && (endDate.getDate()===newestDate && endDate.getMonth()===newestMonth && endDate.getFullYear()===newestYear) 
            && (endDate.getHours()<=newestHour && endDate.getMinutes()<=newestMinute)
            ) {
      Alert.alert('Thông báo', 'Vui lòng đặt thời gian kết thúc sau thời gian hiện tại!');
    }
    else if(flag===true && (endDate.getDate()===startDate.getDate() && endDate.getMonth()===startDate.getMonth() && endDate.getFullYear()===startDate.getFullYear()) 
            && (endDate.getHours()<=startDate.getHours() && endDate.getMinutes()<=startDate.getMinutes())
            ) {
      Alert.alert('Thông báo', 'Vui lòng đặt thời gian kết thúc sau thời gian bắt đầu!');
    }
    else {
      setIsLoading(true);
      
      if(flag===false || (displayEndDate==='... / ... / ....' && displayEndTime==='... giờ ... phút')) {
        // setDuration('');
        apiCreateTask('');
        setDeadline('');
      } else { //detail duration
        const durationSeconds = (endDate.getTime() - startDate.getTime())/1000;
        let integerPartH, remainderPartM;
        let integerPartDay, remainderPartH;
        let integerPartW, remainderPartDay;
        if(durationSeconds>=60 && durationSeconds<3600) { //phút
          apiCreateTask(Math.round(durationSeconds/60).toString() +' phút');
        }
        else if(durationSeconds>=3600 && durationSeconds<86400) { //giờ: 60x60
          const durationHours = durationSeconds/3600;
          integerPartH = Math.round(durationHours);
          remainderPartM = Math.round((durationHours - integerPartH)*60);
          if(remainderPartM===0)
            apiCreateTask(integerPartH.toString() +' giờ');
          // else if(remainderPartM<0)
          //   apiCreateTask(integerPartH.toString() +' giờ, ' +(remainderPartM*(-1)).toString() +' phút');
          else
            apiCreateTask(integerPartH.toString() +' giờ, ' +remainderPartM.toString() +' phút');
        }
        else if(durationSeconds>=86400 && durationSeconds<86400*7) { //ngày: 3600x24
          const durationDays = durationSeconds/86400;
          integerPartDay = Math.round(durationDays);
          remainderPartH = (durationDays - integerPartDay)*24;

          if(remainderPartH<0) {
            remainderPartH = ((durationDays - integerPartDay)*24)*(-1);
            integerPartH = Math.round(remainderPartH);
            remainderPartM = Math.round((remainderPartH - integerPartH)*60);
            if(remainderPartH===0 && remainderPartM===0)
              apiCreateTask(integerPartDay.toString() +' ngày');
            // if(integerPartH<0)
            //   apiCreateTask(integerPartDay.toString() +' ngày, ' +(integerPartH*(-1)).toString() +' giờ, ' +remainderPartM.toString() +' phút');
            // if(remainderPartM<0)
            //   apiCreateTask(integerPartDay.toString() +' ngày, ' +integerPartH.toString() +' giờ, ' +(remainderPartM*(-1)).toString() +' phút');
            // if(integerPartH>0 || remainderPartM>0)
            apiCreateTask(integerPartDay.toString() +' ngày, ' +integerPartH.toString() +' giờ, ' +remainderPartM.toString() +' phút');
          } else {
            integerPartH = Math.round(remainderPartH);
            remainderPartM = Math.round((remainderPartH - integerPartH)*60);
            if(remainderPartH===0 && remainderPartM===0)
              apiCreateTask(integerPartDay.toString() +' ngày');
            // if(integerPartH<0)
            //   apiCreateTask(integerPartDay.toString() +' ngày, ' +(integerPartH*(-1)).toString() +' giờ, ' +remainderPartM.toString() +' phút');
            // if(remainderPartM<0)
            //   apiCreateTask(integerPartDay.toString() +' ngày, ' +integerPartH.toString() +' giờ, ' +(remainderPartM*(-1)).toString() +' phút');
            // if(integerPartH>0 || remainderPartM>0)
            apiCreateTask(integerPartDay.toString() +' ngày, ' +integerPartH.toString() +' giờ, ' +remainderPartM.toString() +' phút');
          }
        }
        else if(durationSeconds>=86400*7) { //ngày: 3600x24
          const durationWeeks = durationSeconds/(86400*7);
          integerPartW = Math.round(durationWeeks);
          remainderPartDay = (durationWeeks - integerPartW)*7;

          if(remainderPartDay===0) apiCreateTask(integerPartW.toString() +' tuần');
          if(remainderPartDay>0) {
            remainderPartDay = (durationWeeks - integerPartW)*7;
            integerPartDay = Math.round(remainderPartDay);
            remainderPartH = (remainderPartDay - integerPartDay)*24;

            integerPartH = Math.round(remainderPartH);
            remainderPartM = Math.round((remainderPartH - integerPartH)*60);
            apiCreateTask(integerPartW.toString() +' tuần, ' +integerPartDay.toString() +' ngày, ' +integerPartH.toString() +' giờ, ' +remainderPartM.toString() +' phút');
          }

          // if(remainderPartDay<0) {
          //   remainderPartDay = ((durationWeeks - integerPartW)*7)*(-1);
          //   integerPartDay = Math.round(remainderPartDay);
          //   remainderPartH = (remainderPartDay - integerPartDay)*24;

          //   if(remainderPartH<0) {
          //     remainderPartH = ((remainderPartDay - integerPartDay)*24)*(-1);
          //     integerPartH = Math.round(remainderPartH);
          //     remainderPartM = Math.round((remainderPartH - integerPartH)*60);
          //     if(remainderPartH===0 && remainderPartM===0)
          //       apiCreateTask(integerPartW.toString() +' tuần, ' +integerPartDay.toString() +' ngày');
          //     else apiCreateTask(integerPartW.toString() +' tuần, ' +integerPartDay.toString() +' ngày, ' +integerPartH.toString() +' giờ, ' +remainderPartM.toString() +' phút');
          //   } else {
          //     if(remainderPartH===0)
          //       apiCreateTask(integerPartW.toString() +' tuần, ' +integerPartDay.toString() +' ngày');
          //     else apiCreateTask(integerPartW.toString() +' tuần, ' +integerPartDay.toString() +' ngày, ' +integerPartH.toString() +' giờ');
          //   }
          // }
          

          // else {
              // remainderPartDay = (durationWeeks - integerPartW)*7;
              
              // remainderPartH = (remainderPartDay - integerPartDay)*24;

              // if(remainderPartH<0) {
              //   remainderPartH = ((remainderPartDay - integerPartDay)*24)*(-1);
              //   integerPartH = Math.round(remainderPartH);
              //   remainderPartM = Math.round((remainderPartH - integerPartH)*60);
              //   if(remainderPartH===0 && remainderPartM===0)
              //     apiCreateTask(integerPartW.toString() +' tuần, ' +integerPartDay.toString() +' ngày');
              //   else apiCreateTask(integerPartW.toString() +' tuần, ' +integerPartDay.toString() +' ngày, ' +integerPartH.toString() +' giờ, ' +remainderPartM.toString() +' phút');
              // } else {
              //   if(remainderPartH===0)
              //     apiCreateTask(integerPartW.toString() +' tuần, ' +integerPartDay.toString() +' ngày');
              //   else apiCreateTask(integerPartW.toString() +' tuần, ' +integerPartDay.toString() +' ngày, ' +integerPartH.toString() +' giờ');
              // }
          // }

          // if(durationWeeks%2==0)
          //   apiCreateTask(durationWeeks.toString());
          // else
          //   apiCreateTask((Math.round(durationWeeks)).toString() +' tuần, ' +(Math.round(durationSeconds/86400)).toString() +' ngày, ' +(Math.round(durationSeconds/3600)).toString() +' giờ, ' +(Math.round(durationSeconds/60)).toString() +' phút, ' +Math.round(durationSeconds) +' giây');
        }
      }
    }
  }

  async function apiCreateTask(duration) {
    //handle create newTask
        const newTask = {
          taskName: txtInputTask,
          userId: userId,
          taskType: taskType,
          description: txtInputDesc,
          priority: priority,
          startTime: displayStartDate +', ' +displayStartTime,
          endTime: endDateTime,
          reminderTime: reminderTime,
          duration: duration,
          deadline: deadline,
          repeat: repeat,
        }
        await axios
          .post(`${url}/api/task/addTask`, newTask)
          .then((task) => {
            window.setTimeout(function () {
              console.log(task.data);
              setIsLoading(false);
              setTxtInputTask('');
              setTxtInputDesc('');
              setDisplayStartDate(formatCurrentDateVN);
              setDisplayStartTime("... giờ ... phút");
              setDisplayEndDate("... / ... / ....");
              setDisplayEndTime("... giờ ... phút");
              Alert.alert('Thông báo', 'Thêm công việc thành công!');
            }, 2000);
          });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ width: "100%", height: "100%", padding: "3%", justifyContent: "space-between", paddingBottom: '3%' }}>
        {/* tên cv */}
        <TextInput
          style={[styles.styleInput, {borderRadius: 0, borderColor: 'gray'}]}
          placeholder="Nhập tên công việc"
          numberOfLines={1}
          autoFocus
          onChangeText={(txt) => setTxtInputTask(txt.trim())}
          value={txtInputTask}
        />

        {/* mô tả */}
        <TextInput
          style={[styles.styleInput, {height: '15%', marginTop: '3%', borderRadius: 0, borderColor: 'gray'}]}
          placeholder="Nhập mô tả"
          numberOfLines={3}
          multiline
          onChangeText={(txt) => setTxtInputDesc(txt.trim())}
          value={txtInputDesc}
        />

        {/* loại cv, ưu tiên */}
        <View style={{flexDirection: "row", width: '100%', justifyContent: "space-between"}}>
          <View style={{flexDirection: "row", width: '55%', justifyContent: "space-between", alignItems: "center"}}>
            <Text style={{color: '#09CBD0'}}>Loại công việc:</Text>
            <Picker
              style={{width: '70%', backgroundColor: '#f4f4f4'}}
              selectedValue={taskType}
              onValueChange={(itemValue, itemIndex) => setTaskType(itemValue)}
            >
              <Picker.Item style={{fontWeight: "bold", fontSize: 14}} label="Cá nhân" value="Cá nhân" />
              <Picker.Item style={{fontWeight: "bold", fontSize: 14}} label="Học tập" value="Học tập" />
              <Picker.Item style={{fontWeight: "bold", fontSize: 14}} label="Công việc" value="Công việc" />
            </Picker>
          </View>
          <View style={{flexDirection: "row", width: '32%', justifyContent: "space-between", alignItems: "center"}}>
            <Text style={{color: '#09CBD0'}}>Ưu tiên:</Text>
            <Picker
              style={{width: '72%', backgroundColor: '#f4f4f4'}}
              selectedValue={priority}
              onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}
            >
              <Picker.Item style={{fontWeight: "bold", color: 'red'}} label="1" value="1" />
              <Picker.Item style={{fontWeight: "bold", color: 'orange'}} label="2" value="2" />
              <Picker.Item style={{fontWeight: "bold", color: '#09CBD0'}} label="3" value="3" />
            </Picker>
          </View>
        </View>

        {/* lời nhắc */}
        <View style={[styles.viewTwoColumns, {height: '7%', alignItems: "center"}]}>
          <Text style={{ color: "#09CBD0" }}>Đặt lời nhắc</Text>
          <Picker
            style={{width: '82%', backgroundColor: '#f4f4f4'}}
            selectedValue={reminderTime}
            onValueChange={(itemValue, itemIndex) => setReminderTime(itemValue)}
          >
            <Picker.Item style={{fontSize: 18}} label="Không" value="Không" />
            <Picker.Item style={{fontSize: 18}} label="Đúng giờ" value="Đúng giờ" />
            <Picker.Item style={{fontSize: 18}} label="Trước 5 phút" value="Trước 5 phút" />
            <Picker.Item style={{fontSize: 18}} label="Trước 30 phút" value="Trước 30 phút" />
            <Picker.Item style={{fontSize: 18}} label="Trước 1 tiếng" value="Trước 1 tiếng" />
            <Picker.Item style={{fontSize: 18}} label="Trước 1 ngày" value="Trước 1 ngày" />
          </Picker>
        </View>

        {/* lặp lại */}
        <View style={[styles.viewTwoColumns, {height: '7%', alignItems: "center"}]}>
          <Text style={{ color: "#09CBD0" }}>Đặt lặp lại</Text>
          <Picker
            style={{width: '82%', backgroundColor: '#f4f4f4'}}
            selectedValue={repeat}
            onValueChange={(itemValue, itemIndex) => setRepeat(itemValue)}
          >
            <Picker.Item style={{fontSize: 18}} label="Không" value="Không" />
            <Picker.Item style={{fontSize: 18}} label="Mỗi ngày" value="Mỗi ngày" />
            <Picker.Item style={{fontSize: 18}} label="Mỗi tuần" value="Mỗi tuần" />
            <Picker.Item style={{fontSize: 18}} label="Mỗi tháng" value="Mỗi tháng" />
            <Picker.Item style={{fontSize: 18}} label="Mỗi năm" value="Mỗi năm" />
          </Picker>
        </View>

        {/* ngày, th.gian */}
        <View style={{width: '100%', height: '30%', justifyContent: 'space-around', alignItems: "center"}}>
          {/* startTime */}
          <Text style={{alignSelf: "flex-start", marginBottom: '-3%', color: '#09CBD0'}}>Thời gian bắt đầu:</Text>
          <View style={styles.viewTwoColumns}>
            <View style={{flexDirection: 'row', width: '46%', justifyContent: "space-between", alignItems: "center"}}>
              <View style={styles.displayDateTime}>
                <Text style={{fontSize: 18}}>{displayStartDate}</Text>
              </View>
              <TouchableOpacity
                style={styles.btnDayTime}
                onPress={() => {
                  setShowStartDateTime(true);
                  setModeStartDateTime("date");
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold", color: "#09CBD0" }}>Chọn ngày</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', width: '46%', justifyContent: "space-between", alignItems: "center", marginRight: '3%'}}>
              <View style={styles.displayDateTime}>
                <Text style={{fontSize: 18}}>{displayStartTime}</Text>
              </View>
              <TouchableOpacity
                style={[styles.btnDayTime]}
                onPress={() => {
                  setShowStartDateTime(true);
                  setModeStartDateTime("time");
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold", color: "#09CBD0" }}>Chọn thời gian</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* endTime */}
          <View style={{flexDirection: "row", width: '65%', alignSelf: "flex-start", justifyContent: "space-between"}}>
            <Text style={{alignSelf: "center", color: '#09CBD0'}}>Thời gian kết thúc (nếu có):</Text>
            <View style={{flexDirection: "row", alignItems: "center", width: '50%', justifyContent: "center"}}>
              <Text style={{color: '#09CBD0', fontStyle: "italic"}}>Không</Text>
              <Switch
                  trackColor={{false: '#09CBD0', true: '#09CBD0'}}
                  thumbColor={'#fff9c4'}
                  style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], marginLeft: '7%', marginRight: '7%' }}
                  value={flag}
                  onValueChange={(value) => {
                    if(displayStartTime===('... giờ ... phút')){
                      setShowEndDateTime(false);
                      setModeEndDateTime("");
                      Alert.alert('Thông báo', 'Vui lòng chọn thời gian bắt đầu trước!');
                    } else {
                      setFlag(value);
                      setDisplayEndDate("... / ... / ....");
                      setDisplayEndTime("... giờ ... phút");
                    }
                  }}
                />
              <Text style={{color: '#09CBD0', fontStyle: "italic"}}>Có</Text>
            </View>
          </View>
          <View style={[styles.viewTwoColumns, {display: flag ? 'flex' : 'none'}]}>
            <View style={{flexDirection: 'row', width: '46%', justifyContent: "space-between", alignItems: "center"}}>
              <View style={styles.displayDateTime}>
                <Text style={{fontSize: 18}}>{displayEndDate}</Text>
              </View>
              <TouchableOpacity
                style={styles.btnDayTime}
                onPress={() => {
                  setShowEndDateTime(true);
                  setModeEndDateTime("date");
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold", color: "#09CBD0" }}>Chọn ngày</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', width: '46%', justifyContent: "space-between", alignItems: "center", marginRight: '3%'}}>
              <View style={styles.displayDateTime}>
                <Text style={{fontSize: 18}}>{displayEndTime}</Text>
              </View>
              <TouchableOpacity
                style={[styles.btnDayTime]}
                onPress={() => {
                  setShowEndDateTime(true);
                  setModeEndDateTime("time");
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold", color: "#09CBD0" }}>Chọn thời gian</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
          <View style={{flexDirection: "row", alignSelf: "center", justifyContent: "center"}}>
            <Text style={{alignSelf: "center"}}>Đang khởi tạo</Text>
            <Image 
              source={require('../../../assets/loading-dots.gif')}
              style={{resizeMode: "contain", width: 50, height: 50, marginLeft: '3%'}}
            />
          </View>
        ) : (
          <View style={{flexDirection: 'row', width: '100%', justifyContent: "space-around"}}>
            <TouchableOpacity
              style={styles.btn}
              onPress={handleCreateTask}
            >
              <Text style={{ fontSize: 20, color: "#fff" }}>Tạo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                setTxtInputTask(''); setTxtInputDesc('');
                setTaskType('Cá nhân'); setPriority('1');
                setReminderTime('Không'); setRepeat('Không');
                setDisplayStartDate(formatCurrentDateVN); setDisplayStartTime('... giờ ... phút');
                setDisplayEndDate('... / ... / ....'); setDisplayEndTime('... giờ ... phút');
              }}
            >
              <Text style={{ fontSize: 20, color: "#fff" }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: '100%', 
    height: '20%', 
    flexDirection: 'row', 
    justifyContent: "space-between"
  },
  displayDateTime: {
    width: "50%",
    height: "100%",
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
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
    width: "55%",
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
