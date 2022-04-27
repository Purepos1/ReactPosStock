import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, Button, } from "react-native";
import { FontAwesome } from '@expo/vector-icons';


type ModalItem = {
    isvisible: boolean,
    onDoneFunction: any,
    barcode: string,
    onClearBarcode: any
    submitQty:any
}

export type ModalItemProps = ModalItem;


export function EditStockModal(props: ModalItemProps) {
    const [qty, setQty] = useState('');
    function onDone() {
        props.onDoneFunction();
        props.onClearBarcode();
        props.submitQty(qty);
    }


    return (

        <View style={styles.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={props.isvisible}
                onRequestClose={() => {

                    Alert.alert("Modal has been closed.");
                    props.onDoneFunction
                }}
            >
                <View style={styles.centeredView}>

                    <View style={styles.modalView}>

                        <Pressable
                            onPress={onDone}
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.5 : 1,
                                alignSelf: 'flex-end',
                            })}>
                            <FontAwesome
                                name="close"
                                size={25}

                                style={{
                                    marginRight: 7,
                                    marginTop: 1,
                                }}
                            />
                        </Pressable>

                        <View style={styles.contentView}>

                            <Text style={styles.modalText}>Enter Quantity for: {props.barcode}</Text>
                            <TextInput
                                keyboardType="numeric"
                                value={qty}
                                onChangeText={newText => setQty(newText)}
                                style={styles.input}
                                autoFocus={true}
                            />
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={onDone}
                            >
                                <Text style={styles.textStyle}>Add Quantity</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
    closableArea: {

    },
    modalView: {
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    contentView: {
        paddingTop: 5,
        paddingHorizontal: 40,
        paddingBottom: 30,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        marginTop: 20,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 10,
        textAlign: "center"
    },
    input: {
        height: 40,
        margin: 15,
        borderColor: '#436BD1',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        justifyContent: 'center',
        width: 140,
        alignItems: 'stretch',
        alignSelf: 'center',
    },
});

