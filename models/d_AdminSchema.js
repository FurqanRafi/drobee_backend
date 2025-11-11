import mongoose from "mongoose";

const d_adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const D_Admin = mongoose.model("D_Admin", d_adminSchema);

export default D_Admin;
