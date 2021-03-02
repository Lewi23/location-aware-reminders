import React from "react";
import { useFormikContext } from "formik";
import { Button } from "react-native-paper";
import Colors from "../../utils/colors";

export default function FormButton({ title }) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button
      mode="contained"
      uppercase={false}
      onPress={handleSubmit}
      style={{
        backgroundColor: Colors.green,
      }}
      labelStyle={{
        color: "white",
        fontSize: 20,
      }}
    >
      Add Reminder
    </Button>
  );
}
