import mongoose from "mongoose";

const existingSkuSchema = new mongoose.Schema({
    name: String,
    color: String,
    typeCode: String,
    code: String,
    shopifyProductId: String,
    shopifyVariantId: String,
    shopifyAdminUrl: String,
    shopifySyncedAt: Date
});

const ExistingSku = mongoose.model("ExistingSku", existingSkuSchema);
export default ExistingSku;