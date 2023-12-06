import {
  Alert,
  View,
  Text,
  Switch,
  StyleSheet,
  Settings,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import IconM from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, IconButton, TouchableRipple } from "react-native-paper";
import { deleteTables } from "../BL/database";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BLUE_CLOUD, RED, WHITE } from "../BL/Colors";

const storeKey = "@hideKeyboard_Key";

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem(storeKey, value);
  } catch (e) {
    // saving error
  }
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem(storeKey);
    if (value !== null) {
      // value previously stored
      console.log("get data");
      console.log(value);
      return value;
    }
  } catch (e) {
    // error reading value
    console.log(e);
  }
};

export function Setting(props: any) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    // setIsEnabled((previousState) => !previousState);
    setHideKeyboard((previousState) => !previousState);
    console.log(hideKeyboard);
    storeData(String(hideKeyboard));
    console.log(hideKeyboard);
  };

  const [hideKeyboard, setHideKeyboard] = useState(
    String(getData()) === "true"
  );

  return (
    <View style={styles.container}>
      <View style={styles.node}>
        <IconM
          name="keyboard"
          size={24}
          style={{ textAlignVertical: "center" }}
        />
        <Text style={{ flex: 1, textAlignVertical: "center", marginStart: 15 }}>
          Hide Barcode Keyborad
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: BLUE_CLOUD }}
          thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={!hideKeyboard}
        />
      </View>
      <View style={styles.nodeAlt}>
        <IconM
          name="delete"
          size={24}
          style={{ textAlignVertical: "center" }}
        />
        <Text style={{ flex: 1, textAlignVertical: "center", marginStart: 15 }}>
          Delete Cache (with long press)
        </Text>
        <View>
          <TouchableOpacity
            onLongPress={() => {
              deleteTables();
              ToastAndroid.show("Cache date cleared.", ToastAndroid.LONG);
              props.navigation.navigate("Profile");
            }}
          >
            <Button mode="outlined"  textColor="#fff" style={styles.buttonStyle}>
              Delete
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: "column",
    backgroundColor: "#fff",
  },

  node: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#DEE1EC",
  },
  nodeAlt: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: WHITE,
  },

  buttonStyle: {
    backgroundColor: RED,
    borderColor:WHITE,
     // text color
    cursor: "pointer",
  },
});
