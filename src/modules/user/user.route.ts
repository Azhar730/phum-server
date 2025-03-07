import { userControllers } from './user.controller';
import { studentValidations } from '../student/student.zod';
import validateRequest from '../../app/middlewares/validateRequest';
import { NextFunction, Request, Response, Router } from 'express';
import { facultyValidationSchema } from '../Faculty/faculty.validation';
import { adminValidationSchema } from '../Admin/admin.validation';
import auth from '../../app/middlewares/auth';
import { userValidation } from './user.validation';
import { upload } from '../../app/utils/sendImageToCloudinary';
import { USER_ROLE } from './user.constant';

const router = Router();

router.post(
  '/create-student',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);
router.post(
  '/create-faculty',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(facultyValidationSchema.createFacultyValidationSchema),
  userControllers.createFaculty,
);
router.post(
  '/create-admin',
  auth(USER_ROLE.SuperAdmin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(adminValidationSchema.createAdminValidationSchema),
  userControllers.createAdmin,
);
router.get('/me', auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin,USER_ROLE.Faculty,USER_ROLE.Student), userControllers.getMe);
router.post(
  '/change-status/:id',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin),
  validateRequest(userValidation.changeStatusValidationSchema),
  userControllers.changeStatus,
);
export const userRoutes = router;
