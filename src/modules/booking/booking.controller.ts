import { Request, Response } from "express";
import { BookingData, bookingServices } from "./booking.service";
import { UserRole } from "../../middleware/auth";

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.getAllBookings();
        return res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const createBooking = async (req: Request, res: Response) => {
    try {
        const bookingData = req.body as BookingData;
        const result = await bookingServices.createBooking(bookingData);
        return res.status(201).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getUsersBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string;
        const role = req.user?.role as string;
        const result = await bookingServices.getUsersBookings(userId as string, role as UserRole);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getBookingDetails = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.bookingId; 
        const result = await bookingServices.getBookingDetails(bookingId as string);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const markBookingAsCompleted = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.bookingId;
        console.log(bookingId);
        const result = await bookingServices.markBookingAsCompleted(bookingId as string);
        res.status(200).json({ success: true, data: result });
    } catch (error : unknown) {
        if(error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const bookingController = {
    getAllBookings,
    createBooking,
    getUsersBookings, 
    getBookingDetails,
    markBookingAsCompleted
}