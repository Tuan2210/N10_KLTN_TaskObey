import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useDispatch, useSelector } from "react-redux";

import { createAxios } from "../../redux/createInstance";
import { logoutSuccess } from "../../redux/authSlice";
import { logOut, logOutRegsiter } from "../../redux/apiRequest/authApiRequest";

import { SafeAreaView } from "react-native-safe-area-context";

import {Avatar, Drawer} from 'react-native-paper'
//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

import {BarChart, LineChart, PieChart} from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function StatisticScreen() {
  const currentLoginUser = useSelector((state) => state.auth.login?.currentUser);
  const loginUserId = currentLoginUser?._id;
  const phoneLoginrUser = currentLoginUser?.phoneNumber;
  const refreshToken = currentLoginUser?.refreshToken;
  const loginUserNameAcc = currentLoginUser?.userName;

  const currentRegisterUser = useSelector((state) => state.auth.register?.currentUserRegister);
  const registerUserId = currentRegisterUser?._id;
  const phoneRegisterUser = currentRegisterUser?.phoneNumber;
  const accessToken = currentRegisterUser?.token;
  const registerUserNameAcc = currentRegisterUser?.userName;

//   useEffect(() => {
//     if(currentRegisterUser && !currentLoginUser)
//     //   setUserNameAcc(registerUserNameAcc);
//     if(!currentRegisterUser && currentLoginUser)
//     //   setUserNameAcc(loginUserNameAcc);
//   }, [currentRegisterUser, currentLoginUser]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [viewModelStatic, setViewModelStatic] = useState("Line")

  return (
    <SafeAreaView style={styles.container}>
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 0.5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
          <Text style={{ color: "#09CBD0" }}>Biểu đồ xem:</Text>
          <Picker
            style={{
              width: "55%",
              backgroundColor: "#BCF4F5",
              marginLeft: "3%",
            }}
            selectedValue={viewModelStatic}
            onValueChange={(itemValue, itemIndex) => 
              setViewModelStatic(itemValue)
              }>
                <Picker.Item style={{fontSize: 18}}
                  label="Đường"
                  value={"Line"}/>
                <Picker.Item style={{fontSize: 18}} 
                  label="Cột"
                  value={"Chart"}/>  
          </Picker>
      </View>
      {/* <View
        style={{
          flex: 0.3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
          <Text style={{ color: "#09CBD0" }}>Mức độ:</Text>
          <Picker
            style={{
              width: "55%",
              backgroundColor: "#BCF4F5",
              marginLeft: "3%",
            }}
            selectedValue={viewModelStatic}
            onValueChange={(itemValue, itemIndex) => 
              setViewModelStatic(itemValue)
              }>
                <Picker.Item style={{fontSize: 18}}
                  label="Quan trọng"
                  value={"Line"}/>
                <Picker.Item style={{fontSize: 18}} 
                  label="Không quan trọng"
                  value={"Chart"}/>  
          </Picker>
      </View> */}
      {viewModelStatic === "Line" && <LineChartScreen />}
      {viewModelStatic === "Chart" && <BarChartScreen />}
      {/* <TouchableOpacity
        onPress={() => {
          switch (viewModelStatic){
            case "Line":
              LineChartScreen()
              break
            case "Pie":
              PieChartScreen()
              break
            default:
              break
          }
          }
        }
        >

      </TouchableOpacity> */}
    </View>  
    </SafeAreaView>
  );
};
function BarChartScreen() {
  return(
    <BarChart
    data={{
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [
            5,6,1,0,2,3
            // Math.random() * 100,
            // Math.random() * 100,
            // Math.random() * 100,
            // Math.random() * 100,
            // Math.random() * 100,
            // Math.random() * 100
          ]
        }
      ]
    }}
    width={400}
    height={420}
    // yAxisInterval={1}
    chartConfig={{
      backgroundColor: '#09CBD0',
      backgroundGradientFrom: '#09CBD0',
      backgroundGradientTo: '#09CBD0',
      decimalPlaces: 2,
      color: (opacity = 0.0) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 0.0) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 50,
      }
    }}
    verticalLabelRotation={50}
    >
    </BarChart>
  )
}
function LineChartScreen() {
  
  return(  
    <LineChart 
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [
                  5,6,1,0,2,1,0,7
                  // Math.random() * 100,
                  // Math.random() * 100,
                  // Math.random() * 100,
                  // Math.random() * 100,
                  // Math.random() * 100,
                  // Math.random() * 100
                ]
              }
            ]
          }}
          width={400}
          height={420}
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#09CBD0',
            backgroundGradientFrom: '#09CBD0',
            backgroundGradientTo: '#09CBD0',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 20,
            }
          }}
          bezier
          style={{
            marginVertical: 5, borderRadius: 5
          }}
          >

        </LineChart>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: "center",
    alignSelf: "center",  
  },
  btnPrevNext: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "15%",
    backgroundColor: "#09CBD0",
    borderRadius: 10,
  },
});