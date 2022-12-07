import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
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
import { Keyboard } from 'react-native'

const db = SQLite.openDatabase("db.db");

class Items extends React.Component {
    state = {
        items: null
    };

    componentDidMount() {
        this.update();
    }

    render() {
        const { synced: doneHeading } = this.props;
        const { items } = this.state;
        const heading = doneHeading ? "Completed" : "Todo";

        if (items === null || items.length === 0) {
            return null;
        }

        return (
            <View style={styles.sectionContainer}>
                {items.map(({ id, barcode, quantity, synced }) => (
                    <TouchableOpacity
                        key={id}
                        onLongPress={() => this.props.onPressItem && this.props.onPressItem(id)}
                        style={{
                            borderColor: "lightgray",
                            borderBottomWidth: 1,
                            padding: 8
                        }}
                    >
                        <View style={styles.itemContainer}>
                        <Text style={{ minWidth:25, fontWeight:"bold" }}>{id}</Text>
                        <Text style={{marginEnd:10}}>-</Text>
                            <Text style={{ flex: 3 }}>{barcode}</Text>
                            <Text style={{ alignItems: 'flex-end', flex: 1, textAlign: 'right' }}>{quantity}</Text>
                        </View>

                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    update() {
        db.transaction(tx => {
            tx.executeSql(
                `select * from items order by id desc;`,
                [],
                (_, { rows: { _array } }) => this.setState({ items: _array })
            );
        });
    }
}

const utilizeFocus = () => {
    const ref = React.createRef()
    const setFocus = () => { ref.current && ref.current.focus() }

    return { setFocus, ref }
}

export class StockDbList extends React.Component {
    state = {
        barcode: '',
        quantity: '',
        onSubmit: null,
        customerId: 0,
        modalVisible: false,
        refNumber: '',
        input2Focus:null
    };

    hideModal = () => { this.setState({ modalVisible: false }) };

    startSync = (ref: string) => {

        if (ref == '') {
            Alert.alert("Informatie","Geef hier uw referentie in");
        } else {
            this.setState({ modalVisible: false });
            this.setState({ refNumber: ref });
            console.log(ref);
            this.syncData(this.state.customerId);
            this.input1Focus.setFocus();
            this.setState({ barcode: '', quantity: '' });
        }
    };

    constructor(props: any) {
        super(props);
        this.input1Focus = utilizeFocus();
        this.input2Focus = utilizeFocus();
        console.log('ctor');
    }

    componentDidMount() {
        db.transaction(tx => {
            tx.executeSql(
                "create table if not exists items (id integer primary key not null,barcode text, quantity int, synced int);"
            );
        });
        this.input2Focus.setFocus();
        this.input1Focus.setFocus();
        this.loadUser(false);
        console.log('useEffect of StockDbList');
        
    }

    


    submitItem() {
        this.add(this.state.barcode, this.state.quantity);
        // this.pushData(this.state.barcode, this.state.quantity);
        this.input1Focus.setFocus();
        this.setState({ barcode: '', quantity: '' });
    }

    async loadUser(loadAlways: boolean, callback: any) {
        if (loadAlways == false && this.state.customerId != 0) return;

        console.log("Load user Called from stockdblist");
        await db.transaction(
            tx => {
                tx.executeSql("select * from user", [], (_, { rows }) => {

                    if (rows._array.length > 0) {
                        console.log(JSON.stringify(rows));
                        console.log(rows._array[0].id);
                        console.log(rows._array[0].customerId);
                        this.setState({ customerId: rows._array[0].customerId });
                    } else {
                        this.setState({ customerId: 0 });
                    }
                });
            },
            null,
            callback,

        )
    };

    

    render() {

  

        return (
            <View style={styles.container}>

                {/* <TabbedBarcodeEnterance/> */}
                <View style={styles.editPart}>
                    <View style={styles.flexRow}>
                        <TextInput
                            onChangeText={text => this.setState({ barcode: text })}
                            placeholder="Scan Barcode"
                            style={styles.input}
                            value={this.state.barcode}
                            autoFocus={true}
                            ref={this.input1Focus.ref}
                            returnKeyType='next'
                            selectionColor={'#3b5998'}
                            onSubmitEditing={() => this.input2Focus.setFocus()}
                        />
                        <TextInput
                            onChangeText={qty => this.setState({ quantity: qty })}
                            placeholder="Voer aantal in"
                            style={styles.input}
                            keyboardType="numeric"
                            value={this.state.quantity}
                            ref={this.input2Focus.ref}
                            selectionColor={'#3b5998'}
                            onSubmitEditing={() => this.submitItem()}
                        />
                        <View style={styles.buttonAdd}>
                            <FontAwesome.Button name="long-arrow-right" backgroundColor="#3b5998"
                                onPress={() => this.submitItem()} >
                               Opslaan
                            </FontAwesome.Button>
                        </View>
                    </View>

                </View>

                <ScrollView style={styles.listArea}>
                    <Items
                        ref={itms => (this.itms = itms)}
                        onPressItem={id =>
                            db.transaction(
                                tx => {
                                    tx.executeSql(`delete from items where id = ?;`, [
                                        id
                                    ]);
                                },
                                null,
                                this.update
                            )
                        }
                    />

                </ScrollView>

                {this.state.modalVisible && <SyncModal onDoneFunction={this.startSync} onCancel={this.hideModal} isvisible={this.state.modalVisible} />}

                <View style={{ borderRadius: 0 }} >
                    <FontAwesome.Button borderRadius={0} style={{ alignSelf: 'center' }} name="cloud-upload" backgroundColor="#4D77FF" onPress={() => {
                        
                        this.loadUser(true, () => {
                            if (this.state.customerId == 0) {
                                Alert.alert('Login','U moet eerst inloggen');
                                return;
                            }
                
                            console.log("CustomerId below:");
                
                            console.log(this.state.customerId);
                            
                            this.setState({ modalVisible: true });

                        });
                    }} >
                        Verzenden naar PurePOS
                    </FontAwesome.Button>
                </View>
            </View>
        );
    }

    pushData(data: any, synced: any) {
        const url = format("https://cloud.posmanager.nl/web20/hook/AddStock?customerid={3}&barcode={0}&quantity={1}&referenceNo={2}",
            data.barcode, data.quantity, this.state.refNumber, this.state.customerId);
        axios.get(url)
            .then(function (response) {
                console.log(response.data);
if(response.data)
{
    db.transaction(
        tx => {
            tx.executeSql(`delete from items where id = ?;`, [data.id]);
        },
        null,
        synced
    )
}else{
    Alert.alert('Problem','Er is een probleem opgetreden probeer het opnieuw!');
}
              

            })
            .catch(function (error) {
                Alert.alert('Problem','Er is een probleem opgetreden probeer het opnieuw!');
                console.log("Error :" + error.response.data);
            });
    }


    add(barcode: string, quantity: string) {
        // is text empty?
        if (barcode === null || barcode === "") {
            return false;
        }

        db.transaction(
            tx => {
                tx.executeSql("insert into items (barcode,quantity,synced) values (?, ?,0)", [barcode, quantity]);
                tx.executeSql("select * from items order by id desc", [], (_, { rows }) =>
                    console.log(JSON.stringify(rows))
                );
            },
            null,
            this.update
        );
    }

    synced = () => {
        this.update();
        ToastAndroid.show('Uw data is verzonden', ToastAndroid.LONG);

    }

    update = () => {
        this.itms && this.itms.update();
    };

    async syncData() {

        db.transaction(
            tx => {
                tx.executeSql("select * from items order by id desc", [], (_, { rows }) => {

                    for (let i = 0; i < rows._array.length; i++) {
                        let itm = rows._array[i];
                        this.pushData(itm, this.synced);
                    }
                });
            },
            null,
        );

       




    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#EFF5F5",
        flex: 9,
    },
    editPart: {
        backgroundColor: '#EFF5F5',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: 'gray',
        padding: 0,
        paddingTop:5,
        paddingBottom: 0,
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
        borderColor: "#C4D7E0",
        backgroundColor:"#fff",
        borderRadius: 4,
        borderWidth: 1,
        height: 40,
        margin: 10,
        padding: 10
    },
    listArea: {
        backgroundColor: "#EFF5F5",
        flex: 1,
        paddingTop: 6,
        marginTop: 6,
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