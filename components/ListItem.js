import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';


export default function ListItem({ item, onPress, style }){
  let title;

  switch(item.location){
    case 'Food, Drink and Multi Item Retail':
      title = '🛒  '
      break;
    case 'Nature':
      title = '🌳  '
      break;
  }

  return(
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text>
      <Text style={styles.item_title}>{title}</Text>
      <Text>{item.reminder}</Text>
    </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item_title: {
    fontSize:40,
  },
  item: {
    backgroundColor: 'black',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    fontSize: 20,
    color: 'white',
    borderRadius:10,
    borderColor: "blue"
  },
});
