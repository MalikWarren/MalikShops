import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Use environment variable or fallback to the working connection string
    const mongoURI =
      process.env.MONGO_URI ||
      'mongodb+srv://Malikwar:Warrenboy10@cluster0.ig5hs5u.mongodb.net/malikshop?retryWrites=true&w=majority';

    const conn = await mongoose.connect(mongoURI, {
      dbName: 'malikshop', // Explicitly specify the database name
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(
      `Collections: ${Object.keys(conn.connection.collections).join(', ')}`
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
