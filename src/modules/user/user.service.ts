import mongoose from 'mongoose';
import config from '../../app/config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../app/errors/AppError';
import { TFaculty } from '../Faculty/faculty.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../Faculty/faculty.model';
import { TAdmin } from '../Admin/admin.interface';
import { Admin } from '../Admin/admin.model';
import { User } from './user.model';
import { sendImageToCloudinary } from '../../app/utils/sendImageToCloudinary';

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  const userData: Partial<TUser> = {};
  userData.role = 'Student';
  userData.email = payload.email;
  userData.password = password || (config.default_pass as string);

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );
  if (!admissionSemester) {
    throw new Error('Admission semester not found');
  }
  // find department
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(404, 'academicDepartment not found !');
  }
  payload.academicFaculty = academicDepartment.academicFaculty;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // set generate id
    userData.id = await generateStudentId(admissionSemester);
    if (file) {
      const imageName = `${userData.id} ${payload.name.firstName}`;
      const path = file?.path;
      const { secure_url } = sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }
    // create a user (transaction - 1)
    const newUser = await User.create([userData], { session });
    // create a student
    if (!newUser.length) {
      throw new AppError(400, 'Failed to Create User');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    // create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(400, 'Failed to create Student');
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};
const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  // create a user object
  const userData: Partial<TUser> = {};
  // if password is not given, use default password
  userData.password = password || (config.default_pass as string);
  // set user role
  userData.role = 'Faculty';
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(400, 'Academic Department not Found');
  }
  payload.academicFaculty = academicDepartment.academicFaculty
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // set generated id
    userData.id = await generateFacultyId();
    if (file) {
      const imageName = `${userData.id} ${payload.name.firstName}`;
      const path = file?.path;
      const { secure_url } =await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }
    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array
    // create a faculty
    if (!newUser.length) {
      throw new AppError(400, 'Failed to create user');
    }
    // set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    // create a faculty (transaction-2)
    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(400, 'Failed to Create Faculty');
    }
    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};
const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
  
) => {
  // create a user object
  const userData: Partial<TUser> = {};
  // if password is not given , use default password
  userData.password = password || (config.default_pass as string);
  // set user role
  userData.role = 'Admin';
  userData.email = payload.email;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // set generated id
    userData.id = await generateAdminId();
    if (file) {
      const imageName = `${userData.id} ${payload.name.firstName}`;
      const path = file?.path;
      const { secure_url } = sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }
    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });
    // create an admin
    if (!newUser.length) {
      throw new AppError(400, 'Failed to create Admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    // create an admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(400, 'Failed to create admin');
    }
    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};
const getMe = async (userId: string, role: string) => {
  let result;
  if (role === 'Admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }
  if (role === 'Faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }
  if (role === 'Student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  return result;
};
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};
export const userServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
