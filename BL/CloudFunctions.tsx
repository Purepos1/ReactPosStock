import axios from "axios";
import { Alert } from "react-native";
import { userStore } from "../stores/userStore";
import { getDatabase } from "../Utils/dbService";

export function GetProductInfo(
  customerId: any,
  barcode: any,
  added: any,
  failedFunc: any
) {
  const url = `https://cloud.posmanager.nl/web20/hook/getproductinfo?customerid=${customerId}&barcode=${barcode}`;

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

  const url = `https://cloud.posmanager.nl/web20/hook/addstockv2?customerid=${customerId}&barcode=${data.barcode}&quantity=${data.quantity}&referenceNo=${refNumber}&createdDate=${date}`;
  //"http://192.168.1.187:59387/hook/addstockv2?customerid={3}&barcode={0}&quantity={1}&referenceNo={2}&createdDate={4}",

  axios
    .get(url)
    .then(async function (response) {
      try {
        console.log(response.data);
        if (response.data) {
          const db = await getDatabase();
          await db.runAsync(`DELETE FROM items WHERE id = ?;`, [data.id]);
          console.log(`id: ${data.id} finished successfully`);
          synced();
        } else {
          // Alert.alert(
          //   "Problem",
          //   "Er is een probleem opgetreden probeer het opnieuw!"
          // );
          console.log("error", response);
          resolve?.();
        }
      } catch (innerError) {
        console.error("Error in database operation:", innerError);
        resolve?.();
      }
    })
    .catch(function (error) {
      // Alert.alert(
      //   "Problem",
      //   "Er is een probleem opgetreden probeer het opnieuw!"
      // );
      console.log("Error :" + error.response.data);
      resolve?.();
    });
}

export function GetProductSearch(
  searchTerm: string,
  resultFetched: any,
  failedFunc: any
) {
  console.log("GetProductSearch CustomerId:");
  console.log(userStore.value.customerId);
  console.log("GetProductSearch UserName:");
  console.log(userStore.value.userName);
  console.log("GetProductSearch barcode:");
  console.log(searchTerm);
  const url = `https://cloud.posmanager.nl/web20/hook/GetProductSearch?customerid=${userStore.value.customerId}&searchTerm=${searchTerm}`;
  //"http://192.168.1.187:59387/hook/GetProductSearch?customerid={0}&searchTerm={1}",

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
