"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const admin_route_1 = require("../modules/admin/admin.route");
const auth_routes_1 = require("../modules/auth/auth.routes");
const specialties_routes_1 = require("../modules/specialties/specialties.routes");
const doctor_routes_1 = require("../modules/doctor/doctor.routes");
const patient_routes_1 = require("../modules/patient/patient.routes");
const schedule_route_1 = require("../modules/schedule/schedule.route");
const doctorSchedule_route_1 = require("../modules/doctorSchedule/doctorSchedule.route");
const appointment_route_1 = require("../modules/appointment/appointment.route");
const payment_routes_1 = require("../modules/payment/payment.routes");
const prescription_routes_1 = require("../modules/prescription/prescription.routes");
const review_routes_1 = require("../modules/review/review.routes");
const meta_routes_1 = require("../modules/meta/meta.routes");
const router = express_1.default.Router();
const modulesRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/admin",
        route: admin_route_1.AdminRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/specialties",
        route: specialties_routes_1.SpecialtiesRoutes,
    },
    {
        path: "/doctor",
        route: doctor_routes_1.DoctorRoutes,
    },
    {
        path: "/patient",
        route: patient_routes_1.PatientRoutes,
    },
    {
        path: "/schedule",
        route: schedule_route_1.ScheduleRoutes,
    },
    {
        path: "/doctor-schedule",
        route: doctorSchedule_route_1.DoctorScheduleRoutes,
    },
    {
        path: "/appointment",
        route: appointment_route_1.AppointmentRoutes,
    },
    {
        path: "/payment",
        route: payment_routes_1.PaymentRoutes,
    },
    {
        path: "/prescription",
        route: prescription_routes_1.PrescriptionRoutes,
    },
    {
        path: "/review",
        route: review_routes_1.ReviewRoutes,
    },
    {
        path: "/meta",
        route: meta_routes_1.MetaRoutes,
    },
];
modulesRoutes.forEach((item) => router.use(item.path, item.route));
exports.default = router;
