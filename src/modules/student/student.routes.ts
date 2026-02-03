import { Router } from "express";
import { studentController } from "./student.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router(); 

router.get("/student-profile/stats", studentController.studentProifleStats);

router.get("/current-user", auth(UserRole.STUDENT), studentController.getCurrentUser)

export const studentRoutes = router;