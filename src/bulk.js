import dotenv from "dotenv";
import mongoose from "mongoose";
import Material from "./models/Material.js";

dotenv.config();

const insertList = []

const insertMaterials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    const result = await Material.insertMany(insertList);
    console.log(`✅ ${result.length} materials inserted successfully!`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
  }
};

// Execute the function
insertMaterials();