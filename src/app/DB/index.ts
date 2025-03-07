import { USER_ROLE } from '../../modules/user/user.constant';
import { User } from '../../modules/user/user.model';
import config from '../config';

const superAdmin = {
  id: '0001',
  email: 'azharmahmud730@gmail.com',
  password: config.super_admin_password,
  role: USER_ROLE.SuperAdmin,
  status: 'In Progress',
  isDeleted: false,
};
const seedSuperAdminIntoDB = async () => {
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.SuperAdmin });
  if (!isSuperAdminExists) {
    await User.create(superAdmin);
  }
};
export default seedSuperAdminIntoDB;
