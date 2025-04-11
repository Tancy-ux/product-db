// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import GeneralColor from "./models/GeneralColor.js";

// dotenv.config();

// async function connectDB() {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("Connected to MongoDB");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error.message);
//     }
// }
// async function seedBaseColors() {
//   try {
//     await connectDB();

//     const result = await GeneralColor.updateMany(
//         { material: { $regex: /^Mats$/i } },
//         { $set: { material: "Cork" } }
//       );
  
//       console.log(`Updated ${result.modifiedCount} documents from pink to blue`);
      
    
    
//     console.log('Base colors seeded successfully');
//   } catch (error) {
//     console.error('Error seeding base colors:', error);
//   }
// }

// seedBaseColors();