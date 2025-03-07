import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { courseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await courseServices.createCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Create course successfully',
    data: result,
  });
});
const getAllCourse = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCourseFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'get all course successfully',
    meta: result.meta,
    data: result.result
  });
});
const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.getSingleCourseFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'get single course successfully',
    data: result,
  });
});
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.updateCourseIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'course updated successfully',
    data: result,
  });
});
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.deleteCourseFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'course delete successfully',
    data: result,
  });
});
const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await courseServices.assignFacultiesWithCourseIntoDB(
    courseId,
    faculties,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculties Assigned Successfully',
    data: result,
  });
});
const getFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await courseServices.getFacultiesWithCourseFromDB(
    courseId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'getFacultiesWithCourse Successfully',
    data: result,
  });
});
const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await courseServices.removeFacultiesFromCourseFromDB(
    courseId,
    faculties,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculties Removed Successfully',
    data: result,
  });
});
export const courseController = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesWithCourse,
  getFacultiesWithCourse,
  removeFacultiesFromCourse,
};
