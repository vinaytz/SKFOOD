const myPayment = require('../controllers/payment.controller');
const express = require("express")

const router = express.Router()

router.post("/order", myPayment.makePayment)
router.post("/verify",myPayment.verifyPayment)

module.exports = router

