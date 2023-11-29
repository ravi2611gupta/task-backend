"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const Constants_1 = __importDefault(require("../utils/Constants"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res
                .status(Constants_1.default.ERROR_CODE.UNAUTHORIZED)
                .json({ success: false, message: Constants_1.default.ERROR_MESSAGE.MIDDLEWARE.HEADER_MISSING });
        const token = authHeader.split(" ")[1];
        if (!token)
            return res
                .status(Constants_1.default.ERROR_CODE.UNAUTHORIZED)
                .json({ success: false, message: Constants_1.default.ERROR_MESSAGE.MIDDLEWARE.TOKEN_MISSING });
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (err) {
            return res
                .status(Constants_1.default.ERROR_CODE.UNAUTHORIZED)
                .json({ success: false, message: Constants_1.default.ERROR_MESSAGE.MIDDLEWARE.INVALID_TOKEN });
        }
        const user = yield UserModel_1.default.findById(decoded.userId);
        if (!user)
            return res
                .status(Constants_1.default.ERROR_CODE.UNAUTHORIZED)
                .json({ success: false, message: Constants_1.default.ERROR_MESSAGE.UNAUTHORIZED });
        req.user = user;
        next();
    }
    catch (error) {
        res
            .status(Constants_1.default.ERROR_CODE.SERVER)
            .json({ success: false, message: Constants_1.default.ERROR_MESSAGE.SERVER });
    }
});
exports.authenticate = authenticate;
