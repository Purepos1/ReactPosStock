import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

const StockList = () => {
const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDataFromDatabase = async () => {

     
      // Fetch data from the table
      db.transaction((tx) => {

        tx.executeSql(
            "insert into items(name"
        )
        tx.executeSql(
          'SELECT * FROM items',
          [],
          (_, result) => {
            console.log(result.rows);
            const rows = result.rows;
            const users = [];
            for (let i = 0; i < rows.length; i++) {
              users.push({
                id: rows.item(i).id,
                name: rows.item(i).name,
               
              });
            }
            setData(users);
          },
          null
        );
      });
    };

    fetchDataFromDatabase();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{`${item.name}, Age: ${item.id}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default StockList;
