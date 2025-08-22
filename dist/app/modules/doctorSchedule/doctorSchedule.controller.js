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
exports.doctorScheduleController = void 0;
const sendResponse_1 = require("../../../helpers/sendResponse");
const catchAsync_1 = require("../../../helpers/catchAsync");
const doctorSchedule_service_1 = require("./doctorSchedule.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const createIntoDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const payload = req.body;
    const result = yield doctorSchedule_service_1.doctorScheduleServices.createIntoDB(user, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Doctor Schedule Created Successfully",
        data: result,
    });
}));
const getMySchedule = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req === null || req === void 0 ? void 0 : req.user;
    const query = (0, pick_1.default)(req.query, ["startDate", "endDate", "isBooked"]);
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield doctorSchedule_service_1.doctorScheduleServices.getMySchedule(query, options, user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "My Schedule Fetched Successfully",
        data: result,
    });
}));
const deleteFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req === null || req === void 0 ? void 0 : req.user;
    const { id } = req.params;
    const result = yield doctorSchedule_service_1.doctorScheduleServices.deleteFromDB(user, id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "My Schedule Deleted Successfully",
        data: result,
    });
}));
const getAllFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req === null || req === void 0 ? void 0 : req.user;
    const query = (0, pick_1.default)(req.query, ["startDate", "endDate"]);
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield doctorSchedule_service_1.doctorScheduleServices.getAllFromDB(query, options, user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All Doctor Schedule Fetched Successfully",
        data: result,
    });
}));
exports.doctorScheduleController = {
    createIntoDB,
    getMySchedule,
    deleteFromDB,
    getAllFromDB
};
