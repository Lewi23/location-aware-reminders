import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import colors from "../utils/colors";

export default function ListItem({ item, onPress, style }) {
  let title;

  switch (item.location) {
    case "Food, Drink and Multi Item Retail":
      title = "🛒  ";
      break;
    case "Nature":
      title = "🌳  ";
      break;
    case "Postboxes":
      title = "📮  ";
      break;
    case "DIY and home improvement":
      title = "⛏  ";
      break;
    case "Banks and building societies":
      title = "💷  ";
      break;
    case "Gymnasiums, sports halls and leisure centres":
      title = "🏃  ";
      break;
    case "Fast food and takeaway outlets":
      title = "🍕  ";
      break;
    case "Chemists and pharmacies":
      title = "💊  ";
      break;
    case "Clothing":
      title = "🛍  ";
      break;
  }

  if (!item.completed) {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
        <Text>
          <Text style={styles.item_title}>{title}</Text>
          <Text style={styles.item_text}>{item.reminder}</Text>
        </Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
        <Text>
          <Text style={styles.item_title}>{title}</Text>
          <Text style={styles.item_text_completed}>{item.reminder}</Text>
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  item_title: {
    fontSize: 30,
  },
  item_text: {
    fontSize: 20,
  },
  item_text_completed: {
    fontSize: 20,
    color: colors.white,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
});
