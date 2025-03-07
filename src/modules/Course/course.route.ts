import { Router } from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import { courseValidationSchema } from './course.validation';
import { courseController } from './course.controller';
import auth from '../../app/middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.post(
  '/create-course',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(courseValidationSchema.createCourseValidationSchema),
  courseController.createCourse,
);
router.get(
  '/',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  courseController.getAllCourse,
);
router.patch(
  '/:id',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(courseValidationSchema.updateCourseValidationSchema),
  courseController.updateCourse,
);
router.get(
  '/:id',
  auth(
    USER_ROLE.SuperAdmin,
    USER_ROLE.Admin,
    USER_ROLE.Faculty,
    USER_ROLE.Student,
  ),
  courseController.getSingleCourse,
);
router.delete('/:id', courseController.deleteCourse);
router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(courseValidationSchema.facultiesWithCourseValidationSchema),
  courseController.assignFacultiesWithCourse,
);
router.get(
  '/:courseId/get-faculties',
  auth(
    USER_ROLE.SuperAdmin,
    USER_ROLE.Admin,
    USER_ROLE.Faculty,
    USER_ROLE.Student,
  ),
  courseController.getFacultiesWithCourse,
);
router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(courseValidationSchema.facultiesWithCourseValidationSchema),
  courseController.removeFacultiesFromCourse,
);

export const courseRoutes = router;
