// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import BaseColor from "./models/BaseColor.js";

// dotenv.config();

// async function connectDB() {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("Connected to MongoDB");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error.message);
//     }
// }

// const baseColors = [
//   { name: 'Gloss Misty Rose' },
//   { name: 'Matte Misty Rose' },
//   { name: 'Matte Jet Black' },
//   { name: 'Gloss Stormy Blue' },
//   { name: 'Gloss Tea Green' },
//   { name: 'Matte Nude' },
//   { name: 'Gloss Sage Green' },
//   { name: 'Gloss Warm Brown' },
//   { name: 'Matte Tan' },
//   { name: 'Gloss Nude' },
//   { name: 'Unglazed' },
//   { name: 'Gloss Aqua' },
//   { name: 'Matt Black' },
//   { name: 'Gloss Pink' },
//   { name: 'Steel Blue' },
//   { name: 'Steel Blue with a Band' },
//   { name: 'Gloss Black' },
//   { name: 'Gloss Cherry Red' },
//   { name: 'Deep Blue' }
// ];

// async function seedBaseColors() {
//   try {
//     await connectDB();
//     // Optional: Clear existing data
//     await BaseColor.deleteMany({});
    
//     // Insert new data
//     await BaseColor.insertMany(baseColors);
    
//     console.log('Base colors seeded successfully');
//   } catch (error) {
//     console.error('Error seeding base colors:', error);
//   }
// }

// seedBaseColors();