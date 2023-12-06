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
import { BLUE, GRAY, WHITE, WHITE_SMOKE } from "../BL/Colors";

function signOut(props: any) {
  UserDbFunction.Delete();
  props.navigation.navigate("Scanner");
}

export function DrawerContent(props) {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} >
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
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
          marginBottom:14,
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
    backgroundColor:WHITE,
  },
  userInfoSection: {
    paddingLeft: 20,
    
    borderColor:WHITE_SMOKE,
    borderBottomWidth:1,
    shadowColor:WHITE_SMOKE,
    shadowOpacity:10,
   paddingBottom:12
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    backgroundColor:WHITE,
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  circleStyle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#478ac9",
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'center',
  },
});
