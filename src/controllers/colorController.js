import CutleryColor from "../models/CutleryColor.js";
import GeneralColor from "../models/GeneralColor.js";

export const getCutleryColors = async(req, res) => {
    try {
        const colors = await CutleryColor.find().sort({code: 1});
        res.status(200).json({ data: colors });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const newCutleryColor = async(req, res) => {
    try {
        const lastColor = await CutleryColor.findOne().sort({code: -1});
        const nextCode = lastColor ? lastColor.code + 1 : 1;

        const newColor = new CutleryColor({...req.body, code: nextCode});
        await newColor.save();
        res.status(201).json(newColor);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getColorByMaterial = async(req, res) => {
    const {material} = req.params;
    try {
        const colors = await GeneralColor.find({material}).sort({code: 1});
        res.status(200).json(colors);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const addColorByMaterial = async(req, res) => {
    try {
        const {material, color} = req.body;
        const existing = await GeneralColor.findOne({ material, color });
        if (existing) {
            return res.status(400).json({ message: "Color already exists for this material." });
        }

        const lastColor = await GeneralColor.findOne({material}).sort({code: -1});
        const nextCode = lastColor ? lastColor.code + 1 : 1;

        const newColor = new GeneralColor({material, color, code: nextCode});
        await newColor.save();
        res.status(201).json(newColor);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getMaterialCode = async (req, res) => {
    try {
      const { material, color } = req.body;
  
      const colorData = await GeneralColor.findOne({ material, color});
  
      if (colorData) {
        return res.status(200).json({ exists: true, data: colorData.code });
      }
  
      return res.status(200).json({
        exists: false,
        message: "Color combination does not exist! Please create it first."
      });
  
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  };

  export const getCutleryCode = async (req, res) => {
    try {
      const { handleColor, finishColor} = req.body;
  
      const colorData = await GeneralColor.findOne({ handleColor, finishColor});
  
      if (colorData) {
        return res.status(200).json({ exists: true, data: colorData.code });
      }
  
      return res.status(200).json({
        exists: false,
        message: "Color combination does not exist! Please create it first."
      });
  
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  };