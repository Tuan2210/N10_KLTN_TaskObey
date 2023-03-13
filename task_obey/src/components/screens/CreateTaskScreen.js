import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
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

  const [txtInputTask, setTxtInputTask] = useState('');
  // const [task, setTask] = useState('');

  async function handleCreateTask(createTask) {
    if(txtInputTask==='') Alert.alert('Thông báo', 'Vui lòng nhập công việc!');
    else {
      const newTask = {
        taskName: txtInputTask,
        userId: userId
      }
      await axios
        .post(`${url}/api/task/addTask`, newTask)
        .then((task) => {
          console.log(task.data);
          setTxtInputTask('');
          Alert.alert('Thông báo', 'Thêm công việc thành công!');
        });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{width: '100%', padding: '5%'}}>
        <TextInput
          placeholder="Nhập tên công việc cần làm"
          numberOfLines={4}
          onChangeText={(txt) => setTxtInputTask(txt.trim())}
          style={{borderColor: 'gray', borderWidth: 1}}
        />
        <TouchableOpacity style={styles.btn} onPress={handleCreateTask}>
          <Text style={{fontSize: 20, color: '#fff'}}>Tạo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btn: {
    alignSelf: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#09CBD0",
    borderRadius: 100,
    width: "40%",
    marginTop: '5%'
  },
});
