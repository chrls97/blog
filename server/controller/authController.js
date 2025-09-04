import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { pool } from '../config/dbConnection.js';
import { USERS } from '../config/dbTableName.js';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if empty
    if (!username, !email, !password) {
      return res.status(400).json({ success: false, message: "Username, email, and password are required" })
    }


    const errors = [
      {type: 'length', isValid: 'true', message:'Password must be at least 8 characters long.'}, 
      {type: 'upcase', isValid: 'true', message:'Password must contain at least one uppercase letter.'}, 
      {type: 'number', isValid: 'true', message:'Password must contain at least one number.'},
      {type: 'special', isValid: 'true', message:'Password must contain at least one special character.'}
    ];
    
    // Validate password
    if(password.length < 8){
      errors[0].isValid = 'false';
    }

    if(!/[A-Z]/.test(password)){
      errors[1].isValid = 'false';
    }

    if(!/[0-9]/.test(password)){
      errors[2].isValid = 'false';
    }
    if(!/[!@#$%^&*(),.?":{}|<>]/.test(password)){
      errors[3].isValid = 'false';
    }
    const canSubmit = !errors.some(error => error.isValid === 'false');

    if (!canSubmit) {
      return res.status(400).json({ success: false, message: "Password does not meet the criteria", errors: errors });
    }



    //Check Email duplicate
    const [rows] = await pool.execute(
      `SELECT email FROM ${USERS} WHERE username = ?`, [username]
    );
    if (rows.length > 0) {
      // Email already exists
      return res.status(400).json({ success: false, message: "Username already in taken!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO ${USERS} (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword]
    );

    res.status(200).json({ success: true, userId: result.insertId });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if empty
    if (!username, !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" })
    }

    

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}





