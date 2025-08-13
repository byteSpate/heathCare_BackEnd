import express from 'express'
import { AppointmentController } from './appointment.controller';
import { authValidation } from '../../middlewares/authValidation';
import { UserRole } from '../../../generated/prisma';
import { validateRequest } from '../../middlewares/validateRequest';
import { AppointmentValidation } from './appointment.validation';


const router = express.Router();

router.post(
    '/',
    authValidation(UserRole.PATIENT),
    validateRequest(AppointmentValidation.createAppointment),
    AppointmentController.createAppointment
);

router.get(
    '/',
    authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AppointmentController.getAllFromDB
);

router.get(
    '/my-appointment',
    authValidation(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointment
)

router.patch(
    '/status/:id',
    authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
    AppointmentController.changeAppointmentStatus
);





export const AppointmentRoutes = router;