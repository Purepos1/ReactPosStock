import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView,Image } from 'react-native';
import { StockDbList } from './components/StockDbList';
import { useState } from 'react';
import { EditStockModal } from './components/EditStockModal';
import { StockInsert } from './components/StockInsert';


export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const hideModal = () => setModalVisible(false);
  const [barcode, setBarcode] = useState("");
  const [qty, setQty] = useState(0);
  const clearBarcode = () => setBarcode("");
  const showModal = (args:string) => {
    setModalVisible(true);
    setBarcode(args);
  }
  return (
    <SafeAreaView style={styles.container}>

      
      {/* <StockInsert submitBarcode={showModal} clearBarcode={clearBarcode}  /> */}
      <StockDbList />
      {modalVisible && <EditStockModal onDoneFunction={hideModal} isvisible={modalVisible} barcode={barcode} 
      onClearBarcode={clearBarcode}  submitQty={setQty}/>}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  
});
