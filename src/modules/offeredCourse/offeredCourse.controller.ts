import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { offeredCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await offeredCourseServices.createOfferedCourseIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered course is created successfully',
    data: result,
  });
});
const getAllOfferedCourse = catchAsync(async (req, res) => {
  const result = await offeredCourseServices.getAllOfferedCourseFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'getAllOfferedCourse successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getMyOfferedCourses = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await offeredCourseServices.getMyOfferedCourseFromDB(
    userId,
    req.query,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'getMyOfferedCourses successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseServices.getSingleOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'getSingleOfferedCourse successfully',
    data: result,
  });
});
const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'updateOfferedCourse successfully',
    data: result,
  });
});
const deleteOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseServices.deleteOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'deleteOfferedCourse successfully',
    data: result,
  });
});
export const offeredCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourse,
  getMyOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
