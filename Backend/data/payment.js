const menuModel = require("../model/menu.model")
const orderModel = require("../model/oder.model")
const axios = require("axios")
// const razorpay = require("../config/paymentConfig")
// const { Cashfree } = require('cashfree-pg');
// const Razorpay = require('razorpay');
// Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });
// const cashfree = new Cashfree(Cashfree.SANDBOX, process.env.CASHFREE_APP_ID, process.env.CASHFREE_SECRET_KEY);


async function seeLunchMenu(req, res){
    try {
        const seeMenu = await menuModel.find({
            mealType:"lunch"
        })
        res.json(seeMenu)
    } catch (error) {
    res.json({'message': `Somwthing went worng ${error}`})
    }
}

async function seeDinnerMenu(req, res){
        try {
        const seeMenu = await menuModel.find({
            mealType:"dinner"
        })
        res.json(seeMenu)
    } catch (error) {
    res.json({'message': `Somwthing went worng error`})
    }
}

async function prepareYourThali(req, res){
    try {
        
    } catch (error) {
    res.json({'message': `Somwthing went worng error`})
    }
}

// async function orderPreparedThali(req, res){
//     //input Validation required!!!
//     try {
//         const {mealType, listOfSabjis, optionForRoti, noOfRoti} = req.body;
//             const specialSabjis = await menuModel.exists({
//                 mealType,
//                 listOfSabjis: {
//                     $elemMatch: { name: { $in: listOfSabjis }, isSpecial: true }
//                 }
//             });

//         const mealDoc = await menuModel.findOne({ mealType });
//         const basePrice = mealDoc ? mealDoc.basePrice : 60;

//         let specialPrice = 0
//         if (!!specialSabjis) specialPrice = 20
//         const priceForRoti = noOfRoti*10;
//         const totalPrice = basePrice  + specialPrice + priceForRoti  // supposeing 
//         const options = {
//             amount: totalPrice, // Rs → paise
//             currency: "INR",
//             receipt: "receipt#1",
//             }; 

//         const order = await razorpay.orders.create(options);
//         res.json(order); // send order back to frontend


//         // res.json({"message":`total cost: ${totalPrice}`})
//     } catch (error) {
//     res.json({'message': `Something went worng ${error}`})
//     }
// }

// async function orderPreparedThali(req, res){
//     //input Validation required!!!
//     try {
//         const {mealType, listOfSabjis, optionForRoti, noOfRoti} = req.body;
//             const specialSabjis = await menuModel.exists({
//                 mealType,
//                 listOfSabjis: {
//                     $elemMatch: { name: { $in: listOfSabjis }, isSpecial: true }
//                 }
//             });

//         const mealDoc = await menuModel.findOne({ mealType });
//         const basePrice = mealDoc ? mealDoc.basePrice : 60;

//         let specialPrice = 0
//         if (!!specialSabjis) specialPrice = 20
//         const priceForRoti = noOfRoti*10;
//         const totalPrice = basePrice  + specialPrice + priceForRoti  // supposeing 


//         // Generate unique order_id
//         const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

//         // Prepare Cashfree order request (v2023-08-01 API format)
//         const cashfreeRequest = {
//             order_amount: totalPrice,
//             order_currency: 'INR',
//             order_id: orderId,
//             customer_details: {
//                 customer_id: `CUST_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // Unique customer ID
//                 customer_email: "customer_email@gmail.com",
//                 customer_phone: 9392939294
//             },
//             order_meta: {
//                 return_url: `https://${req.get('host')}/payment/success?order_id=${orderId}`, // Your success redirect URL
//                 notify_url: `https://${req.get('host')}/webhook/cashfree` // Optional: for server-to-server notifications
//             }
//         };
//         console.log("Sdsdsf")
        
//         // Create order on Cashfree
//         const cashfreeResponse = await cashfree.PGCreateOrder(cashfreeRequest);
//         if (!cashfreeResponse || cashfreeResponse.status !== 'OK' || !cashfreeResponse.data.payment_session_id) {
//             throw new Error(`Cashfree order creation failed: ${cashfreeResponse.message || 'Unknown error'}`);
//         }
        
