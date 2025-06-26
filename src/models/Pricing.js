import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
    skuCode: String,
    makingPriceExclGst: Number,
    makingPriceInclGst: Number,
    deliveryCharges: {
        type: Number,
        default: 0
    },
    totalCost: Number,
    sellingPriceExclGst: Number,
    sellingPriceInclGst: Number,
    cogs: Number
});

const Pricing = mongoose.model("Pricing", pricingSchema);
export default Pricing;