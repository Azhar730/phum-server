import { startSession } from 'mongoose';
import QueryBuilder from '../../app/builder/QueryBuilder';
import AppError from '../../app/errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import {
  registrationStatus,
  semesterRegistrationStatus,
} from './semesterRegistration.constant';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  /**
   * step-1: check if there any registered semester that is already 'UPCOMING' or 'ONGOING'
   * step-2: check if the semester is exist
   * step-3: check if the semester is already registered
   * step-4: create the semester registration
   */
  const academicSemester = payload?.academicSemester;
  //check if there any registered semester that is already 'UPCOMING' or 'ONGOING'
  const isAnyUpcomingOngoingSemester = await SemesterRegistration.findOne({
    $or: [
      { status: registrationStatus.UPCOMING },
      { status: registrationStatus.ONGOING },
    ],
  });
  if (isAnyUpcomingOngoingSemester) {
    throw new AppError(
      400,
      `There is already an ${isAnyUpcomingOngoingSemester.status} registered semester`,
    );
  }
  // check if the semester is exist
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new AppError(404, 'Academic Semester Not Found');
  }
  // check if the semester is already registered
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(409, 'this semester is already registered');
  }
  const result = await SemesterRegistration.create(payload);
  return result;
};
const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semesterRegistrationQuery.modelQuery;
  const meta = await semesterRegistrationQuery.countTotal();
  return {
    meta,
    result,
  };
};
const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};
const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  /**
   * step-1: Check if the semester is exist
   * step-2: Check if the requested registered semester is exists
   * step-3: If the requested semester registration is 'ENDED', we will not update anything
   * step-4: If the requested semester registration is 'UPCOMING', we will let update everything
   * step-5: If the requested semester registration is 'ONGOING', we will not update anything except status to 'ENDED'
   * step-6: If the requested semester registration is 'ENDED', we will not update anything
   */

  //Check if the requested registered semester is exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(404, 'this semester is not found');
  }
  // If the requested semester registration is 'ENDED', we will not update anything
  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  const requestedStatus = payload?.status;
  if (currentSemesterStatus === registrationStatus.ENDED) {
    throw new AppError(
      400,
      `This semester is already ${currentSemesterStatus}`,
    );
  }
  // UPCOMING --> ONGOING --> ENDED
  if (
    currentSemesterStatus === registrationStatus.UPCOMING &&
    requestedStatus === registrationStatus.ENDED
  ) {
    throw new AppError(
      400,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }
  if (
    currentSemesterStatus === registrationStatus.ONGOING &&
    requestedStatus === registrationStatus.UPCOMING
  ) {
    throw new AppError(
      400,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteSemesterRegistrationFromDB = async (id: string) => {
  /** 
  * Step1: Delete associated offered courses.
  * Step2: Delete semester registration when the status is 
  'UPCOMING'.
  **/
  // checking if the semester registration is exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(404, 'this registered semester is not found');
  }
  // checking if the status still upcoming
  const semesterRegistrationStatus = isSemesterRegistrationExists.status;
  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      400,
      `you can not update as the registered semester is ${semesterRegistrationStatus}`,
    );
  }
  const session = await startSession();
  // deleting associated offered course
  try {
    session.startTransaction();
    const deletedOfferedCourse = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      { session },
    );
    if (!deletedOfferedCourse) {
      throw new AppError(400, 'failed to delete semester registration');
    }
    const deletedSemesterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, { session, new: true });
    if (!deletedSemesterRegistration) {
      throw new AppError(400, 'failed to delete semester registration');
    }
    await session.commitTransaction();
    await session.endSession();
    return null;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};
export const semesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
