import dotenv from "dotenv";
import mongoose from "mongoose";
import Counter from "./models/Counter.js";
import Product from "./models/Product.js";
import products from './products.json' with { type: 'json' };

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const insertProducts = async () => {
  try {
    const insertList = [];

    for (const item of products) {
      // Get the design code counter for this category
      let counter = await Counter.findOne({ category: item.category });
      if (!counter) {
        counter = await Counter.create({ category: item.category, last_code: 100 });
      }
      counter.last_code += 1;
      await counter.save();

      // Push product with design_code
      insertList.push({
        name: item.name,
        category: item.category,
        design_code: counter.last_code,
      });
    }

    await Product.insertMany(insertList);
    console.log("✅ Products inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting products:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

insertProducts();
