const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: {type: String},
  password: { type: String },
  googleId: { type: String },   
  picture:{type: String, default: "https://static.vecteezy.com/system/resources/thumbnails/048/926/084/small_2x/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector.jpg" },  //https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png

  savedAddresses: [
    {
      label: { type: String, default: 'Room' },  // e.g. "Hostel", "PG", "Home"
      address: { type: String, required: true },
      lat: { type: Number },  // Made optional
      lng: { type: Number },  // Made optional
      phoneNumber: { type: String }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);


