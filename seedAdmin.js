import bcrypt from "bcryptjs";

import connectDB from "./config/mongodbConnect.js";
import D_Admin from "./models/d_AdminSchema.js";
connectDB();
const seedAdmin = async () => {
  try {
    const admin = await D_Admin.findOne({ email: "admin@drobee.com" });
    if (admin) {
      console.log("Admin already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash("admin", 10);
    await D_Admin.create({
      email: "admin@gmail.com",
      password: hashedPassword,
    });
    console.log("Admin created");
  } catch (error) {
    console.log(error);
  }
};

seedAdmin();
