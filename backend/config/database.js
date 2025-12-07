import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/study-vault');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Fallback na in-memory storage ako MongoDB nije dostupan
    console.log('MongoDB not available, using in-memory storage');
  }
};

export default connectDB;

