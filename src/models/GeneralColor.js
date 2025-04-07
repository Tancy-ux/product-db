import mongoose from "mongoose";

const materialColorSchema = new mongoose.Schema({
    material: String,
    color: String,
    code: Number
});

const MaterialColor = mongoose.model("MaterialColor", materialColorSchema);

export default MaterialColor;
