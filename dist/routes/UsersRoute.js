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
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const router = (0, express_1.Router)();
exports.UsersRoute = router;
// const storage: StorageEngine = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, '/tmp/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
//   }
// });
// const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//     req.fileValidationError = 'Only image files are allowed!';
//     return cb(null, false);
//   }
//   cb(null, true);
// };
// const upload = multer({ storage: storage, fileFilter: fileFilter });
router.post("/login", [
    (0, express_validator_1.body)("password", Constants_1.default.FIELD_VALIDATION.COMMON.PASSWORD).isLength({
        min: 8,
    }),
    (0, express_validator_1.body)("email", Constants_1.default.FIELD_VALIDATION.COMMON.EMAIL).isEmail(),
], UserController_1.Login);
router.post("/register", [
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
router.get("/get", AuthMiddleware_1.authenticate, UserController_1.UserList);
router.get("/get-profile", AuthMiddleware_1.authenticate, UserController_1.getProfileData);
router.patch("/update", AuthMiddleware_1.authenticate, UserController_1.UpdateProfile);
