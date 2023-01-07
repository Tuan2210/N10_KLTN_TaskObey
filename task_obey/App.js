import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

//link all icons react-native: https://oblador.github.io/react-native-vector-icons
////npm i react-native-vector-icons

// link all name animations: https://github.com/oblador/react-native-animatable
// Link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
////npm i react-native-animatable

////npm i axios firebase react-native-safe-area-context
////npm i @react-navigation/native @react-navigation/native-stack @react-navigation/material-top-tabs

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from './src/components/Login';
import Register from './src/components/Register';
import TabBarBottom from './src/components/TabBarBottom';

const Stack = createNativeStackNavigator();

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
          // options={{ title: "Đăng nhập" }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
          // options={{ title: "Đăng ký" }}
        />
        <Stack.Screen
          name="TabBarBottom"
          component={TabBarBottom}
          options={{ headerShown: false }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}