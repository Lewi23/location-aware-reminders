import React from 'react';
import { View, StyleSheet, Button } from 'react-native';

import AppButton from '../components/AppButton';
import useStatusBar from '../hooks/useStatusBar';
import { logout } from '../components/Firebase/firebase';

export default function HomeScreen({ navigation }) {
  useStatusBar('dark-content');

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
      <AppButton title="Create Event" color="grey" onPress={() => navigation.navigate('AddEvent')}/>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
