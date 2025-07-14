import { UserModel } from "../Models/UserModel";
import { getDatabase } from "../Utils/dbService";
import { setUser, clearUser } from "../stores/userStore";

class UserBL {
  async Delete(): Promise<void> {
    try {
      const db = await getDatabase();
      clearUser();
      await db.execAsync("DELETE FROM user");
      console.log("User deleted");
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  }

  async Create(user: UserModel): Promise<void> {
    try {
      const db = await getDatabase();
      await db.runAsync(
        "INSERT INTO user (userName, password, customerId, database) VALUES (?, ?, ?, ?)",
        [user.userName, user.password, user.customerId, user.database]
      );
      console.log(`User ${user.userName} inserted`);
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  }

  async getUsers(): Promise<UserModel[]> {
    try {
      const db = await getDatabase();
      const results = await db.getAllAsync<UserModel>(
        "SELECT id, userName, password, customerId, database FROM user"
      );
      return results;
    } catch (error) {
      console.error("UserBl.getUsers Failed to get users:", error);
      throw new Error("Failed to get users");
    }
  }
}

const UserDbFunction = new UserBL();
export default UserDbFunction;
