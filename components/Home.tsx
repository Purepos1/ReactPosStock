import { StatusBar } from "expo-status-bar";
import { useSignalEffect } from "@preact/signals-react";
import { SafeAreaView, StyleSheet } from "react-native";
import { BLUE, ORANGE } from "../BL/Colors";
import { isLoggedInReactive } from "../stores/userStore";
import { StockDbList } from "./StockDbList";
import { useComputed } from "@preact/signals-react";

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const loggedIn = useComputed(() => isLoggedInReactive.value);
  console.log("loggedin:" + loggedIn);
  useSignalEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: loggedIn.value ? BLUE : ORANGE,
      },
    });
  });

  return (
    <SafeAreaView style={styles.container}>
      <StockDbList />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 8,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "space-between",
    margin: 10,
  },
});
