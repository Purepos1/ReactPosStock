import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { StockDbList } from './components/StockDbList';
import { useState } from 'react';
import * as React from 'react';
import { EditStockModal } from './components/EditStockModal';
import { StockInsert } from './components/StockInsert';
import * as NavigationBar from 'expo-navigation-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from './components/Login';
import { AppHeader } from './components/AppHeader';



const Stack = createStackNavigator();

 const HomeScreen= ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const hideModal = () => setModalVisible(false);
  const [barcode, setBarcode] = useState("");
  const [qty, setQty] = useState(0);
  const clearBarcode = () => setBarcode("");
  const showModal = (args: string) => {
    setModalVisible(true);
    setBarcode(args);
  }
  return (
    <SafeAreaView style={styles.container}>
     {/* <AppHeader component={navigation} />
     */}
      {/* <StockInsert submitBarcode={showModal} clearBarcode={clearBarcode}  /> */}
      <StockDbList />
      {modalVisible && <EditStockModal onDoneFunction={hideModal} isvisible={modalVisible} barcode={barcode}
        onClearBarcode={clearBarcode} submitQty={setQty} />}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home Screen" >
        <Stack.Screen name="Home Screen"  component={HomeScreen} options={({navigation})=>({
                    headerTitle: 'Pure Fly',
                    headerRight: () => (
                      <AppHeader component={navigation} />
                    ),
                    headerStyle: { backgroundColor: '#fff', borderBottomColor:'#3b5998', borderBottomWidth:1 },
                    headerTintColor:'#3b5998',
                    headerTitleStyle:{fontFamily:'notoserif', letterSpacing:1}
                  
                    
                })} />
        <Stack.Screen name="Login"  component={Login} options={({navigation})=>(
          {
            headerLeft:()=>null
          }
        )
          
        } />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex:10,
    backgroundColor: '#1f80ba',
    alignItems: 'stretch',
  },

});
