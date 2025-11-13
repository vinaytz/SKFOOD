//   // const mongoose = require("mongoose");

//   // const orderSchema = new mongoose.Schema({
//   //   userId: { type:String, required: true },
//   //   menuId: { type:String, required: true },
//   //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   //   menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },

//   //   sabjisSelected: [String], // max 2 items
//   //   base: { type: String, enum: ["roti", "roti+rice"], required: true },
//   //   extraRoti: { type: Number, default: 0 },
//   //   isSpecial: { type: Boolean, default: false },
//   //   quantity: { type: Number, default: 1, min: 1, max: 5 },

//   //   totalPrice: { type: Number, required: true },
//   //   tipMoney: { type: Number, required: false },

//   //   address: {
//   //     label: String,
//   //     address: String,
//   //     lat: Number,
//   //     lng: Number
//   //   },

//   //   otp: { type: String, required: true },

//   //   status: { 
//   //     type: String, 
//   //     enum: ["Pending", "on-the-way", "delivered"], 
//   //     default: "Pending" 
//   //   },

//   //   createdAt: { type: Date, default: Date.now }
//   // });

//   // module.exports = mongoose.model("Order", orderSchema);


// const mongoose = require("mongoose");

// const Counter = new mongoose.Schema({
//   _id: { type: String, required: true },
//   sequence_value: { type: Number, default: 100000 }
// });



// const orderSchema = new mongoose.Schema({
//   orderNumber: {
//     type: Number,
//     unique: true,
//     index: true
//   },
  
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", 
//     required: true,
//     index: true  // Index for faster queries by user
//   },
  
//   menuId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "Menu", 
//     required: true 
//   },

//   sabjisSelected: {
//     type: [String],
//     validate: {
//       validator: function(arr) {
//         return arr.length <= 2;
//       },
//       message: "Maximum 2 sabjis allowed"
//     }
//   },
  
//   base: { 
//     type: String, 
//     enum: ["roti", "roti+rice"], 
//     required: true 
//   },
  
//   extraRoti: { 
//     type: Number, 
//     default: 0,
//     min: 0,
//     max: 10
//   },
  
//   isSpecial: { 
//     type: Boolean, 
//     default: false 
//   },
  
//   quantity: { 
//     type: Number, 
//     default: 1, 
//     min: 1, 
//     max: 5 
//   },

//   totalPrice: { 
//     type: Number, 
//     required: true,
//     min: 0
//   },
  
//   tipMoney: { 
//     type: Number, 
//     default: 0,
//     min: 0
//   },

//   address: {
//     label: { type: String, trim: true },
//     address: { type: String, required: true, trim: true },
//     lat: { type: Number, required: true },
//     lng: { type: Number, required: true }
//   },

//   otp: { 
//     type: String, 
//     required: true,
//     length: 6
//   },

//   status: { 
//     type: String, 
//     enum: ["pending", "on-the-way", "delivered"], 
//     default: "pending",
//     index: true  // Index for filtering by status
//   }
// }, { 
//   timestamps: true  // Auto-creates createdAt and updatedAt
// });

// // Compound index for status + createdAt (most common query)
// orderSchema.index({ status: 1, createdAt: -1 });

// // Index for order search
// orderSchema.index({ orderNumber: 1, userId: 1 });

// // Auto-generate orderNumber before saving
// orderSchema.pre('save', async function(next) {
//   if (!this.orderNumber) {
//     try {
//       const counter = await Counter.findByIdAndUpdate(
//         'orderNumber',
//         { $inc: { sequence_value: 1 } },
//         { new: true, upsert: true }
//       );
//       this.orderNumber = counter.sequence_value;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// module.exports = mongoose.model("Order", orderSchema);









// models/orderSchema.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  mealType: { 
    type: String, 
    enum: ["lunch", "dinner"], 
    required: true 
  },
  
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },
  
  selectedSabjis: [
    {
      name: String,
      imageUrl: String,
      isSpecial: Boolean
    }
  ],
  
  baseOption: { 
    type: String, 
    required: true  // e.g., "5 Roti", "3 Roti + Rice"
  },
  
  extraRoti: { 
    type: Number, 
    default: 0 
  },
  
  quantity: { 
    type: Number, 
    default: 1,
    min: 1,
    max: 5
  },
  
  deliveryAddress: {
    label: String,
    address: String,
    lat: Number,
    lng: Number,
    phoneNumber: String,
    hostel: String,
    room: String
  },
  
  pricing: {
    basePrice: Number,
    specialSabjiPrice: Number,
    extraRotiPrice: Number,
    subtotal: Number,
    tax: Number,
    deliveryFee: Number,
    discount: Number,
    total: Number
  },
  
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'preparing', 'on-the-way', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  otp: String,
  
  estimatedDelivery: Date,
  deliveredAt: Date,
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);