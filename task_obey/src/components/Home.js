import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerView } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

import { SafeAreaView } from "react-native-safe-area-context";

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeicons from "react-native-vector-icons/FontAwesome";

import ListScreen from "./screens/ListScreen";
import CreateTaskScreen from "./screens/CreateTaskScreen";
import CalendarScreen from "./screens/CalendarScreen";
import FinishTaskScreen from "./screens/FinishTaskScreen";

import DrawerContent from "./screens/drawer/DrawerContent";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const DrawerStack = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function Home() {
  //Drawer
  function AppDrawerStack() {
    return (
      <DrawerStack.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <DrawerStack.Screen name="Trang chủ" component={HomeBottomTabs} />
      </DrawerStack.Navigator>
    );
  }

  // Bottom Stack Part
  function HomeBottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconIon, iconFA;
            if (route.name === "HomeScreen") {
              iconIon = focused ? "md-home" : "md-home-outline";
            } else if (route.name === "CreateTaskScreen") {
              iconIon = focused ? "md-create" : "md-create-outline";
            } else if (route.name === "CalendarScreen") {
              iconIon = focused ? "md-calendar" : "md-calendar-outline";
            } else if (route.name === "FinishTaskScreen") {
              iconIon = focused ? "checkmark-done-circle" : "checkmark-done-circle-outline";
            }
            size = focused ? 28 : 24;
            return (
              <View style={{ flexDirection: "row" }}>
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
            paddingBottom: 10,
            borderTopColor: "#09CBD0",
            borderTopWidth: 1,
            borderStyle: "solid",
          },
          tabBarItemStyle: {},
        })}
      >
        <Tab.Screen
          name="HomeScreen"
          options={{ title: "Trang chủ", headerShown: false }}
          component={ListScreen}
        />
        <Tab.Screen
          name="CreateTaskScreen"
          options={{ title: "Ghi chú", headerShown: false }}
          component={CreateTaskScreen}
        />
        <Tab.Screen
          name="CalendarScreen"
          options={{ title: "Lịch", headerShown: false }}
          component={CalendarScreen}
        />
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
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="AppDrawerStack" component={AppDrawerStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Animatable.View>
  );
}
