import { Router } from "express";
import { body } from "express-validator";
import {
  Login,
  Signup,
} from "../controllers/UserController";
import CONSTANTS from "../utils/Constants";
import { authenticate } from "../middleware/AuthMiddleware";
import multer, { StorageEngine } from "multer";


const router = Router();

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
  body("password", CONSTANTS.FIELD_VALIDATION.COMMON.PASSWORD).isLength({
    min: 8,
  }),

  body("email", CONSTANTS.FIELD_VALIDATION.COMMON.EMAIL).isEmail(),
], Login);
router.post(
  "/register",
  [
    body("password", CONSTANTS.FIELD_VALIDATION.COMMON.PASSWORD).isLength({
      min: 8,
    }),
    body("mobile", CONSTANTS.FIELD_VALIDATION.COMMON.MOBILE).isLength({
      min: 10,
    }),
    body("zipCode", CONSTANTS.FIELD_VALIDATION.COMMON.ZIP).isLength({
      min: 6,
    }),
    body("email", CONSTANTS.FIELD_VALIDATION.COMMON.EMAIL).isEmail(),
  ],
  Signup
);

export { router as UsersRoute };
