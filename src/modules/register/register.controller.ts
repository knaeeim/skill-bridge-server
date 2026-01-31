import { Request, Response } from "express";
import { registrationServices } from "./register.service";
import { tutorServices } from "../tutor/tutor.service";
import { UserRole } from "../../middleware/auth";
import { studentService } from "../student/student.service";

const register = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const response = await registrationServices.register(userData);

        res.status(201).json({ message: "Registration successful", user: response });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const { id, role } = req.user as { id: string, role: string };
        const result = await registrationServices.getCurrentUser(id as string, role as UserRole);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const registerController = {
    register,
    getCurrentUser
}