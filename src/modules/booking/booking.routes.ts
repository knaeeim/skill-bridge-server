import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/all-bookings", bookingController.getAllBookings);

router.post("/create-booking", bookingController.createBooking);

router.get("/user-bookings", auth(UserRole.STUDENT, UserRole.TUTOR), bookingController.getUsersBookings);

export const bookingRouter = router;