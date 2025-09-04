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
      return res.status(400).json({ success: false, message: "Password does not meet the criteria", errors: errors.message });
    }



    //Check Email duplicate
    const [rows] = await pool.execute(
      `SELECT username FROM ${USERS} WHERE username = ?`, [username]
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

    //Check if usernaem and password is empty
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" })
    }

    //Check is username and password is valid
    const [rows] = await pool.execute(
      `SELECT username, password FROM ${USERS} WHERE username = ?`,[username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    //Check and compare the password
    const user = rows[0];
    const storedHash = user.password;
    const isMatch = await bcrypt.compare(password, storedHash);
    if(!isMatch){
       return res.status(401).json({success:false , message: "Invalid username of password"})
    }

    //Generate Token using jwt
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })

    //Generate Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({sucess:true, message: "Login successful"})
    
  } catch (error) {

    res.status(500).json({ success: false, message: error.message });
    
  }
}





