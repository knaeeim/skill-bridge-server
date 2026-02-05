import { prisma } from "../../lib/prisma"
import { UserRole } from "../../middleware/auth";

const createStudentProfile = async (studentInfo: { userId: string, bio?: string }) => {
    try {
        const result = await prisma.studentProfile.create({
            data: {
                userId: studentInfo.userId,
                bio: studentInfo.bio ? studentInfo.bio : ""
            },
            include: {
                user: true
            }
        })

        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Creating student profile failed");
    }
}

const studentProfileStats = async (studentId: string) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const bookingsCount = await tx.booking.count({
                where: {
                    studentId: studentId,
                    status : "COMPLETED"
                }
            })

            const inProgressBooking = await tx.booking.count({
                where : {
                    studentId : studentId,
                    status : "CONFIRMED"
                }
            })

            const reviewsCount = await tx.review.count({
                where: {
                    studentId: studentId
                }
            })

            const totalSpentAgg = await tx.booking.aggregate({
                where: {
                    studentId: studentId,
                    status : "COMPLETED"
                },
                _sum: {
                    price: true,
                },
            })

            const totalCancelled = await tx.booking.count({
                where : {
                    studentId : studentId,
                    status : "CANCELLED"
                }
            })

            return {
                totalSpentAgg,
                bookingsCount,
                reviewsCount,
                totalCancelled,
                inProgressBooking
            }
        }, {
            maxWait: 5000,
            timeout: 10000
        })
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Fetching student profile stats failed");
    }
}

const getCurrentUser = async (userId: string, role: UserRole) => {
    try {
        const dynamicProfileInclude = role === UserRole.TUTOR ? { tutorProfile: true } : role === UserRole.STUDENT ? { studentProfile: true } : {};
        return await prisma.user.findUnique({
            where: { id: userId },
            include: {
                ...dynamicProfileInclude
            }
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Fetching current user failed");
    }
}

const updateStudentProfile = async (userId: string, userData: { name?: string, bio?: string, image?: string }) => {
    try {
        const { name, bio, image } = userData;
        const result = await prisma.$transaction(async (tx) => {
            if (name || image) {
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        ...(name && { name }),
                        ...(image && { image })
                    }
                })
            }

            if (bio) {
                await tx.studentProfile.update({
                    where: { userId },
                    data: {
                        bio
                    }
                })
            }

            const updatedData = await tx.user.findUnique({
                where: { id: userId },
                include: {
                    studentProfile: true
                }
            })
            return updatedData;
        })
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Updating student profile failed");
    }
}

const cancelBooking = async (bookingId: string) => {
    try {
        const result = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status : "CANCELLED"
            }
        })
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Cancelling booking failed");
    }
}

export const studentService = {
    createStudentProfile,
    studentProfileStats,
    getCurrentUser,
    updateStudentProfile, 
    cancelBooking
}