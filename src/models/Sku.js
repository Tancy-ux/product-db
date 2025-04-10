import mongoose from "mongoose";

const skuSchema = new mongoose.Schema({
    materialCode: String,
    color: String,
    typeCode: String,
    skuCode: String,
    productName: String,
});

const Sku = mongoose.model("Sku", skuSchema);
export default Sku;