import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";
import CONSTANTS from "../utils/Constants";

export interface IRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
        .json({ success: false, message: CONSTANTS.ERROR_MESSAGE.MIDDLEWARE.HEADER_MISSING });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res
        .status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
        .json({ success: false, message: CONSTANTS.ERROR_MESSAGE.MIDDLEWARE.TOKEN_MISSING });

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return res
        .status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
        .json({ success: false, message: CONSTANTS.ERROR_MESSAGE.MIDDLEWARE.INVALID_TOKEN });
    }

    const user = await User.findById(decoded.userId);
    if (!user)
      return res
        .status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
        .json({ success: false, message: CONSTANTS.ERROR_MESSAGE.UNAUTHORIZED });

    req.user = user;
    next();
  } catch (error) {
    res
      .status(CONSTANTS.ERROR_CODE.SERVER)
      .json({ success: false, message: CONSTANTS.ERROR_MESSAGE.SERVER });
  }
};
