const express = require('express');
const orders = require('../controllers/orders.controller');

const router = express.Router()

router.get("/", orders)

module.exports = router