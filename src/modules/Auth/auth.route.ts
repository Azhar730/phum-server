import { Router } from 'express';
import { authControllers } from './auth.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { authValidation } from './auth.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../app/middlewares/auth';

const router = Router();
router.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  authControllers.loginUser,
);
router.post(
  '/change-password',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  validateRequest(authValidation.changePasswordValidationSchema),
  authControllers.changePassword,
);
router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenValidationSchema),
  authControllers.refreshToken,
);
router.post(
  '/forget-password',
  validateRequest(authValidation.forgetPasswordValidationSchema),
  authControllers.forgetPassword,
);
router.post(
  '/reset-password',
  validateRequest(authValidation.resetPasswordValidationSchema),
  authControllers.resetPassword,
);
export const authRoutes = router;
