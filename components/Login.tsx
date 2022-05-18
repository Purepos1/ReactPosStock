import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Keyboard } from 'react-native'
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("db.db");

function add(userName: string, password: string, customerId: number) {
    // is text empty?
    if (userName === null || userName === "" ||
        password === null || password === "" ||
        customerId === null || customerId === 0) {
        return false;
    }

    console.log(userName);
    console.log('delete  user from Login add');

    db.transaction(
        tx => {
            tx.executeSql("delete from user");
            tx.executeSql("insert into user (userName,password,customerId) values (?, ?,?)", [userName, password, customerId]);
            tx.executeSql("select * from user", [], (_, { rows }) =>
                console.log(JSON.stringify(rows))
            );
        },
        null,
        
    );
}


export function Login(props: any) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [id, setId] = useState('');
    const [userName, setUserName] = useState('');
    const [pass, setPass] = useState('');
    const [hideCam, setHideCam] = useState(false);
    

    useEffect(() => {
        
        setId('');
        setUserName('');
        setPass('');
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        console.log('delete user from useEffect in login')
        db.transaction(tx => {
            console.log('Create table user');
            tx.executeSql(
                "create table if not exists user (id integer primary key not null,userName text, password text,customerId int);"
            );
            tx.executeSql("delete from user");
        },
        err=>{
            console.log(err);
        });

    }, []);



    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);

        let str = data.toString();
        let splitted = str.split(';');
        setId(splitted[0]);
        setUserName(splitted[1]);
        setPass(splitted[2]);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const focused = () => {
        setHideCam(true);

    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Use QR code for fastly enterence.</Text>
            <View style={{flexDirection:'row', alignSelf:'center', marginBottom:8}}>
            <Text style={styles.modalInfo}>*Open PurePOS BO</Text>
            <FontAwesome name='arrow-right' style={{marginHorizontal:8, marginBottom:5, alignSelf:'center'}}/>
            <Text style={styles.modalInfo}>Api</Text>
            <FontAwesome name='arrow-right' style={{marginHorizontal:8, marginBottom:5, alignSelf:'center'}}/>
            <Text style={styles.modalInfo}>Scanner Settings</Text>
            </View>
            {!hideCam && <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.camera}
            />}
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            {hideCam && <Button title={'Tap to Open Cam Again'} onPress={() => {
                setHideCam(false);
                Keyboard.dismiss();
            }} />}

            <View style={styles.searchSection}>
                <FontAwesome name="key" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="User Portal Id"
                    value={id}
                    keyboardType="numeric"
                    onChangeText={newText => setId(newText)}
                    underlineColorAndroid="transparent"
                    onFocus={focused}
                />
            </View>

            <View style={styles.searchSection}>
                <FontAwesome name="user" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="User Name"
                    value={userName}
                    onChangeText={newText => setUserName(newText)}
                    underlineColorAndroid="transparent"
                />
            </View>

            <View style={styles.searchSection}>
                <FontAwesome name="lock" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={pass}
                    secureTextEntry={true}
                    onChangeText={newText => setPass(newText)}
                    underlineColorAndroid="transparent"
                />
            </View>

            <View >
                <FontAwesome.Button name="sign-in" backgroundColor="#fd7e14" onPress={() => {
                    console.log('login press called')
                    add(userName, pass, parseInt(id));
                    // props.route.params.loggedIn(userName);
                    props.navigation.goBack();
                }} >
                    Login
                </FontAwesome.Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'space-between',
        margin: 10,
    },
    camera: {
        flex: 4,
        alignContent: 'stretch',
        justifyContent: 'center'
    },
    text: {
        
        alignSelf: 'stretch',
        textAlign: 'center',
        alignContent: 'space-around',
        justifyContent: 'space-around',
        fontSize: 16,
        marginBottom:8,
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
    modalInfo: {
        marginBottom: 6,
        textAlign: "center",
        fontSize: 12,
        color: "orange"
    },

});
