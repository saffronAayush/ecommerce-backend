import express from "express";
import cors from "cors";
import ErrorMidleware from "./middleware/Error.js";
import cookieParser from "cookie-parser";
const app = express();
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests from any origin
        callback(null, true);
    },
    credentials: true // Allow credentials (cookies, authorization headers, TLS client certificates)
}));

// Fallback CORS configuration to handle preflight requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow only this origin
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

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
