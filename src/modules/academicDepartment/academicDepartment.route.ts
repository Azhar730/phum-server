import { Router } from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import { academicDepartmentValidation } from './academicDepartment.validation';
import { academicDepartmentControllers } from './academicDepartment.controller';
import auth from '../../app/middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-academic-department',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(
    academicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  academicDepartmentControllers.createAcademicDepartment,
);
router.get('/', academicDepartmentControllers.getAllAcademicDepartment);
router.get(
  '/:departmentId',
  academicDepartmentControllers.getSingleAcademicDepartment,
);
router.patch(
  '/:departmentId',
  validateRequest(
    academicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  academicDepartmentControllers.updateAcademicDepartment,
);
export const academicDepartmentRoutes = router;
