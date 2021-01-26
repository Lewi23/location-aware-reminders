import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { firebase_db } from '../components/Firebase/firebase'
import { auth } from '../components/Firebase/firebase'
import * as Yup from 'yup';

import Colors from '../utils/colors';
import SafeView from '../components/SafeView';
import Form from '../components/Forms/Form';
import FormField from '../components/Forms/FormField';
import FormButton from '../components/Forms/FormButton';
import FormErrorMessage from '../components/Forms/FormErrorMessage';
import useStatusBar from '../hooks/useStatusBar';



const validationSchema = Yup.object().shape({
  reminder: Yup.string()
    .required('Please enter the reminder')
});

export default function AddEventScreen({ navigation: { goBack } }) {
  useStatusBar('light-content');


  async function addReminder(values){

    event_obj.reminder = values.reminder

    await firebase_db.collection(auth.currentUser.uid).add({
      reminder: event_obj.reminder,
      location: event_obj.location
    });

    goBack();
  }

  const [customError, setCustomError] = useState('');
  const [location_val, setLocation] = useState('');

  let event_obj = {
    reminder: '',
    location: location_val
  }

  return (
    <SafeView style={styles.container}>
      <Form
        initialValues={{ reminder: '' }}
        initialValues={{ location: '' }}
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
          autoFocus={true}
        />
        <FormField
          name="location"
          leftIcon="map"
          placeholder= "Select location"
          autoCapitalize="sentences"
          keyboardType="ascii-capable"
          textContentType="emailAddress"
          autoFocus={true}
          setFieldValue = { location_val }
        />
       <RNPickerSelect
            onValueChange={(value) => setLocation(value)}
            items={[
                { label: 'Food', value: 'food' },
                { label: 'Tools', value: 'tools' },
            ]}
        />

        <FormButton title="Add reminder" />
        {<FormErrorMessage error={customError} visible={true} />}
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
  }
});
