import React from "react";
import { View, StyleSheet } from "react-native";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import UserDbFunction from "../BL/UserBL";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconM from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AppHeader } from "./AppHeader";
import { BLUE, GRAY, ORANGE, RED, WHITE, WHITE_SMOKE } from "../BL/Colors";

function signOut(props: any) {
  UserDbFunction.Delete();
  props.navigation.navigate("Scanner");
}

export function DrawerContent(props) {
  return (
    
    <View style={{ flex: 1, backgroundColor:BLUE}}>
      <DrawerContentScrollView  contentContainerStyle={{flex:1}} {...props} >
       
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 25,
                marginBottom:15,
                alignItems: "center",
              }}
            >
              <View style={styles.circleStyle}>
                <Avatar.Image
                  source={{
                    uri: "https://www.posmanager.nl/wp-content/uploads/2021/08/POSManagerzondercirkels-1.jpg",
                  }}
                  size={50}
                  style={{ margin: 2 }}
                />
              </View>
              <View>
                <AppHeader component={props.navigation} />
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate("Scanner");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => {
                props.navigation.navigate("Profile");
              }}
            />

            <DrawerItem
              icon={({ color, size }) => (
                <IconM name="settings" color={color} size={size} />
              )}
              label="Settings"
              onPress={() => {
                props.navigation.navigate("Setting");
              }}
            />
          </Drawer.Section>
       
        </View>
       
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Log out"
          onPress={() => {
            signOut(props);
          }}
        />
      </Drawer.Section>
      <View
        style={{
          alignContent: "center",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:WHITE,
          paddingBottom:14,
          paddingTop:14
        }}
      >
        <Text style={{fontSize:11, color:GRAY}}>© 2023 Pos Manager. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor:ORANGE,
  },
  userInfoSection: {
    paddingLeft: 20,
    borderColor:WHITE_SMOKE,
    borderBottomWidth:1,
    shadowColor:WHITE_SMOKE,
    shadowOpacity:10,
    backgroundColor:BLUE,
   paddingBottom:12
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
    backgroundColor:WHITE,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    backgroundColor:WHITE,
  },

  drawerSection: {
    backgroundColor:WHITE,
    marginBottom:0,
    flex:1
    
  },
  bottomDrawerSection: {
    marginBottom:0,
    borderTopColor: WHITE_SMOKE,
    backgroundColor:WHITE,
    borderTopWidth: 1,
  },

  circleStyle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: WHITE_SMOKE
  },

});
