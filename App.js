import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashBoard from "./src/screens/DashBoard";
import ControlScreen from "./src/screens/ControlScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="DashBoard">
          <Stack.Screen 
            name="DashBoard" 
            component={DashBoard} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ControlScreen" 
            component={ControlScreen} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
