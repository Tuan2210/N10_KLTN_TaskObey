import { StyleSheet, View } from 'react-native';
import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabScreen from './screens/TabScreen';
import ListScreen from './screens/ListScreen';
import CreateTaskScreen from './screens/CreateTaskScreen';
import CalendarScreen from './screens/CalendarScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function Home() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="TabScreen"
              component={TabScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="ListScreen" component={ListScreen} />
            <Stack.Screen name="CreateTaskScreen" component={CreateTaskScreen} />
            <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    );
}

