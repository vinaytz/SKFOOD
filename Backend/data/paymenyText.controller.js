require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Cashfree } = require("cashfree-pg-sdk-nodejs");

const app = express();
app.use(bodyParser.json());


// CASHFREE_APP_ID =
// CASHFREE_SECRET_KEY=
// CASHFREE_ENV=   # or PROD

// ⚡ Sandbox for testing. Change to PRODUCTION when live.

// ✅ Create Order API
app.post("/create-order", async (req, res) => {
  try {
    const { orderId, orderAmount, customerId, customerEmail, customerPhone } = req.body;

    if (!orderId || !orderAmount || !customerId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const request = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/payment-status?order_id={order_id}`,
      },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    res.json(response.data);
  } catch (err) {
    console.error("Order creation error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Webhook (Cashfree will call this after payment)
app.post("/webhook", (req, res) => {
  try {
    console.log("Webhook received:", req.body);

    // ⚡ TODO: verify signature here before updating DB
    // Save order/payment status to DB

    res.status(200).send("Webhook received");
  } catch (err) {
    res.status(500).send("Webhook error");
  }
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Cashfree Single File Backend Working 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
