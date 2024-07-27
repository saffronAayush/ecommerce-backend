import app from "./app.js";
const port = process.env.PORT || 3000;
import cors from "cors"
import dotenv from "dotenv";
app.use(cors());
dotenv.config({ path: "./.env" });
import cloudinary from "cloudinary";
cloudinary.config({
    cloud_name: dfwgakqfi,
    api_key: 645338565867895,
    api_secret: "0MPA1yaJDo9MBe-58PXb-09cGZM",
});
import connectDB from "./db/DB.js";
connectDB();

app.get("/", (req, res) => {
    res.json({ message: "done" });
});

app.listen(port, () => {
    console.log("Server is working on port ", port);
});
