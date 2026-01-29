import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import { UserStatus } from "../../generated/prisma/enums";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { isActive } = req.query;
        const result = await adminServices.getAllUsers(isActive as UserStatus);
        const refineData = result.length === 0 ? "No Users Found" : result;
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
        const {isActive} = req.body;
        const result = await adminServices.manageUserStatus(userId as string, isActive as UserStatus);
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
        
    } catch (error : unknown) {
        if(error instanceof Error){
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const adminController = {
    getAllUsers,
    manageUserStatus, 
    getAllBookings
}