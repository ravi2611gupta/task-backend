"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const UserController_1 = require("../controllers/UserController");
const Constants_1 = __importDefault(require("../utils/Constants"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
exports.UsersRoute = router;
// email-password
// const upload = multer({ dest: '/tmp/' });
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(null, false);
    }
    cb(null, true);
};
const upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
router.post("/login", [
    (0, express_validator_1.body)("password", Constants_1.default.FIELD_VALIDATION.COMMON.PASSWORD).isLength({
        min: 8,
    }),
    (0, express_validator_1.body)("email", Constants_1.default.FIELD_VALIDATION.COMMON.EMAIL).isEmail(),
], UserController_1.Login);
router.post("/register", upload.single('file'), [
    (0, express_validator_1.body)("password", Constants_1.default.FIELD_VALIDATION.COMMON.PASSWORD).isLength({
        min: 8,
    }),
    (0, express_validator_1.body)("mobile", Constants_1.default.FIELD_VALIDATION.COMMON.MOBILE).isLength({
        min: 10,
    }),
    (0, express_validator_1.body)("zipCode", Constants_1.default.FIELD_VALIDATION.COMMON.ZIP).isLength({
        min: 6,
    }),
    (0, express_validator_1.body)("email", Constants_1.default.FIELD_VALIDATION.COMMON.EMAIL).isEmail(),
], UserController_1.Signup);
