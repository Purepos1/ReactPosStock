import { useState } from "react";
import { TextInput, View, StyleSheet, SafeAreaView, Image } from "react-native";

export function StockInsert(props: any) {
    const [barcode, setBarcode] = useState('');
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Image source={require('../assets/images/PosManagerLogo.jpg')} style={styles.image} />
                <TextInput
                    style={styles.input}
                    value={barcode}
                    onChangeText={newText => setBarcode(newText)}
                    onSubmitEditing={newText => {
                        props.submitBarcode(barcode);
                        setBarcode('');
                    }}
                    keyboardType="default"
                    placeholder='Scan Barcode'>
                </TextInput>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        marginVertical: 20,
        alignItems: 'stretch',
        justifyContent: 'center',

    },
    input: {
        height: 50,
        borderColor: '#436BD1',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 20,
    },
    image: {
        height: 40,
        width: '50%',
        resizeMode: 'stretch',

    }

});