import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    name: String,
    code: String
});

const Material = mongoose.model("Material", materialSchema);
export default Material;