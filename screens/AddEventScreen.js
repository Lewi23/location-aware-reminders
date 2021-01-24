import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

//import { Picker } from '@react-native-picker/picker';

import RNPickerSelect from 'react-native-picker-select';

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
    //.label('Email')
    //.email('Enter a valid email')
    .required('Please enter the reminder')
});





export default function ForgotPasswordScreen({ navigation }) {
  useStatusBar('light-content');

  function update_print(values){
    event_obj.reminder = values.reminder
    console.log(event_obj)
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
        onSubmit={values => update_print(values)}


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
