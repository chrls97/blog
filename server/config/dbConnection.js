import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'blog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection at startup
const dbcon = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL Database Connected");
    connection.release(); // release back to pool
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // stop the app if DB is not reachable
  }
};

export default dbcon;