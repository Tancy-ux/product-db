import mongoose from "mongoose";

const singleColorSchema = new mongoose.Schema({
    name: String,
    code: Number
});

const SingleColor = mongoose.model("SingleColor", singleColorSchema);

export default SingleColor;