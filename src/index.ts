require("dotenv").config();
import express from "express";
import cors from "cors";
import connectToMongo from "./config/database";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import bodyParser from "body-parser";
import session from "express-session";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware";
import { UsersRoute } from "./routes";
import corsMiddleware from "./middleware/corsMiddleware";
import multer from "multer";

const app = express();
const port = process.env.PORT || 5000;

// connection
connectToMongo();

process.env.SESSION_SECRET &&
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet({ contentSecurityPolicy: false }));
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 1000000,
});
app.use(limiter);
app.use(hpp());
app.use(cors({ origin: true, credentials: true }));
app.use(errorHandlerMiddleware);
app.use(corsMiddleware);


// Available Routes
app.get("/test", (req, resp) => {
  resp.status(200).json({ success: true, message: "test is working" });
});

// routes
app.use("/api/auth", UsersRoute);

app.listen(port, () => {
  console.log(`Task backend listening at http://localhost:${port}`);
});
