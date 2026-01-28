import { Router } from "express";
import { studentController } from "./student.controller";

const router = Router(); 

router.post('/create-profile', studentController.createStudentProfile)

export const studentRoutes = router;