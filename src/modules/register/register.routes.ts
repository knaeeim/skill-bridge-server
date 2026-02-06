import { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { registerController } from "./register.controller";

const router = Router();

router.get("/current-user", auth(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR), registerController.getCurrentUser);

router.post("/register", registerController.register);


export const registerRouter = router;