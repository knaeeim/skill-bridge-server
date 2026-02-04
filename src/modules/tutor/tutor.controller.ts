import { Request, Response } from "express";
import { tutorServices } from "./tutor.service";

const getAllTutor = async (req: Request, res: Response) => {
    try {
        const queries = req.query;
        const result = await tutorServices.getAllTutors(queries);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateTutorProfileAvailability = async (req: Request, res: Response) => {
    try {
        const tutorId = req.user?.id;
        const updateData = req.body;
        const result = await tutorServices.updateTutorProfileAvailability(tutorId as string, updateData);
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
        const tutorId = req.user?.id;
        const updateData = req.body;
        const result = await tutorServices.updateTutorProfile(tutorId as string, updateData);
        return res.status(200).json({ success: true, data: result });
    } catch (error : unknown) {
        if(error instanceof Error) {
            return res.status(500).json({ message : error.message });
        }
        res.status(500).json({ message : "Internal Server Error" });
    }
}

const seeRatingAndReviews = async (req: Request, res: Response) => {
    try {
        const tutorId = req.params.tutorId;
        const result = await tutorServices.seeRatingAndReviews(tutorId as string);
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
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getTutorStats = async (req: Request, res: Response) => {
    try {
        const tutorId = req.user?.id as string;
        const result = await tutorServices.getTutorStats(tutorId);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const tutorController = {
    updateTutorProfileAvailability,
    seeRatingAndReviews,
    getAllTutor,
    getTutorProfile,
    getTutorStats,
    updateTutorProfile
}