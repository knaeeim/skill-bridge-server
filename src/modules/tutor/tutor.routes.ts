import { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { tutorController } from "./tutor.controller";

const router = Router();

router.get("/all-tutors", tutorController.getAllTutor);

router.get("/profile/:tutorId", tutorController.getTutorProfile);

router.put("/update-tutor/:tutorId", tutorController.updateTutorProfile);

router.get("/ratings-reviews/:tutorId", auth(UserRole.TUTOR, UserRole.ADMIN), tutorController.seeRatingAndReviews)

export const tutorRouter = router; 