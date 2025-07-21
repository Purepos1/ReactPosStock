import FontAwesome from "@expo/vector-icons/FontAwesome";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GetProductInfo } from "../BL/CloudFunctions";
import { isLoggedIn, userStore } from "../stores/userStore";
import { barcodeAddStyles } from "../styles/BarcodeAddStyles";
import ProductSearchScreen from "./ProductSearchScreen";
import { StockDbList } from "./StockDbList";

type Props = { parentComponent: StockDbList };

const BarcodeAdd = ({ parentComponent }: Props) => {
  const txtBarcodeRef = useRef<TextInput>(null);
  const txtQuantityRef = useRef<TextInput>(null);
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    txtBarcodeRef.current?.focus();
  }, []);

  const clearInputs = () => {
    setBarcode("");
    setQuantity("");
    txtBarcodeRef.current?.focus();
  };

  const handleAddItem = async () => {
    const netState = await NetInfo.fetch();

    if (!isLoggedIn()) {
      Alert.alert("Login", "U moet eerst inloggen");
      return;
    }

    if (netState.isConnected) {
      parentComponent.loadUser(() => {
        GetProductInfo(
          userStore.value.customerId,
          barcode,
          (data: any) => {
            parentComponent.add(
              barcode,
              quantity,
              data.Data.Name,
              data.Data.Price
            );
            clearInputs();
          },
          clearInputs
        );
      });
    } else {
      parentComponent.add(barcode, quantity, "offline gescand", 0);
      clearInputs();
    }
  };

  const handleSubmit = () => {
    if (!barcode) {
      Alert.alert("Fout", "Barcode kan niet leeg zijn!");
      txtBarcodeRef.current?.focus();
      return;
    }
    if (!quantity) {
      Alert.alert("Fout", "Hoeveelheid kan niet leeg zijn!");
      txtQuantityRef.current?.focus();
      return;
    }
    if (Number(quantity) > 1000) {
      Alert.alert(
        "Bevestig",
        "Weet u zeker dat u een grote hoeveelheid wilt toevoegen?",
        [
          { text: "Ja", onPress: handleAddItem },
          { text: "Nee", onPress: () => setQuantity("") },
        ]
      );
    } else {
      handleAddItem();
    }
  };

  const openSearch = async () => {
    if (!isLoggedIn()) {
      Alert.alert("Login", "U moet eerst inloggen");
      return;
    }
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert("Fout", "Zoeken vereist een internetverbinding");
      return;
    }
    setSearchVisible(true);
  };

  return (
    <View style={barcodeAddStyles.editPart}>
      {/* Barcode input row */}
      <View style={barcodeAddStyles.inputRow}>
        <TextInput
          ref={txtBarcodeRef}
          style={barcodeAddStyles.inputBarcode}
          placeholder="Scan Barcode"
          value={barcode}
          onChangeText={setBarcode}
          returnKeyType="next"
          onSubmitEditing={() => txtQuantityRef.current?.focus()}
        />
        <TouchableOpacity onPress={openSearch} style={barcodeAddStyles.button}>
          <FontAwesome name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Quantity input row */}
      <View style={barcodeAddStyles.inputRow}>
        <TextInput
          ref={txtQuantityRef}
          style={barcodeAddStyles.inputBarcode}
          placeholder="Voer aantal in"
          value={quantity}
          keyboardType="numeric"
          onChangeText={setQuantity}
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          style={barcodeAddStyles.button}
        >
          <View style={barcodeAddStyles.saveRow}>
            <FontAwesome name="save" size={24} color="white" />
            <Text style={barcodeAddStyles.saveText}>Opslaan</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={searchVisible}
        animationType="slide"
        onRequestClose={() => setSearchVisible(false)}
      >
        <ProductSearchScreen
        barcode = {barcode}
          parentComponent={parentComponent}
          onClose={(selected) => {
            setSearchVisible(false);
            if (selected) {
              setBarcode(selected.barcode);
              txtQuantityRef.current?.focus();
            }
          }}
        />
      </Modal>
    </View>
  );
};

export default BarcodeAdd;
