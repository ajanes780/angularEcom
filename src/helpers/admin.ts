import { HttpException } from "../Interfaces/interfaces";
const colors = require("colors/safe");
import { Request, Response, NextFunction } from "express";

//  build interface for this
const admin = (req, res: Response, next: NextFunction) => {
  if (req.user.isAdmin === false) {
    console.log(colors.red("Permission denied."));
    res.json({ message: "Permission denied." });
  } else {
    next();
  }
};

module.exports = admin;
export {};
