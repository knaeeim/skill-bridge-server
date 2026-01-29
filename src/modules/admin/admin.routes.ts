import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/all-users", adminController.getAllUsers);

router.put("/manage-user/:userId", adminController.manageUserStatus);

router.get("/all-bookings", adminController.getAllBookings);

export const adminRouter = router