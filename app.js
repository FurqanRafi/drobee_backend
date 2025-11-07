import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/mongodbConnect.js";
import userRouter from "./routers/d_userRouter.js";

import cors from "cors";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", userRouter);


// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });

export default app;
