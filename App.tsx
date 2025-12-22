import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomTabNavigator } from "./src/navigation/BottomTabNavigator";
import { RootStackParamList } from "./src/navigation/types";
import { CarDetailScreen } from "./src/screens/CarDetailScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#fff" },
          }}
        >
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen
            name="CarDetail"
            component={CarDetailScreen}
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              gestureEnabled: true,
              fullScreenGestureEnabled: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
