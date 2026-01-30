import { Router } from "express";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/create-review", reviewController.createReview);

export const reviewRouter = router;