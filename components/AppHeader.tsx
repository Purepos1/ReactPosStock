import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("db.db");

export function LoginButton(props: any) {
    return (

        <FontAwesome size={22} name="user" color="#fff" onPress={() =>
            props.navigation.navigate('Login', { loggedIn: props.loggedIn }, true)
        }  >

        </FontAwesome>
    );
}

export function LogoutButton(props: any) {
    const [loginName, setLoginName] = useState('');
    return (
        <View  >
            <FontAwesome name="sign-out" size={17} numberOfLines={1}  color="#fff" onPress={() =>
                props.navigation.navigate('Login', { loggedIn: props.loggedIn }, true)
            }>
                <Text> {props.name}</Text>
            </FontAwesome>
        </View>
    );
}

export function UserName() {
    return (

        <FontAwesome name="user" size={22} color="#fff" style={{ alignSelf: 'center', }} >

            <Text style={{ fontSize: 16, alignSelf: 'center', marginLeft: 4 }}>Hilmi</Text>
        </FontAwesome>

    );
}
export function AppHeader(props: any) {
    const [isLogin, setIsLogin] = useState(false);
    const [loginName, setLoginName] = useState('');
    const onLoggedIn = (name: string) => {
        setIsLogin(true);
        setLoginName(name)
    }

    db.transaction(
        tx => {
            tx.executeSql("select * from user", [], (_, { rows }) => {

                if (rows._array.length > 0) {
                    console.log(JSON.stringify(rows));
                    console.log(rows._array[0].id);
                    setIsLogin(true);
                    setLoginName(rows._array[0].userName);
                }
            });
        },
        null,

    );


    return (

        <View style={styles.icon}>
            {isLogin == false ? <LoginButton navigation={props.component} loggedIn={onLoggedIn} /> :
                <LogoutButton navigation={props.component} loggedIn={onLoggedIn} name={loginName} />}
        </View>
    );
}

const styles = StyleSheet.create({


    image: {
        marginStart: 10,
        height: 50,
        width: 200,
        resizeMode: 'stretch',
        backgroundColor: 'red',
        alignSelf: 'flex-start',
    },

    icon: {
        marginEnd: 10,
        width:100,
        alignItems:'flex-end'
    },

    userName: {
        flexDirection: 'row',
        alignContent: 'flex-end',
        alignSelf: 'flex-end',
        marginEnd: 10,
    }

});