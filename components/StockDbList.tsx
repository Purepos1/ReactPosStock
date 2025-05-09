import React, { useRef, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";

import * as SQLite from "expo-sqlite";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import { format } from "react-string-format";
import { SyncModal } from "./SyncModal";
import { PushToCloud, GetProductInfo } from "../BL/CloudFunctions";
import { BLUE, BLUE_CLOUD, ORANGE, ORANGE_DARK } from "../BL/Colors";
import BarcodeAdd from "./BarcodeAdd";
import Total from "./Total";

const db = SQLite.openDatabase("db.db");

class Items extends React.Component {
  state = {
    items: null,
  };

  componentDidMount() {
    this.update();
  }

  render() {
    const { synced: doneHeading } = this.props;
    const { items } = this.state;

    if (items === null || items.length === 0) {
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        {items.map(({ id, barcode, quantity, synced, name, price }) => (
          <TouchableOpacity
            key={id}
            onLongPress={() =>
              this.props.onPressItem && this.props.onPressItem(id)
            }
            style={{
              borderColor: "lightgray",
              borderBottomWidth: 1,
              padding: 3,
            }}
          >
            <View style={styles.itemContainer}>
              <View style={styles.itemTemplate}>
                <Text style={{ flex: 1, fontSize: 14 }}>{name}</Text>
                <Text style={{ flex: 1, fontSize: 12, color: ORANGE_DARK }}>
                  Barcode:{barcode}
                </Text>
              </View>
              <View style={styles.itemPrice}>
                <Text style={{ flex: 1, fontSize: 14 }}>{quantity}</Text>
                <Text style={{ flex: 1, fontSize: 12, color: ORANGE_DARK }}>
                  {price} €
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  update() {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from items order by id desc;",
        [],
        (_, { rows: { _array } }) => this.setState({ items: _array })
      );
    });
  }
}

export class StockDbList extends React.Component {
  state = {
    barcode: "",
    quantity: "",
    onSubmit: null,
    customerId: 0,
    modalVisible: false,
    refNumber: "",
    input2Focus: null,
    showAlert: false,
    quantityRejected: false,
  };

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  startSync = (ref: string) => {
    if (ref == "") {
      Alert.alert("Informatie", "Geef hier uw referentie in");
    } else {
      this.setState({ modalVisible: false });
      this.setState({ refNumber: ref });
      //console.log(ref);
      this.syncData(this.state.customerId);
    }
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {}

  async loadUser(callback: any) {
    if (this.state.customerId != 0) {
      //console.log("call callback");
      callback();
      return;
    }

    //console.log("Load user Called from stockdblist");
    await db.transaction(
      (tx) => {
        tx.executeSql("select * from user", [], (_, { rows }) => {
          if (rows._array.length > 0) {
            //console.log(JSON.stringify(rows));
            //console.log(rows._array[0].id);
            //console.log(rows._array[0].customerId);
            //this.setState({ customerId: rows._array[0].customerId });
          } else {
            this.setState({ customerId: 0 });
          }
        });
      },
      null,
      callback
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <BarcodeAdd parentComponent={this} />

        <ScrollView style={styles.listArea}>
          <Items
            ref={(itms) => (this.itms = itms)}
            onPressItem={(id) =>
              db.transaction(
                (tx) => {
                  tx.executeSql(`delete from items where id = ?;`, [id]);
                },
                null,
                this.update
              )
            }
          />
        </ScrollView>

        {this.state.modalVisible && (
          <SyncModal
            onDoneFunction={this.startSync}
            onCancel={this.hideModal}
            isvisible={this.state.modalVisible}
          />
        )}

        <View style={{ borderRadius: 0 }}>
          <FontAwesome.Button
            borderRadius={0}
            style={{ alignSelf: "center" }}
            name="cloud-upload"
            backgroundColor={BLUE_CLOUD}
            onPress={() => {
              this.loadUser(() => {
                if (this.state.customerId == 0) {
                  Alert.alert("Login", "U moet eerst inloggen");
                  return;
                }

                console.log("CustomerId:" + this.state.customerId);
                this.setState({ modalVisible: true });
              });
            }}
          >
            Verzenden naar PurePOS
          </FontAwesome.Button>
        </View>
      </View>
    );
  }

  pushData(data: any, synced: any) {
    const url = format(
      "https://cloud.posmanager.nl/web20/hook/AddStock?customerid={3}&barcode={0}&quantity={1}&referenceNo={2}",
      data.barcode,
      data.quantity,
      this.state.refNumber,
      this.state.customerId
    );
    axios
      .get(url)
      .then(function (response) {
        console.log(response.data);
        if (response.data) {
          db.transaction(
            (tx) => {
              tx.executeSql(`delete from items where id = ?;`, [data.id]);
            },
            null,
            synced
          );
        } else {
          Alert.alert(
            "Problem",
            "Er is een probleem opgetreden probeer het opnieuw!"
          );
        }
      })
      .catch(function (error) {
        Alert.alert(
          "Problem",
          "Er is een probleem opgetreden probeer het opnieuw!"
        );
        console.log("Error :" + error.response.data);
      });
  }

  add(barcode: string, quantity: string, name: string, price: number) {
    if (barcode === null || barcode === "") {
      console.log("barcode or quantity empty");
      return false;
    }

    console.log("add - before transaction");

    db.transaction(
      (tx) => {
        // Insert query
        tx.executeSql(
          "insert into items (barcode, quantity, synced, name, price) values (?,?,?,?,?)",
          [barcode, quantity, 0, name, price],
          // Success callback
          (tx, result) => {
            console.log("Insert successful", result);

            // select
            tx.executeSql(
              "select * from items order by id desc",
              [],
              // Success callback for select
              (_, { rows }) => {
                console.log("Committed");
                console.log(JSON.stringify(rows));

                this.setState({ barcode: "", quantity: "" });

                this.update();
              },
              // Error callback for select
              (tx, er) => {
                console.log("Error on select items");
                console.log(er);
                return false;
              }
            );
          },
          // Error callback for insert
          (tx, er) => {
            console.log("Error on insert");
            console.log(er);
            return false;
          }
        );
      },
      // Transaction error callback
      (e) => console.log("Transaction error", e),
      // Optional completion callback for the transaction
      this.update
    );
  }

  synced = () => {
    this.update();
    ToastAndroid.show("Uw data is verzonden", ToastAndroid.LONG);
  };

  update = () => {
    this.itms && this.itms.update();
  };

  async syncData() {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from items order by id asc",
          [],
          (_, { rows }) => {
            for (let i = 0; i < rows._array.length; i++) {
              let itm = rows._array[i];
              PushToCloud(
                itm,
                this.synced,
                this.state.refNumber,
                this.state.customerId
              );
              // this.pushData(itm, this.synced);
            }
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EFF5F5",
    flex: 9,
  },

  listArea: {
    backgroundColor: "#EFF5F5",
    flex: 1,
    paddingTop: 1,
    marginTop: 6,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 6,
  },

  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemTemplate: {
    flex: 4,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  itemPrice: {
    flex: 2,
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: 5,
  },
});
