import React, { useState, useEffect, PureComponent  } from 'react';
import { View, StyleSheet, Button, FlatList, Text, TouchableOpacity, TouchableHighlight, Dimensions, LogBox } from 'react-native';
import * as Location from 'expo-location';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import MapView, {Marker} from 'react-native-maps';
import BouncyCheckbox from "react-native-bouncy-checkbox";
var _ = require('underscore');


import Spinner from '../components/Spinner';
import AppButton from '../components/AppButton';
import useStatusBar from '../hooks/useStatusBar';
import { logout } from '../components/Firebase/firebase';
import { firebase_db } from '../components/Firebase/firebase'
import { auth } from '../components/Firebase/firebase'
import colors from '../utils/colors';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['Warning: componentWillReceiveProps has been renamed'])


const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.reminder + "\n" + item.completed}</Text>
  </TouchableOpacity>
);


export default function HomeScreen({ navigation }) {
  useStatusBar('light-content');

  // Reminders a user has created 
  const [ reminders, setReminders ] = useState();
  // Current locations we are looking out for based on the reminders created 
  const [ reminderLocations, setReminderLocations ] = useState();
  // Tracking users current position
  const [ curLon, setCurLon ] = useState();
  const [ curLat, setCurLat ] = useState();
  const [ remindersToDisplay, setRemindersToDisplay ] = useState();

  

  
  const [ selectedId, setSelectedId ] = useState(null);
  
  const [ markersArray, setMarkersArray ] = useState();
  const [ completed, setCompleted ] = useState();
  const [ modalVisible, setModalVisible ] = useState(true);
  const [ reminderType , setReminderType ] = useState();
  const [ loop, setLoop] = useState(true);

  //console.log(selectedId);

  // Render flat list items
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

  // Get users location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }    
    })
  })

  // Doing the location checks / API calls
  useEffect(() => {
    (async () => {

        
    //  var interVal = setInterval(async () => {
        
          let location = await Location.getCurrentPositionAsync({});
          setCurLon(location["coords"]['longitude']);
          setCurLat(location["coords"]['latitude']);
        
          let result = await fetch('https://0186u6yf60.execute-api.eu-west-2.amazonaws.com/v1/check_location?lon=' + location["coords"]['longitude'] + '&lat=' + location["coords"]['latitude']);
          let POIs = await result.json();

          let reminderTypes = await getReminderTypes();
          //console.log(reminderTypes);
          setReminderType(reminderTypes);

          

          let mapMarkers = await buildMapMarkers(POIs, reminderTypes);
          //console.log(mapMarkers);
          setMarkersArray(mapMarkers);

          if(mapMarkers.markers.length > 0){
            setModalVisible(true);
          //   clearInterval(interVal);
          }
      
      // }, 1000);

    })();
  }, []);


  async function getReminderTypes() {
    const locations = await firebase_db
    .collection(auth.currentUser.uid)
    .get();

    const reminders = [];

    locations.forEach(doc => {
      const { location, reminder, completed} = doc.data()
      //(reminder)
      //reminders.push(location);

      reminders.push({
        location: location,
        reminder: reminder,
        status: completed
      })

    });
    return reminders; 
  }

  
 
 
  async function buildMapMarkers(POIs, reminderTypes) {
    var poi_markers = {
        markers:[]
      }

    const reminders_to_display = [];

    const POI_TYPE = 2;

    // destruct locations from array
    const locations = [];
    const reminders = [];
    const status = [];

    reminderTypes.forEach(function(Element){
      locations.push(Element.location);
      reminders.push(Element.reminder);
      status.push(Element.status);
    });
   
    // Only shows reminders that are nearby
    // Check if each of our reminders features in any nearby POI's
    // add it to reminders to display as we will build points for them bellow
    for (let i = 0; i < reminders.length; i++) {
      if(_.contains(POIs['body'].flat(), locations[i])){
        if(status[i] == false){
          //console.log(reminders)
          reminders_to_display.push(reminders[i]);
        }
        
      }
    }
                                                   
 
    POIs['body'].forEach(function(POI) {
      if(locations.includes(POI[POI_TYPE])){

        const coords_res = getCords(POI[4]);
            
        const obj = ({
          coordinates: ({
            latitude: Number(coords_res[1]),
            longitude: Number(coords_res[0]),
          }),
            title: POI[0]
        });
    
        poi_markers.markers.push(obj);
          
      }
    });
    //console.log(reminders_to_display);
    setRemindersToDisplay(reminders_to_display);
    return poi_markers;
      
  };


  const getCords = (POI) => {
    const remove_point = POI.replace("POINT", "")
    const remove_left_bracket = remove_point.replace("(", "")
    const remove_right_bracket = remove_left_bracket.replace(")", "")
    const coords = remove_right_bracket.split(" ");
    
    return coords;

  }

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
            location
          });

          locations.push(location);
        }
      });

      setReminders(reminder_list);
 
      
    });
  }, []);

  
  // handle selection of reminders on popup
  const curIsSelected = [];

  function isSelected(key){
 
    if(curIsSelected.includes(key)){
      const index = curIsSelected.indexOf(key);
        if (index > -1) {
          curIsSelected.splice(index, 1);
        }
    } else {
      curIsSelected.push(key);
    }
  }

  //console.log(curIsSelected);
 
  async function handleSignOut() {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  }


  // if(markersArray == undefined){
  //   return <Spinner />;
  // } else if(markersArray != undefined) {



  async function handle_completion(){
    
    //Index of completed reminders 
    const completed = curIsSelected.sort()
    //console.log(completed);
  
    //SHITTY NAME - RENAME
    //console.log(remindersToDisplay);

    const completed_reminders = [];

    for (let index = 0; index < completed.length; index++) {
      //console.log(remindersToDisplay[completed[index]]);
      completed_reminders.push(remindersToDisplay[completed[index]]);
    }

    //console.log(completed_reminders);

    const alter_reminder = [];
    
    const reminders = await firebase_db
          .collection(auth.currentUser.uid)
          .get();

    reminders.forEach(doc => {
      const { reminder, completed } = doc.data()

      if(completed == false && completed_reminders.includes(reminder)){
        //console.log(reminder)
        //console.log(_.contains(remindersToDisplay, reminder));
        //reminders.push(location);
  
        // a match we want to alter this doc to completed
        if(_.contains(remindersToDisplay, reminder)){
          alter_reminder.push(doc.id);
        }
      }

      
    });

   

    //console.log(alter_reminder);
    alter_reminder.forEach(function(reminder_id){
      firebase_db
      .collection(auth.currentUser.uid)
      .doc(reminder_id)
      .update({completed: true});
    })


    // have to close it last
    setModalVisible(false);


  }

  function MapPopup(){

    if(markersArray == undefined) {return false}
    if(markersArray.markers.length == 0) {return false}
    if(remindersToDisplay == undefined) {return false}
 
      return(
          <Modal isVisible={modalVisible} >
            <View style={styles.modal}>
            
            <MapView 
              style={styles.map} 
              showsUserLocation={true}
              initialRegion={{
                latitude: curLat,
                longitude: curLon,
                latitudeDelta: 0,
                longitudeDelta: 0,
              }}
            >
            {markersArray.markers.map(marker => (
              <MapView.Marker 
                coordinate={marker.coordinates}
                title={marker.title}
              />
            ))} 
    
            </MapView>

         
           <Text style={styles.modal_heading_text}>Reminder 🎉</Text>
           <View style={styles.reminder_style}>
              {remindersToDisplay.map((reminder,index) => (
              <BouncyCheckbox
                key={index}
                borderColor="green"
                textColor="black"
                fillColor="green"
                text={reminder}
                fontSize={20}
                onPress={(checked) => isSelected(index)}
                // onPress={(checked) => setCompleted(checked)}
              />
              ))} 
            </View>

            <Button title="Completed" onPress={() => handle_completion()} />

           

           {/* <Button title="Completed" ></Button>
           <Button title="Did not complete" ></Button> */}
    
            </View>
          </Modal> 
      );
    
  }


  

      return (
  
        <View style={styles.container}>
    

          
          <Button title="Sign Out" onPress={handleSignOut} />
         
    
          <FlatList
            data={reminders}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={selectedId}
          />

          <MapPopup/> 
        
          <ActionButton
            size={70}
            buttonColor="rgb(60, 179, 113)"
            onPress={() => { navigation.navigate('AddEvent')}}
          />
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
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height / 3,
    borderRadius:10,
  },
  modal: {
    flex: 0.7,
    backgroundColor: 'white',    
    //padding: 10,
    borderRadius:10,
    alignItems: 'flex-start',
 },
 modal_heading_text:{
   fontSize:30,
   padding: 10,
   fontWeight: "bold",
 },
 reminder_style:{
   padding: 10
 }

});
