const menuModel = require("../model/menu.model")
const orderModel = require("../model/oder.model")

const Razorpay = require('razorpay');

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

async function prepareYourThali(req, res){
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

    const specialPrice = specialSabjis ? 20 : 0;
    const priceForRoti = noOfRoti * 10;
    const totalPrice = basePrice + specialPrice + priceForRoti;

    const options = {
      amount: totalPrice * 100, // Rs → paise
      currency: "INR",
      receipt: "receipt#1",
    }; 

    const order = await razorpay.orders.create(options);
    res.json(order); // send order back to frontend

  } catch (error) {
    console.error('Cashfree order error', error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
}

async function orderPreparedThali(req, res) {    //Verify The Payment!
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature ,productId, productName, productImage, productDescription, productPrice } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("testing Done222 ")
    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
    
    if (expectedSignature === razorpay_signature) {
      const token = req.headers.authorization?.split(" ")[1];
      const orders = {
        id:productId,
        name:productName,
        image:productImage,
        description: productDescription,
        price: productPrice
      }
      
      console.log(orders)
      
      if(token){
        const decode =  jwt.verify(token, process.env.JWT_SECRET)
        console.log(`🙂🙂🙂🙂 ${decode}`)
        console.log(`🙂🙂🙂🙂 ${decode._id}`)
        const updatedUser = await userSchema.findByIdAndUpdate(
          decode._id,
          { $push: { orders: orders } },
          { new: true } // return updated user
        );
        console.log(updatedUser)
      }
      res.json({ success: true, message: "Payment verified ✅" });
    } else {
      res.json({ success: false, message: "Payment verification failed ❌" });
    } 
}

async function myAllOrders(req, res){
    try {
        const orders = await orderModel.find({userId: res.userId})
        res.json(orders)
    } catch (error) {
    res.json({'message': `Somwthing went worng ${error}`})
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
    myAllOrders,
    confirmedOrders,
    myOrderwithId
}