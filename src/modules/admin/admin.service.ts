import { User } from "better-auth/types";
import { UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async (isActive: UserStatus) => {
    try {
        const result = await prisma.user.findMany({
            where: {
                status: isActive
            }
        });
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Fetching all users failed");
    }
}

const manageUserStatus = async (userId: string, isActive: UserStatus) => {
    try {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                status: isActive
            }
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Managing user status failed");
    }
}

const getAllBookings = async () => {
    try {
        const result = await prisma.booking.findMany({})
        return result;
    } catch (error : unknown) {
        if(error instanceof Error){
            throw new Error(error.message);
        }
        throw new Error("Fetching all bookings failed");
    }
}

export const adminServices = {
    getAllUsers,
    manageUserStatus,
    getAllBookings,
}