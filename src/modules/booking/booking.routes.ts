import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/all-bookings", auth(UserRole.STUDENT, UserRole.TUTOR), bookingController.getAllBookings);

router.post("/create-booking", bookingController.createBooking);

router.get("/user-bookings", auth(UserRole.STUDENT, UserRole.TUTOR), bookingController.getUsersBookings);

router.get("/booking-details/:bookingId", bookingController.getBookingDetails)

router.put("/mark-booking-as-completed/:bookingId", auth(UserRole.TUTOR), bookingController.markBookingAsCompleted);

export const bookingRouter = router;