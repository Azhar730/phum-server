import express from 'express';
import { adminControllers } from './admin.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';
const router = express.Router();
router.get('/', adminControllers.getAllAdmin);
router.get('/:id', adminControllers.getSingleAdmin);
router.patch(
  '/:id',
  validateRequest(updateAdminValidationSchema),
  adminControllers.updateAdmin,
);
router.delete('/:adminId', adminControllers.deleteAdmin);
export const adminRoutes = router;
