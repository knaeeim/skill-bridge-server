import { Request, Response } from "express";
import { registrationServices } from "./register.service";
import { tutorServices } from "../tutor/tutor.service";
import { UserRole } from "../../middleware/auth";
import { studentService } from "../student/student.service";

interface StudentProfile {
    userId: string;
    bio?: string[];
}

interface TutorProfile {
    userId: string;
    bio?: string[];
    experienceYears: number;
    hourlyRate: number;
    category: string[];
    availabilities: string[]
}

const register = async (req: Request, res: Response) => {
    try {
        const { Profile, ...userData } = req.body;
        const result = await registrationServices.register({ email: userData.email, password: userData.password, name: userData.name, role: userData.role });

        if (!result) {
            throw new Error("Registration failed");
        }

        const userId = result.id;

        let response = null;

        if (userData.role === UserRole.TUTOR) {
            response = await tutorServices.createTutorProfile({
                userId,
                ...Profile
            })
        }

        if (userData.role === UserRole.STUDENT) {
            response = await studentService.createStudentProfile({
                userId,
                ...Profile
            })
        }

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