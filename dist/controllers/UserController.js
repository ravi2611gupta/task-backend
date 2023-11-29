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
exports.Login = exports.Signup = void 0;
const Constants_1 = __importDefault(require("../utils/Constants"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET);
};
// !Signup --> POST: auth-token ❌
const Signup = (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let success = false;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return resp.status(Constants_1.default.ERROR_CODE.COMMON).json({
            success,
            message: Constants_1.default.ERROR_MESSAGE.COMMON,
            errors: errors.array(),
        });
    }
    const { name, email, password, phone, mobile, zipCode, address } = req.body;
    try {
        const existingUser = yield UserModel_1.default.findOne({
            email: new RegExp(`^${email}$`, "i"),
        });
        let userDetails;
        if (existingUser)
            return resp
                .status(Constants_1.default.ERROR_CODE.COMMON)
                .json({ success, message: Constants_1.default.ERROR_MESSAGE.AUTH.EMAIL_EXIST });
        const salt = yield bcryptjs_1.default.genSalt(12);
        const hashedPassword = password && (yield bcryptjs_1.default.hash(password, salt));
        const user = new UserModel_1.default({ email, password: hashedPassword, name, phone, mobile, zipCode, address, profilePic: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
        yield user.save();
        const token = generateToken(user._id);
        success = true;
        resp.status(Constants_1.default.SUCCESS_CODE.SUCCESS_CREATION).json({
            success,
            message: Constants_1.default.SUCCESS_MESSAGE.AUTH.REGISTER,
            data: user,
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.Signup = Signup;
// !Login --> POST: auth-token ❌
const Login = (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return resp.status(Constants_1.default.ERROR_CODE.COMMON).json({
            success,
            message: Constants_1.default.ERROR_MESSAGE.COMMON,
            errors: errors.array(),
        });
    }
    const { email, password } = req.body;
    try {
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            return resp.status(Constants_1.default.ERROR_CODE.UNAUTHORIZED).json({
                success,
                message: Constants_1.default.ERROR_MESSAGE.UNAUTHORIZED,
            });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return resp.status(Constants_1.default.ERROR_CODE.UNAUTHORIZED).json({
                success,
                message: Constants_1.default.ERROR_MESSAGE.UNAUTHORIZED,
            });
        }
        const token = generateToken(user._id);
        success = true;
        resp.status(Constants_1.default.SUCCESS_CODE.SUCCESS_CREATION).json({
            success,
            message: Constants_1.default.SUCCESS_MESSAGE.AUTH.REGISTER,
            data: user,
            token,
        });
    }
    catch (error) {
        resp.status(400).send(error);
    }
});
exports.Login = Login;
