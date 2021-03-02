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
import { Chip } from 'react-native-paper';
import { Subheading } from 'react-native-paper';
import { TextInput } from 'react-native-paper';

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
    .required('Please enter the reminder')
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
  const [location_val, setLocation] = useState('');
  const [ curIsSelected, setCurIsSelected ] = useState(-1);



  return (
    <SafeView style={styles.container}>
      <Form
        initialValues={{ reminder: '' }}
        validationSchema={validationSchema}
        onSubmit={values => addReminder(values)}

      >

  
        <Subheading>Create Reminder</Subheading>

        <FormField
          name="reminder"
          leftIcon="reminder"
          placeholder="Enter reminder"
          autoCapitalize="sentences"
          keyboardType="ascii-capable"
          textContentType="emailAddress"
          autoFocus={true}
        />

      
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
        {<FormErrorMessage error={customError} visible={true} />}
      </Form>

    


    </SafeView>
  );
}

//RNPickerSelect
const placeholder = {
  label: 'Select a location',
  color: 'black',
};

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
    paddingVertical: 20
  },
  chip_not_selected: {
    backgroundColor: "#d0d9d3",
    color: "black",
    margin: 4
  },
  chip_selected: {
    backgroundColor: "green",
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
  }
});
