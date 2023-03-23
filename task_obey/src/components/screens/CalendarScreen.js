import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar,CalendarList, LocaleConfig } from 'react-native-calendars';
// link calendar: https://github.com/wix/react-native-calendars
//link all name animations: https://github.com/oblador/react-native-animatable
//link how to code animation: https://blog.bitsrc.io/top-5-animation-libraries-in-react-native-d00ec8ddfc8d
import * as Animatable from "react-native-animatable";

LocaleConfig.locales['vn'] = {
    monthNames: [
        "Tháng một",
        "Tháng hai",
        "Tháng ba",
        "Tháng bốn",
        "Tháng năm",
        "Tháng sáu",
        "Tháng bảy",
        "Tháng tám",
        "Tháng chín",
        "Tháng mười",
        "Tháng mười một",
        "Tháng mười hai"
    ],
    dayNames: [
        "Thứ hai",
        "Thứ ba",
        "Thứ tư",
        "Thứ năm",
        "Thứ sáu",
        "Thứ bảy",
        "Chủ nhật"
    ],
    dayNamesShort: [
        "CN",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
    ],
}

LocaleConfig.defaultLocale = 'vn'

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export default function CalendarScreen(props) {
    const initDate = '2022-12-01';
    const [selected, setSelected] = useState(initDate);
    const marked = useMemo(() => ({
        [selected]: {
        customStyles: {
            container: {
            borderColor: "#09CBD0",
            borderWidth: 1.5,
            borderRadius: 100,
            },
            text: {
            color: 'black',
            }
        }
        }
    }), [selected]);
    return (
        <SafeAreaView style={styles.container}>
            <CalendarList style={{height:'100%', width: '100%',alignContent:'center'}}
                theme={{
                    backgroundColor: "#fff",
                    textSectionTitleColor: "#09CBD0",
                    selectedDayBackgroundColor: "#09CBD0",
                    selectedDayTextColor:"#fff",
                    todayTextColor: "#fff",
                    selectedDotColor: "#09CBD0",
                    todayDotColor:"#09CBD0",
                    dotColor: "#09CBD0",
                    todayBackgroundColor:"#09CBD0",
                    agendaTodayColor:"#09CBD0",
                    agendaDayNumColor:"#09CBD0",
                    agendaDayTextColor:"#fff",
                }}
                markingType="custom"
                markedDates={marked}
                onDayPress={(day) => {
                    setSelected(day.dateString);
                    props.onDaySelect && props.onDaySelect(day);
                }}
                {...props}/>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})