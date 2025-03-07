import { Router } from 'express';
import { semesterRegistrationControllers } from './semesterRegistration.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { semesterRegistrationValidationSchema } from './semesterRegistration.validation';
import auth from '../../app/middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.post(
  '/create-semester-registration',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(
    semesterRegistrationValidationSchema.createSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.createSemesterRegistration,
);
router.get(
  '/:id',
  auth(
    USER_ROLE.SuperAdmin,
    USER_ROLE.Admin,
    USER_ROLE.Faculty,
    USER_ROLE.Student,
  ),
  semesterRegistrationControllers.getSingleSemesterRegistration,
);
router.patch(
  '/:id',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(
    semesterRegistrationValidationSchema.updateSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.updateSemesterRegistration,
);
router.delete(
  '/:id',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  semesterRegistrationControllers.deleteSemesterRegistration,
);
router.get(
  '/',
  auth(
    USER_ROLE.SuperAdmin,
    USER_ROLE.Admin,
    USER_ROLE.Faculty,
    USER_ROLE.Student,
  ),
  semesterRegistrationControllers.getAllSemesterRegistration,
);
export const semesterRegistrationRoutes = router;
