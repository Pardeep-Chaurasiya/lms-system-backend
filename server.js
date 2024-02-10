import app from "./app.js";
import cloudnairy from "cloudinary";
import { connectDB } from "./config/database.js";

connectDB();

cloudnairy.v2.config({
  cloud_name: process.env.CLOUDNAIRY_CLOUD_NAME,
  api_key: process.env.CLOUDNAIRY_API_KEY,
  api_secret: process.env.CLOUDNAIRY_API_SECRET,
});
app.listen(process.env.PORT, () => {
  console.log(`App listning on port ${process.env.PORT}`);
});
