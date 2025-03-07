import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../../modules/user/user.interface';
import { User } from '../../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(401, 'You are not authorized');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    const { role, userId, iat } = decoded;

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
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(401, 'You are not authorized');
    }
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(401, 'You are not authorized');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};
export default auth;
