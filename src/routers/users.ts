const express = require('express')
const router = express.Router()

import { Request, Response } from 'express'
const colors = require('colors/safe')

router.get(`/`, async (eq: Request, res: Response) => {})

router.post('/', async (req: Request, res: Response) => {})

module.exports = router
