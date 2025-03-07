import { Router } from 'express';
import { academicSemesterValidation } from './academicSemester.validation';
import validateRequest from '../../app/middlewares/validateRequest';
import { academicSemesterControllers } from './academicSemester.controller';
import auth from '../../app/middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-academic-semester',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(
    academicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  academicSemesterControllers.createAcademicSemester,
);
router.get(
  '/',
  auth(
    USER_ROLE.SuperAdmin,
    USER_ROLE.Admin,
    USER_ROLE.Faculty,
    USER_ROLE.Student,
  ),
  academicSemesterControllers.getAllAcademicSemester,
);
router.get(
  '/:semesterId',
  auth(
    USER_ROLE.SuperAdmin,
    USER_ROLE.Admin,
    USER_ROLE.Faculty,
    USER_ROLE.Student,
  ),
  academicSemesterControllers.getSingleAcademicSemester,
);
router.patch(
  '/:semesterId',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(
    academicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  academicSemesterControllers.updateAcademicSemester,
);
export const academicSemesterRoutes = router;
