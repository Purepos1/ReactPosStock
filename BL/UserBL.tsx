import * as SQLite from "expo-sqlite";
import { UserModel } from "../Models/UserModel";
import { getDBConnection } from "../Helpers/DbHelper";
import { setUser, clearUser } from "../stores/userStore";

const db = SQLite.openDatabase("db.db");

class UserBL {
  Delete() {
    clearUser();
    db.transaction(
      (tx) => {
        tx.executeSql("delete from user");
        console.log("User deleted");
      },
      (err) => {
        console.log(err);
      }
    );
  }

  Create(props: any) {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into user (userName,password,customerId,database) values (?,?,?,?)",
          [props.userName, props.password, props.customerId, props.database]
        );
        console.log("User " + props.userName + " inserted");
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getTodoItems = async (db: SQLiteDatabase): Promise<UserModel[]> => {
    try {
      const userItems: UserModel[] = [];
      const results = await db.executeSql(
        "select id, userName, password, customerId, database from user"
      );
      results.forEach((result) => {
        for (let index = 0; index < result.rows.length; index++) {
          userItems.push(result.rows.item(index));
        }
      });
      return userItems;
    } catch (error) {
      console.error(error);
      throw Error("Failed to get userItems !!!");
    }
  };
}

const UserDbFunction = new UserBL();
export default UserDbFunction;
