import dbUpgrade from ".//db-upgrade.json";
import dbDelete from ".//db-delete.json";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export const open = () => {
  console.log("open called");
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS version (version integer primary key not NULL);"
    );
    // tx.executeSql("CREATE UNIQUE INDEX NOT EXISTS ix_version ON Version (version);")
    tx.executeSql(
      "SELECT version FROM version order by version desc LIMIT 1;",
      [],
      (trans, results) => {
        console.log(JSON.stringify(results));
        if (results.rows._array.length == 0) {
          console.log("Version table is empty.");
        } else {
          console.log("Version:" + results.rows._array[0].version);
        }
        let version = 1;
        if (results.rows._array.length > 0) version = results.rows._array[0].version;
        if (version < dbUpgrade.version) {
          //Call upgrade scripts
          upgradeFrom(db, version);
        }
      }
    );
    (transaction, error) => console.log(error);
  });
};

const executeQuery = (query, param) => {
  console.log(query);
  db.transaction((tx) => {
    tx.executeSql(
      query,
      param,
      (_, { rows }) => {
        console.log("Success:" + query);
      },
      (err) => {
        console.log("Failed:" + query);
      }
    );
  });
};

export const deleteTables =()=>{
 const deletescripts = dbDelete.deleteTables;

 deletescripts.forEach(element => {
  executeQuery(element[0],null);
 });
}

export const upgradeFrom = (db, previousVersion) => {
  console.log("upgradeFrom called");
  console.log(previousVersion);
  let statements = [];
  let version = dbUpgrade.version - (dbUpgrade.version - previousVersion) + 1;
  let length = Object.keys(dbUpgrade.upgrades).length;

  console.log("version:" + version);
  console.log("Length:" + length);
  for (let i = 0; i < length; i += 1) {
    let upgrade = dbUpgrade.upgrades[`to_v${version}`];

    if (upgrade) {
      statements = [...statements, ...upgrade];
    } else {
      break;
    }

    version++;
  }

  statements = [
    ...statements,
    ...[["REPLACE INTO version (version) VALUES (?);", [dbUpgrade.version]]],
  ];

  statements.forEach((s) => {
    let result = Array.isArray(s);
    if (result) executeQuery(s[0], s[1]);
    else executeQuery(s);
  });
};
