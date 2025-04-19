// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import ExistingSku from "./models/ExistingSku.js";

// dotenv.config();

// const skuData = [
//     {
//       "name": "Ara Plate",
//       "color": "Aqua",
//       "code": "CEB001AE001"
//     },
//     {
//       "name": "Ara Plate",
//       "color": "Deep Blue",
//       "code": "CEB002AE002"
//     },
//     {
//       "name": "Ara Plate",
//       "color": "Nude",
//       "code": "CEB007AE003"
//     },
//     {
//       "name": "Cee Plate",
//       "color": "Deep Blue",
//       "code": "CEB002AE004"
//     },
//     {
//       "name": "Cee Plate",
//       "color": "Lime Green",
//       "code": "CEB004AE005"
//     },
//     {
//       "name": "Cee Plate",
//       "color": "Pink",
//       "code": "CEB008AE006"
//     },
//     {
//       "name": "Cosmo Plate",
//       "color": "Deep Blue",
//       "code": "CEB002AE007"
//     },
//     {
//       "name": "Cosmo Plate",
//       "color": "Nude",
//       "code": "CEB007AE008"
//     },
//     {
//       "name": "Dash",
//       "color": "Deep Blue",
//       "code": "CEB002AE009"
//     },
//     {
//       "name": "Dash",
//       "color": "Lime Green",
//       "code": "CEB004AE010"
//     },
//     {
//       "name": "Dash",
//       "color": "Pink",
//       "code": "CEB008AE011"
//     },
//     {
//       "name": "Drop Plate",
//       "color": "Deep Blue",
//       "code": "CEB002AE012"
//     },
//     {
//       "name": "Drop Plate",
//       "color": "Mint Ombre",
//       "code": "CEB006AE013"
//     },
//     {
//       "name": "Drop Plate",
//       "color": "Nude",
//       "code": "CEB007AE014"
//     },
//     {
//       "name": "Droplet",
//       "color": "Deep Blue",
//       "code": "CEB002AE015"
//     },
//     {
//       "name": "Droplet",
//       "color": "Nude",
//       "code": "CEB007AE016"
//     },
//     {
//       "name": "Droplet",
//       "color": "Pink",
//       "code": "CEB008AE017"
//     },
//     {
//       "name": "Droplet",
//       "color": "Teal",
//       "code": "CEB010AE018"
//     },
//     {
//       "name": "Hello Plate",
//       "color": "Aqua",
//       "code": "CEB001AE019"
//     },
//     {
//       "name": "Hello Plate",
//       "color": "Deep Blue",
//       "code": "CEB002AE020"
//     },
//     {
//       "name": "Hello Plate",
//       "color": "Nude",
//       "code": "CEB007AE021"
//     },
//     {
//       "name": "Hex Plate",
//       "color": "Aqua",
//       "code": "CEB001AE022"
//     },
//     {
//       "name": "Hex Plate",
//       "color": "Deep Blue",
//       "code": "CEB002AE023"
//     },
//     {
//       "name": "Hex Plate",
//       "color": "Lime Green",
//       "code": "CEB004AE024"
//     },
//     {
//       "name": "Hex Plate",
//       "color": "Nude",
//       "code": "CEB007AE025"
//     },
//     {
//       "name": "Hyphen",
//       "color": "Deep Blue",
//       "code": "CEB002AE026"
//     },
//     {
//       "name": "Hyphen",
//       "color": "Lime Green",
//       "code": "CEB004AE027"
//     },
//     {
//       "name": "Hyphen",
//       "color": "Pink",
//       "code": "CEB008AE028"
//     },
//     {
//       "name": "Jay",
//       "color": "Deep Blue",
//       "code": "CEB002AE029"
//     },
//     {
//       "name": "Jay",
//       "color": "Lime Green",
//       "code": "CEB004AE030"
//     },
//     {
//       "name": "Jay",
//       "color": "Pink",
//       "code": "CEB008AE031"
//     },
//     {
//       "name": "Krypto Plate",
//       "color": "Aqua",
//       "code": "CEB001AE032"
//     },
//     {
//       "name": "Krypto Plate",
//       "color": "Matt Nude",
//       "code": "CEB005AE033"
//     },
//     {
//       "name": "Krypto Plate",
//       "color": "Nude",
//       "code": "CEB007AE034"
//     },
//     {
//       "name": "Leaf Plate",
//       "color": "Aqua",
//       "code": "CEB001AE035"
//     },
//     {
//       "name": "Leaf Plate",
//       "color": "Deep Blue",
//       "code": "CEB002AE036"
//     },
//     {
//       "name": "Leaf Plate",
//       "color": "Lime Green",
//       "code": "CEB004AE037"
//     },
//     {
//       "name": "Luna Plate",
//       "color": "Lime Green",
//       "code": "CEB004AE038"
//     },
//     {
//       "name": "Luna Plate",
//       "color": "Pink",
//       "code": "CEB008AE039"
//     },
//     {
//       "name": "Neo Plate",
//       "color": "Aqua",
//       "code": "CEB001AE040"
//     },
//     {
//       "name": "Neo Plate",
//       "color": "Nude",
//       "code": "CEB007AE041"
//     },
//     {
//       "name": "Orbi Plate",
//       "color": "Nude",
//       "code": "CEB007AE042"
//     },
//     {
//       "name": "Orbi Lid",
//       "color": "Nude",
//       "code": "CEB007AE043"
//     },
//     {
//       "name": "Sky Plate",
//       "color": "Stormy Blue",
//       "code": "CEB000AE044"
//     },
//     {
//       "name": "7\" Sola Plate",
//       "color": "Deep Blue",
//       "code": "CEB002AE045"
//     },
//     {
//       "name": "7\" Sola Plate",
//       "color": "Nude",
//       "code": "CERO07AE046"
//     },
//     {
//       "name": "Tara Plate Big",
//       "color": "Deep Blue",
//       "code": "CERO02AE047"
//     },
//     {
//       "name": "Tara Plate Big",
//       "color": "Nude",
//       "code": "CERO07AE048"
//     },
//     {
//       "name": "Tara Plate Big",
//       "color": "Pink",
//       "code": "CERO08AE049"
//     },
//     {
//       "name": "Tara Plate Small",
//       "color": "Deep Blue",
//       "code": "CERO02AE050"
//     },
//     {
//       "name": "Tara Plate Small",
//       "color": "Pink",
//       "code": "CERO08AE051"
//     },
//     {
//       "name": "Yoo",
//       "color": "Deep Blue",
//       "code": "CERO02AE052"
//     },
//     {
//       "name": "Yoo",
//       "color": "Lime Green",
//       "code": "CERO04AE054"
//     },
//     {
//       "name": "Molo Saucer",
//       "color": "Pink",
//       "code": "CERO01AE055"
//     },
//     {
//       "name": "Lilo Saucer",
//       "color": "Aqua",
//       "code": "CERO01AE056"
//     },
//     {
//       "name": "Jojo Saucer",
//       "color": "Aqua",
//       "code": "CERO01AE057"
//     },
//     {
//       "name": "Tara Plate Small",
//       "color": "Matt Nude",
//       "code": "CERO05AE058"
//     },
//     {
//       "name": "Neo Plate",
//       "color": "Matt Nude",
//       "code": "CERO05AE059"
//     },
//     {
//       "name": "Droplet",
//       "color": "Matt Nude",
//       "code": "CERO05AE060"
//     },
//     {
//       "name": "Cee Plate Matt",
//       "color": "Matt Lime Green",
//       "code": "CERO11AE061"
//     },
//     {
//       "name": "Xmas Tree",
//       "color": "Nude",
//       "code": "CERO07AE062"
//     },
//     {
//       "name": "Clover Plate",
//       "color": "Nude",
//       "code": "CERO07AE063"
//     },
//     {
//       "name": "Eve Plate",
//       "color": "Nude",
//       "code": "CERO07AE064"
//     },
//     {
//       "name": "Eve Plate",
//       "color": "Blush",
//       "code": "CERO12AE065"
//     },
//     {
//       "name": "Large Flat Plate 1",
//       "color": "Aqua",
//       "code": "CERO01AE066"
//     },
//     {
//       "name": "Large Flat Plate 2",
//       "color": "Aqua",
//       "code": "CERO01AE067"
//     },
//     {
//       "name": "Medium Plate",
//       "color": "Aqua",
//       "code": "CERO01AE068"
//     },
//     {
//       "name": "Small Plate",
//       "color": "Aqua",
//       "code": "CERO01AE069"
//     },
//     {
//       "name": "Big Plate",
//       "color": "Aqua",
//       "code": "CERO01AE070"
//     },
//     {
//       "name": "Dome Pizza Platter",
//       "color": "Nude",
//       "code": "CERO07AE071"
//     },
//     {
//       "name": "Aureole Plate",
//       "color": "Nude",
//       "code": "CERO07AE072"
//     },
//     {
//       "name": "Eve Plate",
//       "color": "Powder Blue",
//       "code": "CERO12AE073"
//     },
//     {
//       "name": "Clover Plate",
//       "color": "Blush",
//       "code": "CERO12AE074"
//     },
//     {
//       "name": "Sola Plate",
//       "color": "Aqua",
//       "code": "CERO01AE075"
//     },
//     {
//       "name": "Tara Plate Small",
//       "color": "Lilac",
//       "code": "CERO14AE076"
//     },
//     {
//       "name": "Cosmo Plate",
//       "color": "Aqua",
//       "code": "CERO01AE077"
//     },
//     {
//       "name": "Clover Plate",
//       "color": "Lime Green",
//       "code": "CERO04AE078"
//     },
//     {
//       "name": "Eve Plate",
//       "color": "Lime Green",
//       "code": "CERO04AE079"
//     },
//     {
//       "name": "Eve Plate",
//       "color": "Aqua",
//       "code": "CERO01AE080"
//     },
//     {
//       "name": "Raindeer",
//       "color": "Nude",
//       "code": "CERO07AE081"
//     },
//     {
//       "name": "Jay",
//       "color": "Nude",
//       "code": "CERO07AE082"
//     },
//     {
//       "name": "Droplet",
//       "color": "Nude",
//       "code": "CERO07AE083"
//     },
//     {
//       "name": "Dash",
//       "color": "Nude",
//       "code": "CERO07AE084"
//     },
//     {
//       "name": "Aureole Plate",
//       "color": "Aqua",
//       "code": "CERO01AE085"
//     },
//     {
//       "name": "Aureole Plate",
//       "color": "Blush",
//       "code": "CERO12AE086"
//     },
//     {
//       "name": "Aureole Plate",
//       "color": "Stormy Blue",
//       "code": "CERO09AE087"
//     },
//     {
//       "name": "Sky Plate",
//       "color": "Nude",
//       "code": "CERO07AE088"
//     },
//     {
//       "name": "Sky Plate",
//       "color": "Nude",
//       "code": "CEB007AE08B"
//     },
//     {
//       "name": "Tara Plate Small",
//       "color": "Nude",
//       "code": "CEB007AE09B"
//     },
//     {
//       "name": "Orbi Plate",
//       "color": "Experimental",
//       "code": "CEB005AE09D"
//     },
//     {
//       "name": "Hyphen",
//       "color": "Nude",
//       "code": "CEB007AE09I"
//     },
//     {
//       "name": "Cee Plate",
//       "color": "Nude",
//       "code": "CEB007AE09Z"
//     },
//     {
//       "name": "Yoo",
//       "color": "Nude",
//       "code": "CEB007AE03S"
//     },
//     {
//       "name": "Droplet",
//       "color": "Lime Green",
//       "code": "CEB004AE04"
//     },
//     {
//       "name": "Droplet (Glazed In & Out)",
//       "color": "Pink",
//       "code": "CEB008AE05G"
//     },
//     {
//       "name": "10in Tara Plate",
//       "color": "Nude",
//       "code": "CEB007AE06"
//     },
//     {
//       "name": "Cosmo Plate (In & Out Glaze)",
//       "color": "Nude",
//       "code": "CEB007AE07"
//     },
//     {
//       "name": "Jojo Saucer",
//       "color": "Melon",
//       "code": "CEB007AE09B"
//     },
//     {
//       "name": "Jojo Saucer",
//       "color": "Tea Green",
//       "code": "CEB006AE09"
//     },
//     {
//       "name": "Krypto Plate",
//       "color": "Stormy Blue",
//       "code": "CEB009AE00"
//     },
//     {
//       "name": "8in Cosmo Plate",
//       "color": "Nude",
//       "code": "CEB007AE01"
//     },
//     {
//       "name": "Mojo Saucer",
//       "color": "Tea Green",
//       "code": "CEB006AE02"
//     },
//     {
//       "name": "Mojo Saucer",
//       "color": "Melon",
//       "code": "CEB007AE03"
//     },
//     {
//       "name": "Uno Plate",
//       "color": "Midnight Blue",
//       "code": "CEB022AE24"
//     },
//     {
//       "name": "Uno Plate",
//       "color": "Ice Blue",
//       "code": "CEB022AE24"
//     },
//     {
//       "name": "Duo Plate",
//       "color": "Midnight Blue",
//       "code": "CEB022AE25"
//     },
//     {
//       "name": "Trio Plate",
//       "color": "Midnight Blue",
//       "code": "CEB022AE26"
//     },
//     {
//       "name": "Triad Plate",
//       "color": "Midnight Blue",
//       "code": "CEB022AE27"
//     },
//     {
//       "name": "Penta Dinner Plate",
//       "color": "Midnight Blue",
//       "code": "CEB022AE28"
//     },
//     {
//       "name": "Uno Plate",
//       "color": "Pacific Blue",
//       "code": "CEB022AE24"
//     },
//     {
//       "name": "Duo Plate",
//       "color": "Pacific Blue",
//       "code": "CEB022AE25"
//     },
//     {
//       "name": "Trio Plate",
//       "color": "Pacific Blue",
//       "code": "CEB022AE26"
//     },
//     {
//       "name": "Triad Plate",
//       "color": "Pacific Blue",
//       "code": "CEB022AE27"
//     },
//     {
//       "name": "Penta Dinner Plate",
//       "color": "Pacific Blue",
//       "code": "CEB022AE28"
//     },
//     {
//       "name": "Sola Plate (In & Out Glaze)",
//       "color": "Nude",
//       "code": "CEB007AE13"
//     },
//     {
//       "name": "7\" Sola Plate",
//       "color": "Nude (In Glaze)",
//       "code": "CEB027AE13"
//     },
//     {
//       "name": "7\" Sola Plate",
//       "color": "Nude (Different Glaze)",
//       "code": "CEB028AE15"
//     }
//   ]

// async function connectDB() {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("Connected to MongoDB");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error.message);
//         process.exit(1);
//     }
// }

// async function bulkUploadSkus() {
//   try {
//     await connectDB();
    
//     // Better option: Upsert based on sku_code to avoid duplicates
//     const bulkOps = skuData.map(sku => ({
//       updateOne: {
//         filter: { code: sku.code },
//         update: { $set: sku },
//         upsert: true
//       }
//     }));

//     const result = await ExistingSku.bulkWrite(bulkOps);
    
//     console.log(`Bulk write results:`);
//     console.log(`- Inserted: ${result.nInserted}`);
//     console.log(`- Updated: ${result.nModified}`);
//     console.log(`- Upserted: ${result.nUpserted}`);
//     console.log(`- Total processed: ${result.nMatched + result.nUpserted}`);

//     console.log('SKU data uploaded successfully');
//   } catch (error) {
//     console.error('Error uploading SKU data:', error);
//   } finally {
//     mongoose.disconnect();
//   }
// }

// bulkUploadSkus();