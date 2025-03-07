import { Router } from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import { offeredCourseValidations } from './offeredCourse.validation';
import { offeredCourseControllers } from './offeredCourse.controller';
import auth from '../../app/middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.post(
  '/create-offered-course',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(offeredCourseValidations.createOfferedCourseValidationSchema),
  offeredCourseControllers.createOfferedCourse,
);
router.get(
  '/',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin, USER_ROLE.Faculty),
  offeredCourseControllers.getAllOfferedCourse,
);
router.get(
  '/my-offered-courses',
  auth(USER_ROLE.Student),
  offeredCourseControllers.getMyOfferedCourses,
);
router.get(
  '/:id',
  auth(
    USER_ROLE.SuperAdmin,
    USER_ROLE.Admin,
    USER_ROLE.Faculty,
    USER_ROLE.Student,
  ),
  offeredCourseControllers.getSingleOfferedCourse,
);
router.patch(
  '/:id',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin, USER_ROLE.Faculty),
  validateRequest(offeredCourseValidations.updateOfferedCourseValidationSchema),
  offeredCourseControllers.updateOfferedCourse,
);
router.delete(
  '/:id',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin, USER_ROLE.Faculty),
  offeredCourseControllers.deleteOfferedCourse,
);
export const offeredCourseRoutes = router;
