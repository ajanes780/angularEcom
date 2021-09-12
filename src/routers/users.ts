const express = require('express')
const router = express.Router()
const User = require('../models/users')
import { Request, Response } from 'express'
const colors = require('colors/safe')
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// get all of users
router.get(`/`, async (req: Request, res: Response) => {
  try {
    const usersList = await User.find().select("-passwordHash");
    res.send(usersList);
  } catch (error) {
    console.log(colors.red(error));
    res.status(500).json({ success: false, message: error });
  }
});
//  get on single user
router.get(`/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Invalid user id");
  }
  try {
    const user = await User.findById(id).select("-passwordHash");
    console.log(`user`, user);
    res.send(user);
  } catch (error) {
    console.log(colors.red(error));
    res.status(500).json({ success: false, message: error });
  }
});

// add a new user
router.post("/", async (req: Request, res: Response) => {
  const { name, email, password, phone, isAdmin, street, apartment, city, postalCode, country } = req.body;
  const checkEmail = await User.find({ email });

  if (checkEmail.length) return res.send("That user already exists");

  try {
    let newUser = new User({
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 8),
      phone,
      isAdmin,
      street,
      apartment,
      city,
      postalCode,
      country,
    });
    const result = await newUser.save();

    if (result) {
      res.status(201).json({ result, success: true });
    }
  } catch (error) {
    res.status(404).json({
      message: "The user could not be created",
      success: false,
      error: error,
    });
  }
});

// update user
router.put("/:id", async (req: Request, res: Response) => {
  const { name, email, password, phone, isAdmin, street, apartment, city, postalCode, country } = req.body;
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Invalid user id");
  }

  const userExists = await User.findById(id);
  if (!userExists) return res.send("User not found");
  let newPassword: string;

  if (password) {
    newPassword = bcrypt.hashSync(password, 8);
  } else {
    newPassword = userExists.passwordHash;
  }

  try {
    let updateUser = await User.findByIdAndUpdate(id, {
      name: name || userExists.name,
      email: email || userExists.email,
      passwordHash: newPassword,
      phone: phone || userExists.phone,
      isAdmin: isAdmin || userExists.isAdmin,
      street: street || userExists.street,
      apartment: apartment || userExists.apartment,
      city: city || userExists.city,
      postalCode: postalCode || userExists.postalCode,
      country: country || userExists.country,
    });
    if (updateUser) {
      res.status(201).json({ updateUser, message: "User has been updated", success: true });
    }
  } catch (error) {
    res.status(404).json({
      message: "The user could not be updated",
      success: false,
      error: error,
    });
  }
});

module.exports = router
