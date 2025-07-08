import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import skuRoutes from "./routes/skuRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'https://sku-generator-mu.vercel.app'
}));
app.use(express.json());

app.use("/api/sku", skuRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB successfully!");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error.message);
    });
});
