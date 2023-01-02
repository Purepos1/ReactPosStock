import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image,Button } from 'react-native';
import { StockDbList } from './components/StockDbList';
import { Component, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from './components/Login';
import { AppHeader } from './components/AppHeader';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Setting} from './components/Setting';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {DrawerContent} from './components/DrawerContent'
import {open} from './BL/database'
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


function Screen1({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function Screen2({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

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
  open()
  return (

    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" drawerContent={props => <DrawerContent{...props}/>}>
      <Drawer.Screen name="Scanner"  component={HomeScreen} options={({navigation})=>({
                    headerTitle: 'PureSCAN',
                    headerStyle: { backgroundColor: '#3b5998', borderBottomColor:'#3b5998' },
                    headerTintColor:'#fff',
                    headerTitleStyle:{fontFamily:'notoserif', letterSpacing:1}
                })} />
        
        <Drawer.Screen name="Profile" component={Login} options={({navigation})=>({
                    headerTitle: 'Login',
                    headerStyle: { backgroundColor: '#3b5998', borderBottomColor:'#3b5998' },
                    headerTintColor:'#fff',
                    headerTitleStyle:{fontFamily:'notoserif', letterSpacing:1}
                })} />
        <Drawer.Screen name="Setting" component={Setting} options={({navigation})=>({
                    headerTitle: 'Setting',
                    headerStyle: { backgroundColor: '#3b5998', borderBottomColor:'#3b5998' },
                    headerTintColor:'#fff',
                    headerTitleStyle:{fontFamily:'notoserif', letterSpacing:1}
                })} />
      </Drawer.Navigator>
    </NavigationContainer>
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Home Screen" >
    //     <Stack.Screen name="Home Screen"  component={HomeScreen} options={({navigation})=>({
    //                 headerTitle: 'PureSCAN',
    //                 headerRight: () => (
    //                   <AppHeader component={navigation} />
    //                 ),
    //                 headerStyle: { backgroundColor: '#3b5998', borderBottomColor:'#3b5998', borderBottomWidth:1 },
    //                 headerTintColor:'#fff',
    //                 headerTitleStyle:{fontFamily:'notoserif', letterSpacing:1}
    //             })} />
    //     <Stack.Screen name="Login" component={Login} options={({navigation})=>(
    //       {
    //         headerTitle:'Inloggen',
    //         headerStyle: { backgroundColor: '#3b5998', borderBottomColor:'#3b5998', borderBottomWidth:1 },
    //         headerTintColor:'#fff',
    //         headerTitleStyle:{fontFamily:'notoserif', letterSpacing:1},
    //         headerLeft:()=>null
    //       }
    //     )
          
    //     } />
    //   </Stack.Navigator>
    // </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex:10,
    backgroundColor: '#1f80ba',
    alignItems: 'stretch',
  },

});
