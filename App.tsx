import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { StockDbList } from './components/StockDbList';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
      <StockDbList  />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home Screen" >
        <Stack.Screen name="Home Screen"  component={HomeScreen} options={({navigation})=>({
                    headerTitle: 'Pure SCAN',
                    headerRight: () => (
                      <AppHeader component={navigation} />
                    ),
                    headerStyle: { backgroundColor: '#3b5998', borderBottomColor:'#3b5998', borderBottomWidth:1 },
                    headerTintColor:'#fff',
                    headerTitleStyle:{fontFamily:'notoserif', letterSpacing:1}
                })} />
        <Stack.Screen name="Login"  component={Login} options={({navigation})=>(
          {
            headerStyle: { backgroundColor: '#3b5998', borderBottomColor:'#3b5998', borderBottomWidth:1 },
            headerTintColor:'#fff',
            headerTitleStyle:{fontFamily:'notoserif', letterSpacing:1},
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
