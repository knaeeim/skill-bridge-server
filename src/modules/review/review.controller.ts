import { Request, Response } from "express";
import { ReviewData, reviewServices } from "./review.service";

const createReview = async (req: Request, res: Response) => {
    try {
        const reviewData: ReviewData = req.body;
        const result = await reviewServices.createReview(reviewData);
        res.status(201).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const reviewController = {
    createReview
}