const express = require('express')
const router = express.Router()
const Orders = require('../models/orders')
const OrderItem = require("../models/orderItem");
const colors = require("colors/safe");
const admin = require("../helpers/admin");
import { Request, Response } from "express";
import { OrderItemClass } from "../Interfaces/interfaces";

router.get(`/`, admin, async (req: Request, res: Response) => {
  try {
    //  using populate to create a "join" and fill the data from the other table/doc  also sort new to old
    const ordersList = await Orders.find().populate("user", "name street").sort({ dateOrdered: -1 });
    res.send(ordersList);
  } catch (error) {
    console.log(colors.red(error));
    res.status(500).json({ success: false, message: error });
  }
});
router.get(`/:id`, admin, async (req: Request, res: Response) => {
  try {
    //  using populate to create a " multi join" and fill the data from the other table/doc
    const order = await Orders.findById(req.params.id)
      .populate("user", "name street")
      .populate({ path: "orderItems", populate: { path: "product", populate: "category" } });
    res.send(order);
  } catch (error) {
    console.log(colors.red(error));
    res.status(500).json({ success: false, message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const {
    orderItems,
    shippingAddress1,
    shippingAddress2,
    city,
    postalCode,
    Country,
    phone,
    status,
    totalPrice,
    user,
    dateOrdered,
  } = req.body;

  const orderItemsId = Promise.all(
    orderItems.map(async (item: OrderItemClass) => {
      let newOrderItem = new OrderItem({
        quantity: item.quantity,
        product: item.product,
      });

      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsId;

  try {
    let newOrder = new Orders({
      orderItems: orderItemsIdsResolved,
      shippingAddress1,
      shippingAddress2,
      city,
      postalCode,
      Country,
      phone,
      status,
      totalPrice,
      user,
      dateOrdered,
    });

    const result = await newOrder.save();
    if (result) {
      res.status(201).json({ result, success: true });
    }
  } catch (error) {
    res.status(404).json({
      message: "The newOrder could not be created",
      success: false,
      error: error,
    });
  }
});

router.post('/', async (req: Request, res: Response) => {})

module.exports = router
