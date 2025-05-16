import { format } from "react-string-format";
import axios from "axios";
import * as SQLite from "expo-sqlite";
import { Alert } from "react-native";
import { userStore } from "../stores/userStore";

const db = SQLite.openDatabase("db.db");

export function GetProductInfo(
  customerId: any,
  barcode: any,
  added: any,
  failedFunc: any
) {
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
        Alert.alert("Problem", response.data.Message);
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
  customerId: any,
  resolve?: (value: void | PromiseLike<void>) => void
) {
  console.log("data", data);

  const date =
    data && data.createdDate ? data.createdDate : new Date().toISOString();

  console.log("data", data, date);

  const url = format(
    "https://cloud.posmanager.nl/web20/hook/addstockv2?customerid={3}&barcode={0}&quantity={1}&referenceNo={2}&createdDate={4}",
    //"http://192.168.1.187:59387/hook/addstockv2?customerid={3}&barcode={0}&quantity={1}&referenceNo={2}&createdDate={4}",
    data.barcode,
    data.quantity,
    refNumber,
    customerId,
    date
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
          undefined, // Pass `undefined` if you don't want to handle the error:
          synced
        );
        console.log(`'id: ${data.id} finished successfully`);
      } else {
        // Alert.alert(
        //   "Problem",
        //   "Er is een probleem opgetreden probeer het opnieuw!"
        // );
        console.log("error", response);
        resolve && resolve();
      }
    })
    .catch(function (error) {
      // Alert.alert(
      //   "Problem",
      //   "Er is een probleem opgetreden probeer het opnieuw!"
      // );
      console.log("Error :" + error.response.data);
      resolve && resolve();
    });
}

export function GetProductSearch(
  searchTerm: string,
  resultFetched: any,
  failedFunc: any
) {
  console.log("GetProductSearch CustomerUd:");
  console.log(userStore.value.customerId);
  console.log("GetProductSearch barcode:");
  console.log(searchTerm);
  const url = format(
    "https://cloud.posmanager.nl/web20/hook/GetProductSearch?customerid={0}&searchTerm={1}",
    //"http://192.168.1.187:59387/hook/GetProductSearch?customerid={0}&searchTerm={1}",
    userStore.value.customerId,
    searchTerm
  );
  console.log(url);
  axios
    .get<PosActionResult<ProductSearchResultDto[]>>(url)
    .then(function (response) {
      console.log("------------------");
      //console.log(response.data);
      if (response.data.Succeed) {
        resultFetched(response.data.Data);
      } else {
        Alert.alert("Problem", response.data.Message);
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
