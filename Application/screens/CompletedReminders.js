import React, { useState, useEffect  } from 'react';
import { View, StyleSheet, Button, FlatList, Text } from 'react-native';
import useStatusBar from '../hooks/useStatusBar';

import ListItem from "../components/ListItem";
import { firebase_db } from '../components/Firebase/firebase'
import { auth } from '../components/Firebase/firebase'
import colors from '../utils/colors';


export default function CompletedReminders() {
  useStatusBar('light-content');

  const [ completedReminders, setCompletedReminders] = useState();


  const renderItem = ({ item }) => {
    return (
      <ListItem
        item={item}
        style={{ backgroundColor: colors.green }}
      />
    );
  };


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
            renderItem={renderItem}
            keyExtractor={item => item.id}
            //extraData={selectedId}
          />  

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
