import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import AddEventScreen from '../screens/AddEventScreen';
import completedReminders from '../screens/CompletedReminders';


const Stack = createStackNavigator();



export default function AppStack() {
  return (
      <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#9AC4F8",
        },
        headerTintColor: "white",
        headerBackTitle: "Back",
      }}
    >
        <Stack.Screen name="Reminders" component={HomeScreen} />
        <Stack.Screen name="AddEvent" component={AddEventScreen} />
        <Stack.Screen name="completedReminders" component={completedReminders}/>
      </Stack.Navigator>

  );
}
