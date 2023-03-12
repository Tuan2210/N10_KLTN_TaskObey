import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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

export default function ListScreen() {
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const userId = currentUser?._id;

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
          {res.data.map((taskData, index) => {
            console.log(taskData);
            setDataTaskName(taskData.taskName);
            setDataDayTime(taskData.dayTime);
          })}
        };
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>{dataTaskName}</Text>
        <Text>{dataDayTime}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})