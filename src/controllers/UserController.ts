import { NextFunction, Request, Response } from "express";
import CONSTANTS from "../utils/Constants";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/UserModel";
import bcrypt from "bcryptjs";
import { IRequest } from "../middleware/AuthMiddleware";

type ExpressHandler = (req: IRequest, res: Response, next: NextFunction) => void;

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
    const user = new User({ email, password: hashedPassword, name, phone, mobile, zipCode, address });
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

// !UserList --> GET: auth-token ❌
export const UserList: ExpressHandler = async (req, resp, next) => {
  let success = false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(CONSTANTS.ERROR_CODE.COMMON).json({
      success,
      message: CONSTANTS.ERROR_MESSAGE.COMMON,
      errors: errors.array(),
    });
  }
  const limitParam = req.query.limit as string;

  try {
    const user = req.user;
    const userId = req.user._id;

    if (!userId || userId === "")
      return resp.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED).json({
        success,
        message: CONSTANTS.ERROR_MESSAGE.UNAUTHORIZED,
      });


    const coords = [parseFloat(user.address.coordinates.coordinates[0]), parseFloat(user.address.coordinates.coordinates[1])];
    const resultsLimit = limitParam ? parseInt(limitParam, 10) : 5;
    const queryPipeline: any[] = [
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
    
    const nearestUsers = await User.aggregate(queryPipeline);


    success = true;
    resp.status(CONSTANTS.SUCCESS_CODE.SUCCESS_CREATION).json({
      success,
      message: CONSTANTS.SUCCESS_MESSAGE.AUTH.REGISTER,
      data: nearestUsers,
    });
  } catch (error) {
    resp.status(400).send(error);
  }
};

// ! GET: get profile data ✅
export const getProfileData = async (
  req: IRequest,
  resp: Response,
  next: NextFunction
) => {
  let success = false;
  try {
    const user = req.user as IUser;
    const userId = req.user._id;

    if (!user || !userId || userId === "")
      return resp.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED).json({
        success,
        message: CONSTANTS.ERROR_MESSAGE.UNAUTHORIZED,
      });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(CONSTANTS.ERROR_CODE.COMMON).json({
        success,
        message: CONSTANTS.ERROR_MESSAGE.COMMON,
        errors: errors.array(),
      });
    }

    success = true;
    resp.status(CONSTANTS.SUCCESS_CODE.SUCCESS_FETCH).json({
      success,
      message: "User details fetch successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


// ! Update Profile --> PUT: Update user profile
export const UpdateProfile: ExpressHandler = async (req, resp, next) => {
  let success = false;

  // Validating request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(CONSTANTS.ERROR_CODE.COMMON).json({
      success,
      message: CONSTANTS.ERROR_MESSAGE.COMMON,
      errors: errors.array(),
    });
  }

  try {
    const userId = req.user._id;
    if (!userId) {
      return resp.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED).json({
        success,
        message: CONSTANTS.ERROR_MESSAGE.UNAUTHORIZED,
      });
    }

    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    success = true;
    resp.status(CONSTANTS.SUCCESS_CODE.SUCCESS_FETCH).json({
      success,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
