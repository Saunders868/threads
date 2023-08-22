import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) {
    return console.log("MongoDB URL was not found!");
  };

  if (isConnected) {
    return console.log("You are already connected to MongoDB");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Successfully connected to the Database");
  } catch (error: any) {
    console.log(error);
  }
}