import { model, Schema } from 'mongoose';
import { FacultyModel, TFaculty, TUserName } from './faculty.interface';
import { BloodGroup, Gender } from './faculty.constant';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 Characters'],
  },
  middleName: { type: String, required: false, trim: true },
  lastName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 Characters'],
  },
});
const facultySchema = new Schema<TFaculty, FacultyModel>(
  {
    id: {
      type: String,
      required: [true, 'ID is Required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: [true, 'User ID is Required'],
    },
    designation: {
      type: String,
      required: [true, 'Designation is Required'],
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is Required'],
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: '{VALUE} is not valid',
      },
    },
    dateOfBirth: { type: Date, required: false },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact No is Required'],
      trim: true,
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency Contact No is Required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BloodGroup,
        message: '{VALUE} is not valid',
      },
      required: false,
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is Required'],
    },
    profileImg: {
      type: String,
      default: '',
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is Required'],
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Academic Department is Required'],
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: [true, 'AcademicFaculty is Required'],
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
  },
);
// generating full name
facultySchema.virtual('fullName').get(function (this: TFaculty) {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});
// filtering out deleted faculty
facultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
facultySchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});
facultySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
// checking if user exists
facultySchema.statics.isUserExists = async function (id: string) {
  return await this.findOne({ id });
};
export const Faculty = model<TFaculty, FacultyModel>('Faculty', facultySchema);
