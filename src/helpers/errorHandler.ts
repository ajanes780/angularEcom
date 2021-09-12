import { HttpException } from "../Interfaces/interfaces";
const colors = require("colors/safe");
import { Request, Response, NextFunction } from "express";

const errorHandler = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    const error = new HttpException(err.status, `${err.message}`);
    console.log(colors.red(error.errorMessage()));
    res.send(error.errorMessage());
  }
};

module.exports = errorHandler;
