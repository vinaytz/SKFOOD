// const { Cashfree } = require('cashfree-pg');
// const cashfree = new Cashfree(Cashfree.SANDBOX, process.env.CASHFREE_APP_ID, process.env.CASHFREE_SECRET_KEY);
// module.exports = { cashfree };

const Razorpay = require('razorpay');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});


module.exports = {razorpay}