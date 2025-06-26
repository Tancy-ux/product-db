import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
    skuCode: String,
    makingPriceExclGst: Number,
    makingPriceInclGst: Number,
    deliveryCharges: Number,
    totalCost: Number,
    sellingPriceExclGst: Number,
    sellingPriceInclGst: Number,
    cogs: Number
});

const Pricing = mongoose.model("Pricing", pricingSchema);
export default Pricing;