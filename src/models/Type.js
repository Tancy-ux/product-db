import mongoose from "mongoose";

const types = new mongoose.Schema({
    name: String,
    code: String
});

const Type = mongoose.model("Type", types);
export default Type;