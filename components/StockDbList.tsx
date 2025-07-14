import React, { useRef, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Modal,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SyncModal } from "./SyncModal";
import { PushToCloud, GetProductInfo } from "../BL/CloudFunctions";
import { BLUE, BLUE_CLOUD, ORANGE, ORANGE_DARK } from "../BL/Colors";
import BarcodeAdd from "./BarcodeAdd";
import { clearUser, isLoggedIn, setUser, userStore } from "../stores/userStore";
import { Semaphore } from "../Utils/semaphore";
import {
  selectAllItems,
  insertItem,
  updateItem,
  checkIfBarcodeExists,
  deleteItem,
} from "../Services/ItemService";
import { selectUser } from "../Services/UserService";
import { confirmAsync } from "../Utils/confirm";

interface ItemsProps {
  onPressItem?: (id: string) => void;
  onTotalChanged?: (totalCount: number) => void;
}

interface ScannedListItem {
  id: string;
  barcode: string;
  quantity: number;
  name: string;
  price: number;
}

interface ItemsState {
  items: ScannedListItem[] | null;
  totalCount: number;
}

class Items extends React.Component<ItemsProps, ItemsState> {
  state: ItemsState = {
    items: null,
    totalCount: 0,
  };

  componentDidMount() {
    this.update();
  }

  render() {
    const { items }: { items: ScannedListItem[] | null } = this.state;

    if (items === null || items.length === 0) {
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        {items.map(({ id, barcode, quantity, name, price }) => (
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

  async update() {
    const rows = await selectAllItems();

    this.setState({ items: rows });
    this.state.totalCount = rows.length;
    this.props.onTotalChanged &&
      this.props.onTotalChanged(this.state.totalCount);
  }
}

export class StockDbList extends React.Component {
  private itmsRef = React.createRef<Items>();

  state = {
    barcode: "",
    quantity: "",
    onSubmit: null,
    modalVisible: false,
    refNumber: "",
    input2Focus: null,
    showAlert: false,
    quantityRejected: false,
    succeededCount: 0,
    totalCount: 0,
  };

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  startSync = (ref: string) => {
    if (ref == "") {
      Alert.alert("Informatie", "Geef hier uw referentie in");
    } else {
      this.setState({ refNumber: ref });
      this.syncData();
    }
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {}

  async loadUser(callback: any) {
    if (userStore.value.customerId != 0) {
      //console.log("call callback");
      callback();
      return;
    }

    const user = await selectUser();

    if (user) {
      setUser(user.userName, user.password, user.customerId, user.database);
      console.log("loadUser, load user from db", user);
    } else {
      clearUser();
    }

    callback && callback();
  }

  render() {
    return (
      <View style={styles.container}>
        <BarcodeAdd parentComponent={this} />

        <ScrollView style={styles.listArea}>
          <Items
            ref={this.itmsRef}
            onPressItem={async (id: string) => {
              console.log("deleting id", id);
              await deleteItem({ id });
              this.update();
            }}
            onTotalChanged={(tcount: number) => {
              this.setState({ totalCount: tcount });
            }}
          />
        </ScrollView>

        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <SyncModal
            onDoneFunction={this.startSync}
            onCancel={this.hideModal}
            isvisible={this.state.modalVisible}
            succeededCount={this.state.succeededCount}
            totalCount={this.state.totalCount}
          />
        </Modal>

        <View style={{ borderRadius: 0 }}>
          <FontAwesome.Button
            borderRadius={0}
            style={{ alignSelf: "center" }}
            name="cloud-upload"
            backgroundColor={BLUE_CLOUD}
            onPress={() => {
              this.loadUser(() => {
                if (!isLoggedIn()) {
                  Alert.alert("Login", "U moet eerst inloggen");
                  return;
                }

                console.log("CustomerId:" + userStore.value.customerId);
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

  async add(barcode: string, quantity: string, name: string, price: number) {
    if (barcode === null || barcode === "") {
      console.log("barcode or quantity empty");
      return false;
    }

    const existingItem = await checkIfBarcodeExists(barcode);

    if (existingItem) {
      const confirmed = await confirmAsync(
        "Bijwerken of toevoegen als nieuw item?",
        "Om een ​​nieuw item toe te voegen, drukt u op nee, om bij te werken, drukt u op ja"
      );

      if (confirmed) {
        // yes to update
        const updated = await updateItem({
          barcode,
          quantity: Number.parseInt(quantity),
        });

        console.log(JSON.stringify(updated));

        this.setState({ barcode: "", quantity: "" });
        this.update();

        return;
      }
    } // end of existingItem

    console.log("parent add is called");
    await insertItem({
      barcode,
      quantity: Number.parseInt(quantity),
      synced: 0,
      name,
      price,
    });
    console.log("parent add is called 2");
    this.setState({ barcode: "", quantity: "" });
    this.update();
  }

  synced = () => {
    this.update();
    ToastAndroid.show("Uw data is verzonden", ToastAndroid.LONG);
  };

  update = () => {
    this.itmsRef.current && this.itmsRef.current.update();
  };

  async syncData() {
    const rows = await selectAllItems();

    const semaphore = new Semaphore(4);
    let succeeded = 0;
    const succeededLock = new Semaphore(1);

    const taskCreators: Array<() => Promise<void>> = [];

    for (let i = 0; i < rows.length; i++) {
      let itm = rows[i];

      taskCreators.push(
        () =>
          new Promise<void>((resolve) => {
            console.log(`Task ${itm.barcode}/${i} started`);

            PushToCloud(
              itm,
              async () => {
                await succeededLock.wrap(async () => {
                  succeeded++;
                });
                resolve();
              },
              this.state.refNumber,
              userStore.value.customerId,
              resolve
            );
          })
      );
    }

    await Promise.all(taskCreators.map((creator) => semaphore.wrap(creator)));

    this.setState({ succeededCount: succeeded });
    this.synced();
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
