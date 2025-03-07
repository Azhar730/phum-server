import { Router } from 'express';
import { facultyControllers } from './faculty.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { facultyValidationSchema } from './faculty.validation';
import auth from '../../app/middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.get('/:id',auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin,USER_ROLE.Faculty), facultyControllers.getSingleFaculty);
router.patch(
  '/:id',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(facultyValidationSchema.updateFacultyValidationSchema),
  facultyControllers.updateFaculty,
);
router.delete('/:id',auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin), facultyControllers.deleteFaculty);
router.get('/', auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin), facultyControllers.getAllFaculties);
export const facultyRoutes = router;
