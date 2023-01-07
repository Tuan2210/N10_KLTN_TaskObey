import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

//link all icons react-native: https://oblador.github.io/react-native-vector-icons/
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeicons from 'react-native-vector-icons/FontAwesome';

import ListScreenn from './ListScreen';
import CreateTaskScreen from './CreateTaskScreen';
import CalendarScreen from './CalendarScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabScreen() {
    return (
      <Animatable.View animation="bounceIn" style={{flex: 1}}>
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
              } else if (route.name === "ProfileScreen") {
                iconFA = focused ? "user-circle-o" : "user-circle";
              }
              size = focused ? 30 : 24;

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
            component={ListScreenn}
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
            name="ProfileScreen"
            options={{ title: "Thông tin", headerShown: false }}
            component={ProfileScreen}
          />
        </Tab.Navigator>
      </Animatable.View>
    );
}
