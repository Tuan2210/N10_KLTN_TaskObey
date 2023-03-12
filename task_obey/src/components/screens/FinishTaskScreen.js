import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../../redux/createInstance";

import { SafeAreaView } from "react-native-safe-area-context";

export default function FinishTaskScreen() {
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
    await axios.get(`${url}/api/task/finishTasks/${userId}`).then((res) => {
      if (res.data.length > 0) {
        {
          res.data.map((taskData, index) => {
            console.log(taskData);
            setDataTaskName(taskData.taskName);
            setDataDayTime(taskData.dayTime);
          });
        }
      }
    });
  }

  return (
    <SafeAreaView>
      <View>
        <Text>{dataTaskName}</Text>
        <Text>{dataDayTime}</Text>
      </View>
    </SafeAreaView>
  );
}
