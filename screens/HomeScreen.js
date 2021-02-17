import React, { useState, useEffect  } from 'react';
import { View, StyleSheet, Button, FlatList, Text, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import MapView, {Marker} from 'react-native-maps';


import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import completedReminders from './CompletedReminders';


import AppButton from '../components/AppButton';
import useStatusBar from '../hooks/useStatusBar';
import { logout } from '../components/Firebase/firebase';
import { firebase_db } from '../components/Firebase/firebase'
import { auth } from '../components/Firebase/firebase'
import colors from '../utils/colors';



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
  const [ curLon, setCurLon ] = useState();
  const [ curLat, setCurLat ] = useState();
  const [ coordsArray, setCoordsArray ] = useState();

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
      setCurLon(location["coords"]['longitude']);
      setCurLat(location["coords"]['latitude']);
   
      
      let result = await fetch('https://0186u6yf60.execute-api.eu-west-2.amazonaws.com/v1/check_location?lon=' + location["coords"]['longitude'] + '&lat=' + location["coords"]['latitude']);
      let POIs = await result.json();

      //console.log(POIs['body'][2]);

      const found_pois = [];

      var poi_markers = {
        markers:[]
      }

      POIs['body'].forEach(function(Element) {
        if(reminderLocations.includes(Element[2])){
          //console.log(Element);
          found_pois.push(Element);
          alert(Element);

          const coords_res = getCords(Element[4]);
          console.log(coords_res)
          const obj = ({
            coordinates: ({
              latitude: Number(coords_res[1]),
              longitude: Number(coords_res[0]),
            }),
            title: Element[0]
          })

          poi_markers.markers.push(obj)
        
        }
      });


      // set state here (Object we used to build our map)
      setNearbyPOIs(found_pois);


      console.log(poi_markers);

      //setCoordsArray(getCords(nearbyPOIs[0][4])

      


     
  
      setCoordsArray(poi_markers);
      //console.log(coordsArray);
      // console.log(coordsArray.markers);
      
    

   

     
      // console.log(val);

      //console.log(nearbyPOIs[0][4]);
      //console.log(nearbyPOIs[0][2]);

    })();
  }, []);

  const handle_reminder = (element) => {
    console.log(element);
  }

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




        <ActionButton
          size={70}
          buttonColor="rgb(60, 179, 113)"
          onPress={() => { navigation.navigate('AddEvent')}}
        />

      <Modal isVisible={true} >
        <View style={styles.modal}>
        
        <MapView style={styles.map} showsUserLocation={true}
    //     initialRegion={{
    //   latitude: curLat,
    //   longitude: curLon,
    //   latitudeDelta: 0,
    //   longitudeDelta: 0,
    // }}
        
        >
        {/* <Marker coordinate = {{latitude: 56.025982,longitude:-3.815855}}
         pinColor = {"purple"} // any color
         title={"title"}
         description={"description"}/> */}

          {coordsArray.markers.map(marker => (
              <MapView.Marker 
                coordinate={marker.coordinates}
                title={marker.title}
              />
            ))} 

            
        </MapView>

       

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
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height / 2,
    borderRadius:10,
  },
  modal: {
    flex: 0.7,
    backgroundColor: 'white',    
    //padding: 10,
    borderRadius:10,
    alignItems: 'center',
 },
 modal_heading_text:{
   fontSize:32,
 }
});
