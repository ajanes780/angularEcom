const express = require('express')
const router = express.Router()
const Orders = require('../models/orders')
const OrderItem = require("../models/orderItem");
const colors = require("colors/safe");
const admin = require("../helpers/admin");
const mongoose = require("mongoose");

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

router.get(`/get/userorders/:userid`, admin, async (req: Request, res: Response) => {
  try {
    //  using populate to create a "join" and fill the data from the other table/doc  also sort new to old
    const userOrdersList = await Orders.find({ user: req.params.userid })
      .populate("user", "name")
      .populate({ path: "orderItems", populate: { path: "product", populate: "category" } })
      .sort({ dateOrdered: -1 });

    res.send(userOrdersList);
  } catch (error) {
    console.log(colors.red(error));
    res.status(500).json({ success: false, message: error });
  }
});

router.get(`/:id`, admin, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Invalid order id");
  }
  try {
    //  using populate to create a " multi join" and fill the data from the other table/doc
    const order = await Orders.findById(id)
      .populate("user", "name street")
      .populate({ path: "orderItems", populate: { path: "product", populate: "category" } });
    res.send(order);
  } catch (error) {
    console.log(colors.red(error));
    res.status(500).json({ success: false, message: error });
  }
});

router.get(`/get/totalsales`, admin, async (req: Request, res: Response) => {
  try {
    const totalSales = await Orders.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
      { $project: { totalSales: { $trunc: ["$totalSales", 2] } } },
    ]);
    if (totalSales) {
      res.status(200).json({ totalSales, message: `Your total sales are ${totalSales[0].totalSales}`, success: true });
    }
  } catch (error) {
    res.status(404).json({
      message: "The total sales could not be calculated",
      success: false,
      error: error,
    });
  }
});

router.get("/get/count", admin, async (req: Request, res: Response) => {
  try {
    const totalOrders = await Orders.countDocuments();
    res.status(201).json({ totalOrders, success: true });
    console.log(colors.inverse(` Drum roll please.... your have ${totalOrders} orders!!!`));
  } catch (error) {
    res.status(500).json({ message: "I could not get the product count", success: false, error });
    console.log(colors.red(error));
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
  const calculatePrice = await Promise.all(
    orderItemsIdsResolved.map(async (item) => {
      const orderItem = await OrderItem.findById(item).populate("product", "price");
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  //  may add tofixed(2) here
  const totalPrice = calculatePrice.reduce((a, b) => a + b, 0);

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

router.put("/:id", admin, async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Invalid order id");
  }
  const { status } = req.body;
  try {
    const result = await Orders.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    if (result) {
      res.status(200).json({ result, message: "Order has been updated", success: true });
    }
  } catch (error) {
    res.status(404).json({
      message: "The order could not be updated please try again later",
      success: false,
      error: error,
    });
  }
});

router.delete("/:id", admin, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Invalid order id");
  }

  try {
    const deletedOrder = await Orders.findByIdAndRemove(id);
    if (deletedOrder) {
      await deletedOrder.orderItems.map(async (item) => {
        await OrderItem.findByIdAndRemove(item._id);
      });
      res.status(200).json({ message: "Order was deleted", success: true });
      console.log(colors.inverse(`Success the order was deleted`, deletedOrder));
    }
  } catch (error) {
    res.status(500).json({ message: "The order was not deleted", success: false, error });
    console.log(colors.red(error));
  }
});



module.exports = router
