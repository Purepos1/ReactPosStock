import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import * as SQLite from 'expo-sqlite';
import React from "react";
import { useState } from "react";

const db = SQLite.openDatabase("db.db");

export class Items extends React.Component {
    state = {
        items: null
    };

    componentDidMount() {
        console.log('componentDidMount called');
        this.update();
    }

    render() {
        const { items } = this.state;

        console.log('render called');

        if (items === null || items.length === 0) {
            console.log(this.state.items);
            return null;
        }

        return (
            <View style={styles.sectionContainer}>
                {items.map(({ id, barcode, quantity,synced }) => (
                    <TouchableOpacity style={styles.item}
                        key={id}
                        //onLongPress={() => { this.props.onPressItem && this.props.onPressItem(id) }}
                    >
                        <View style={styles.itemContainer}>
                            <Text style={{ flex: 1 }}>{barcode}</Text>
                            <Text style={{ alignItems: 'flex-end', flex: 1, textAlign: 'right' }}>{quantity}</Text>
                        </View>

                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    update() {
        db.transaction(tx => {
            tx.executeSql( `select * from items;`, [],
                (_, { rows: { _array } }) => {
                    this.setState({ items: _array })
                    console.log(this.state.items[0])
                }
            );
        },
            (err) => {
                console.log(err);
            });
    }
}


const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 16,
        marginHorizontal: 6
    },
    itemContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    item:{
        borderColor: "lightgray",
        borderBottomWidth: 1,
        padding: 8
    }
});