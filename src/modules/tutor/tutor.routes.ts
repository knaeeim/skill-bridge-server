import { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";

const router = Router(); 

router.post("/create-tutor", auth(UserRole.TUTOR, UserRole.ADMIN))


export const tutorRouter = router; 