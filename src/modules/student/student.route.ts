import express from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.zod';
import { studentController } from './student.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../app/middlewares/auth';
const router = express.Router();
router.get('/',auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin), studentController.getAllStudent);
router.get('/:id',auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin, USER_ROLE.Faculty), studentController.getSingleStudent);
router.patch(
  '/:id',
  auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin,USER_ROLE.Faculty),
  validateRequest(updateStudentValidationSchema),
  studentController.updateStudent,
);
router.delete('/:id',auth(USER_ROLE.SuperAdmin, USER_ROLE.Admin), studentController.deleteSingleStudent);
export const studentRoutes = router;
