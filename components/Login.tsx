import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TextInput } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Keyboard } from "react-native";
import * as SQLite from "expo-sqlite";
import { Alert } from "react-native";
import { ORANGE, ORANGE_DARK } from "../BL/Colors";
import { setUser, clearUser } from "../stores/userStore";

const db = SQLite.openDatabase("db.db");

function add(
  userName: string,
  password: string,
  customerId: number,
  database: string
) {
  // is text empty?
  if (
    userName === null ||
    userName === "" ||
    password === null ||
    password === "" ||
    customerId === null ||
    customerId === 0
  ) {
    return false;
  }

  console.log(userName);
  console.log("!!! delete  user from Login add");

  setUser(userName, password, customerId, database);

  db.transaction(
    (tx) => {
      tx.executeSql("delete from user");
      tx.executeSql(
        "insert into user (userName,password,customerId,database) values (?,?,?,?)",
        [userName, password, customerId, database]
      );
      tx.executeSql("select * from user", [], (_, { rows }) =>
        console.log(JSON.stringify(rows))
      );
    },
    (err) => {
      console.log(err);
    }
  );
}

export function Login(props: any) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [id, setId] = useState("");
  const [userName, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const [hideCam, setHideCam] = useState(false);
  const [database, setDatabase] = useState("");

  useEffect(() => {
    setId("");
    setUserName("");
    setPass("");
    setDatabase("");
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    clearUser();

    db.transaction(
      (tx) => {
        console.log("delete table user !!!");
        tx.executeSql("delete from user");
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    let str = data.toString();
    let splitted = str.split(";");
    setId(splitted[0]);
    setUserName(splitted[1]);
    setPass(splitted[2]);
    setDatabase(splitted[3]);
  };

  if (hasPermission === null) {
    //Requesting for camera permission
    return <Text>Geef toestemming voor de camera</Text>;
  }
  if (hasPermission === false) {
    //No access to camera
    return <Text>Geen toestemming voor camera</Text>;
  }

  const focused = () => {
    setHideCam(true);
  };

  return (
    <View style={styles.container}>
      {/* Use QR code for fastly enterence. */}
      <Text style={styles.text}>Scan QR code vanuit de applicatie.</Text>
      <View
        style={{ flexDirection: "row", alignSelf: "center", marginBottom: 8 }}
      >
        <Text style={styles.modalInfo}>*Open PurePOS BO</Text>
        <FontAwesome
          name="arrow-right"
          style={{ marginHorizontal: 8, marginBottom: 5, alignSelf: "center" }}
        />
        <Text style={styles.modalInfo}>Instellingen</Text>
        <FontAwesome
          name="arrow-right"
          style={{ marginHorizontal: 8, marginBottom: 5, alignSelf: "center" }}
        />
        <Text style={styles.modalInfo}>Scanner instellingen</Text>
      </View>
      {!hideCam && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      )}
      {/* Tap to Scan Again */}
      {scanned && (
        <Button
          title={"Click om te scannen"}
          onPress={() => setScanned(false)}
        />
      )}
      {/* Tap to Open Camera Again   */}
      {hideCam && (
        <Button
          title={"Click om camera te openen"}
          onPress={() => {
            setHideCam(false);
            Keyboard.dismiss();
          }}
        />
      )}

      <View style={styles.inputContainer}>
        <View style={styles.searchSection}>
          <FontAwesome name="key" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Gebruiker portal"
            value={id}
            keyboardType="numeric"
            onChangeText={(newText) => setId(newText)}
            underlineColorAndroid="transparent"
            onFocus={focused}
          />
        </View>

        <View style={styles.searchSection}>
          <FontAwesome name="user" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Gebruikersnaam"
            value={userName}
            onChangeText={(newText) => setUserName(newText)}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.searchSection}>
          <FontAwesome name="lock" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Wachtwoord"
            value={pass}
            secureTextEntry={true}
            onChangeText={(newText) => setPass(newText)}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.searchSection}>
          <FontAwesome name="database" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Database"
            value={database}
            onChangeText={(newText) => setDatabase(newText)}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      <View>
        <FontAwesome.Button
          name="sign-in"
          backgroundColor={ORANGE}
          onPress={() => {
            console.log("login press called");
            add(userName, pass, parseInt(id), database);
            props.navigation.goBack();
          }}
        >
          Login
        </FontAwesome.Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 8,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "space-between",
    margin: 10,
  },

  inputContainer: {
    flex: 4,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "space-between",
  },

  camera: {
    flex: 4,
    alignContent: "stretch",
    justifyContent: "center",
  },

  text: {
    alignSelf: "stretch",
    textAlign: "center",
    alignContent: "space-around",
    justifyContent: "space-around",
    fontSize: 16,
    marginBottom: 8,
  },

  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "#C4D7E0",
    borderBottomWidth: 1,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 0,
    paddingBottom: 10,
    paddingLeft: 0,

    borderColor: "#C4D7E0",
    backgroundColor: "transparent",
    color: "#424242",
  },
  modalInfo: {
    marginBottom: 6,
    textAlign: "center",
    fontSize: 12,
    color: ORANGE_DARK,
  },
});
