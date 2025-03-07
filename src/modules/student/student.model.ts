import { model, Schema } from 'mongoose';

import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
import validator from 'validator';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true,
    validate: {
      validator: function (value: string) {
        const capitalize =
          value.charAt(0).toUpperCase() + value.slice(1) === value;
        const alpha = validator.isAlpha(value);
        return capitalize && alpha;
      },
      message: '{VALUE} is not in Capitalize Formate or Alphanumeric Pattern',
    },
  },
  middleName: { type: String },
  lastName: {
    type: String,
    required: [true, 'Last Name is Required'],
  },
});
const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is Required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is Required'],
  },
  fatherPhone: {
    type: String,
    required: [true, 'Father Phone is Required'],
    maxlength: [11, 'Maximum Allowed 11 Character'],
    minlength: [11, 'Minimum Allowed 11 Character'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is Required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is Required'],
  },
  motherPhone: {
    type: String,
    required: [true, 'Mother Phone is Required'],
    maxlength: [11, 'Maximum Allowed 11 Character'],
    minlength: [11, 'Minimum Allowed 11 Character'],
  },
});
const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Name is Required'],
  },
  occupation: {
    type: String,
    required: [true, 'Occupation is Required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is Required'],
  },
  address: {
    type: String,
    required: [true, 'Address is Required'],
  },
});
const studentSchema = new Schema<TStudent, StudentModel>({
  id: {
    type: String,
    required: [true, 'ID is Required'],
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is Required'],
    unique: true,
    ref: 'User',
  },
  name: {
    type: userNameSchema,
    required: [true, 'Name is Required'],
  },
  gender: {
    type: String,
    enum: {
      values: ['Male', 'Female', 'Others'],
      message: '{VALUE is not Valid}',
    },
    required: [true, 'Gender is Required'],
  },
  DOB: {
    type: String,
    required: [true, 'DOB is Required'],
  },
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
    validate: {
      validator: (value: string) => {
        const isEmail = validator.isEmail(value);
        return isEmail;
      },
      message: '{VALUE is not of Email Formate}',
    },
  },
  contactNo: {
    type: String,
    required: [true, 'Phone is Required'],
    maxlength: [11, 'Maximum Allowed 11 Character'],
    minlength: [11, 'Minimum Allowed 11 Character'],
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency Phone is Required'],
    maxlength: [11, 'Maximum Allowed 11 Character'],
    minlength: [11, 'Minimum Allowed 11 Character'],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not Valid',
    },
  },
  presentAddress: {
    type: String,
    required: [true, 'Present Address is Required'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent Address is Required'],
  },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian is Required'],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, 'Local Guardian is Required'],
  },
  profileImg: {
    type: String,
    default: '',
  },
  admissionSemester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicSemester',
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment',
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicFaculty',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { $ne: true } });
  next();
});

// implement custom static method
studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};
// // implement custom instance method
// studentSchema.methods.isUserExist = async function(id:string){
//   const existingUser = await Student.findOne({id})
//   return existingUser
// }
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
