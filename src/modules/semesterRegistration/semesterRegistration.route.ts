import { Router } from 'express';
import { semesterRegistrationControllers } from './semesterRegistration.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { semesterRegistrationValidationSchema } from './semesterRegistration.validation';
import auth from '../../app/middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.post(
  '/create-semester-registration',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    semesterRegistrationValidationSchema.createSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.createSemesterRegistration,
);
router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  semesterRegistrationControllers.getSingleSemesterRegistration,
);
router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    semesterRegistrationValidationSchema.updateSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.updateSemesterRegistration,
);
router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  semesterRegistrationControllers.deleteSemesterRegistration,
);
router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  semesterRegistrationControllers.getAllSemesterRegistration,
);
export const semesterRegistrationRoutes = router;
