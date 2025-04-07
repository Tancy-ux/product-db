import mongoose from "mongoose";

const cutlerySchema = new mongoose.Schema({
    handleColor: String,
    finishColor: String,
    code: Number
});

const CutleryColor = mongoose.model("CutleryColor", cutlerySchema);
export default CutleryColor;