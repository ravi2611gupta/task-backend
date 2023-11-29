"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const hpp_1 = __importDefault(require("hpp"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const errorHandlerMiddleware_1 = __importDefault(require("./middleware/errorHandlerMiddleware"));
const routes_1 = require("./routes");
const corsMiddleware_1 = __importDefault(require("./middleware/corsMiddleware"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// connection
(0, database_1.default)();
process.env.SESSION_SECRET &&
    app.use((0, express_session_1.default)({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 1000000,
});
app.use(limiter);
app.use((0, hpp_1.default)());
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(errorHandlerMiddleware_1.default);
app.use(corsMiddleware_1.default);
// Available Routes
app.get("/test", (req, resp) => {
    resp.status(200).json({ success: true, message: "test is working" });
});
// routes
app.use("/api/auth", routes_1.UsersRoute);
app.listen(port, () => {
    console.log(`Task backend listening at http://localhost:${port}`);
});
