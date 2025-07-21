import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";
import { GetProductSearch } from "../BL/CloudFunctions";
import { StockDbList } from "./StockDbList";
import { BackHandler } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BLUE, GRAY, WHITE } from "../BL/Colors";

type Props = {
  parentComponent: StockDbList;
  onClose: (selectedProduct: Product | null) => void;
  barcode: string;
};

const ProductSearchScreen = ({ parentComponent, onClose, barcode }: Props) => {
  const [searchQuery, setSearchQuery] = useState(barcode || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const searchInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert("Problem", "Voer een zoekterm in");
      return;
    }

    GetProductSearch(
      searchQuery.trim(),
      (result: ProductSearchResultDto[]) => {
        const products: Product[] = result.map((item) => ({
          id: item.ProductBarcodeId,
          barcode: item.Barcode,
          name: item.LongName,
          description: item.LongName,
        }));

        setProducts(products);

        setSelectedProduct(null);
      },
      () => {
        setProducts([]);
        setSelectedProduct(null);
      }
    );

    Keyboard.dismiss(); // hide keyboard
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true }); // scroll to top
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleConfirmSelection = () => {
    if (!selectedProduct) {
      Alert.alert("Problem", "Selecteer eerst een product");
      return;
    }

    onClose(selectedProduct);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();

      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 300); // 300ms delay helps avoid transition issues

    const backAction = () => {
      onClose(null);
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    () => clearTimeout(timer);
    return () => subscription.remove();
  }, [onClose]);

  return (
    <View style={styles.container}>
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Zoeken op naam of barcode..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
            }}
          >
            <FontAwesome name="search" size={24} color="white" />
            <Text style={[styles.searchButtonText, { marginLeft: 8 }]}>
              Zoeken
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Results Section */}
      {products.length > 0 ? (
        <>
          <View style={styles.resultsHeader}>
            <Text style={[styles.headerText, { flex: 1 }]}>Barcode</Text>
            <Text style={[styles.headerText, { flex: 2 }]}>Name</Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.productItem,
                  selectedProduct?.id === item.id && styles.selectedProduct,
                ]}
                onPress={() => handleSelectProduct(item)}
              >
                <Text style={[styles.productText, { flex: 1 }]}>
                  {item.barcode}
                </Text>
                <Text style={[styles.productText, { flex: 2 }]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Geen producten gevonden. Probeer een andere zoekopdracht.
          </Text>
        </View>
      )}

      {/* Confirm Button */}
      <TouchableOpacity
        style={[
          styles.confirmButton,
          !selectedProduct && styles.disabledButton,
        ]}
        onPress={handleConfirmSelection}
        disabled={!selectedProduct}
      >
        <Text style={styles.confirmButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: WHITE,
    marginRight: 8,
  },
  searchButton: {
    height: 50,
    backgroundColor: BLUE,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  searchButtonText: {
    color: WHITE,
    fontWeight: "bold",
  },
  resultsHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 8,
    backgroundColor: "#e9e9e9",
    paddingHorizontal: 8,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  productItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
  },
  selectedProduct: {
    backgroundColor: "#e3f2fd",
  },
  productText: {
    fontSize: 14,
    paddingHorizontal: 4,
    color: "#333",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  confirmButton: {
    height: 50,
    backgroundColor: "#28a745",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProductSearchScreen;
