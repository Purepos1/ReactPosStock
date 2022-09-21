import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Touchable,
    Image,
    Button,
    ToastAndroid
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from "axios";
import { format } from 'react-string-format';
import { Alert } from "react-native";
import { SyncModal } from "./SyncModal";
import TabbedBarcodeEnterance from "./TabbedBarcodeEnterance";
import { Items } from "./Items";

const db = SQLite.openDatabase("db.db");

type ItemListType={
    clearInput:any,
}

export type ItemListProps = ItemListType;



export function ItemList(props: ItemListProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [refNumber, setRefNumber] = useState('');
    const [customerId, setCustomerId] = useState(0);

    // state = {
    //     barcode: '',
    //     quantity: '',
    //     onSubmit: null,
    //     customerId: 0,
    //     modalVisible: false,
    //     refNumber: ''
    // };

    const hideModal = () => { setModalVisible(false); };

    const startSync = (ref: string) => {

        if (ref == '') {
            alert("Please enter reference number");
        } else {
            setModalVisible(false);
            setRefNumber(ref);
            console.log(ref); //delete later
            syncData();
            props.clearInput(); //assign function to trigger
            // this.input1Focus.setFocus(); // call this above function inside
        }
    };

    const syncData = () => {

        loadUser(() => {
            if (customerId == 0) {
                alert('You need to login before send data');
                return;
            }

            db.transaction(
                tx => {
                    tx.executeSql("select * from items", [], (_, { rows }) => {
                        for (let i = 0; i < rows._array.length; i++) {
                            let itm = rows._array[i];
                            pushData(itm, synced);
                        }
                    });
                },
                (err) => {
                    console.log(err);
                },
            );
        });

    }

    const loadUser =( callback: any)=> {
        if (customerId != 0) return;

        console.log("Load user Called from stockdblist");
        db.transaction(
            tx => {
                tx.executeSql("select * from user", [], (_, { rows }) => {

                    if (rows._array.length > 0) {
                        console.log(JSON.stringify(rows)); // delete later
                        setCustomerId(rows._array[0].customerId);
                    } else {
                        setCustomerId(0);
                    }
                });
            },
            null,
            callback,
        )
    };


    const pushData = (data: any, synced: any) => {
        const url = format("https://cloud.posmanager.nl/web20/hook/AddStock?customerid={3}&barcode={0}&quantity={1}&referenceNo={2}",
            data.barcode, data.quantity, refNumber, customerId);
        axios.get(url)
            .then(function (response) {
                console.log(response);

                db.transaction(
                    tx => {
                        tx.executeSql(`delete from items where id = ?;`, [data.id]);
                    },
                    null,
                    synced
                )

            })
            .catch(function (error) {
                console.log("PushData error :" + error.response.data);
            });
    }


    const synced = () => {
        update();
        ToastAndroid.show('Data(s) are send to PurePOS system.', ToastAndroid.LONG);

    }

    const update = () => {
        x && x.update();
    };

   
    return (

        
        <View>
            <ScrollView style={styles.listArea}>
                <Items
                    ref={x => (x = x)}
                />

            </ScrollView>

            {modalVisible && <SyncModal onDoneFunction={startSync} onCancel={hideModal} isvisible={modalVisible} />}

            <View style={{ borderRadius: 0 }} >
                <FontAwesome.Button borderRadius={0} style={{ alignSelf: 'center' }} name="cloud-upload" backgroundColor="#4D77FF" onPress={() => {
                    setModalVisible(false);
                }} >
                    Sync Data
                </FontAwesome.Button>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 9,
    },
    editPart: {
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: 'gray',
        padding: 5,
        paddingBottom: 10,
    },

    buttonAdd: {
        margin: 10,
        height: 50,
    },

    heading: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    flexRow: {
        flexDirection: "column",


    },
    input: {
        borderColor: "#3b5998",
        borderRadius: 4,
        borderWidth: 1,
        height: 40,
        margin: 12,
        padding: 8
    },
    listArea: {
        backgroundColor: "white",
        flex: 1,
        paddingTop: 16,
        marginTop: 16,
    },
    sectionContainer: {
        marginBottom: 16,
        marginHorizontal: 6
    },
    sectionHeading: {
        fontSize: 18,
        marginBottom: 8
    },
    image: {
        marginVertical: 16,
        height: 40,
        width: '50%',
        resizeMode: 'stretch',

    },
    itemContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'stretch',
    }
});