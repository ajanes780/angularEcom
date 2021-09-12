import { HttpException } from "../Interfaces/interfaces";
const colors = require("colors/safe");
import { Request, Response, NextFunction } from "express";

const errorHandler = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "UnauthorizedError") {
    const error = new HttpException(err.status, `Unauthorized for this request`);
    console.log(colors.red(error.errorMessage()));
    return res.send(error.errorMessage());
  }
  if (err) {
    const error = new HttpException(err.status, `${err.message}`);
    console.log(colors.red(error.errorMessage()));
    return res.send(error.errorMessage());
  }


};

module.exports = errorHandler;
