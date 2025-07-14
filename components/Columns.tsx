import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getDatabase } from "../Utils/dbService";

interface ColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
}

const Columns = () => {
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const db = await getDatabase();
        const tableName = "items"; // Replace with your table name

        // Get column information using PRAGMA
        const results = await db.getAllAsync<ColumnInfo>(
          `PRAGMA table_info(${tableName})`
        );

        if (results.length > 0) {
          console.log(`Columns of table '${tableName}':`);
          results.forEach((column) => {
            console.log(`- Name: ${column.name}, Type: ${column.type}`);
          });
          setColumns(results);
        } else {
          console.warn(`Table '${tableName}' not found or has no columns.`);
          setError(`Table '${tableName}' not found or has no columns.`);
        }
      } catch (err) {
        console.error("Error fetching columns:", err);
        setError("Failed to fetch table columns");
      }
    };

    fetchColumns();
  }, []);

  return (
    <View>
      <Text>React Native SQLite Example</Text>
    </View>
  );
};

export default Columns;
