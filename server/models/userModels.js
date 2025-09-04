import { pool } from "../config/dbConnection.js";
import { USERS } from "../config/dbTableName.js";

class User{
  
  static async findByUsername(username){
    const [rows] = await pool.execute(
      `SELECT username FROM ${USERS} WHERE username = ?`, [username]
    )

    return rows[0] || null;
  }

  static async create(userData){
    const [result] = await pool.execute(
      `INSERT INTO ${USERS} (username, email, password) VALUES (?, ?, ?)`,
      [userData.username, userData.email, userData.password]
    );

    return result.insertId
  }

}

export default User