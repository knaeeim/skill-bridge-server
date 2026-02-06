import { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { tutorController } from "./tutor.controller";

const router = Router();

router.get("/all-tutors", tutorController.getAllTutor);

router.get("/tutor-stats", auth(UserRole.TUTOR), tutorController.getTutorStats)

router.get("/profile/:tutorId", tutorController.getTutorProfile);

router.put("/update-tutor-availability", auth(UserRole.TUTOR), tutorController.updateTutorProfileAvailability);

router.put("/update-tutor-profile", auth(UserRole.TUTOR), tutorController.updateTutorProfile);

router.get("/ratings-reviews/:tutorId", auth(UserRole.TUTOR, UserRole.ADMIN), tutorController.seeRatingAndReviews)

export const tutorRouter = router; 