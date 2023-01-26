import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Provider } from "react-redux";
import { store, persistor } from './src/redux/store';
import { PersistGate } from "redux-persist/integration/react";

import AppWrapper from './src/AppWrapper';

//link all icons react-native: https://oblador.github.io/react-native-vector-icons
////npm i react-native-vector-icons

// link all name animations: https://github.com/oblador/react-native-animatable
// Link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
////npm i react-native-animatable

////npm i axios firebase react-native-safe-area-context
////npm i @react-navigation/native @react-navigation/native-stack @react-navigation/material-top-tabs

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppWrapper />
      </PersistGate>
    </Provider>
  );
}