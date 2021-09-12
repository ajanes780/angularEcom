const express = require('express')
const router = express.Router()
const Product = require("../models/product");
const mongoose = require("mongoose");
const Category = require("../models/category");
import { Request, Response } from "express";
const colors = require("colors/safe");

// get all products
router.get(`/`, async (req: Request, res: Response) => {
  let filter = {};
  if (req.query.categories && typeof req.query.categories === "string") {
    filter = { category: req.query.categories.split(",") };
  }

  try {
    const productList = await Product.find(filter);
    res.send(productList);
  } catch (error) {
    console.log(colors.red(error));
    res.status(500).json({ success: false, message: error });
  }
});

router.get("/get/count", async (req: Request, res: Response) => {
  try {
    const productCount = await Product.countDocuments();
    res.status(201).json({ productCount, success: true });
    console.log(colors.inverse(` Drum roll please.... your have ${productCount} products!`));
  } catch (error) {
    res.status(500).json({ message: "I could not get the product count", success: false, error });
    console.log(colors.red(error));
  }
});

router.get("/get/featured/:count", async (req: Request, res: Response) => {
  const limit: Number = Number(req.params.count) || 0;

  try {
    const featuredProducts = await Product.find({ isFeatured: true }).limit(limit);
    res.status(201).json({ featuredProducts, success: true });
    console.log(colors.inverse(` Drum roll please.... your have ${featuredProducts} featured products!`));
  } catch (error) {
    res.status(500).json({ message: "I could not get the featured products", success: false, error });
    console.log(colors.red(error));
  }
});

//  get single product
router.get(`/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).send("Invalid product id");
    }
    const singleProduct = await Product.findById(id).populate("category");
    res.status(200).json({ singleProduct, success: true });
  } catch (error) {
    console.log(colors.red(error));
    res.status(500).json({ success: false, message: error });
  }
});

//  create a single product
router.post("/", async (req: Request, res: Response) => {
  const {
    name,
    description,
    richDescription,
    image,
    images,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured,
    dateCreated,
  } = req.body;

  try {
    // validate the required fields
    const result = await Category.findById(category);
    if (!result) return res.status(400).send("Invalid category");

    const product = new Product({
      name,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category: result,
      countInStock,
      rating,
      numReviews,
      isFeatured,
      dateCreated,
    });

    const newProduct = await product.save();
    res.status(201).json({ newProduct, message: "Product was created", success: true });
    console.log(colors.inverse(`Success this product was created`, product));
  } catch (error) {
    res.status(500).json({ message: "The product was not created", success: false, error });
    console.log(colors.red(error));
  }
});

// update the product
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Invalid product id");
  }
  const {
    name,
    description,
    richDescription,
    image,
    images,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured,
    dateCreated,
  } = req.body;

  try {
    // valid the required fields
    const result = await Category.findById(category);
    if (!result) return res.status(400).send("Invalid category");

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        richDescription,
        image,
        images,
        brand,
        price,
        category: result,
        countInStock,
        rating,
        numReviews,
        isFeatured,
        dateCreated,
      },
      { new: true }
    );

    res.status(201).json({ updatedProduct, message: "Product was updated", success: true });
    console.log(colors.inverse(`Success the product was created`, updatedProduct));
  } catch (error) {
    res.status(500).json({ message: "The product was not updated", success: false, error });
    console.log(colors.red(error));
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Invalid product id");
  }

  try {
    const deletedProduct = await Product.findByIdAndRemove(id);
    res.status(201).json({ message: "Product was deleted", success: true });
    console.log(colors.inverse(`Success the product was deleted`, deletedProduct));
  } catch (error) {
    res.status(500).json({ message: "The product was not deleted", success: false, error });
    console.log(colors.red(error));
  }
});






module.exports = router
