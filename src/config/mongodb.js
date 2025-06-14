import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Handle connection success
    mongoose.connection.on('connected', () => {
      console.log('✅ Database connected');
    });

    // Handle connection errors
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    // Use SSL: true if connecting to Atlas (mongodb+srv)
    await mongoose.connect(`${process.env.MONGODB_URI}/edutech`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: process.env.MONGODB_URI.startsWith("mongodb+srv://"),
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit process if DB fails to connect
  }
};

export default connectDB;
