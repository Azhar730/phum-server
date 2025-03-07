import { Student } from './student.model';
import mongoose from 'mongoose';
import AppError from '../../app/errors/AppError';
import { TStudent } from './student.interface';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';
import { User } from '../user/user.model';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query };
  // const studentSearchableFields = ['name.firstName', 'email', 'presentAddress'];
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query.searchTerm as string;
  // }
  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });
  // // filtering
  // const excludedFields = ['searchTerm', 'limit', 'sort', 'page', 'fields'];
  // excludedFields.forEach((field) => delete queryObj[field]);

  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });
  // // sorting
  // let sort = '-createdAt';
  // if (query?.sort) {
  //   sort = query.sort as string;
  // }
  // const sortedQuery = filterQuery.sort(sort);

  // // limiting & pagination system-1
  // // let limit = 10;
  // // let page = 1;
  // // if (query?.limit) {
  // //   limit = parseInt(query.limit as string, 10);
  // // }
  // // if (query?.page) {
  // //   page = parseInt(query.page as string, 10);
  // // }
  // // const skip = (page - 1) * limit;
  // // const paginatedQuery = sortedQuery.skip(skip).limit(limit);
  // // const result = await paginatedQuery;
  // // return result;

  // // limiting & pagination system-2
  // let limit = 2;
  // let page = 1;
  // let skip = 0;
  // if (query?.limit) {
  //   limit = parseInt(query.limit as string);
  // }
  // if (query?.page) {
  //   page = parseInt(query.page as string);
  //   skip = (page - 1) * limit;
  // }
  // const pageQuery = sortedQuery.skip(skip);
  // const limitedQuery = pageQuery.limit(limit);
  // // field limiting
  // let fields = '-__v';
  // if (query?.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  // }
  // const fieldLimitedQuery =await limitedQuery.select(fields);
  // return fieldLimitedQuery;

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('user')
      .populate('admissionSemester')
      .populate('academicDepartment academicFaculty'),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();
  return {
    meta,
    result,
  };
};
const getSingleStudentFromDB = async (id: string) => {
  const isStudentExist = await Student.findById(id);
  if (!isStudentExist) {
    throw new AppError(400, 'This student is does not exist');
  }
  const result = await Student.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudent } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudent,
  };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }
  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteStudentFromDB = async (id: string) => {
  const isStudentExist = await Student.findOne({ id });
  if (!isStudentExist) {
    throw new AppError(400, 'This student is does not exist');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(400, 'Failed to Delete Student');
    }
    // get user _id from deleted student
    const userId = deletedStudent.user;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(400, 'Failed to Delete User');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};
export const studentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
