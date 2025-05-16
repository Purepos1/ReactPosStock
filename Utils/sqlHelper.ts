// sqlHelper.ts
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export const executeSqlAsync = (
  sql: string,
  params: any[] = []
): Promise<SQLite.SQLResultSet> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          console.error("executeSqlAsync - SQL Error:", error);
          reject(error);
          return false;
        }
      );
    });
  });
};

//*** ITEMS OPERATIONS - BEGIN ***/

export const selectAllItems = async (): Promise<any[]> => {
  const result = await executeSqlAsync("SELECT * FROM items order by id desc;");
  const items: any[] = [];

  for (let i = 0; i < result.rows.length; i++) {
    items.push(result.rows.item(i));
  }

  return items;
};

export const checkIfBarcodeExists = async (barcode: string) => {
  const result = await executeSqlAsync(
    "SELECT * FROM items WHERE barcode = ?",
    [barcode]
  );
  return result.rows.length > 0 ? result.rows.item(0) : null;
};

export const insertItem = async (item: {
  barcode: string;
  quantity: number;
  synced: number;
  name: string;
  price: number;
}) => {
  const now = new Date().toISOString();

  await executeSqlAsync(
    "insert into items (barcode, quantity, synced, name, price, createddate) values (?,?,?,?,?,?)",
    [item.barcode, item.quantity, item.synced, item.name, item.price, now]
  );
};

export const updateItem = async (item: {
  barcode: string;
  quantity: number;
}) => {
  const result = await executeSqlAsync(
    "SELECT id FROM items WHERE barcode = ? ORDER BY createdDate ASC LIMIT 1",
    [item.barcode]
  );

  if (result.rows.length === 0) {
    console.log(`No item found with barcode ${item.barcode}`);
    return;
  }

  const targetId = result.rows.item(0).id;

  await executeSqlAsync(
    "UPDATE items SET quantity = quantity + ? WHERE id = ?",
    [item.quantity, targetId]
  );

  console.log(`Item with ID ${targetId} (barcode: ${item.barcode}) updated.`);
};

export const deleteItem = async (item: { id: string }) => {
  await executeSqlAsync("delete from items where id = ?;", [item.id]);

  console.log(`Item.Id: ${item.id} deleted successfully.`);
};

//*** ITEMS OPERATIONS - END ***/

//*** USER OPERATIONS - BEGIN ***/

export const selectUser = async () => {
  const result = await executeSqlAsync("SELECT * FROM items");
  return result.rows.length > 0 ? result.rows.item(0) : null;
};

//*** USER OPERATIONS - END ***/

export { db };
