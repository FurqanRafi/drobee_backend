import mongoose from "mongoose";

const d_userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "D_checkout", // or whatever your checkout model name is
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  resetPasswordCode: String,
  resetPasswordExpires: Date,
});

const D_User = mongoose.model("D_User", d_userSchema);

export default D_User;
