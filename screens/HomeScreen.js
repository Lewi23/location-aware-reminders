import React, { useState, useEffect  } from 'react';
import { View, StyleSheet, Button, FlatList, Text, ListItem } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import AppButton from '../components/AppButton';
import useStatusBar from '../hooks/useStatusBar';
import { logout } from '../components/Firebase/firebase';
import { firebase_db } from '../components/Firebase/firebase'
import { auth } from '../components/Firebase/firebase'


export default function HomeScreen({ navigation }) {
  useStatusBar('light-content');

  const [ reminders, setReminders] = useState();

  useEffect(() => {
    return firebase_db.collection(auth.currentUser.uid).onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { location, reminder, completed } = doc.data();
        if(list.completed == false){
          list.push({
            id: doc.id,
            location,
            reminder,
            completed,
          });
        }
      });

      setReminders(list);

    });
  }, []);
 
  async function handleSignOut() {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Sign Out" onPress={handleSignOut} />
      <AppButton title="Create Event" color="black" onPress={() => navigation.navigate('AddEvent')}/>

      <FlatList
            data={reminders}
            renderItem={({ item }) => {
              return <Text style={styles.item}>{item.reminder}</Text>;
            }}
            keyExtractor={item => item.id}
      />

        <ActionButton
          size={80}
          buttonColor="rgb(60, 179, 113)"
          onPress={() => { navigation.navigate('AddEvent')}}
        />
            
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
