import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { auth } from "../components/Firebase/firebase";
import { AuthUserContext } from "./AuthUserProvider";
import Spinner from "../components/Spinner";

// Post-auth screens
import AddEventScreen from "../screens/AddEventScreen";
import completedRemindersScreen from "../screens/CompletedReminders";
import HomeScreen from "../screens/HomeScreen";

// Pre-auth screens
import WelcomeScreen from "../screens/WelcomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

// Build navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function Routes() {
  const { user, setUser } = useContext(AuthUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(async (authUser) => {
      try {
        await (authUser ? setUser(authUser) : setUser(null));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  // If a user is logged in load the auth routing
  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 32,
            },
            headerTitleAlign: "left",
          }}
        >
          <Stack.Screen name="Reminders" component={TabNavigation} />
          <Stack.Screen
            name="Create Reminder"
            component={AddEventScreen}
            options={{ headerLeft: () => null }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    // Return the pre auth routing
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" headerMode="none">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

// Tab navigation config
const TabNavigation = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: {
          fontSize: 20,
          fontWeight: "bold",
          position: "absolute",
        },
      }}
    >
      <Tab.Screen name="Active" component={HomeScreen} />
      <Tab.Screen name="Completed" component={completedRemindersScreen} />
    </Tab.Navigator>
  );
};
