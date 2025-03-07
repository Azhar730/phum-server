import { studentServices } from './student.service';
import sendResponse from '../../app/utils/sendResponse';
import catchAsync from '../../app/utils/catchAsync';

const getAllStudent = catchAsync(async (req, res) => {
  const result = await studentServices.getAllStudentFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'get all student successful',
    meta: result.meta,
    data: result.result,
  });
});
const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.getSingleStudentFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'get single student successful',
    data: result,
  });
});
const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await studentServices.updateStudentIntoDB(id, student);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'update student successful',
    data: result,
  });
});
const deleteSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.deleteStudentFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'delete student successful',
    data: result,
  });
});
export const studentController = {
  getAllStudent,
  getSingleStudent,
  deleteSingleStudent,
  updateStudent,
};
