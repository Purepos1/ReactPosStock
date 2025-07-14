import dbUpgrade from ".//db-upgrade.json";
import dbDelete from ".//db-delete.json";
import * as SQLite from "expo-sqlite";

export const open = () => {
  console.log("open called");
  const db = SQLite.openDatabaseSync("db.db");

  try {
    db.withTransactionSync(() => {
      db.execSync(`
      CREATE TABLE IF NOT EXISTS version 
      (version integer primary key not NULL);
    `);
      console.log("version Table created or already exists.");

      const results = db.getAllSync(`
      SELECT version FROM version 
      ORDER BY version DESC LIMIT 1;
    `);

      let version = 1;
      if (results.length === 0) {
        console.log("Version table is empty.!!!");
      } else {
        version = results[0].version;
        console.log("open.Query current Version: " + version);
      }

      if (version < dbUpgrade.version) {
        upgradeFrom(db, version);
      }
    });
  } catch (error) {
    console.log("Transaction failed:", error);
  }
};

const executeQuery = (db, query, param) => {
  console.log(query);

  try {
    const result = db.execSync(query, param);

    console.log("Success:" + query);
    console.log("Result:", result);
  } catch (error) {
    console.log("Failed:" + query);
    console.error("Error details:", error);
  }
};

export const deleteTables = () => {
  const deletescripts = dbDelete.deleteTables;

  const db = SQLite.openDatabaseSync("db.db");

  deletescripts.forEach((element) => {
    executeQuery(db, element[0], null);
  });
};

export const upgradeFrom = (db, previousVersion) => {
  console.log("upgradeFrom called");
  console.log(previousVersion);
  let statements = [];
  let version = dbUpgrade.version - (dbUpgrade.version - previousVersion) + 1;
  let length = Object.keys(dbUpgrade.upgrades).length;

  console.log("current version: " + version);

  for (let i = 0; i < length; i += 1) {
    let upgrade = dbUpgrade.upgrades[`to_v${version}`];

    if (upgrade) {
      statements = [...statements, ...upgrade];
    } else {
      break;
    }

    version++;

    console.log("new version:", version);
  }

  statements = [
    ...statements,
    ...[["REPLACE INTO version (version) VALUES (?);", [version]]],
  ];

  statements.forEach((s) => {
    let result = Array.isArray(s);
    if (result) executeQuery(db, s[0], s[1]);
    else executeQuery(db, s);
  });
};
