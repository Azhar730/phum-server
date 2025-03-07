import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { enrolledCourseServices } from './EnrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await enrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student is enrolled successfully',
    data: result,
  });
});
const getMyEnrolledCourse = catchAsync(async (req, res) => {
  const studentId = req.user.userId;
  const result = await enrolledCourseServices.getMyEnrolledCourseFromDB(
    studentId,
    req.query,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Enrolled course are retrivied successfully',
    meta: result.meta,
    data: result.result,
  });
});
const updateEnrolledCourse = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;
  const result = await enrolledCourseServices.updateEnrolledCourseMarksIntoDB(
    facultyId,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Mark is updated successfully',
    data: result,
  });
});
export const enrolledCourseControllers = {
  createEnrolledCourse,
  getMyEnrolledCourse,
  updateEnrolledCourse,
};
