import { getDatabase } from "../Utils/dbService";

export const selectAllItems = async <T = any>(): Promise<T[]> => {
  const db = await getDatabase();

  return await db.getAllAsync<T>("SELECT * FROM items ORDER BY id DESC;");
};

export const checkIfBarcodeExists = async (barcode: string) => {
  try {
    const db = await getDatabase();

    const result = await db.getAllAsync<any>(
      "SELECT * FROM items WHERE barcode = ?",
      [barcode]
    );

    return result?.length > 0 ? result[0] : null;
  } catch (error) {
    console.log("checkIfBarcodeExists", error);
  }
};

export const insertItem = async (item: {
  barcode: string;
  quantity: number;
  synced: number;
  name: string;
  price: number;
}) => {
  try {
    const now = new Date().toISOString();
    const db = await getDatabase();

    await db.runAsync(
      "insert into items (barcode, quantity, synced, name, price, createddate) values (?,?,?,?,?,?)",
      [item.barcode, item.quantity, item.synced, item.name, item.price, now]
    );
    console.log("insertItem completed");
  } catch (error) {
    console.log("insertItem:    ", error);
  }
};

export const updateItem = async (item: {
  barcode: string;
  quantity: number;
}) => {
  const db = await getDatabase();

  const result = await db.getAllAsync<any>(
    "SELECT id FROM items WHERE barcode = ? ORDER BY createdDate ASC LIMIT 1",
    [item.barcode]
  );

  if (result.length === 0) {
    console.log(`No item found with barcode ${item.barcode}`);
    return;
  }

  const targetId = result[0].id;

  await db.runAsync("UPDATE items SET quantity = quantity + ? WHERE id = ?", [
    item.quantity,
    targetId,
  ]);

  console.log(`Item with ID ${targetId} (barcode: ${item.barcode}) updated.`);
};

export const deleteItem = async (item: { id: string }) => {
  const db = await getDatabase();

  await db.runAsync("delete from items where id = ?;", [item.id]);

  console.log(`Item.Id: ${item.id} deleted successfully.`);
};
