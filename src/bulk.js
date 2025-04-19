import dotenv from "dotenv";
import mongoose from "mongoose";
import ExistingSku from "./models/ExistingSku.js";

dotenv.config();

const skuData = [
    {
      "name": "Ara Plate",
      "color": "Aqua",
      "code": "CER001AE001",
      "typeCode": "AE"
    },
    {
      "name": "Ara Plate",
      "color": "Deep Blue",
      "code": "CER002AE002",
      "typeCode": "AE"
    },
    {
      "name": "Ara Plate",
      "color": "Nude",
      "code": "CER007AE003",
      "typeCode": "AE"
    },
    {
      "name": "Cee Plate",
      "color": "Deep Blue",
      "code": "CER002AE004",
      "typeCode": "AE"
    },
    {
      "name": "Cee Plate",
      "color": "Lime Green",
      "code": "CER004AE005",
      "typeCode": "AE"
    },
    {
      "name": "Cee Plate",
      "color": "Pink",
      "code": "CER008AE006",
      "typeCode": "AE"
    },
    {
      "name": "Cosmo Plate",
      "color": "Deep Blue",
      "code": "CER002AE007",
      "typeCode": "AE"
    },
    {
      "name": "Cosmo Plate",
      "color": "Nude",
      "code": "CER007AE008",
      "typeCode": "AE"
    },
    {
      "name": "Dash",
      "color": "Deep Blue",
      "code": "CER002AE009",
      "typeCode": "AE"
    },
    {
      "name": "Dash",
      "color": "Lime Green",
      "code": "CER004AE010",
      "typeCode": "AE"
    },
    {
      "name": "Dash",
      "color": "Pink",
      "code": "CER008AE011",
      "typeCode": "AE"
    },
    {
      "name": "Drop Plate",
      "color": "Deep Blue",
      "code": "CER002AE012",
      "typeCode": "AE"
    },
    {
      "name": "Drop Plate",
      "color": "Mint Ombre",
      "code": "CER006AE013",
      "typeCode": "AE"
    },
    {
      "name": "Drop Plate",
      "color": "Nude",
      "code": "CER007AE014",
      "typeCode": "AE"
    },
    {
      "name": "Droplet",
      "color": "Deep Blue",
      "code": "CER002AE015",
      "typeCode": "AE"
    },
    {
      "name": "Droplet",
      "color": "Nude",
      "code": "CER007AE016",
      "typeCode": "AE"
    },
    {
      "name": "Droplet",
      "color": "Pink",
      "code": "CER008AE017",
      "typeCode": "AE"
    },
    {
      "name": "Droplet",
      "color": "Teal",
      "code": "CER010AE018",
      "typeCode": "AE"
    },
    {
      "name": "Hello Plate",
      "color": "Aqua",
      "code": "CER001AE019",
      "typeCode": "AE"
    },
    {
      "name": "Hello Plate",
      "color": "Deep Blue",
      "code": "CER002AE020",
      "typeCode": "AE"
    },
    {
      "name": "Hello Plate",
      "color": "Nude",
      "code": "CER007AE021",
      "typeCode": "AE"
    },
    {
      "name": "Hex Plate",
      "color": "Aqua",
      "code": "CER001AE022",
      "typeCode": "AE"
    },
    {
      "name": "Hex Plate",
      "color": "Deep Blue",
      "code": "CER002AE023",
      "typeCode": "AE"
    },
    {
      "name": "Hex Plate",
      "color": "Lime Green",
      "code": "CER004AE024",
      "typeCode": "AE"
    },
    {
      "name": "Hex Plate",
      "color": "Nude",
      "code": "CER007AE025",
      "typeCode": "AE"
    },
    {
      "name": "Hyphen",
      "color": "Deep Blue",
      "code": "CER002AE026",
      "typeCode": "AE"
    },
    {
      "name": "Hyphen",
      "color": "Lime Green",
      "code": "CER004AE027",
      "typeCode": "AE"
    },
    {
      "name": "Hyphen",
      "color": "Pink",
      "code": "CER008AE028",
      "typeCode": "AE"
    },
    {
      "name": "Jay",
      "color": "Deep Blue",
      "code": "CER002AE029",
      "typeCode": "AE"
    },
    {
      "name": "Jay",
      "color": "Lime Green",
      "code": "CER004AE030",
      "typeCode": "AE"
    },
    {
      "name": "Jay",
      "color": "Pink",
      "code": "CER008AE031",
      "typeCode": "AE"
    },
    {
      "name": "Krypto Plate",
      "color": "Aqua",
      "code": "CER001AE032",
      "typeCode": "AE"
    },
    {
      "name": "Krypto Plate",
      "color": "Matt Nude",
      "code": "CER005AE033",
      "typeCode": "AE"
    },
    {
      "name": "Krypto Plate",
      "color": "Nude",
      "code": "CER007AE034",
      "typeCode": "AE"
    },
    {
      "name": "Leaf Plate",
      "color": "Aqua",
      "code": "CER001AE035",
      "typeCode": "AE"
    },
    {
      "name": "Leaf Plate",
      "color": "Deep Blue",
      "code": "CER002AE036",
      "typeCode": "AE"
    },
    {
      "name": "Leaf Plate",
      "color": "Lime Green",
      "code": "CER004AE037",
      "typeCode": "AE"
    },
    {
      "name": "Luna Plate",
      "color": "Lime Green",
      "code": "CER004AE038",
      "typeCode": "AE"
    },
    {
      "name": "Luna Plate",
      "color": "Pink",
      "code": "CER008AE039",
      "typeCode": "AE"
    },
    {
      "name": "Neo Plate",
      "color": "Aqua",
      "code": "CER001AE040",
      "typeCode": "AE"
    },
    {
      "name": "Neo Plate",
      "color": "Nude",
      "code": "CER007AE041",
      "typeCode": "AE"
    },
    {
      "name": "Orbi Plate",
      "color": "Nude",
      "code": "CER007AE042",
      "typeCode": "AE"
    },
    {
      "name": "Orbi Lid",
      "color": "Nude",
      "code": "CER007AE043",
      "typeCode": "AE"
    },
    {
      "name": "Sky Plate",
      "color": "Stormy Blue",
      "code": "CER000AE044",
      "typeCode": "AE"
    },
    {
      "name": "7\" Sola Plate",
      "color": "Deep Blue",
      "code": "CER002AE045",
      "typeCode": "AE"
    },
    {
      "name": "7\" Sola Plate",
      "color": "Nude",
      "code": "CERO07AE046",
      "typeCode": "AE"
    },
    {
      "name": "Tara Plate Big",
      "color": "Deep Blue",
      "code": "CERO02AE047",
      "typeCode": "AE"
    },
    {
      "name": "Tara Plate Big",
      "color": "Nude",
      "code": "CERO07AE048",
      "typeCode": "AE"
    },
    {
      "name": "Tara Plate Big",
      "color": "Pink",
      "code": "CERO08AE049",
      "typeCode": "AE"
    },
    {
      "name": "Tara Plate Small",
      "color": "Deep Blue",
      "code": "CERO02AE050",
      "typeCode": "AE"
    },
    {
      "name": "Tara Plate Small",
      "color": "Pink",
      "code": "CERO08AE051",
      "typeCode": "AE"
    },
    {
      "name": "Yoo",
      "color": "Deep Blue",
      "code": "CERO02AE052",
      "typeCode": "AE"
    },
    {
      "name": "Yoo",
      "color": "Lime Green",
      "code": "CERO04AE054",
      "typeCode": "AE"
    },
    {
      "name": "Molo Saucer",
      "color": "Pink",
      "code": "CERO01AE055",
      "typeCode": "AE"
    },
    {
      "name": "Lilo Saucer",
      "color": "Aqua",
      "code": "CERO01AE056",
      "typeCode": "AE"
    },
    {
      "name": "Jojo Saucer",
      "color": "Aqua",
      "code": "CERO01AE057",
      "typeCode": "AE"
    },
    {
      "name": "Tara Plate Small",
      "color": "Matt Nude",
      "code": "CERO05AE058",
      "typeCode": "AE"
    },
    {
      "name": "Neo Plate",
      "color": "Matt Nude",
      "code": "CERO05AE059",
      "typeCode": "AE"
    },
    {
      "name": "Droplet",
      "color": "Matt Nude",
      "code": "CERO05AE060",
      "typeCode": "AE"
    },
    {
      "name": "Cee Plate Matt",
      "color": "Matt Lime Green",
      "code": "CERO11AE061",
      "typeCode": "AE"
    },
    {
      "name": "Xmas Tree",
      "color": "Nude",
      "code": "CERO07AE062",
      "typeCode": "AE"
    },
    {
      "name": "Clover Plate",
      "color": "Nude",
      "code": "CERO07AE063",
      "typeCode": "AE"
    },
    {
      "name": "Eve Plate",
      "color": "Nude",
      "code": "CERO07AE064",
      "typeCode": "AE"
    },
    {
      "name": "Eve Plate",
      "color": "Blush",
      "code": "CERO12AE065",
      "typeCode": "AE"
    },
    {
      "name": "Large Flat Plate 1",
      "color": "Aqua",
      "code": "CERO01AE066",
      "typeCode": "AE"
    },
    {
      "name": "Large Flat Plate 2",
      "color": "Aqua",
      "code": "CERO01AE067",
      "typeCode": "AE"
    },
    {
      "name": "Medium Plate",
      "color": "Aqua",
      "code": "CERO01AE068",
      "typeCode": "AE"
    },
    {
      "name": "Small Plate",
      "color": "Aqua",
      "code": "CERO01AE069",
      "typeCode": "AE"
    },
    {
      "name": "Big Plate",
      "color": "Aqua",
      "code": "CERO01AE070",
      "typeCode": "AE"
    },
    {
      "name": "Dome Pizza Platter",
      "color": "Nude",
      "code": "CERO07AE071",
      "typeCode": "AE"
    },
    {
      "name": "Aureole Plate",
      "color": "Nude",
      "code": "CERO07AE072",
      "typeCode": "AE"
    },
    {
      "name": "Eve Plate",
      "color": "Powder Blue",
      "code": "CERO12AE073",
      "typeCode": "AE"
    },
    {
      "name": "Clover Plate",
      "color": "Blush",
      "code": "CERO12AE074",
      "typeCode": "AE"
    },
    {
      "name": "Sola Plate",
      "color": "Aqua",
      "code": "CERO01AE075",
      "typeCode": "AE"
    },
    {
      "name": "Tara Plate Small",
      "color": "Lilac",
      "code": "CERO14AE076",
      "typeCode": "AE"
    },
    {
      "name": "Cosmo Plate",
      "color": "Aqua",
      "code": "CERO01AE077",
      "typeCode": "AE"
    },
    {
      "name": "Clover Plate",
      "color": "Lime Green",
      "code": "CERO04AE078",
      "typeCode": "AE"
    },
    {
      "name": "Eve Plate",
      "color": "Lime Green",
      "code": "CERO04AE079",
      "typeCode": "AE"
    },
    {
      "name": "Eve Plate",
      "color": "Aqua",
      "code": "CERO01AE080",
      "typeCode": "AE"
    },
    {
      "name": "Raindeer",
      "color": "Nude",
      "code": "CERO07AE081",
      "typeCode": "AE"
    },
    {
      "name": "Jay",
      "color": "Nude",
      "code": "CERO07AE082",
      "typeCode": "AE"
    },
    {
      "name": "Droplet",
      "color": "Nude",
      "code": "CERO07AE083",
      "typeCode": "AE"
    },
    {
      "name": "Dash",
      "color": "Nude",
      "code": "CERO07AE084",
      "typeCode": "AE"
    },
    {
      "name": "Aureole Plate",
      "color": "Aqua",
      "code": "CERO01AE085",
      "typeCode": "AE"
    },
    {
      "name": "Aureole Plate",
      "color": "Blush",
      "code": "CERO12AE086",
      "typeCode": "AE"
    },
    {
      "name": "Aureole Plate",
      "color": "Stormy Blue",
      "code": "CERO09AE087",
      "typeCode": "AE"
    },
    {
      "name": "Sky Plate",
      "color": "Nude",
      "code": "CERO07AE088",
      "typeCode": "AE"
    },
    {
      "name": "Sky Plate",
      "color": "Nude",
      "code": "CER007AE08B",
      "typeCode": "AE"
    },
    {
      "name": "Tara Plate Small",
      "color": "Nude",
      "code": "CER007AE09B",
      "typeCode": "AE"
    },
    {
      "name": "Orbi Plate",
      "color": "Experimental",
      "code": "CER005AE09D",
      "typeCode": "AE"
    },
    {
      "name": "Hyphen",
      "color": "Nude",
      "code": "CER007AE09I",
      "typeCode": "AE"
    },
    {
      "name": "Cee Plate",
      "color": "Nude",
      "code": "CER007AE09Z",
      "typeCode": "AE"
    },
    {
      "name": "Yoo",
      "color": "Nude",
      "code": "CER007AE03S",
      "typeCode": "AE"
    },
    {
      "name": "Droplet",
      "color": "Lime Green",
      "code": "CER004AE04",
      "typeCode": "AE"
    },
    {
      "name": "Droplet (Glazed In & Out)",
      "color": "Pink",
      "code": "CER008AE05G",
      "typeCode": "AE"
    },
    {
      "name": "10in Tara Plate",
      "color": "Nude",
      "code": "CER007AE06",
      "typeCode": "AE"
    },
    {
      "name": "Cosmo Plate (In & Out Glaze)",
      "color": "Nude",
      "code": "CER007AE07",
      "typeCode": "AE"
    },
    {
      "name": "Jojo Saucer",
      "color": "Melon",
      "code": "CER007AE09B",
      "typeCode": "AE"
    },
    {
      "name": "Jojo Saucer",
      "color": "Tea Green",
      "code": "CER006AE09",
      "typeCode": "AE"
    },
    {
      "name": "Krypto Plate",
      "color": "Stormy Blue",
      "code": "CER009AE00",
      "typeCode": "AE"
    },
    {
      "name": "8in Cosmo Plate",
      "color": "Nude",
      "code": "CER007AE01",
      "typeCode": "AE"
    },
    {
      "name": "Mojo Saucer",
      "color": "Tea Green",
      "code": "CER006AE02",
      "typeCode": "AE"
    },
    {
      "name": "Mojo Saucer",
      "color": "Melon",
      "code": "CER007AE03",
      "typeCode": "AE"
    },
    {
      "name": "Uno Plate",
      "color": "Midnight Blue",
      "code": "CER022AE24",
      "typeCode": "AE"
    },
    {
      "name": "Uno Plate",
      "color": "Ice Blue",
      "code": "CER022AE24",
      "typeCode": "AE"
    },
    {
      "name": "Duo Plate",
      "color": "Midnight Blue",
      "code": "CER022AE25",
      "typeCode": "AE"
    },
    {
      "name": "Trio Plate",
      "color": "Midnight Blue",
      "code": "CER022AE26",
      "typeCode": "AE"
    },
    {
      "name": "Triad Plate",
      "color": "Midnight Blue",
      "code": "CER022AE27",
      "typeCode": "AE"
    },
    {
      "name": "Penta Dinner Plate",
      "color": "Midnight Blue",
      "code": "CER022AE28",
      "typeCode": "AE"
    },
    {
      "name": "Uno Plate",
      "color": "Pacific Blue",
      "code": "CER022AE24",
      "typeCode": "AE"
    },
    {
      "name": "Duo Plate",
      "color": "Pacific Blue",
      "code": "CER022AE25",
      "typeCode": "AE"
    },
    {
      "name": "Trio Plate",
      "color": "Pacific Blue",
      "code": "CER022AE26",
      "typeCode": "AE"
    },
    {
      "name": "Triad Plate",
      "color": "Pacific Blue",
      "code": "CER022AE27",
      "typeCode": "AE"
    },
    {
      "name": "Penta Dinner Plate",
      "color": "Pacific Blue",
      "code": "CER022AE28",
      "typeCode": "AE"
    },
    {
      "name": "Sola Plate (In & Out Glaze)",
      "color": "Nude",
      "code": "CER007AE13",
      "typeCode": "AE"
    },
    {
      "name": "7\" Sola Plate",
      "color": "Nude (In Glaze)",
      "code": "CER027AE13",
      "typeCode": "AE"
    },
    {
      "name": "7\" Sola Plate",
      "color": "Nude (Different Glaze)",
      "code": "CER028AE15"
    }
  ]

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

async function bulkUploadSkus() {
  try {
    await connectDB();
    
    // Better option: Upsert based on sku_code to avoid duplicates
    const bulkOps = skuData.map(sku => ({
      updateOne: {
        filter: { code: sku.code },
        update: { $set: sku },
        upsert: true
      }
    }));

    const result = await ExistingSku.bulkWrite(bulkOps);
    
    console.log(`Bulk write results:`);
    console.log(`- Inserted: ${result.nInserted}`);
    console.log(`- Updated: ${result.nModified}`);
    console.log(`- Upserted: ${result.nUpserted}`);
    console.log(`- Total processed: ${result.nMatched + result.nUpserted}`);

    console.log('SKU data uploaded successfully');
  } catch (error) {
    console.error('Error uploading SKU data:', error);
  } finally {
    mongoose.disconnect();
  }
}

bulkUploadSkus();