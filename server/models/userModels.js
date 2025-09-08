import { pool } from "../config/dbConnection.js";
import { USERS } from "../config/dbTableName.js";

class User {

  static async findByUsername(username) {
    try {
      // Execute query to find user by email
      const [rows] = await pool.execute(
        `SELECT userId, username, password, email, refreshToken FROM ${USERS} WHERE username = ?`, [username]
      )
      return rows[0]; // Return the first matching user or undefined
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    const [result] = await pool.execute(
      `INSERT INTO ${USERS} (username, email, password) VALUES (?, ?, ?)`,
      [userData.username, userData.email, userData.password]
    );

    return result.insertId
  }

  static async findById(userId){
    try {
      const [rows] = await pool.execute(`SELECT  userId, username, email, refreshToken FROM ${USERS} WHERE userId = ?`, [userId]);
      return rows[0]; // Return the first matching user or undefined
    } catch (error) {
      throw error
    }
  }

  static async updateRefreshToken(userId, refreshToken) {
    try {
      const [result] = await pool.execute(`UPDATE ${USERS} SET refreshToken = ? WHERE userId = ?`,[refreshToken, userId])
      return result.affectedRows > 0; // Return true if update was successful
    } catch (error) {
      throw error;
    }
  }

  static async findRefreshToken(refreshToken){
    try {
      const [rows] = await pool.execute(`SELECT userId, username, email, refreshToken FROM ${USERS} WHERE refreshToken = ?`,[refreshToken])
      return rows[0]
    } catch (error) {
      throw error
    }
  }

}

export default User