import mongoose from "mongoose";

const baseColorSchema = new mongoose.Schema({
    name: String
});

const BaseColor = mongoose.model("BaseColor", baseColorSchema);

export default BaseColor;