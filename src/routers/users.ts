const express = require('express')
const router = express.Router()
const User = require('../models/users')
import { Request, Response } from 'express'
const colors = require('colors/safe')

router.get(`/`, async (eq: Request, res: Response) => {
  try {
    const usersList = await User.find()
    res.send(usersList)
  } catch (error) {
    console.log(colors.red(error))
    res.status(500).json({ success: false, message: error })
  }
})

router.post('/', async (req: Request, res: Response) => {})

module.exports = router
