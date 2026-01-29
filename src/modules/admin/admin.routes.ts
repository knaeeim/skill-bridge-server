import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/all-users", adminController.getAllUsers)

router.put("/manage-user/:userId", adminController.manageUserStatus)

export const adminRouter = router