import BaseColor from "../models/BaseColor.js";
import Color from "../models/Color.js";
import CutleryColor from "../models/CutleryColor.js";
import GeneralColor from "../models/GeneralColor.js";
import Material from "../models/Material.js";
import Product from "../models/Product.js";
import Type from "../models/Type.js";

export const getCutleryColors = async (req, res) => {
  try {
    const colors = await CutleryColor.find().sort({ code: 1 });
    res.status(200).json({ data: colors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const newCutleryColor = async (req, res) => {
  try {
    const lastColor = await CutleryColor.findOne().sort({ code: -1 });
    const nextCode = lastColor ? lastColor.code + 1 : 1;

    const newColor = new CutleryColor({ ...req.body, code: nextCode });
    await newColor.save();
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getColorByMaterial = async (req, res) => {
  const { material } = req.params;
  try {
    const colors = await GeneralColor.find({ material }).sort({ code: 1 });
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addColorByMaterial = async (req, res) => {
  try {
    const { material, color } = req.body;
    const existing = await GeneralColor.findOne({ material, color });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Color already exists for this material." });
    }

    const lastColor = await GeneralColor.findOne({ material }).sort({
      code: -1,
    });
    const nextCode = lastColor ? lastColor.code + 1 : 1;

    const newColor = new GeneralColor({ material, color, code: nextCode });
    await newColor.save();
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMaterialCode = async (req, res) => {
  try {
    const { material, color } = req.body;

    const colorData = await GeneralColor.findOne({ material, color });

    if (colorData) {
      return res.status(200).json({ exists: true, data: colorData.code });
    }

    return res.status(200).json({
      exists: false,
      message: "Color combination does not exist! Please create it first.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCutleryCode = async (req, res) => {
  try {
    const { handleColor, finishColor } = req.body;

    const colorData = await GeneralColor.findOne({ handleColor, finishColor });

    if (colorData) {
      return res.status(200).json({ exists: true, data: colorData.code });
    }

    return res.status(200).json({
      exists: false,
      message: "Color combination does not exist! Please create it first.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllColorEntries = async (req, res) => {
  try {
    const colors = await Color.find().sort({ code: 1 });
    res.status(200).json({ data: colors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBaseColor = async (req, res) => {
  const { name } = req.body;
  try {
    const exists = await BaseColor.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Color already exists" });
    }
    const newColor = new BaseColor({ name });
    await newColor.save();
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBase = async (req, res) => {
  try {
    const colors = await BaseColor.find().sort({ code: 1 });
    res.status(200).json({ data: colors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMaterialSkuCode = async (req, res) => {
  try {
    const { materialName, colour, typology, productName } = req.body;

    const material = await Material.findOne({ name: materialName });
    if (!material) {
      return res
        .status(404)
        .json({ message: "Material not found", data: material });
    }

    let color = await GeneralColor.findOne({
      material: materialName,
      color: colour,
    });
    if (!color) {
      return res.status(404).json({ message: "Color not found!", data: color });
    }
    let colorCode = color.code.toString().padStart(3, "0");

    const type = await Type.findOne({ name: typology });
    if (!type) {
      return res.status(404).json({ message: "Type not found" });
    }

    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const designCode = product.design_code;

    const skuCode = `${material.code}${colorCode}${type.code}${designCode}`;
    res
      .status(200)
      .json({ message: "SKU code generated successfully", data: skuCode });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
