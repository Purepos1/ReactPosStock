import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { BLUE } from "../BL/Colors";
import { GetProductInfo } from "../BL/CloudFunctions";
import { StockDbList } from "./StockDbList";
import ProductSearchScreen from "./ProductSearchScreen";
import { Modal } from "react-native";
import { isLoggedIn, userStore } from "../stores/userStore";
import NetInfo from "@react-native-community/netinfo";

type Props = {
  parentComponent: StockDbList;
};

const BarcodeAdd = ({ parentComponent }: Props) => {
  const txtBarcodeRef = useRef<TextInput>(null);
  const txtQuantityRef = useRef<TextInput>(null);
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productSearchModalVisible, setProductSearchModalVisible] =
    useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Not checked yet");

  const submitItem = () => {
    if (barcode == undefined || barcode == "") {
      //Quantity cannot be empty!
      Alert.alert("Problem", "Barcode kan niet leeg zijn!");
      txtBarcodeRef.current?.focus();
      return;
    }
    if (quantity == undefined || quantity == "") {
      //Quantity cannot be empty!
      Alert.alert("Problem", "Hoeveelheid kan niet leeg zijn!");
      txtQuantityRef.current?.focus();
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
              txtBarcodeRef.current?.focus();
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
    txtBarcodeRef.current?.focus();
    setBarcode("");
    setQuantity("");
  };

  const clearBarcode = () => {
    txtBarcodeRef.current?.focus();
    setBarcode("");
  };

  const addItem = async () => {
    const state = await NetInfo.fetch();

    if (state.isConnected) {
      parentComponent.loadUser(() => {
        if (!isLoggedIn()) {
          Alert.alert("Login", "U moet eerst inloggen");
          return;
        }

        console.log(
          "BarcodeAdd.addItem - ",
          userStore.value.customerId,
          barcode,
          added,
          clearBarcode
        );

        GetProductInfo(
          userStore.value.customerId,
          barcode,
          added,
          clearBarcode
        );
      });
    } else {
      //offline scan
      added({ Data: { Name: "offline gescand", Price: Number(0) } });
    }
  };

  useEffect(() => {
    if (txtBarcodeRef.current) txtBarcodeRef.current.focus();
  }, []);

  return (
    <View style={styles.editPart}>
      <View style={styles.flexRow}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 10,
            paddingRight: 5,
          }}
        >
          <TextInput
            onChangeText={(text) => setBarcode(text)}
            placeholder="Scan Barcode"
            style={styles.inputBarcode}
            value={barcode}
            autoFocus={true}
            ref={txtBarcodeRef}
            returnKeyType="next"
            selectionColor={"#3b5998"}
            onSubmitEditing={() => txtQuantityRef.current?.focus()}
          />
          <TouchableOpacity
            onPress={async () => {
              if (!isLoggedIn()) {
                Alert.alert("Login", "U moet eerst inloggen");
                return;
              }

              const state = await NetInfo.fetch();

              if (!state.isConnected) {
                Alert.alert(
                  "Problem",
                  "Deze bewerking werkt alleen terwijl u online bent"
                );
                return;
              }

              setProductSearchModalVisible(true);
            }}
            style={{
              backgroundColor: BLUE,
              padding: 10,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name="filter" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 10,
            paddingRight: 5,
          }}
        >
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
          <TouchableOpacity
            onPress={() => submitItem()}
            style={{
              backgroundColor: BLUE,
              padding: 10,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name="long-arrow-right" size={24} color="white">
              {" "}
              Opslaan
            </FontAwesome>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={productSearchModalVisible}
        animationType="slide"
        onRequestClose={() => setProductSearchModalVisible(false)}
      >
        <ProductSearchScreen
          parentComponent={parentComponent}
          onClose={(selectedProduct: Product | null) => {
            setProductSearchModalVisible(false);

            if (selectedProduct) {
              setBarcode(selectedProduct.barcode);
            }
          }}
        />
      </Modal>
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
    height: 44,
    margin: 6,
    padding: 10,
  },

  inputBarcode: {
    borderColor: "#C4D7E0",
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    height: 44,
    margin: 6,
    padding: 10,
    flex: 2,
    alignItems: "center",
  },

  buttonAdd: {
    alignItems: "center",
    marginEnd: 6,
  },
});
