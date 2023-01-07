import React from "react";
import { View } from "react-native";
import { Route, Routes, NativeRouter } from "react-router-native";
import { publicRoutes } from "./routes";

export default function AppWrapper() {
    return (
        <NativeRouter>
            <View style={{flex: 1}}>
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Screen = route.component;
                        return <Route key={index} path={route.path} element={<Screen />} />;
                    })}
                </Routes>
            </View>
        </NativeRouter>
    )
}