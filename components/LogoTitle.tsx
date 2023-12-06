import React from "react";
import { View, Text, StyleSheet } from "react-native";
import IconM from "react-native-vector-icons/MaterialIcons";
import { BLACK, BLUE, GRAY, GREEN, ORANGE, WHITE, WHITE_SMOKE } from "../BL/Colors";

const LogoTitle = (props: any) => {
    const color = props.isLogin=="true"?WHITE:ORANGE;
  return (
    <View style={styles.title}>
      <IconM style={{marginRight:5, marginTop:3 }} name="circle" size={2} color={color} />
      <IconM style={{marginRight:5, marginTop:3 }} name="circle" size={4} color={color} />
      <IconM style={{marginRight:5, marginTop:3 }} name="circle" size={6} color={color} />
      <Text style={{color:WHITE, fontSize:20}}>{props.title}</Text>
      <IconM style={{marginLeft:5, marginTop:3 }} name="circle" size={6} color={color} />
      <IconM style={{marginLeft:5, marginTop:3 }} name="circle" size={4} color={color} />
      <IconM style={{marginLeft:5, marginTop:3 }} name="circle" size={2} color={color} />
    </View>
  );
};

export default LogoTitle;

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignContent:'center',
    alignItems:'center',
    justifyContent: 'center',
    flex:1,
    color: WHITE,
  },
});
