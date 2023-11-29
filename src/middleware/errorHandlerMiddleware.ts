import { Request, Response, NextFunction } from "express";
import CONSTANTS from "../utils/Constants";

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🤖 Server Error ::-->> ", err.stack);
  res
    .status(CONSTANTS.ERROR_CODE.SERVER)
    .json({ success: false, message: CONSTANTS.ERROR_MESSAGE.SERVER });
};

export default errorHandlerMiddleware;
