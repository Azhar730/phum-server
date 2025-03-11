import { Router } from 'express';
import auth from '../../app/middlewares/auth';
import validateRequest from '../../app/middlewares/validateRequest';
import { enrolledCourseValidation } from './EnrolledCourse.validation';
import { enrolledCourseControllers } from './EnrolledCourse.controller';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(
    enrolledCourseValidation.createEnrolledCourseValidationSchema,
  ),
  enrolledCourseControllers.createEnrolledCourse,
);
router.get(
  '/my-enrolled-course',
  auth(USER_ROLE.student),
  enrolledCourseControllers.getMyEnrolledCourse,
);
router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  validateRequest(
    enrolledCourseValidation.updateEnrolledCourseMarksValidationSchema,
  ),
  enrolledCourseControllers.updateEnrolledCourse,
);
export const enrolledCourseRoutes = router;
