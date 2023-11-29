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
exports.UpdateProfile = exports.getProfileData = exports.UserList = exports.Login = exports.Signup = void 0;
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
        const user = new UserModel_1.default({ email, password: hashedPassword, name, phone, mobile, zipCode, address });
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
// !UserList --> GET: auth-token ❌
const UserList = (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return resp.status(Constants_1.default.ERROR_CODE.COMMON).json({
            success,
            message: Constants_1.default.ERROR_MESSAGE.COMMON,
            errors: errors.array(),
        });
    }
    const limitParam = req.query.limit;
    try {
        const user = req.user;
        const userId = req.user._id;
        if (!userId || userId === "")
            return resp.status(Constants_1.default.ERROR_CODE.UNAUTHORIZED).json({
                success,
                message: Constants_1.default.ERROR_MESSAGE.UNAUTHORIZED,
            });
        const coords = [parseFloat(user.address.coordinates.coordinates[0]), parseFloat(user.address.coordinates.coordinates[1])];
        const resultsLimit = limitParam ? parseInt(limitParam, 10) : 5;
        const queryPipeline = [
            {
                $geoNear: {
                    near: { type: "Point", coordinates: coords },
                    distanceField: "dist.calculated",
                    maxDistance: 5000,
                    spherical: true
                }
            },
            { $project: { password: 0 } }
        ];
        if (resultsLimit > 0) {
            queryPipeline.push({ $limit: resultsLimit });
        }
        const nearestUsers = yield UserModel_1.default.aggregate(queryPipeline);
        success = true;
        resp.status(Constants_1.default.SUCCESS_CODE.SUCCESS_CREATION).json({
            success,
            message: Constants_1.default.SUCCESS_MESSAGE.AUTH.REGISTER,
            data: nearestUsers,
        });
    }
    catch (error) {
        resp.status(400).send(error);
    }
});
exports.UserList = UserList;
// ! GET: get profile data ✅
const getProfileData = (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const user = req.user;
        const userId = req.user._id;
        if (!user || !userId || userId === "")
            return resp.status(Constants_1.default.ERROR_CODE.UNAUTHORIZED).json({
                success,
                message: Constants_1.default.ERROR_MESSAGE.UNAUTHORIZED,
            });
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return resp.status(Constants_1.default.ERROR_CODE.COMMON).json({
                success,
                message: Constants_1.default.ERROR_MESSAGE.COMMON,
                errors: errors.array(),
            });
        }
        success = true;
        resp.status(Constants_1.default.SUCCESS_CODE.SUCCESS_FETCH).json({
            success,
            message: "User details fetch successfully.",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProfileData = getProfileData;
// ! Update Profile --> PUT: Update user profile
const UpdateProfile = (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    // Validating request data
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return resp.status(Constants_1.default.ERROR_CODE.COMMON).json({
            success,
            message: Constants_1.default.ERROR_MESSAGE.COMMON,
            errors: errors.array(),
        });
    }
    try {
        const userId = req.user._id;
        if (!userId) {
            return resp.status(Constants_1.default.ERROR_CODE.UNAUTHORIZED).json({
                success,
                message: Constants_1.default.ERROR_MESSAGE.UNAUTHORIZED,
            });
        }
        const updateData = req.body;
        const updatedUser = yield UserModel_1.default.findByIdAndUpdate(userId, updateData, { new: true });
        success = true;
        resp.status(Constants_1.default.SUCCESS_CODE.SUCCESS_FETCH).json({
            success,
            message: "Profile updated successfully.",
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.UpdateProfile = UpdateProfile;
