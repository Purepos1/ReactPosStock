import dbUpgrade from ".//db-upgrade.json";
import dbDelete from ".//db-delete.json";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export const open = () => {
  console.log("open called");
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS version (version integer primary key not NULL);",
      [],
      () => {
        console.log("version Table created or already exists.");

        tx.executeSql(
          "SELECT version FROM version ORDER BY version DESC LIMIT 1;",
          [],
          (trans, results) => {
            console.log(JSON.stringify(results));

            let version = 1;
            if (results.rows._array.length === 0) {
              console.log("Version table is empty.");
            } else {
              version = results.rows._array[0].version;
              console.log("Version: " + version);
            }

            if (version < dbUpgrade.version) {
              upgradeFrom(db, version);
            }
          }
        );
      },
      (_, error) => {
        console.log("Error creating table:", error);
        return true; // returning true rolls back the transaction
      }
    );
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

export const deleteTables = () => {
  const deletescripts = dbDelete.deleteTables;

  deletescripts.forEach((element) => {
    executeQuery(element[0], null);
  });
};

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
