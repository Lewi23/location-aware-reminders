import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { firebase_db } from "../components/Firebase/firebase";
import { auth } from "../components/Firebase/firebase";
import * as Yup from "yup";

import Colors from "../utils/colors";
import SafeView from "../components/SafeView";
import Form from "../components/Forms/Form";
import FormField from "../components/Forms/FormField";
import FormButton from "../components/Forms/FormButton";
import FormErrorMessage from "../components/Forms/FormErrorMessage";
import useStatusBar from "../hooks/useStatusBar";

//GUI imports
import { Chip, Subheading, Button } from "react-native-paper";

// Build Chips
const ontology_buttons = [
  "🛒 Food Shopping",
  "🌲 Nature",
  "📮 Postbox",
  "⛏ Hardware Store",
  "💷 Bank",
  "🏃 Gym",
  "🍕 Takeaway",
  "💊 Pharmacy",
  "🛍 Clothes shop",
];

// Assign the ontology value to the chips
const ontology_types = [
  "Food, Drink and Multi Item Retail",
  "Nature",
  "Postboxes",
];

const validationSchema = Yup.object().shape({
  reminder: Yup.string().required("Please enter the reminder"),
});

export default function AddEventScreen({ navigation: { goBack } }) {
  useStatusBar("light-content");

  const [customError, setCustomError] = useState("");
  const [curIsSelected, setCurIsSelected] = useState(0);

  async function addReminder(values) {
    await firebase_db.collection(auth.currentUser.uid).add({
      reminder: values.reminder,
      location: ontology_types[curIsSelected],
      completed: false,
    });

    goBack();
  }

  return (
    <SafeView style={styles.container}>
      <Form
        initialValues={{ reminder: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => addReminder(values)}
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
              <Text
                style={
                  curIsSelected === index
                    ? styles.chip_text_selected
                    : styles.chip_text_not_selected
                }
              >
                {reminder_type}
              </Text>
            </Chip>
          ))}
        </View>

        <FormButton title={"Add Reminder"}/>

        <View style={styles.button_holder}>
          {<FormErrorMessage error={customError} visible={true} />}

          <Button
            mode="contained"
            uppercase={false}
            onPress={goBack}
            style={{
              backgroundColor: Colors.red,
            }}
            labelStyle={{
              color: Colors.white,
              fontSize: 20,
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
    backgroundColor: Colors.white,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 10,
  },
  chip_not_selected: {
    backgroundColor: Colors.lightGrey,
    margin: 4,
  },
  chip_selected: {
    backgroundColor: Colors.green,
    margin: 4,
  },
  chip_text_not_selected: {
    color: Colors.black,
    fontSize: 16,
  },
  chip_text_selected: {
    color: Colors.white,
    fontSize: 16,
  },
  button_holder: {
    marginVertical: 10,
  },
});
