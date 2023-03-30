import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarList, LocaleConfig } from 'react-native-calendars';
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
    monthNamesShort:["T1","T2","T3","T4","T5","T7","T8","T9","T10","T11","T12", ],
    dayNames: [ "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"],
    dayNamesShort: [ "CN", "T2", "T3", "T4", "T5", "T6", "T7",]
}

LocaleConfig.defaultLocale = 'vn'

export default function CalendarScreen(props) {
    const presentDate = new Date().toISOString().split("T")[0];
    const presentDay = presentDate.slice(8,10),
            presentMonth = presentDate.slice(5,7),
            presentYear = presentDate.slice(0,4),
            formatpresentDate = presentYear +'-' +presentMonth + '-'  +presentDay ;
    const [selected, setSelected] = useState(formatpresentDate);
    const marked = useMemo(() => ({
        [selected]: {
        // selected: true,
        customStyles: {
            container: {
            borderColor: "#09CBD0",
            borderWidth: 1.6,
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
                    selectedDayTextColor:"#fff",
                    todayTextColor: "#fff",
                    todayBackgroundColor:"#09CBD0",
                }}
                // initialDate={formatpresentDate}
                markingType="custom"
                markedDates={marked}
                onDayPress={(day) => {
                    setSelected(day.dateString);
                    props.onDaySelect && props.onDaySelect(day);
                }}
                {...props}
                />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})