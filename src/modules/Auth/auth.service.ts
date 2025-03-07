import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../app/errors/AppError';
import { User } from '../user/user.model';
import config from '../../app/config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import { TLoginUser } from './auth.interface';
import { sendEmail } from '../../app/utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) {
    throw new AppError(404, 'this user is not found');
  }
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(400, 'this user deleted');
  }
  const userStatus = user?.status;
  if (userStatus === 'Blocked') {
    throw new AppError(400, 'this user is blocked');
  }
  // checking the password is correct
  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(400, 'password not matched');
  }
  const jwtPayLoad = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayLoad,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayLoad,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsByCustomId(userData.userId);
  if (!user) {
    throw new AppError(404, 'this user is not found');
  }
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(400, 'this user deleted');
  }
  const userStatus = user?.status;
  if (userStatus === 'Blocked') {
    throw new AppError(400, 'this user is blocked');
  }
  // checking the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(400, 'password not matched');
  }
  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};
const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  const { userId, iat } = decoded;
  // checking if the user is exists
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(404, 'this user is not found');
  }
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(400, 'this user deleted');
  }
  const userStatus = user?.status;
  if (userStatus === 'Blocked') {
    throw new AppError(400, 'this user is blocked');
  }
  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(401, 'You are not authorized');
  }
  const jwtPayLoad = {
    userId: user?.id,
    role: user?.role,
  };
  const accessToken = createToken(
    jwtPayLoad,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  return { accessToken };
};
const forgetPassword = async (userId: string) => {
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(404, 'this user is not found');
  }
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(400, 'this user deleted');
  }
  const userStatus = user?.status;
  if (userStatus === 'Blocked') {
    throw new AppError(400, 'this user is blocked');
  }
  const jwtPayLoad = {
    userId: user.id,
    role: user.role,
  };
  const resetToken = createToken(
    jwtPayLoad,
    config.jwt_access_secret as string,
    '5m',
  );
  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;
  sendEmail(user?.email, resetUILink);
};
const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) {
    throw new AppError(404, 'this user is not found');
  }
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(400, 'this user deleted');
  }
  const userStatus = user?.status;
  if (userStatus === 'Blocked') {
    throw new AppError(400, 'this user is blocked');
  }
  const decoded = verifyToken(token, config.jwt_access_secret as string);
  if (payload.id !== decoded.userId) {
    throw new AppError(403, 'you are forbidden access');
  }
  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  // update password into db
  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};
export const authServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
