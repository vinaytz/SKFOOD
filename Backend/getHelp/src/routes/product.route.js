const express = require('express');
const router = express.Router()
const auth = require("../controllers/product.controller")


router.get("/product", auth.login)


module.exports = router