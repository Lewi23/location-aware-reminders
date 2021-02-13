import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Import screens
import HomeScreen from '../screens/HomeScreen';
import AddEventScreen from '../screens/AddEventScreen';
import completedReminders from '../screens/CompletedReminders';

// Create nav managers 
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator()


export default function AppStack() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={MainTabNavigator}/> 
        <Stack.Screen name="Reminders" component={HomeScreen} />
        <Stack.Screen name="AddEvent" component={AddEventScreen} />
      </Stack.Navigator>
  );
};


function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Reminders" component={HomeScreen} />
      <Tab.Screen name="completedReminders" component={completedReminders}/>
    </Tab.Navigator>
  )
}






