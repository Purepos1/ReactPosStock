import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { BLUE } from "../BL/Colors";
import { GetProductInfo } from "../BL/CloudFunctions";

const BarcodeAdd = ({ parentComponent }: any) => {
  const txtBarcodeRef = useRef(null);
  const txtQuantityRef = useRef(null);
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("");

  const submitItem = () => {
    if (barcode == undefined || barcode == "") {
      //Quantity cannot be empty!
      Alert.alert("Problem", "Barcode kan niet leeg zijn!");
      txtBarcodeRef.current.focus();
      return;
    }
    if (quantity == undefined || quantity == "") {
      //Quantity cannot be empty!
      Alert.alert("Problem", "Hoeveelheid kan niet leeg zijn!");
      txtQuantityRef.current.focus();
      return;
    }

    if (Number(quantity) > 1000) {
      Alert.alert(
        "Weet je het zeker?",
        "Weet u zeker dat u een grote hoeveelheid wilt toevoegen?",
        [
          // The "Yes" button
          {
            text: "Ja",
            onPress: () => {
              addItem();
            },
          },
          // The "No" button
          // Does nothing but dismiss the dialog when tapped
          {
            text: "Nee",
            onPress: () => {
              txtBarcodeRef.current.focus();
              setQuantity("");
            },
          },
        ]
      );
    } else {
      addItem();
    }
  };

  const added = (data: any) => {
    parentComponent.add(barcode, quantity, data.Data.Name, data.Data.Price);
    txtBarcodeRef.current.focus();
    setBarcode("");
    setQuantity("");
  };

  const clearBarcode = () => {
    txtBarcodeRef.current.focus();
    setBarcode("");
  };

  const addItem = () => {
    parentComponent.loadUser(() => {
      console.log("loadUser callback");
      if (
        parentComponent.state.customerId == undefined ||
        parentComponent.state.customerId == 0
      ) {
        Alert.alert("Login", "U moet eerst inloggen");
        return;
      }

      GetProductInfo(
        parentComponent.state.customerId,
        barcode,
        added,
        clearBarcode
      );
    });
  };

  useEffect(() => {
    if (txtBarcodeRef.current) txtBarcodeRef.current.focus();
  }, []);

  return (
    <View style={styles.editPart}>
      <View style={styles.flexRow}>
        <TextInput
          onChangeText={(text) => setBarcode(text)}
          placeholder="Scan Barcode"
          style={styles.input}
          value={barcode}
          autoFocus={true}
          ref={txtBarcodeRef}
          returnKeyType="next"
          selectionColor={"#3b5998"}
          onSubmitEditing={() => txtQuantityRef.current.focus()}
        />

        <View style={{ flexDirection: "row", justifyContent:'center', alignItems:'center', paddingBottom:10 }}>
          <TextInput
            onChangeText={(qty) => setQuantity(qty)}
            placeholder="Voer aantal in"
            style={styles.inputBarcode}
            keyboardType="numeric"
            value={quantity}
            ref={txtQuantityRef}
            selectionColor={BLUE}
            onSubmitEditing={() => submitItem()}
          />
          <View style={styles.buttonAdd}>
            <FontAwesome.Button
              name="long-arrow-right"
              backgroundColor={BLUE}
              onPress={() => submitItem()}
            >
              Opslaan
            </FontAwesome.Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BarcodeAdd;

const styles = StyleSheet.create({
  editPart: {
    backgroundColor: "#EFF5F5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "gray",
    padding: 0,
    paddingTop: 5,
    paddingBottom: 0,
  },

  flexRow: {
    flexDirection: "column",
  },
  input: {
    borderColor: "#C4D7E0",
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    margin: 6,
    padding: 10,
   
  },

  inputBarcode: {
    borderColor: "#C4D7E0",
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    margin: 6,
    padding: 10,
    flex:2,
    alignItems:'center'
  },

  buttonAdd: {
    alignItems:'center',
    marginEnd:6,
  },
});
