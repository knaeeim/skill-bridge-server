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
                where : {
                    studentId
                }
            })

            const reviewsCount = await tx.review.count({
                where : {
                    studentId
                }
            })

            const totalSpentAgg = await tx.booking.aggregate({
                where :{
                    studentId
                }, 
                _sum : {
                    price : true,
                    
                },
                _avg : {
                    price : true
                }
            })

            return {
                totalSpentAgg,
                bookingsCount,
                reviewsCount
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

export const studentService = {
    createStudentProfile,
    studentProfileStats,
    getCurrentUser
}