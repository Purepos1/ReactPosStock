import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image,Button } from 'react-native';
import { StockDbList } from './components/StockDbList';
import  StockList from './components/StockList';
import { Component, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from './components/Login';
import { AppHeader } from './components/AppHeader';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Setting} from './components/Setting';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {DrawerContent} from './components/DrawerContent'
import {open,deleteTables} from './BL/database'
import Columns from './components/Columns';
import { BLUE } from './BL/Colors';
import LogoTitle from './components/LogoTitle';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
  open();
  return (

    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" drawerContent={props => <DrawerContent{...props}/>}>
      <Drawer.Screen name="Scanner"  component={HomeScreen} options={({navigation})=>({
                    headerTitle:  (props) => <LogoTitle title="Home" isLogin="false" />,
                    headerStyle: { backgroundColor: BLUE, borderBottomColor:BLUE },
                    headerTintColor:'#fff'
                })} />
        
        <Drawer.Screen name="Profile" component={Login} options={({navigation})=>({
                    headerTitle:  (props) => <LogoTitle title="Profile" isLogin="true" />,
                    headerStyle: { backgroundColor: BLUE, borderBottomColor:BLUE },
                    headerTintColor:'#fff'
                })} />
        <Drawer.Screen name="Setting" component={Setting} options={({navigation})=>({
                    headerTitle:  (props) => <LogoTitle title="Settings" isLogin="true" />,
                    headerStyle: { backgroundColor: BLUE, borderBottomColor:BLUE },
                    headerTintColor:'#fff'
                })} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:10,
    backgroundColor: BLUE,
    alignItems: 'stretch',
  },

});
