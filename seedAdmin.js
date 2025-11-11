import bcrypt from "bcryptjs";
import D_Admin from "./models/d_AdminSchema.js";
import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://furqan:furqan123@cluster0.udrs5zb.mongodb.net/?appName=Cluster0"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};
const seedAdmin = async () => {
  try {
    await connectDB();
    const admin = await D_Admin.findOne({ email: "admin@drobee.com" });
    if (admin) {
      console.log("Admin already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash("admin", 10);
    await D_Admin.create({
      email: "admin@drobee.com",
      password: hashedPassword,
    });
    console.log("Admin created");
  } catch (error) {
    console.log(error);
  }
};

await seedAdmin();
