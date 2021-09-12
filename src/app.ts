require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const colors = require('colors/safe')
const app = express()
const Product = require('./models/product')
const cors = require('cors')
const authJwt = require("./helpers/jwt");
import { Request, Response, NextFunction } from "express";
import { HttpException } from "./Interfaces/interfaces";
app.use(cors());
app.options("*", cors());

// middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    const error = new HttpException(err.status, `${err.message}`);
    console.log(colors.red(error.errorMessage()));
    res.send(error.errorMessage());
  }
});

// routers
const productRouter = require("./routers/products");
const categoryRouter = require("./routers/category");
const ordersRouter = require("./routers/orders");
const usersRouter = require("./routers/users");

const api = process.env.API_URL;
app.use(`${api}/products`, productRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);

//  DB connection
interface Error {
  message: string;
}
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@angularstore.irh8h.mongodb.net/angularStore?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log(colors.rainbow("MongoDB is now connected"));
  })
  .catch((e: HttpException) => {
    console.log(colors.red(` There has been a database error ${e.message}`));
  });
  
app.listen(3000, () => {
  console.log(colors.random('Server is running on port 3000'))
})
