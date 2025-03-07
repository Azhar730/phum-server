import { z } from 'zod';
import { UserStatus } from './user.constant';

const createUserValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Name must be a string' })
    .max(8, { message: 'Password should be more length 8' }),
});
const updateUserValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Name must be a string' })
    .max(8, { message: 'Password should be more length 8' })
    .optional(),
});
const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});
export const userValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  changeStatusValidationSchema
};
