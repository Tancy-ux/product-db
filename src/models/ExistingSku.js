import mongoose from "mongoose";

const existingSkuSchema = new mongoose.Schema({
    name: String,
    color: String,
    code: String
});

const ExistingSku = mongoose.model("ExistingSku", existingSkuSchema);
export default ExistingSku;