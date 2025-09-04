import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    if(!origin) return callback(null, true); // allow request with no origin

    // CORS configurations to allow request from specified origins
    const allowedOrigins = [
      process.env.FRONTEND_URL,  // e.g. "https://your-frontend.vercel.app"
      "http://localhost:5173"
    ].filter(Boolean); // removes undefined

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  }, 
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept'
  ], // Allowed Headers
}

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;