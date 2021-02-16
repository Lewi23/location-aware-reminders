import React, { useState, useEffect  } from 'react';
import { View, StyleSheet, Button, FlatList, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import * as Location from 'expo-location';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import MapView from 'react-native-maps';


import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import completedReminders from './CompletedReminders';


import AppButton from '../components/AppButton';
import useStatusBar from '../hooks/useStatusBar';
import { logout } from '../components/Firebase/firebase';
import { firebase_db } from '../components/Firebase/firebase'
import { auth } from '../components/Firebase/firebase'
import colors from '../utils/colors';
import { AppOwnership } from 'expo-constants';


const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.reminder + "\n" + item.location + "\n" + item.completed}</Text>
  </TouchableOpacity>
);




export default function HomeScreen({ navigation }) {
  useStatusBar('light-content');

  // Reminders a user has created 
  const [ reminders, setReminders ] = useState();
  // Current locations we are looking out for based on the reminders created 
  const [ reminderLocations, setReminderLocations ] = useState();
  // Nearby POIs we have found based on reminders locations we are intrested in
  const [ nearbyPOIs, setNearbyPOIs ] = useState();
  const [ selectedId, setSelectedId ] = useState(null);

  //console.log(selectedId);

  const renderItem = ({ item }) => {

    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        style={{ backgroundColor }}
      
      />
    );
  };



  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      
      let result = await fetch('https://0186u6yf60.execute-api.eu-west-2.amazonaws.com/v1/check_location?lon=' + location["coords"]['longitude'] + '&lat=' + location["coords"]['latitude']);
      let POIs = await result.json();

      const found_pois = [];

      POIs['body'].forEach(function(Element) {
        if(reminderLocations.includes(Element[2])){
          //console.log(Element);
          found_pois.push(Element);
          alert(Element);
        }
      });


      // set state here (Object we used to build our map)
      setNearbyPOIs(found_pois);
      console.log(nearbyPOIs);

    })();
  }, []);

  

  // Populates the reminders state
  useEffect(() => {
    return firebase_db.collection(auth.currentUser.uid).onSnapshot(querySnapshot => {
      const reminder_list = [];
      const locations = [];
      querySnapshot.forEach(doc => {
        const { location, reminder, completed } = doc.data();
        if(!completed){
          reminder_list.push({
            id: doc.id,
            reminder,
            completed,
          });

          locations.push(location);
        }
      });

      // Tracking users reminders 
      setReminders(reminder_list);
      //console.log(reminders)
      // Tracking locations of reminders
      setReminderLocations(locations);
      //console.log(locations);
    

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

   
      
      {/* <Button title="Sign Out" onPress={handleSignOut} /> */}
     

      <FlatList
        data={reminders}
        // renderItem={({ item }) => {
        //   return <Text style={styles.item}>{item.reminder + "\n" + item.location + "\n" + item.completed}</Text>;
        // }}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />


<MapView showsScale="true" style={styles.map} />

        <ActionButton
          size={70}
          buttonColor="rgb(60, 179, 113)"
          onPress={() => { navigation.navigate('AddEvent')}}
        />

      <Modal isVisible={true}>
        <View style={styles.modal}>
        <Text>Hello World</Text>
        {/* <MapView showsScale="true" style={styles.map} /> */}
        </View>
      </Modal>
  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button_container:{
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
  map: {
    width: Dimensions.get('window').width * 0.75,
    height: Dimensions.get('window').height / 2,
  },
  modal: {
    flex: 0.7,
    alignItems: 'center',
    backgroundColor: 'white',    
    padding: 100,
    borderRadius:10,
 },
});
