import app from "./app.js";
const port = process.env.PORT || 3000;
import cors from "cors"
import dotenv from "dotenv";
app.use(cors());
dotenv.config({ path: "./.env" });
import cloudinary from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: 142813777265362,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
import connectDB from "./db/DB.js";
connectDB();

app.get("/", (req, res) => {
    res.json({ message: "done" });
});

app.listen(port, () => {
    console.log("Server is working on port ", port);
});
