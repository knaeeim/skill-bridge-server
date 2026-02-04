import { User } from "better-auth/types";
import { UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middleware/auth";

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

const createCategory = async (categoryData: { name: string, description?: string }) => {
    try {
        const result = await prisma.category.create({
            data: {
                ...categoryData
            }
        })
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Creating category failed");
    }
}

const getAllCategories = async () => {
    try {
        const result = await prisma.category.findMany({});
        return result;
    } catch (error : unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Fetching all categories failed");
    }
}

const getAllStats = async () => {
    try {
        const stats = await prisma.$transaction(async (tx) => {
            const totalUser = await tx.user.count({});
            const totalTutors = await tx.user.count({
                where: { role: UserRole.TUTOR }
            })
            const totalStudents = await tx.user.count({
                where: { role: UserRole.STUDENT }
            })
            const totalBookings = await tx.booking.count({});
            const totalCategories = await tx.category.count({});
            const totalSale = await tx.booking.aggregate({
                _sum: {
                    price: true,
                }
            })
            const avgSale = await tx.booking.aggregate({
                _avg: {
                    price: true,
                }
            })
            const totalBanUsers = await tx.user.count({
                where: { status: "BANNED" }
            })

            return {
                totalUser,
                totalTutors,
                totalStudents,
                totalBookings,
                totalCategories,
                totalSale,
                avgSale,
                totalBanUsers
            }
        })

        return stats;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Fetching stats failed");
    }
}

const getAllBookings = async () => {
    try {
        const result = await prisma.booking.findMany({});
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
    createCategory, 
    getAllCategories, 
    getAllStats,
    getAllBookings
}