const express = require('express');
const router = express.Router()
const userPanel = require("../controllers/userPanel.controller")

router.get("/seeLunchMenu",userPanel.seeLunchMenu)                     //✅
router.get("/seeDinnerMenu",userPanel.seeDinnerMenu)                  //✅
router.post("/prepareYourThali",userPanel.prepareYourThali)           //✅
router.post("/orderPreparedThali",userPanel.orderPreparedThali)     //


router.get("/confirmedOrders",userPanel.confirmedOrders)       //✅
router.get("/myOrderwithId/:id",userPanel.myOrderwithId)      //✅
    
router.get('/getUserOrders', userPanel.getUserOrders);
router.get('/getSavedAddresses', userPanel.getSavedAddresses);


module.exports = router