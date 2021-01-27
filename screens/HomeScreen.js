import React, { useState, useEffect  } from 'react';
//import {Picker} from '@react-native-picker/picker';
import { View, StyleSheet, Button, FlatList, Text } from 'react-native';

import AppButton from '../components/AppButton';
import useStatusBar from '../hooks/useStatusBar';
import { logout } from '../components/Firebase/firebase';
import { firebase_db } from '../components/Firebase/firebase'
import { auth } from '../components/Firebase/firebase'
import { out } from 'react-native/Libraries/Animated/src/Easing';







export default function HomeScreen({ navigation }) {


  useStatusBar('dark-content');

  const [ loading, setLoading ] = useState(true);
  const [ reminders, setReminders ] = useState([]);

 
  function onResult(QuerySnapshot) {
    QuerySnapshot.forEach(doc => {
      const { location, reminder } = doc.data();
      console.log(location + " " + reminder)
      
    });
  }
  
  function onError(error) {
    console.error(error);
  }
  
  firebase_db
    .collection(auth.currentUser.uid)
    .onSnapshot(onResult, onError);

  async function handleSignOut() {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  }


  const renderItem = ({ item }) => (
    <Item title={item.reminder} />
  )

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  


  return (
    <View style={styles.container}>
      <Button title="Sign Out" onPress={handleSignOut} />
      <AppButton title="Create Event" color="grey" onPress={() => navigation.navigate('AddEvent')}/>
      {/* <FlatList 
        style={{flex: 1}}
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <reminders {...item} />}
      /> */}
      
      {/* <FlatList
        data={reminders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      /> */}

    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
