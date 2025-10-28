const express = require('express');
const router = express.Router()
const auth = require("../controllers/auth.controller")

router.post("/signup", auth.signup)
router.post("/login", auth.login)

router.get("/google", auth.googleAuth)
router.get("/google/callback", auth.googleAuthCallback)

router.get("/profile", auth.profile)
router.get("/checkAuth", auth.checkAuth)
router.get("/check", (req,res)=>{res.send("f")})

module.exports = router