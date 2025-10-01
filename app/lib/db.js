export const connectionStr2 = `mongodb+srv://anas:as@cluster0.q5xk0zt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
// app/lib/db.js
import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(connectionStr2, {
      dbName: "eventstackz", // explicitly set DB name
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
