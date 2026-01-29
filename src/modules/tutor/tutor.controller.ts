import { Request, Response } from "express";
import { tutorServices } from "./tutor.service";

const getAllTutor = async (req: Request, res: Response) => {
    try {
        const result = await tutorServices.getAllTutors();
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateTutorProfile = async (req: Request, res: Response) => {
    try {
        const tutorId = req.params.tutorId;
        const updateData = req.body;
        const result = await tutorServices.updateTutorProfile(tutorId as string, updateData);
        console.log(result);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const seeRatingAndReviews = async (req: Request, res: Response) => {
    try {
        const tutorId = req.params.tutorId;
        const result = await tutorServices.seeRatingAndReviews(tutorId as string);
        console.log(result);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getTutorProfile = async (req: Request, res: Response) => {
    try {
        const tutorId = req.params.tutorId;
        const result = await tutorServices.getTutorProfile(tutorId as string);
        console.log(result);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const tutorController = {
    updateTutorProfile,
    seeRatingAndReviews,
    getAllTutor,
    getTutorProfile
}