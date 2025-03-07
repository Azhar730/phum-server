import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { academicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const academicSemester = req.body;
  const result =
    await academicSemesterServices.createAcademicSemesterIntoDB(
      academicSemester,
    );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Semester is created Successfully',
    data: result,
  });
});
const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemesterFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get AllAcademicSemester successful',
    meta: result.meta,
    data: result.result,
  });
});
const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await academicSemesterServices.getSingleAcademicSemesterFromDB(semesterId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'get single student successful',
    data: result,
  });
});
const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await academicSemesterServices.updateAcademicSemesterIntoDB(
    semesterId,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'get single student successful',
    data: result,
  });
});
export const academicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
