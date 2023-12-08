import { View,  StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import * as SQLite from "expo-sqlite";
import UserDbFunction from "../BL/UserBL";

import {
  Title,
  Caption,
} from "react-native-paper";
import { ORANGE, WHITE_SMOKE } from "../BL/Colors";

const db = SQLite.openDatabase("db.db");

export function LoginButton(props: any) {
  return (
    <View
      style={{
        marginLeft: 15,
        marginTop: 7,
        height: 35,
        flexDirection: "column",
      }}
    >
      <FontAwesome.Button
        name="sign-in"
        style={{paddingHorizontal:15}}
        backgroundColor={ORANGE}
        onPress={() => {
          console.log("login press called");
          props.navigation.navigate("Profile");
        }}
      >
      Login
      </FontAwesome.Button>
    </View>
  );
}

export function LogoutButton(props: any) {
  const [loginName, setLoginName] = useState("");
  return (
    <View style={{ marginTop:3, marginLeft: 12, flexDirection: "column" }}>
      <Title style={styles.title}>Hello {props.name}!</Title>
      <Caption style={styles.caption}>{props.database}</Caption>
    </View>
  );
}

export function AppHeader(props: any) {
  const [isLogin, setIsLogin] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [database, setDatabase] = useState("");
  db.transaction(
    (tx) => {

      tx.executeSql("select * from user", [], (_, { rows }) => {
        if (rows._array.length > 0) {
          console.log(rows._array[0]);
          setIsLogin(true);
          setLoginName(rows._array[0].userName);
          setDatabase(rows._array[0].database);
        } else {
          setIsLogin(false);
          setLoginName("");
          setDatabase("");
          console.log("no line");
        }
      });
    },
    (err) => {
      console.log(err);
    }
  );

  return (
    <View>
      {isLogin == false ? (
        <LoginButton navigation={props.component} />
      ) : (
        <LogoutButton
          navigation={props.component}
          name={loginName}
          database={database}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
    color:WHITE_SMOKE,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
});
