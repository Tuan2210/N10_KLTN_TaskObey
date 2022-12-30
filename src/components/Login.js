import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import * as Animatable from "react-native-animatable";

//link doc expo av: https://docs.expo.dev/versions/latest/sdk/av
import { Audio } from "expo-av";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function Login() {
  //splash-screen
  const splashscreen = useRef(new Animated.Value(0)).current;
  const [isVisible, setisVisible] = useState(true);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(splashscreen, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  useEffect(() => {
    let myTimeout = setTimeout(() => {
      setisVisible(false);
    }, 4000); //4s
    return () => clearTimeout(myTimeout);
  }, []);

  //sound effect: https://docs.expo.dev/versions/latest/sdk/audio/#sound
  // https://mixkit.co/free-sound-effects
  useEffect(() => {
    handlePlaySound();
  })
  const handlePlaySound = async () => {
    if(isVisible==true) {
      const audioObj = new Audio.Sound();

      try{
        // await audioObj.loadAsync(require("../../assets/sound_effects_splashscreen.mp3"));
        await audioObj.loadAsync(require("../../assets/mixkit-tick-tock-clock-timer-1045.wav"));
        // console.log(audioObj);
        await audioObj.playAsync();
      } catch(err) {console.log(err)}
    }
  }

  function showSplashScreen() {
    return (
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: "#09CBD0",
            alignItems: "center",
            justifyContent: "space-evenly",
          },
          { opacity: splashscreen },
        ]}
      >
        <Animated.Image
            style={[{ width: widthScreen, height: "32%" }]}
          source={require("../../assets/taskobey_line.png")}
          resizeMode="contain"
        />
        <Animated.Image
            style={[{ height: "40%", marginTop: '-25%' }]}
          source={require("../../assets/clock.gif")}
          resizeMode="contain"
        />
        <Animated.Image
          source={require("../../assets/loading.gif")}
          resizeMode="contain"
        />
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        {isVisible ? (
            showSplashScreen()
        ) : (
            <Animatable.View animation="fadeInDownBig">
                <Text>Login</Text>
            </Animatable.View>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
