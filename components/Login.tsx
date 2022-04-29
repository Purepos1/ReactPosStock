import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export function Login(props: any) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [id, setId] = useState('');
    const [userName, setUserName] = useState('');
    const [pass, setPass] = useState('');

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
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

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Use QR code for fastly enterence.</Text>
            {!scanned && <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.camera}
            />}
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}

            <View style={styles.searchSection}>
                <FontAwesome name="key" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="User Portal Id"
                    value={id}
                    onChangeText={(searchString) => { setId({ searchString }) }}
                    underlineColorAndroid="transparent"
                />
            </View>

            <View style={styles.searchSection}>
                <FontAwesome name="user" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="User Name"
                    value={userName}
                    onChangeText={(searchString) => { setUserName({ searchString }) }}
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
                    onChangeText={(searchString) => { setPass({ searchString }) }}
                    underlineColorAndroid="transparent"
                />
            </View>

            <View >
                <FontAwesome.Button name="sign-in" backgroundColor="#fd7e14" onPress={() => {
                    //    navigate('Login', { go_back_key: state.key });
                    props.navigation.goBack();
                }} >
                    Login
                </FontAwesome.Button>
            </View>

            {/* {scanned && <Text style={styles.text}>Your Id: {id}</Text>}
            {scanned && <Text style={styles.text}>User Name: {userName}</Text>}
            {scanned && <Text style={styles.text}>Password: {pass}</Text>} */}
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
        flex: 1,
        alignSelf: 'stretch',
        textAlign: 'center',
        alignContent: 'space-around',
        justifyContent: 'space-around',
        fontSize: 16,
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

});
