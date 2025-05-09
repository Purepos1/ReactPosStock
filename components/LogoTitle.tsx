import React from "react";
import { View, Text, StyleSheet } from "react-native";
import IconM from "react-native-vector-icons/MaterialIcons";
import {
  BLACK,
  BLUE,
  GRAY,
  GREEN,
  ORANGE,
  WHITE,
  WHITE_SMOKE,
} from "../BL/Colors";
import { connectionStatus } from "../stores/connectionStore";
import { useSignals } from "@preact/signals-react/runtime";

const LogoTitle = (props: any) => {
  useSignals();

  const color = props.isLogin == "true" ? WHITE : ORANGE;

  return (
    <View style={styles.titleContainer}>
      <View style={styles.title}>
        <IconM
          style={{ marginRight: 5, marginTop: 3 }}
          name="circle"
          size={2}
          color={color}
        />
        <IconM
          style={{ marginRight: 5, marginTop: 3 }}
          name="circle"
          size={4}
          color={color}
        />
        <IconM
          style={{ marginRight: 5, marginTop: 3 }}
          name="circle"
          size={6}
          color={color}
        />
        <Text style={{ color: WHITE, fontSize: 20 }}>{props.title}</Text>
        <IconM
          style={{ marginLeft: 5, marginTop: 3 }}
          name="circle"
          size={6}
          color={color}
        />
        <IconM
          style={{ marginLeft: 5, marginTop: 3 }}
          name="circle"
          size={4}
          color={color}
        />
        <IconM
          style={{ marginLeft: 5, marginTop: 3 }}
          name="circle"
          size={2}
          color={color}
        />
      </View>
      <Text
        style={{
          alignItems: "flex-end",
          color: connectionStatus.value.isConnected ? "#4CAF50" : "#F44336",
        }}
      >
        {connectionStatus.value.isConnected === null
          ? "..."
          : connectionStatus.value.isConnected
          ? "" //`(${connectionStatus.value.type}) 🟢`
          : "●ex"}
      </Text>
    </View>
  );
};

export default LogoTitle;

const styles = StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    color: WHITE,
  },
  title: {
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    color: WHITE,
  },
});
