const menuModel = require("../model/menu.model")
const orderModel = require("../model/oder.model")
const jwt = require("jsonwebtoken")
const userSchema = require("../model/users.model")
const Razorpay = require('razorpay');
const crypto = require('crypto');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

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

// async function prepareYourThali(req, res){
//   try {
//     const { mealType, listOfSabjis, optionForRoti, noOfRoti } = req.body;

//     // ✅ Input validation
//     if (!mealType || !Array.isArray(listOfSabjis) || typeof noOfRoti !== 'number') {
//       return res.status(400).json({ message: 'Invalid input' });
//     }

//     // Special sabji check
//     const specialSabjis = await menuModel.exists({
//       mealType,
//       listOfSabjis: {
//         $elemMatch: { name: { $in: listOfSabjis }, isSpecial: true },
//       },
//     });

//     const mealDoc = await menuModel.findOne({ mealType });
//     const basePrice = mealDoc ? mealDoc.basePrice : 60;

//     const specialPrice = specialSabjis ? 20 : 0;
//     const priceForRoti = noOfRoti * 10;
//     const totalPrice = basePrice + specialPrice + priceForRoti;

//     const options = {
//       amount: totalPrice * 100, // Rs → paise
//       currency: "INR",
//       receipt: "receipt#1",
//     }; 

//     const order = await razorpay.orders.create(options);
//     res.json(order); // send order back to frontend

//   } catch (error) {
//     console.error('Cashfree order error', error);
//     res.status(500).json({ message: error.message || 'Something went wrong' });
//   }
// }

// async function orderPreparedThali(req, res) {    //Verify The Payment!
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature ,productId, productName, productImage, productDescription, productPrice } = req.body;
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     console.log("testing Done222 ")
//     const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET)
//     .update(body.toString())
//     .digest("hex");
    
//     if (expectedSignature === razorpay_signature) {
//       const token = req.headers.authorization?.split(" ")[1];
//       const orders = {
//         id:productId,
//         name:productName,
//         image:productImage,
//         description: productDescription,
//         price: productPrice
//       }
      
//       console.log(orders)
      
//       if(token){
//         const decode =  jwt.verify(token, process.env.JWT_SECRET)
//         console.log(`🙂🙂🙂🙂 ${decode}`)
//         console.log(`🙂🙂🙂🙂 ${decode._id}`)
//         const updatedUser = await userSchema.findByIdAndUpdate(
//           decode._id,
//           { $push: { orders: orders } },
//           { new: true } // return updated user
//         );
//         console.log(updatedUser)
//       }
//       res.json({ success: true, message: "Payment verified ✅" });
//     } else {
//       res.json({ success: false, message: "Payment verification failed ❌" });
//     } 
// }


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


