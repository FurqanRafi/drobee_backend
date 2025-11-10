import mongoose from "mongoose";

const d_categorySchema = new mongoose.Schema({
  name: String,
  key: String,
});

export default mongoose.model("D_Category", d_categorySchema);
