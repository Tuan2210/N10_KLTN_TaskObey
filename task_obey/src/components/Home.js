import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerView } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

import { SafeAreaView } from "react-native-safe-area-context";

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeicons from "react-native-vector-icons/FontAwesome";
import FontAwesome5icons from "react-native-vector-icons/FontAwesome5";

import moment from "moment";

import ListScreen from "./screens/ListScreen";
import CreateTaskScreen from "./screens/CreateTaskScreen";
// import CalendarScreen from "./screens/CalendarScreen";
import FinishTaskScreen from "./screens/FinishTaskScreen";

import DrawerContent from "./screens/drawer/DrawerContent";
import ProfileScreen from "./screens/ProfileScreen";
import StatisticScreen from "./screens/StatisticScreen";

const Stack = createNativeStackNavigator();
const DrawerStack = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function Home() {
  //current date,time
  // const [currentDate, setCurrentDate] = useState(Date);
  // useEffect(() => {
  //   // const curDate = new Date().toLocaleString();
  //   setInterval(() => {
  //     const curDate = new Date().toLocaleString();
  //     setCurrentDate(curDate)
  //     // console.log(curDate);
  //   }, 1000)
  // })

  // const currentDate = new Date().toISOString().split("T")[0];
  // const currentDay = currentDate.slice(8, 10),
  //   currentMonth = currentDate.slice(5, 7),
  //   currentYear = currentDate.slice(0, 4),
  // formatCurrentDate = currentDay + "/" + currentMonth + "/" + currentYear;
  const currentDate = moment().utcOffset(7).format("DD/MM/YYYY");
  const [formatCurrentDate, setFormatCurrentDate] = useState("");
  useEffect(() => {
    setFormatCurrentDate(currentDate);
  }, [currentDate]);

  //Drawer
  function AppDrawerStack() {
    return (
      <DrawerStack.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        initialRouteName="Trang chủ"
      >
        <DrawerStack.Screen
          name="Trang chủ"
          component={HomeBottomTabs}
          options={{
            headerTitle: "Hôm nay, " + formatCurrentDate,
            headerTitleStyle: {
              color: "#fff",
            },
            headerStyle: {
              backgroundColor: "#09CBD0",
            },
            headerTintColor: "#fff",
          }}
        />
        <DrawerStack.Screen
          name="Thống kê"
          component={StatisticScreen}
          options={{
            headerTitle: "Hôm nay, " + formatCurrentDate,
            headerTitleStyle: {
              color: "#fff",
            },
            headerStyle: {
              backgroundColor: "#09CBD0",
            },
            headerTintColor: "#fff",
          }}
        />
        <DrawerStack.Screen
          name="Thông tin cá nhân"
          component={ProfileScreen}
          options={{
            headerTitle: "Hôm nay, " + formatCurrentDate,
            headerTitleStyle: {
              color: "#fff",
            },
            headerStyle: {
              backgroundColor: "#09CBD0",
            },
            headerTintColor: "#fff",
          }}
        />
      </DrawerStack.Navigator>
    );
  }

  //Home Drawer
  function HomeBottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconIon, iconFA, iconFA5;
            if (route.name === "HomeScreen") {
              iconFA5 = "tasks";
            } else if (route.name === "CreateTaskScreen") {
              iconIon = focused ? "md-create" : "md-create-outline";
            }
            // else if (route.name === "CalendarScreen") {
            //   iconIon = focused ? "md-calendar" : "md-calendar-outline";
            // }
            else if (route.name === "FinishTaskScreen") {
              iconIon = focused
                ? "checkmark-done-circle"
                : "checkmark-done-circle-outline";
            }
            size = focused ? 28 : 24;
            return (
              <View style={{ flexDirection: "row" }}>
                <FontAwesome5icons name={iconFA5} size={size} color={color} />
                <Ionicons name={iconIon} size={size} color={color} />
                <FontAwesomeicons name={iconFA} size={size} color={color} />
              </View>
            );
          },
          tabBarActiveTintColor: "#09CBD0",
          tabBarInactiveTintColor: "black",
          tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
          tabBarStyle: {
            flex: 0.09,
            backgroundColor: "#fff",
            paddingTop: 5,
            paddingBottom: 10,
            borderTopColor: "#09CBD0",
            borderTopWidth: 1,
            borderStyle: "solid",
          },
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen
          name="HomeScreen"
          options={{ title: "Danh sách", headerShown: false }}
          component={ListScreen}
        />
        <Tab.Screen
          name="CreateTaskScreen"
          options={{ title: "Thêm công việc", headerShown: false }}
          component={CreateTaskScreen}
        />
        {/* <Tab.Screen
          name="CalendarScreen"
          options={{ title: "Lịch", headerShown: false }}
          component={CalendarScreen}
        /> */}
        <Tab.Screen
          name="FinishTaskScreen"
          options={{ title: "Hoàn thành", headerShown: false }}
          component={FinishTaskScreen}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Animatable.View animation="lightSpeedIn" style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AppDrawerStack" component={AppDrawerStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Animatable.View>
  );
}
