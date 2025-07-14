import { View, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { setUser, clearUser } from "../stores/userStore";

import { Title, Caption } from "react-native-paper";
import { ORANGE, WHITE_SMOKE } from "../BL/Colors";
import { UserModel } from "../Models/UserModel";
import { getDatabase } from "../Utils/dbService";

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
        style={{ paddingHorizontal: 15 }}
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
    <View style={{ marginTop: 3, marginLeft: 12, flexDirection: "column" }}>
      <Title style={styles.title}>Hello {props.name}!</Title>
      <Caption style={styles.caption}>{props.database}</Caption>
    </View>
  );
}

export function AppHeader(props: any) {
  const [isLogin, setIsLogin] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [database, setDatabase] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const db = await getDatabase();

        await loadUserData(db);
      } catch (err) {
        console.error("Database initialization error:", err);
      }
    }

    loadData();
  }, []);

  async function loadUserData(db: SQLite.SQLiteDatabase) {
    try {
      const results = await db.getAllAsync<UserModel>("SELECT * FROM user;");

      console.log("user info", results);
      if (results.length > 0) {
        const { userName, password, customerId, database: dbName } = results[0];
        setUser(userName, password, customerId, dbName);
        setIsLogin(true);
        setLoginName(userName);
        setDatabase(dbName);
      } else {
        clearUser();
        setIsLogin(false);
        setLoginName("");
        setDatabase("");
        console.log("AppHeader: load user no line");
      }
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  }

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
    color: WHITE_SMOKE,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
});
