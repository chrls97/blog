import jwt from 'jsonwebtoken';

// Middleware to verify access token
export const verifyAccessToken = (req, res, next) => {
  
  // Get token from Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  // Check if token exists
  if (!token) {
    return res.status(400).json({ success: false, message: "Access token is required" });
  }

  try {
    // Verify token
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // Attach user information to request object
    req.user = decode;
    // Proceed to the next middleware/route handler
    next();
    
  } catch (error) {
    console.log(error.message)
    // Handle different JWT error types
        if (error.name === 'TokenExpiredError') 
          return res.status(401).json({ success: false, message: 'Access token expired' });
        
        
        if (error.name === 'JsonWebTokenError') 
          return res.status(403).json({ success: false,  message: 'Invalid access token' });
        

        // Generic error response
        return res.status(403).json({ success: false,  message: 'Failed to authenticate token' });
  }
}

// Middleware to verify refresh token from cookies
export const verifyRefreshToken = (req, res, next) => {
  // Get refresh token from cookies
  const refreshToken = req.cookies.refreshToken;

  // Check if refresh token exists
  if(!refreshToken){
    return res.status(400).json({ success:false , message: "Refresh token is requried"})
  }

  try {
     // Verify the refresh token
    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // Attach user information to the request object
    req.user = decode;
    req.refreshToken = refreshToken; // Attach the refresh token for potential reuse
    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success:false , message: error.message})
  }
}