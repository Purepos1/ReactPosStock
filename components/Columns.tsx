import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SQLite from "expo-sqlite";


const Columns = () => {
  useEffect(() => {
    const db = SQLite.openDatabase("db.db");

    // Replace 'Users' with the name of your table
    const tableName = 'items';

    db.transaction((tx) => {
      tx.executeSql(
        `PRAGMA table_info(${tableName})`,
        [],
        (tx, result) => {
          const rows = result.rows;
          if (rows.length > 0) {
            console.log(`Columns of table '${tableName}':`);
            for (let i = 0; i < rows.length; i++) {
              console.log(`- Name: ${rows.item(i).name}, Type: ${rows.item(i).type}`);
            }
          } else {
            console.warn(`Table '${tableName}' not found or has no columns.`);
          }
        },
        null
      );
    });
  }, []);

  return (
    <View>
      <Text>React Native SQLite Example</Text>
    </View>
  );
};

export default Columns;
