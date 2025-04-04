import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
    outerColor: String,
    innerColor: String,
    rimColor: String,
    code: Number
});

const Color = mongoose.model("Color", colorSchema);
export default Color;