"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, jsonData) => {
    const message = jsonData.message;
    res.status(jsonData.statusCode).json({
        success: true,
        message: message,
        meta: jsonData.meta,
        data: jsonData.data,
    });
};
exports.sendResponse = sendResponse;
