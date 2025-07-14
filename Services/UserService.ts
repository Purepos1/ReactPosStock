import { getDatabase } from "../Utils/dbService";

export const selectUser = async () => {
  try {
    const db = await getDatabase();

    const result = await db.getAllAsync<any>("SELECT * FROM user");

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
