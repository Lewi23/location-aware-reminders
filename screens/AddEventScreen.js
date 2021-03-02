import React, { useState } from 'react';
import { StyleSheet, FlatList, Text, TouchableOpacity, SafeAreaView, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { firebase_db } from '../components/Firebase/firebase'
import { auth } from '../components/Firebase/firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Yup from 'yup';



import Colors from '../utils/colors';
import SafeView from '../components/SafeView';
import Form from '../components/Forms/Form';
import FormField from '../components/Forms/FormField';
import FormButton from '../components/Forms/FormButton';
import FormErrorMessage from '../components/Forms/FormErrorMessage';
import useStatusBar from '../hooks/useStatusBar';

//GUI imports
import { Chip, Subheading, Button } from 'react-native-paper';
import colors from '../utils/colors';





// Build Chips
const ontology_buttons = [
  '🛒 Food Shopping',
  '🌲 Nature',
  '📮 Postbox',
  '⛏ Hardware Store',
  '💷 Bank',
  '🏃 Gym',
  '🍕 Takeaway',
  '💊 Pharmacy', 
  '🛍 Clothes'
]

// Assign the ontology value to the chips
const ontology_types = [
  'Food, Drink and Multi Item Retail',
  'Nature',
  'Postboxes',
]


const validationSchema = Yup.object().shape({
  reminder: Yup.string()
    .required('Please enter the reminder'),
});


export default function AddEventScreen({ navigation: { goBack } }) {
  useStatusBar('light-content');

  

  async function addReminder(values){

    await firebase_db.collection(auth.currentUser.uid).add({
      reminder: values.reminder,
      location: ontology_types[curIsSelected],
      completed: false,
    });

    goBack();
  }

  const [customError, setCustomError] = useState('');
  const [ curIsSelected, setCurIsSelected ] = useState(0);





  return (
    <SafeView style={styles.container}>
      <Form
        initialValues={{ reminder: '' }}
        validationSchema={validationSchema}
        onSubmit={values => addReminder(values)}

      >

  
        

        <FormField
          name="reminder"
          leftIcon="reminder"
          placeholder="Enter reminder"
          autoCapitalize="sentences"
          keyboardType="ascii-capable"
          textContentType="emailAddress"
        />

    

      <Subheading>Location</Subheading>

      
      <View style={styles.row}>
        {ontology_buttons.map((reminder_type, index) => (
            <Chip 
              id={index}
              style={
                curIsSelected === index
                        ? styles.chip_selected
                        : styles.chip_not_selected
                    }
              onPress={() => setCurIsSelected(index)}
            >
              <Text style={curIsSelected === index
                        ? styles.chip_text_selected
                        : styles.chip_text_not_selected
                    }>{reminder_type}</Text>
            </Chip>
        ))} 
      </View>


       
        <FormButton title="Add reminder" />


        <View style={styles.button_holder}>

        
        {<FormErrorMessage error={customError} visible={true} />}


        <Button 
         mode="contained"
         uppercase={false} 
         onPress={() => console.log('Pressed')}
         style={{
           backgroundColor: "#ff3b30"
         }}
         labelStyle={{
           color:"white",
           fontSize: 20
        }}
        >
            Cancel
        </Button>

        </View>

        

      </Form>
    </SafeView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.white
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  picker_style: {
    width: 200,
    backgroundColor: 'black',
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 30,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //paddingHorizontal: 10,
    paddingVertical: 10
  },
  chip_not_selected: {
    backgroundColor: Colors.lightGrey,
    color: "black",
    margin: 4
  },
  chip_selected: {
    backgroundColor: Colors.green,
    color: "white",
    margin: 4
  },
  chip_text_not_selected: {
    color: "black",
    fontSize: 16
  },
  chip_text_selected: {
    color: "white",
    fontSize: 16
  },
  button_holder:{
    marginVertical: 10,
    
  
  }
});
