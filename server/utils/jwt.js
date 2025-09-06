import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  // Create payload with user information
  const payload = {
    userId: user.userId,
    email: user.email,
    username: user.username
  };

  // Generate token with expiration time
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '1m' }
  );
}

export const generateRefreshToken = (user) => {
  // Create payload with user information
  const payload = {
    userId: user.userId,
    username: user.username
  }

  // Generate token with expiration time
  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '1d' }
  );
}