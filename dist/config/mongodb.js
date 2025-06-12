import mongoose from "mongoose";
const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('dadtabase connected'));
  await mongoose.connect(`${process.env.MONGODB_URI}/edutech`);
};
export default connectDB;