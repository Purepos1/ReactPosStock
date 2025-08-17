import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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
import iconDisconnected from "../assets/images/plug-disconnected-24-white.png";
import { connectionStatus } from "../stores/connectionStore";
import { useSignals } from "@preact/signals-react/runtime";

const LogoTitle = (props: any) => {
  useSignals();

  const color = props.isLogin == "true" ? WHITE : ORANGE;

  return (
    <View style={styles.titleContainer}>
      <Text style={{ color: WHITE, fontSize: 20 }}>{props.title}</Text>

      <View style={{ marginLeft: "auto" }}>
        {connectionStatus.value.isConnected === null ? (
          <Text style={{ color: "#FFFFFF" }}>...</Text>
        ) : connectionStatus.value.isConnected ? (
          <Text style={{ color: "#FFFFFF" }}></Text>
        ) : (
          <Image source={iconDisconnected} style={{ width: 32, height: 32 }} />
        )}
      </View>
    </View>
  );
};

export default LogoTitle;

const styles = StyleSheet.create({
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
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
