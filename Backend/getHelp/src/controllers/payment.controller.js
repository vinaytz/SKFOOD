const Razorpay = require('razorpay');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const userSchema = require("../model/users.model")

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

async function makePayment(req,res){
  try {
    const options = {
      amount: req.body.amount * 100, // Rs → paise
      currency: "INR",
      receipt: "receipt#1",
    }; 

    const order = await razorpay.orders.create(options);
    res.json(order); // send order back to frontend
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
  console.log("testing Done")
}


async function verifyPayment(req, res){
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



module.exports = {makePayment, verifyPayment}