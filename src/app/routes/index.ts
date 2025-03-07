import { Router } from 'express';
import { userRoutes } from '../../modules/user/user.route';
import { studentRoutes } from '../../modules/student/student.route';
import { academicSemesterRoutes } from '../../modules/academicSemester/academicSemester.route';
import { academicFacultyRoutes } from '../../modules/academicFaculty/academicFaculty.route';
import { academicDepartmentRoutes } from '../../modules/academicDepartment/academicDepartment.route';
import { facultyRoutes } from '../../modules/Faculty/faculty.route';
import { adminRoutes } from '../../modules/Admin/admin.route';
import { courseRoutes } from '../../modules/Course/course.route';
import { semesterRegistrationRoutes } from '../../modules/semesterRegistration/semesterRegistration.route';
import { offeredCourseRoutes } from '../../modules/offeredCourse/offeredCourse.route';
import { authRoutes } from '../../modules/Auth/auth.route';
import { enrolledCourseRoutes } from '../../modules/EnrolledCourse/EnrolledCourse.route';

const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/students',
    route: studentRoutes,
  },
  {
    path: '/faculties',
    route: facultyRoutes,
  },
  {
    path: '/admins',
    route: adminRoutes,
  },
  {
    path: '/courses',
    route: courseRoutes,
  },
  {
    path: '/academic-semester',
    route: academicSemesterRoutes,
  },
  {
    path: '/academic-faculty',
    route: academicFacultyRoutes,
  },
  {
    path: '/academic-department',
    route: academicDepartmentRoutes,
  },
  {
    path: '/semester-registrations',
    route: semesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    route: offeredCourseRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/enrolled-courses',
    route: enrolledCourseRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
