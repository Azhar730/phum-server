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
    USER_ROLE.SuperAdmin,
    USER_ROLE.Admin,
    USER_ROLE.Faculty,
    USER_ROLE.Student,
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
