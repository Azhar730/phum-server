import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { userServices } from './user.service';

const createStudent = catchAsync(async (req, res) => {
  const file = req.file;
  const { password, student: studentData } = req.body;
  const result = await userServices.createStudentIntoDB(
    file,
    password,
    studentData,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Student created Successfully',
    data: result,
  });
});
const createFaculty = catchAsync(async (req, res) => {
  const file = req.file;
  const { password, faculty: facultyData } = req.body;
  const result = await userServices.createFacultyIntoDB(
    file,
    password,
    facultyData,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Faculty created Successfully',
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const file = req.file;
  const { password, admin: adminData } = req.body;
  const result = await userServices.createAdminIntoDB(
    file,
    password,
    adminData,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Admin created Successfully',
    data: result,
  });
});
const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = userServices.getMe(userId, role);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'get me Successfully',
    data: result,
  });
});
const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = userServices.changeStatus(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'change status Successfully',
    data: result,
  });
});
export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
