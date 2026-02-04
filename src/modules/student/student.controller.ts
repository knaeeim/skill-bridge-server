import { Request, Response } from "express";
import { studentService } from "./student.service";
import { UserRole } from "../../middleware/auth";


const studentProifleStats = async (req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId;
        const stats = await studentService.studentProfileStats(studentId as string);
        res.status(200).json({ success: true, data: stats });
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
        const result = await studentService.getCurrentUser(id as string, role as UserRole);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateStudentProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string;
        const userData = req.body;
        const result = await studentService.updateStudentProfile(userId, userData);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const studentController = {
    studentProifleStats,
    getCurrentUser,
    updateStudentProfile
}