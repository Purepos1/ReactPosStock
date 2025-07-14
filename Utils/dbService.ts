import * as SQLite from "expo-sqlite";

let _db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async () => {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync("db.db");
    //await initializeDatabase(_db); // Create tables, etc.
  }
  return _db;
};

export const closeDatabase = async () => {
  if (_db) {
    await _db.closeAsync();
    _db = null;
  }
};
