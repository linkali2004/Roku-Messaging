import mongoose from "mongoose";

const connection = {};

export async function connect() {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("Using existing database connection");
      return;
    }
    await mongoose.disconnect(); 
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    throw new Error("Failed to connect to MongoDB");
  }
}
