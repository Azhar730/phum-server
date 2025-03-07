import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { facultyServices } from './faculty.service';

const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await facultyServices.getSingleFacultyFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get single Faculty successfully',
    data: result,
  });
});
const getAllFaculties = catchAsync(async (req, res) => {
  const result = await facultyServices.getAllFacultiesFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get All Faculty successfully',
    meta: result.meta,
    data: result.result,
  });
});
const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;
  const result = await facultyServices.updateFacultyIntoDB(id, faculty);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty successfully Updated',
    data: result,
  });
});
const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await facultyServices.deleteFacultyFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty is deleted successful',
    data: result,
  });
});
export const facultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  deleteFaculty,
  updateFaculty,
};
