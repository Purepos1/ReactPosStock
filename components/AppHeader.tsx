import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { GRAY_LIGHT, ORANGE, WHITE_SMOKE } from "../BL/Colors";
import { UserModel } from "../Models/UserModel";
import { getDatabase } from "../Utils/dbService";
import { clearUser, isLoggedIn, setUser, userStore } from "../stores/userStore";

export function LoginButton(props: any) {
  return (
    <View style={styles.loginLogout}>
      <FontAwesome.Button
        name="sign-in"
        style={{ paddingHorizontal: 15 }}
        backgroundColor={ORANGE}
        size={24}
        onPress={() => {
          console.log("login press called");
          props.navigation.navigate("Profile");
        }}
      >
        Inloggen
      </FontAwesome.Button>
    </View>
  );
}

export function LogoutButton(props: any) {
  const [loginName, setLoginName] = useState("");
  return (
    <View style={styles.loginLogout}>
      <Text variant="titleMedium" style={{ color: WHITE_SMOKE }}>
        Hallo {props.name}!
      </Text>
      <Text variant="labelMedium" style={{ color: GRAY_LIGHT }}>
        {props.database}
      </Text>
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
      {isLoggedIn() == false ? (
        <LoginButton navigation={props.component} />
      ) : (
        <LogoutButton
          navigation={props.component}
          name={userStore.value.userName}
          database={userStore.value.database}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loginLogout: {
    flexDirection: "column",
    marginLeft: 15,
  },
});
