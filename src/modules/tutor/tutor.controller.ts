import { Request, Response } from "express";
import { TutorServices } from "./tutor.service";

const createTutorProifle = async (req: Request, res: Response) => {
    try {
        const tutorData = req.body;
        const result = await TutorServices.createTutorProfile(tutorData);
        if (!result) {
            throw new Error("Tutor profile creation failed");
        }
        res.status(201).json({ success: true, data: result });
    } catch (error : unknown) {
        if(error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const tutorController = {
    createTutorProifle
}