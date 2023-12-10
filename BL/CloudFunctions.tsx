import { format } from "react-string-format";
import axios from "axios";
import * as SQLite from "expo-sqlite";
import {Alert} from "react-native";

const db = SQLite.openDatabase("db.db");

export function GetProductInfo(
  customerId:any,
  barcode:any,
  added:any,
  failedFunc:any
) {
  console.log("GetProductInfo CustomerUd:");
  console.log(customerId);
  console.log("GetProductInfo barcode:");
  console.log(barcode);
  const url = format(
    "https://cloud.posmanager.nl/web20/hook/getproductinfo?customerid={0}&barcode={1}",
    customerId,
    barcode
  );
  console.log(url);
  axios
    .get(url)
    .then(function (response) {
      console.log(response.data);
      if (response.data.Succeed) {
        added(response.data);
      } else {
        Alert.alert(
          "Problem",
          response.data.Message
        );
        failedFunc();
      }
    })
    .catch(function (error) {
      Alert.alert(
        "Problem",
        "Ex Er is een probleem opgetreden probeer het opnieuw!"
      );
      console.log("Error :" + error);
    });
}

export function PushToCloud(
    data: any,
    synced: any,
    refNumber: any,
    customerId: any
  ) {
    const url = format(
      "https://cloud.posmanager.nl/web20/hook/AddStock?customerid={3}&barcode={0}&quantity={1}&referenceNo={2}",
      data.barcode,
      data.quantity,
      refNumber,
      customerId
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
  
