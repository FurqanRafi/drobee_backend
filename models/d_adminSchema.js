import mongoose from "mongoose";

const d_adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const D_Admin = mongoose.model("D_Admin", d_adminSchema);

export default D_Admin;
