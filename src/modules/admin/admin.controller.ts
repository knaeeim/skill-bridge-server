import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import { UserStatus } from "../../generated/prisma/enums";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { isActive, page, limit } = req.query;

        const result = await adminServices.getAllUsers(isActive as UserStatus, Number(page), Number(limit));
        const refineData = result.data.length === 0 ? "No Users Found" : result;
        res.status(200).json({ success: true, data: refineData });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const manageUserStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const { status } = req.body;
        console.log(status);
        const result = await adminServices.manageUserStatus(userId as string, status as UserStatus);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const result = await adminServices.createCategory({ name, description });
        res.status(201).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const result = await adminServices.getAllCategories();
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAllStats = async (req: Request, res: Response) => {
    try {
        const result = await adminServices.getAllStats();
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result = await adminServices.getAllBookings();
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const adminController = {
    getAllUsers,
    manageUserStatus,
    createCategory,
    getAllCategories,
    getAllStats,
    getAllBookings
}