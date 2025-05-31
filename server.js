import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/mongodb.js';
import adminrouter from './src/routes/adminRoute.js';
import cors from 'cors'
// import connectDB from './connectDB.js';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3031;

connectDB();

// Connect to the database
app.use(express.json()); // ✅ Enables JSON parsing
app.use(express.urlencoded({ extended: true })); // ✅ Enables form data parsing
app.use(cors()); // ✅ Enables CORS


// Define a test route
app.use('/api/admin',adminrouter)

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
