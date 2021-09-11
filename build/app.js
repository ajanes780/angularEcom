"use strict";
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const api = process.env.API_URL;
const app = express();
// middleware
app.use(express.json());
app.use(morgan('tiny'));
// routes
app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'string',
        url: 'nome_url',
    };
    res.send(product);
});
app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body;
    console.log(`newProduct`, newProduct);
    res.send('Hello World');
});
app.listen(3000, () => {
    console.log(' Server is running on port 3000');
});
