import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  category: String,
    last_code: Number
}); 

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;