//         cashfree.PGCreateOrder(cashfreeRequest).then((response) => {
//             console.log('Order Created successfully:',response.data)
//         }).catch((error) => {
//             console.error('Error:', error.response.data.message);
//         });
        
//         console.log("Sdsdsf")
//         // Success: Return details for frontend to open checkout
//         res.json({
//             message: 'Order created successfully. Proceed to payment.',
//             order_id: orderId,
//             payment_session_id: cashfreeResponse.data.payment_session_id,
//             total_amount: totalPrice,
//             order_details: {
//                 mealType,
//                 sabjis: listOfSabjis,
//                 rotis: noOfRoti,
//                 optionForRoti
//             }
//         });

//         // const options = {
//         //     amount: totalPrice, // Rs → paise
//         //     currency: "INR",
//         //     receipt: "receipt#1",
//         //     }; 

//         // const order = await razorpay.orders.create(options);
//         // res.json(order); // send order back to frontend


//         // res.json({"message":`total cost: ${totalPrice}`})
//     } catch (error) {
//     res.json({'message': `Something went worng ${error}`})
//     }
// }


// const { Cashfree } = require("@cashfreepayments/cashfree-pg-sdk-node");

// const cf = new Cashfree({
//   mode: "TEST", // or "PROD"
//   appId: process.env.CASHFREE_APP_ID,
//   secretKey: process.env.CASHFREE_SECRET_KEY,
// });

async function orderPreparedThali(req, res) {
  try {
    const { mealType, listOfSabjis, optionForRoti, noOfRoti } = req.body;

    // ✅ Input validation
    if (!mealType || !Array.isArray(listOfSabjis) || typeof noOfRoti !== 'number') {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Special sabji check
    const specialSabjis = await menuModel.exists({
      mealType,
      listOfSabjis: {
        $elemMatch: { name: { $in: listOfSabjis }, isSpecial: true },
      },
    });

    const mealDoc = await menuModel.findOne({ mealType });
    const basePrice = mealDoc ? mealDoc.basePrice : 60;

    let specialPrice = specialSabjis ? 20 : 0;
    const priceForRoti = noOfRoti * 10;
    const totalPrice = basePrice + specialPrice + priceForRoti;

    // Unique order ID
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // ✅ Cashfree order request
    const cashfreeRequest = {
      order_amount: totalPrice,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: `CUST_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        customer_email: "customer_email@gmail.com",
        customer_phone: "9392939294", // ✅ string, not number
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/payment/success?order_id=${orderId}`,
        notify_url: `${process.env.BACKEND_URL}/webhook/cashfree`,
      },
    };

    // ✅ Only create order once
    const cashfreeResponse = await cashfree.PGCreateOrder(cashfreeRequest);

    if (
      !cashfreeResponse ||
      cashfreeResponse.status !== 'OK' ||
      !cashfreeResponse.data.payment_session_id
    ) {
      throw new Error(
        `Cashfree order creation failed: ${cashfreeResponse.message || 'Unknown error'}`
      );
    }

    // ✅ Send success response
    res.json({
      message: 'Order created successfully. Proceed to payment.',
      order_id: orderId,
      payment_session_id: cashfreeResponse.data.payment_session_id,
      total_amount: totalPrice,
      order_details: {
        mealType,
        sabjis: listOfSabjis,
        rotis: noOfRoti,
        optionForRoti,
      },
    });
  } catch (error) {
    console.error('Cashfree order error', error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
}

async function confirmedOrders(req, res){
    try {
        // console.log(req.userId)
        console.log("",res.userId)
        const allConfirmedOrders = await orderModel.find({userId: res.userId, status:"Confirmed"});
        res.json(allConfirmedOrders)
    } catch (error) {
    res.json({'message': `Something went worng ${error}`})
    }
}

async function myOrderwithId(req, res){
    try {
        const { id } = req.params;
        const order = await orderModel.findOne({_id:id})
        res.json(order)
    } catch (error) {
    res.json({'message': `Something went worng ${error}`})
    }
}

module.exports = {
    seeLunchMenu,
    seeDinnerMenu,
    prepareYourThali,
    orderPreparedThali,
    confirmedOrders,
    myOrderwithId
}