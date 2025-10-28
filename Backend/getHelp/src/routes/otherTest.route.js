const express = require("express")
const router = express.Router()
const otherTest = require("../controllers/otherTest.controller")
const {authMiddlewareForFileStorage} = require("../middleware/auth.middleware")
const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage()
})

router.get("/test1", authMiddlewareForFileStorage,   upload.single("video"), otherTest.testing1)


module.exports = router