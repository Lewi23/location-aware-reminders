import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { auth } from '../components/Firebase/firebase';


import navigationTheme from './navigationTheme';


import AuthStack from './AuthStack';
// import AppStack from './AppStack';



import { AuthUserContext } from './AuthUserProvider';
import Spinner from '../components/Spinner';



// Screens
import AddEventScreen from '../screens/AddEventScreen';
import completedRemindersScreen from '../screens/CompletedReminders';
import HomeScreen from '../screens/HomeScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();



export default function Routes() {
  const { user, setUser } = useContext(AuthUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(async authUser => {
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

  if (user){

  } else {

  }

  return (
    <NavigationContainer>
      {/* {user ? <AppStack /> : <AuthStack />} */}
     {/* <AppStack />  */}

     <Stack.Navigator>
        <Stack.Screen name="Tabs" component={TabNavigation}/> 
        <Stack.Screen name="Reminders" component={HomeScreen} />
        <Stack.Screen name="AddEvent" component={AddEventScreen} />
    </Stack.Navigator>

    </NavigationContainer>
  );
}


function AppStack() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={MainTabNavigator}/> 
        <Stack.Screen name="Reminders" component={HomeScreen} />
        <Stack.Screen name="AddEvent" component={AddEventScreen} />
      </Stack.Navigator>
  );
};

function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Reminders" component={HomeScreen} />
      <Tab.Screen name="completedReminders" component={completedRemindersScreen}/>
    </Tab.Navigator>
  )
}

