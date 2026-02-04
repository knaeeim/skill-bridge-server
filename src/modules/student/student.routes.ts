import { Router } from "express";
import { studentController } from "./student.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/student-profile/stats/:studentId", studentController.studentProifleStats);

router.put("/update-student-profile/:userId", auth(UserRole.STUDENT), studentController.updateStudentProfile);

export const studentRoutes = router;