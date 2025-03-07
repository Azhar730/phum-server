import { Router } from 'express';
import auth from '../../app/middlewares/auth';
import validateRequest from '../../app/middlewares/validateRequest';
import { enrolledCourseValidation } from './EnrolledCourse.validation';
import { enrolledCourseControllers } from './EnrolledCourse.controller';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.Student),
  validateRequest(
    enrolledCourseValidation.createEnrolledCourseValidationSchema,
  ),
  enrolledCourseControllers.createEnrolledCourse,
);
router.get(
  '/my-enrolled-course',
  auth(USER_ROLE.Student),
  enrolledCourseControllers.getMyEnrolledCourse,
);
router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin, USER_ROLE.Faculty),
  validateRequest(
    enrolledCourseValidation.updateEnrolledCourseMarksValidationSchema,
  ),
  enrolledCourseControllers.updateEnrolledCourse,
);
export const enrolledCourseRoutes = router;
