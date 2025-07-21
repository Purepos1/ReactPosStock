import { StyleSheet } from "react-native";
import { BLUE, GRAY_LIGHT, WHITE } from "../BL/Colors";

export const  barcodeAddStyles = StyleSheet.create({
  editPart: {
    backgroundColor: "#EFF5F5",
    paddingTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
    marginBottom: 10,
  },
  inputBarcode: {
    flex: 1,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: GRAY_LIGHT,
    backgroundColor: WHITE,
    marginRight: 6,
  },
  button: {
    backgroundColor: BLUE,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  saveRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  saveText: {
    color: "white",
    marginRight: 8,
    fontWeight: "600",
  },
});



