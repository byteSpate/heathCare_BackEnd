"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const appointment_service_1 = require("./app/modules/appointment/appointment.service");
const node_cron_1 = __importDefault(require("node-cron"));
const ApiError_1 = __importDefault(require("./app/errors/ApiError"));
const http_status_2 = __importDefault(require("http-status"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3001",
    credentials: true
}));
// parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/admins", adminRoutes);
node_cron_1.default.schedule('* * * * *', () => {
    try {
        appointment_service_1.AppointmentService.cancelUnpaidAppointments();
    }
    catch (error) {
        throw new ApiError_1.default(http_status_2.default.INTERNAL_SERVER_ERROR, 'Failed to cancel unpaid appointments');
    }
});
app.use("/api/v1", routes_1.default);
app.use(globalErrorHandler_1.globalErrorHandler);
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "Api Not Found",
        error: {
            path: `${req.originalUrl} is wrong`,
            message: "your requested path is not found ",
        },
    });
});
exports.default = app;
