import { ErrorRequestHandler } from "express";
import { HTTP_STATUS_CODE } from "../config/http.config";
import { AppError, ErrorCodes } from "../utils/app-error";

export const errorHandler: ErrorRequestHandler = (
    error, 
    req, 
    res,
    next
) : any => {

    if(error instanceof AppError) {
        return res.status(error.statusCode).json({message: error.message, error: error.errorCode});
    }

    console.log(`Error occured: ${req.path} - `, error);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "INTERNAL SERVER ERROR", error: error.message, errorCode: ErrorCodes.ERR_INTERNAL });
}