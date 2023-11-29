import { NextFunction, Request, Response } from "express";
import CONSTANTS from "../utils/Constants";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/UserModel";
import bcrypt from "bcryptjs";

type ExpressHandler = (req: Request, res: Response, next: NextFunction) => void;

export interface ProfileType extends IUser {
  profileStatus: boolean;
}

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!);
};

// !Signup --> POST: auth-token ❌
export const Signup: ExpressHandler = async (req, resp, next) => {
  let success = false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(CONSTANTS.ERROR_CODE.COMMON).json({
      success,
      message: CONSTANTS.ERROR_MESSAGE.COMMON,
      errors: errors.array(),
    });
  }

  const { name, email, password, phone, mobile, zipCode, address } = req.body as IUser;

  try {
    const existingUser = await User.findOne({
      email: new RegExp(`^${email}$`, "i"),
    });
    let userDetails;
    if (existingUser)
      return resp
        .status(CONSTANTS.ERROR_CODE.COMMON)
        .json({ success, message: CONSTANTS.ERROR_MESSAGE.AUTH.EMAIL_EXIST });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = password && (await bcrypt.hash(password, salt));
    const user = new User({ email, password: hashedPassword, name, phone, mobile, zipCode, address, profilePic: req.file?.path });
    await user.save();

    const token = generateToken(user._id);
    success = true;
    resp.status(CONSTANTS.SUCCESS_CODE.SUCCESS_CREATION).json({
      success,
      message: CONSTANTS.SUCCESS_MESSAGE.AUTH.REGISTER,
      data: user,
      token,
    });
  } catch (error: any) {
    next(error);
  }
};


// !Login --> POST: auth-token ❌
export const Login: ExpressHandler = async (req, resp, next) => {
  let success = false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(CONSTANTS.ERROR_CODE.COMMON).json({
      success,
      message: CONSTANTS.ERROR_MESSAGE.COMMON,
      errors: errors.array(),
    });
  }

  const { email, password } = req.body as IUser;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED).json({
        success,
        message: CONSTANTS.ERROR_MESSAGE.UNAUTHORIZED,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return resp.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED).json({
        success,
        message: CONSTANTS.ERROR_MESSAGE.UNAUTHORIZED,
      });
    }

    const token = generateToken(user._id);
    success = true;
    resp.status(CONSTANTS.SUCCESS_CODE.SUCCESS_CREATION).json({
      success,
      message: CONSTANTS.SUCCESS_MESSAGE.AUTH.REGISTER,
      data: user,
      token,
    });
  } catch (error) {
    resp.status(400).send(error);
  }
};
