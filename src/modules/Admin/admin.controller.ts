import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { adminServices } from './admin.service';

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.getSingleAdminFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'get single admin successful',
    data: result,
  });
});
const getAllAdmin = catchAsync(async (req, res) => {
  const result = await adminServices.getAllAdminFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'get all admin successful',
    meta: result.meta,
    data: result.result,
  });
});
const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;
  const result = await adminServices.updateAdminIntoDB(id, admin);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'admin updated successful',
    data: result,
  });
});
const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.deleteAdminFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'delete admin successful',
    data: result,
  });
});
export const adminControllers = {
  getAllAdmin,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
};
