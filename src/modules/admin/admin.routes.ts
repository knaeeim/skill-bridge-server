import { Router } from "express";
import { adminController } from "./admin.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/all-users", auth(UserRole.ADMIN) ,adminController.getAllUsers);

router.get("/stats", auth(UserRole.ADMIN), adminController.getAllStats)

router.put("/manage-user/:userId", auth(UserRole.ADMIN), adminController.manageUserStatus);

router.post("/create-category", auth(UserRole.ADMIN), adminController.createCategory);

router.get("/all-categories", auth(UserRole.ADMIN), adminController.getAllCategories);

export const adminRouter = router