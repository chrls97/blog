import bcrypt from 'bcryptjs'
import User from '../models/userModels.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if empty
    if (!username, !email, !password) {
      return res.status(400).json({ success: false, message: "Username, email, and password are required" })
    }

    const errors = [
      { type: 'length', isValid: 'true', message: 'Password must be at least 8 characters long.' },
      { type: 'upcase', isValid: 'true', message: 'Password must contain at least one uppercase letter.' },
      { type: 'number', isValid: 'true', message: 'Password must contain at least one number.' },
      { type: 'special', isValid: 'true', message: 'Password must contain at least one special character.' }
    ];

    // Validate password
    if (password.length < 8) {
      errors[0].isValid = 'false';
    }

    if (!/[A-Z]/.test(password)) {
      errors[1].isValid = 'false';
    }

    if (!/[0-9]/.test(password)) {
      errors[2].isValid = 'false';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors[3].isValid = 'false';
    }
    const canSubmit = !errors.some(error => error.isValid === 'false');

    if (!canSubmit) {
      return res.status(400).json({ success: false, message: "Password does not meet the criteria" });
    }

    //Check if user alreadyt exists
    const checkUsername = await User.findByUsername(username)
    if (checkUsername) {
      return res.status(400).json({ sucess: false, message: "Username already exists" })
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Crete new user
    const userId = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(200).json({ success: true, message: "User successfully registered" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Check if username and password is empty
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" })
    }

    //find the user by username
    const user = await User.findByUsername(username)
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username of password" })
    }

    //check if password matches
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Invalid username of password" })
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token on database
    await User.updateRefreshToken(user.userId, refreshToken)

    // Set tokens in HTTP-only cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Adjust base on environment
      maxAge: 1 * 24 * 60 * 60 * 1000 // 1 days expiration
    })

    return res.status(200).json({
      sucess: true,
      message: "Login successful",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email
        }
      }
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });

  }
}

export const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Remove refresh token from database
    await User.updateRefreshToken(userId, '');

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Adjust base on environment
    })

    res.json({ success: true, message: "Logout successful" })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await User.findRefreshToken(req.refreshToken)
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid refresh token" })
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Store refresh token in database
    await User.updateRefreshToken(user.userId, newRefreshToken);

    // Set tokens in HTTP-only cookies
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Adjust base on environment
      maxAge: 1 * 24 * 60 * 60 * 1000 // 1 days expiration
    });

    return res.status(200).json({
      sucess: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email
        }
      }
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message })
  }
}






