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
    Button
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from 'expo-sqlite';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from "axios";
import { format } from 'react-string-format';

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
                        onPress={() => this.props.onPressItem && this.props.onPressItem(id)}
                        style={{
                            backgroundColor: synced ? "#1c9963" : "#fff",
                            borderColor: "gray",
                            borderBottomWidth: 1,
                            padding: 8
                        }}
                    >
                        <View style={styles.itemContainer}>
                            <Text style={{ color: synced ? "#fff" : "#000", flex: 1 }}>{barcode}</Text>
                            <Text style={{ color: synced ? "#fff" : "#000", alignItems: 'flex-end', flex: 1, textAlign: 'right' }}>{quantity}</Text>
                        </View>

                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    update() {
        db.transaction(tx => {
            tx.executeSql(
                `select * from items where synced = ?;`,
                [this.props.synced ? 1 : 0],
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
    };

    constructor(props: any) {
        super(props);
        this.input1Focus = utilizeFocus();
        this.input2Focus = utilizeFocus()
    }


    componentDidMount() {
        db.transaction(tx => {
            tx.executeSql(
                "create table if not exists items (id integer primary key not null,barcode text, quantity int, synced int);"
            );
        });
        this.input1Focus.setFocus();
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.editPart}>


                    <View style={styles.flexRow}>
                        <TextInput
                            onChangeText={text => this.setState({ barcode: text })}
                            placeholder="Enter Barcode"
                            style={styles.input}
                            value={this.state.barcode}
                            ref={this.input1Focus.ref}
                            onSubmitEditing={() => this.input2Focus.setFocus()}
                        />
                        <TextInput
                            onChangeText={qty => this.setState({ quantity: qty })}
                            placeholder="Enter Quantity"
                            style={styles.input}
                            value={this.state.quantity}
                            ref={this.input2Focus.ref}
                        />
                        <View style={styles.buttonAdd}>
                            <FontAwesome.Button name="long-arrow-right" backgroundColor="#3b5998" onPress={() => {
                                this.add(this.state.barcode, this.state.quantity);
                                this.pushData(this.state.barcode, this.state.quantity);
                                this.input1Focus.setFocus();
                                this.setState({ barcode: '', quantity: '' });
                            }} >
                                Add For Stock Taking
                            </FontAwesome.Button>
                        </View>
                    </View>

                </View>

                <ScrollView style={styles.listArea}>
                    <Items
                        synced={false}
                        ref={todo => (this.todo = todo)}
                        onPressItem={id =>
                            db.transaction(
                                tx => {
                                    tx.executeSql(`update items set synced = 1 where id = ?;`, [
                                        id
                                    ]);
                                },
                                null,
                                this.update
                            )
                        }
                    />
                    <Items
                        synced={true}
                        ref={done => (this.done = done)}
                        onPressItem={id =>
                            db.transaction(
                                tx => {
                                    tx.executeSql(`delete from items where id = ?;`, [id]);
                                },
                                null,
                                this.update
                            )
                        }
                    />
                </ScrollView>

                <View style={styles.buttonAdd}>
                    <FontAwesome.Button name="registered" backgroundColor="green" onPress={() => {
                        this.pushData(this.state.barcode, this.state.quantity);
                        this.input1Focus.setFocus();
                        this.setState({ barcode: '', quantity: '' });
                    }} >
                        Sync Data
                    </FontAwesome.Button>


                </View>
            </View>
        );
    }

    pushData(barcode: string, quantity: string) {
        const url = format("https://cloud.posmanager.nl/web20/hook/AddStock?customerid=17&barcode={0}&quantity={1}", barcode, quantity);
        axios.get(url)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        // axios.post('/user', {
        //     firstName: 'Fred',
        //     lastName: 'Flintstone'
        //   })
        //   .then(function (response) {
        //     console.log(response);
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });
    }


    add(barcode: string, quantity: string) {
        // is text empty?
        if (barcode === null || barcode === "") {
            return false;
        }

        db.transaction(
            tx => {
                tx.executeSql("insert into items (barcode,quantity,synced) values (?, ?,0)", [barcode, quantity]);
                tx.executeSql("select * from items", [], (_, { rows }) =>
                    console.log(JSON.stringify(rows))
                );
            },
            null,
            this.update
        );
    }

    update = () => {
        this.todo && this.todo.update();
        this.done && this.done.update();
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 9,
        paddingTop: Constants.statusBarHeight - 15
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
        borderColor: "#4630eb",
        borderRadius: 4,
        borderWidth: 1,
        height: 40,
        margin: 12,
        padding: 8
    },
    listArea: {
        backgroundColor: "#f0f0f0",
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