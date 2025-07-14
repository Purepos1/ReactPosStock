import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { GetProductSearch } from "../BL/CloudFunctions";
import { StockDbList } from "./StockDbList";
import { BackHandler } from "react-native";

type Props = {
  parentComponent: StockDbList;
  onClose: (selectedProduct: Product | null) => void;
};

const ProductSearchScreen = ({ parentComponent, onClose }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const searchInputRef = useRef<TextInput>(null);

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
    const backAction = () => {
      onClose(null);
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
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
          autoFocus
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Zoeken</Text>
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
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
    marginRight: 8,
  },
  searchButton: {
    width: 80,
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
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
