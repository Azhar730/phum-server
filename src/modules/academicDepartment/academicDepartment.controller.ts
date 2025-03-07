import catchAsync from '../../app/utils/catchAsync';
import { academicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
  res.status(200).json({
    success: true,
    message: 'Academic Department is created Successfully',
    data: result,
  });
});
const getAllAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.getAllAcademicDepartmentFromDB(req.query);
  res.status(200).json({
    success: true,
    message: 'Get All Academic Department Successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await academicDepartmentServices.getSingleAcademicDepartmentFromDB(
      departmentId,
    );
  res.status(200).json({
    success: true,
    message: 'Get Single Academic Department Successfully',
    data: result,
  });
});
const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await academicDepartmentServices.updateAcademicDepartmentIntoDB(
      departmentId,
      req.body,
    );
  res.status(200).json({
    success: true,
    message: 'Update Academic Department Successfully',
    data: result,
  });
});
export const academicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
