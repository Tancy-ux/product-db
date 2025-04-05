import dotenv from "dotenv";
import mongoose from "mongoose";
import Type from "./models/Type.js";

dotenv.config();

const insertList = [
  {
    "name": "Accessories",
    "code": "Accessories"
  },
  {
    "name": "Accessories Set",
    "code": "AAS"
  },
  {
    "name": "Bowls",
    "code": "AB"
  },
  {
    "name": "Bowls Set",
    "code": "ABS"
  },
  {
    "name": "Cups / Mugs",
    "code": "AC"
  },
  {
    "name": "Cups / Mugs Set",
    "code": "ACS"
  },
  {
    "name": "Plates",
    "code": "AE"
  },
  {
    "name": "Plates Set",
    "code": "AES"
  },
  {
    "name": "Platter",
    "code": "AF"
  },
  {
    "name": "Platter Sets",
    "code": "AFS"
  },
  {
    "name": "Table Linens",
    "code": "AG"
  },
  {
    "name": "Table Linens Set",
    "code": "AGS"
  },
  {
    "name": "Table Settings",
    "code": "TS"
  },
  {
    "name": "Vases",
    "code": "AH"
  },
  {
    "name": "Vases Set",
    "code": "AHS"
  },
  {
    "name": "Candle Stand",
    "code": "AI"
  },
  {
    "name": "Candle Stand Set",
    "code": "AIS"
  },
  {
    "name": "Trinket",
    "code": "AJ"
  },
  {
    "name": "Trinket Set",
    "code": "AJS"
  },
  {
    "name": "Tissue Box",
    "code": "AK"
  },
  {
    "name": "Cutlery",
    "code": "AL"
  }
];

const insertTypes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const result = await Type.insertMany(insertList);
    console.log(`✅ ${result.length} types inserted successfully!`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
  }
};

// Execute the function
insertTypes();

