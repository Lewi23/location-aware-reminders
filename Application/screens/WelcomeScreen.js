import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import AppButton from '../components/AppButton';
import Colors from '../utils/colors';
import useStatusBar from '../hooks/useStatusBar';

export default function WelcomeScreen({ navigation }) {
  useStatusBar('light-content');

  return (
    <View style={styles.container}>
     <Text style={styles.subtitle}>Location-aware</Text>
     <Text style={styles.subtitle}>Reminders</Text>
      <Text style={styles.logoContainer}>🗺</Text>
      <View style={styles.buttonContainer}>
        <AppButton title="Login" color="black" onPress={() => navigation.navigate('Login')} />
        <AppButton title="Register" color="black" onPress={() => navigation.navigate('Register')}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  logoContainer: {
    //position: 'absolute',
    //top: 60,
    //alignItems: 'center',
    //justifyContent: 'center',
    fontSize:150
  },
  logo: {
    width: 125,
    height: 125
  },
  subtitle: {
    fontSize: 30,
    fontWeight: '600',
    //paddingVertical: 20,
    paddingHorizontal: 20,
    color: Colors.black
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 60,
    width: '100%',
  }
});
