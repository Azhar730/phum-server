import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({ invalid_type_error: 'Name must be a string' }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Department Must be String',
      required_error: 'Academic Faculty is Required',
    }),
  }),
});
const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({ invalid_type_error: 'Name must be a string' }).optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic Department Must be String',
        required_error: 'Academic Faculty is Required',
      })
      .optional(),
  }),
});
export const academicDepartmentValidation = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
