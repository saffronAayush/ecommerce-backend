import express from "express";
import cors from "cors";
import ErrorMidleware from "./middleware/Error.js";
import cookieParser from "cookie-parser";
const app = express();
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true // Allow credentials (cookies, authorization headers, TLS client certificates)
}));
//Router Import
import product from "./routes/ProuctRoute.js";
import user from "./routes/UserRoute.js";
import order from "./routes/OrderRoute.js";
import payment from "./routes/PaymentRoute.js";

app.use("/api/v1", product);
  app.use("/api/v1", user);
 app.use("/api/v1", order);
 app.use("/api/v1", payment);

// //middleware for error
 app.use(ErrorMidleware);

export default app;
