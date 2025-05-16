import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export function SyncModal(props: any) {
  const [refNum, setRefNum] = useState("");

  function onDone() {
    props.onDoneFunction(refNum);
  }

  function onCancel() {
    props.onCancel();
  }

  return (
    <View style={styles.centeredView}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              alignSelf: "flex-end",
            })}
          >
            <FontAwesome
              name="close"
              size={25}
              style={{
                marginRight: 7,
                marginTop: 1,
              }}
            />
          </Pressable>

          <View style={styles.contentView}>
            {/* Enter Reference Number */}
            <Text style={styles.modalText}>Geef uw referentie in!</Text>
            {/* *Srq No, Stock Form No, etc. */}
            <Text style={styles.modalInfo}>
              Bijv. welk schap, of order voor..
            </Text>

            {/* Ex: Andre's Scaninig, Shelf-1 etc. */}
            <Text style={styles.modalInfo}>
              Voorbeeld Andre's Scaninig, Schap-1.
            </Text>
            <TextInput
              style={styles.input}
              autoFocus={true}
              onChangeText={(ref) => setRefNum(ref)}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onDone}
            >
              {/* Start Sync */}
              <Text style={styles.textStyle}>Start Sync</Text>
            </Pressable>
            <Text style={styles.totalInfo}>
              verzonden / resterend: {"\n"}
              {props.succeededCount} / {props.totalCount}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closableArea: {},
  modalView: {
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  contentView: {
    paddingTop: 5,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
  },
  modalInfo: {
    marginBottom: 6,
    textAlign: "center",
    fontSize: 12,
    color: "orange",
  },
  totalInfo: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    color: "blue",
  },
  input: {
    height: 40,
    margin: 15,
    borderColor: "#436BD1",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    justifyContent: "center",

    alignItems: "stretch",
    alignSelf: "stretch",
  },
});
