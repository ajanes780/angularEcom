const express = require('express')
const router = express.Router()
const User = require('../models/users')
import { Request, Response } from 'express'
const colors = require('colors/safe')
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


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

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).send(" The user was not found");

  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).send({ userEmail: user.email, userName: user.name, token });
  } else {
    return res.status(200).send("Not authorized, please try a different email and password");
  }
});


router.post("/register", async (req: Request, res: Response) => {
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




router.get("/get/count", async (req: Request, res: Response) => {
  try {
    const userCount = await User.countDocuments();
    res.status(201).json({ userCount, success: true });
    console.log(colors.inverse(` Drum roll please.... your have ${userCount} products!`));
  } catch (error) {
    res.status(500).json({ message: "I could not get the product count", success: false, error });
    console.log(colors.red(error));
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`id`, id)
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Invalid user id");
  }

  try {
    const deletedUser = await User.findByIdAndRemove(id);
    res.status(201).json({ message: "The user  was deleted", success: true });
    console.log(colors.inverse(`Success the user was deleted`, deletedUser));
  } catch (error) {
    res.status(500).json({ message: "The user was not deleted", success: false, error });
    console.log(colors.red(error));
  }
});



module.exports = router
