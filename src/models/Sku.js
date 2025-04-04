import mongoose from "mongoose";

const skuSchema = new mongoose.Schema({
    materialCode: String,
    colorCode: String,
    typeCode: String,
    skuCode: String,
});

const Sku = mongoose.model("Sku", skuSchema);
export default Sku;