import { Availability, dayOfWeek, Subjects } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

interface tutorInfo {
    userId: string,
    experienceYears: number,
    hourlyRate: number,
    bio?: string
    subjects?: Subjects[],
    availabilities?: Availability[]
}

const getAllTutors = async () => {
    try {
        return await prisma.user.findMany({
            where: {
                status: "ACTIVE",
                role: "TUTOR"
            },
            include: {
                tutorProfile: true
            }
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Fetching all tutors failed");
    }
}

const createTutorProfile = async (tutorData: tutorInfo) => {
    try {
        const { availabilities, ...rest } = tutorData;
        const result = await prisma.tutorProfile.create({
            data: {
                ...rest,
                ...(availabilities && {
                    availabilities: {
                        deleteMany: {},
                        create: availabilities.map((slot: any) => ({
                            dayOfWeek: slot.dayOfWeek,
                            startTime: slot.startTime,
                            endTime: slot.endTime
                        }))

                    }
                })
            }
        })
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Creating tutor profile failed");
    }
}

const updateTutorProfile = async (tutorId: string, tutorData: tutorInfo) => {
    try {
        const { availabilities, ...rest } = tutorData;
        const result = await prisma.tutorProfile.update({
            where: { id: tutorId },
            data: {
                ...rest,
                ...(availabilities && {
                    availabilities: {
                        deleteMany: {},
                        create: availabilities.map((slot: any) => ({
                            dayOfWeek: slot.dayOfWeek,
                            startTime: slot.startTime,
                            endTime: slot.endTime
                        }))

                    }
                })
            },
            include: {
                availabilities: true
            }
        })
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Updating tutor profile failed");
    }
}

const seeRatingAndReviews = async (tutorId: string) => {
    try {
        const result = await prisma.tutorProfile.findUnique({
            where: { id: tutorId },
            select: {
                rating: true,
                totalReviews: true,
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,

                        // get student info 
                        student: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        })
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Fetching tutor reviews failed");
    }
}

const getTutorProfile = async (tutorId: string) => {
    try {
        const result = await prisma.tutorProfile.findUnique({
            where: { userId: tutorId },
            include: {
                user: true
            }
        })
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Fetching tutor profile failed");
    }
}


export const tutorServices = {
    createTutorProfile,
    updateTutorProfile,
    seeRatingAndReviews,
    getAllTutors,
    getTutorProfile
}