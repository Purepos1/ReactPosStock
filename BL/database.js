import dbUpgrade from ".//db-upgrade.json";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export const open = () => {
  console.log("open called");
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE if not exists version (version integer not null);"
    );
    tx.executeSql(
      "SELECT max(version) FROM version",
      [],
      (_, { rows: { results } }) => {
        console.log("Version:" + results);
        let version = 1;
        if (results) version = results[0];
        if (version < dbUpgrade.version) {
          //Call upgrade scripts
          upgradeFrom(db, version);
        }
      }
    );
  });
};

const executeQuery = (query)=>{
    console.log(query);
    db.transaction((tx) => {
        tx.executeSql(
          query,
          [],
          (_, { rows }) => {
            console.log("success");
            console.log(query);
        },
          (err) => {
            console.log(err);
          }
        );
      });
};


export const upgradeFrom = (db, previousVersion) => {
  console.log("Upgrade from called");
  console.log(previousVersion);
  let statements = [];
  let version = dbUpgrade.version - (dbUpgrade.version - previousVersion) + 1;
  let length = Object.keys(dbUpgrade.upgrades).length;

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
    ...[["REPLACE into version (version) VALUES (?);", [dbUpgrade.version]]],
  ];



  statements.forEach((s) => {
    s.forEach(element => {
        executeQuery(element);
    });
  });
};
