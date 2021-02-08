import React, { useState, useEffect  } from 'react';
import { View, StyleSheet, Button, FlatList, Text } from 'react-native';
import * as Location from 'expo-location';

import AppButton from '../components/AppButton';
import useStatusBar from '../hooks/useStatusBar';
import { logout } from '../components/Firebase/firebase';
import { firebase_db } from '../components/Firebase/firebase'
import { auth } from '../components/Firebase/firebase'
import colors from '../utils/colors';


export default function HomeScreen({ navigation }) {
  useStatusBar('light-content');

  const [ completedReminders, setCompletedReminders] = useState();

  // Populates the reminders state
  useEffect(() => {
    return firebase_db.collection(auth.currentUser.uid).onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { location, reminder, completed } = doc.data();
        if(completed){
          list.push({
            id: doc.id,
            location,
            reminder,
            completed,
          });
        }
      });

      setCompletedReminders(list);

    });
  }, []);


  return (
    <View style={styles.container}>

      <FlatList
            data={completedReminders}
            renderItem={({ item }) => {
              return <Text style={styles.item}>{item.reminder + "\n" + item.location + "\n" + item.completed}</Text>;
            }}
            keyExtractor={item => item.id}
      />

          
        {/* <View style={{flexDirection: "row"}}> */}
              {/* <Button title="Current Reminders" style={styles.button} />
              <Button title="Completed" color="#f194ff"  /> */}
        {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    backgroundColor: 'black',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    fontSize: 20,
    color: 'white'
  },

});
