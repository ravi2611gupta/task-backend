"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __importDefault(require("../utils/Constants"));
const errorHandlerMiddleware = (err, req, res, next) => {
    console.error("🤖 Server Error ::-->> ", err.stack);
    res
        .status(Constants_1.default.ERROR_CODE.SERVER)
        .json({ success: false, message: Constants_1.default.ERROR_MESSAGE.SERVER });
};
exports.default = errorHandlerMiddleware;
