import { View, Image, StyleSheet, Text } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";

export function LoginButton(props:any) {
    return (
        <FontAwesome.Button name="sign-in" backgroundColor="#fd7e14" onPress={() =>
            props.navigation.navigate('Login', { name: 'Jane' })
          }  >
            Login
        </FontAwesome.Button>
    );
}

export function UserName() {
    const [loginName, setLoginName] = useState('');
    return (
        <View style={styles.userName}>
            <FontAwesome name="user" style={{ alignSelf: 'center', }} />
            <Text style={{ fontSize: 16, alignSelf: 'center', marginLeft: 4 }}>Hilmi</Text>
        </View>
    );
}
export function AppHeader(props:any) {
    const [isLogin, setIsLogin] = useState(false);
    return (
        <View style={styles.container}>
            <View style={{ flex: 3 }}>
                <Image source={require('../assets/images/PosManagerLogo.jpg')} style={styles.image} />

            </View>
            <View style={styles.icon}>
                {isLogin == false ? <LoginButton navigation={props.component} /> : <UserName />}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'flex-start'
    },

    image: {
        marginStart: 10,
        height: 50,
        width: 200,
        resizeMode: 'stretch',
        backgroundColor: 'red',
        alignSelf: 'flex-start',
    },

    icon: {
        flex: 1,
        alignSelf: 'flex-start',
        alignContent: 'flex-end',
        marginEnd: 10,
    },

    userName: {
        flexDirection: 'row',
        alignContent: 'flex-end',
        alignSelf: 'flex-end',
        marginEnd: 10,
    }

});