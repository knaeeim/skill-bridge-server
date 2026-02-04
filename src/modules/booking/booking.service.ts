import { Subjects } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middleware/auth";

export interface BookingData {
    studentId: string
    tutorId: string
    subject: Subjects
    date: string
    startTime: string
    endTime: string
    price: number
}

const getAllBookings = async () => {
    try {
        const result = await prisma.booking.findMany({})
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Fetching all bookings failed");
    }
}

const createBooking = async (bookingData: BookingData) => {
    try {
        const existingBooking = await prisma.booking.count({
            where: {
                tutorId: bookingData.tutorId,
                date: new Date(bookingData.date),
                startTime: bookingData.startTime
            }
        })

        if (existingBooking > 10) {
            throw new Error("Tutor is fully booked for the selected time slot");
        }

        console.log(bookingData);

        const { date, ...rest } = bookingData;
        const result = await prisma.booking.create({
            data: {
                date: new Date(date),
                ...rest
            }, 
        })
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Creating booking failed");
    }
}

const getUsersBookings = async (userId: string, role: UserRole) => {
    try {
        const rolebasedFilter = role === UserRole.STUDENT ? { studentId: userId } : { tutorId: userId };
        const result = await prisma.booking.findMany({
            where: {
                ...rolebasedFilter,
            }, 
            include : {
                tutor : true,
                student : true
            }
        })
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Fetching user's bookings failed");
    }
}

const getBookingDetails = async (bookingId : string) => {
    try {
        const result = await prisma.booking.findUnique({
            where : {
                id : bookingId
            }
        })
        return result;
    } catch (error : unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Fetching booking details failed");
    }
}

export const bookingServices = {
    getAllBookings,
    createBooking,
    getUsersBookings, 
    getBookingDetails
}