// ✅ Step 1: Create Razorpay Order - FIXED
async function prepareYourThali(req, res) {
  try {
    const { 
      mealType, 
      menuId,
      selectedSabjis,  // Array of objects: [{ name, imageUrl, isSpecial }]
      baseOption,      // e.g., "5 Roti", "3 Roti + Rice"
      extraRoti,       // number
      quantity,        // number
      deliveryAddress  // { label, address, lat, lng, phoneNumber, hostel, room }
    } = req.body;

    // ✅ Verify user authentication
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    // ✅ Input validation
    if (!mealType || !menuId || !Array.isArray(selectedSabjis) || selectedSabjis.length === 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    if (selectedSabjis.length > 2) {
      return res.status(400).json({ message: 'Maximum 2 sabjis allowed' });
    }

    if (!baseOption || typeof extraRoti !== 'number' || typeof quantity !== 'number') {
      return res.status(400).json({ message: 'Invalid order configuration' });
    }

    if (quantity < 1 || quantity > 5) {
      return res.status(400).json({ message: 'Quantity must be between 1 and 5' });
    }

    if (!deliveryAddress || !deliveryAddress.address) {
      return res.status(400).json({ message: 'Delivery address is required' });
    }

    // ✅ Fetch menu details
    const mealDoc = await menuModel.findById(menuId);
    if (!mealDoc) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const basePrice = mealDoc.basePrice || 60;

    // ✅ Check if any selected sabji is special
    const hasSpecialSabji = selectedSabjis.some(sabji => sabji.isSpecial === true);
    const specialSabjiPrice = hasSpecialSabji ? 20 : 0;

    // ✅ Calculate extra roti price
    const extraRotiPrice = extraRoti * 10;

    // ✅ Calculate per thali price
    const perThaliPrice = basePrice + specialSabjiPrice + extraRotiPrice;

    // ✅ Calculate subtotal
    const subtotal = perThaliPrice * quantity;

    // ✅ Calculate bulk discount (5% for 3+ thalis)
    const discount = quantity >= 3 ? Math.round(subtotal * 0.05) : 0;

    // ✅ Calculate tax (5% GST)
    const tax = Math.round((subtotal - discount) * 0.05);

    // ✅ Delivery fee (free for now)
    const deliveryFee = 0;

    // ✅ Calculate total
    const total = subtotal - discount + tax + deliveryFee;

    // ✅ Generate OTP for delivery
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // ✅ Calculate estimated delivery time (40 minutes from now)
    const estimatedDelivery = new Date(Date.now() + 40 * 60 * 1000);

    // ✅ Create order in database (status: pending)
    const order = await orderModel.create({
      userId,
      mealType,
      menuId,
      selectedSabjis,
      baseOption,
      extraRoti,
      quantity,
      deliveryAddress,
      pricing: {
        basePrice,
        specialSabjiPrice,
        extraRotiPrice,
        subtotal,
        tax,
        deliveryFee,
        discount,
        total
      },
      status: 'pending',
      otp,
      estimatedDelivery
    });

    // ✅ FIXED: Save address to user's saved addresses
    try {
      const user = await userSchema.findById(userId);
      
      if (user) {
        // Check if address already exists (compare by address text)
        const addressExists = user.savedAddresses.some(
          addr => addr.address === deliveryAddress.address
        );

        if (!addressExists) {
          // Create clean address object with only defined values
          const newAddress = {
            label: deliveryAddress.label || 'Room',
            address: deliveryAddress.address,
            phoneNumber: deliveryAddress.phoneNumber || ''
          };

          // Only add lat/lng if they exist and are valid numbers
          if (deliveryAddress.lat && !isNaN(deliveryAddress.lat)) {
            newAddress.lat = Number(deliveryAddress.lat);
          }
          if (deliveryAddress.lng && !isNaN(deliveryAddress.lng)) {
            newAddress.lng = Number(deliveryAddress.lng);
          }

          // Push the address
          user.savedAddresses.push(newAddress);
          await user.save();
        }
      }
    } catch (addressError) {
      // Log error but don't fail the order
      console.error('Failed to save address:', addressError);
    }

    // ✅ Create Razorpay order
    const razorpayOptions = {
      amount: total * 100, // Convert to paise
      currency: "INR",
      receipt: `order_${order._id}`,
      notes: {
        orderId: order._id.toString(),
        mealType,
        quantity
      }
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    // ✅ Update order with razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    // ✅ Send response
    res.json({
      success: true,
      order: {
        id: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: total,
        currency: "INR"
      },
      razorpayOrder
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Something went wrong' 
    });
  }
}

// ✅ Step 2: Verify Payment and Confirm Order
async function orderPreparedThali(req, res) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId  // Our database order ID
    } = req.body;

    // ✅ Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment verification failed ❌" 
      });
    }

    // ✅ Verify user authentication
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Update order status
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // ✅ Verify order belongs to user
    if (order.userId.toString() !== decoded._id) {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized access to order' 
      });
    }

    res.json({ 
      success: true, 
      message: "Payment verified ✅",
      order: {
        id: order._id,
        status: order.status,
        otp: order.otp,
        estimatedDelivery: order.estimatedDelivery
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Payment verification failed' 
    });
  }
}
// ✅ Get user's order history
async function getUserOrders(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // const token = req.cookies.token; 
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const orders = await orderModel
      .find({ userId: decoded._id })
      .populate('menuId')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });

  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch orders' 
    });
  }
}

// ✅ Get user's saved addresses
async function getSavedAddresses(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userSchema.findById(decoded._id).select('savedAddresses');

    res.json({ 
      success: true, 
      addresses: user?.savedAddresses || [] 
    });

  } catch (error) {
    console.error('Fetch addresses error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch addresses' 
    });
  }
}
module.exports = {
    seeLunchMenu,
    seeDinnerMenu,
    prepareYourThali,
    orderPreparedThali,
    confirmedOrders,
    myOrderwithId,
    getUserOrders,
    getSavedAddresses
}