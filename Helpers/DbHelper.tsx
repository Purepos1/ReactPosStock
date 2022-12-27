import * as SQLite from "expo-sqlite";

export const getDBConnection = async () => {
    const db = SQLite.openDatabase("db.db");
    return db;
  };