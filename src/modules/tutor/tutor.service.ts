import { Availability, Category, dayOfWeek, Subjects } from "../../generated/prisma/client";
import { TutorProfileWhereInput, UserOrderByWithRelationInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

interface tutorInfo {
    userId: string,
    experienceYears: number,
    hourlyRate: number,
    bio?: string
    subjects?: Subjects[],
    availabilities?: Availability[]
    category?: string[]
}

const getAllTutors = async (queries: { subject?: Subjects, experienceYears?: number, hourlyRate?: number, sortOrder?: string, page?: number, limit?: number, sortBy?: string }) => {
    try {
        const andConditions: TutorProfileWhereInput[] = [];

        if (queries.subject) {
            andConditions.push({
                subjects: {
                    has: queries.subject
                }
            })
        }

        if (queries.experienceYears) {
            andConditions.push({
                experienceYears: {
                    gte: Number(queries.experienceYears)
                }
            })
        }

        if (queries.hourlyRate) {
            andConditions.push({
                hourlyRate: {
                    lte: Number(queries.hourlyRate)
                }
            })
        }

        const orderbyConditions: UserOrderByWithRelationInput = {};

        if (queries.sortOrder === 'asc') {
            orderbyConditions.tutorProfile = {
                hourlyRate: "asc"
            }
        }
        else if (queries.sortOrder === "desc") {
            orderbyConditions.tutorProfile = {
                hourlyRate: "desc"
            }
        }

        return await prisma.user.findMany({
            where: {
                status: "ACTIVE",
                role: "TUTOR",
                tutorProfile: {
                    AND: andConditions
                },
            },
            include: {
                tutorProfile: true
            },
            orderBy: orderbyConditions
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
        const { category, availabilities, ...rest } = tutorData;
        const result = await prisma.tutorProfile.create({
            data: {
                ...rest,
                ...(category && {
                    category: {
                        connect: category.map((catId: string) => ({ id: catId }))
                    }
                }),
                ...(availabilities && {
                    availabilities: {
                        create: availabilities.map((slot: any) => ({
                            dayOfWeek: slot.dayOfWeek,
                            startTime: slot.startTime,
                            endTime: slot.endTime
                        }))
                    }
                })
            }, 
            include : {
                user : true
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
        const { category, availabilities, ...rest } = tutorData;
        console.log(category);
        const result = await prisma.tutorProfile.update({
            where: { id: tutorId },
            data: {
                ...rest,
                ...(category && {
                    category: {
                        set: category.map((catId: string) => ({ id: catId }))
                    }
                }),
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
                availabilities: {
                    select: {
                        dayOfWeek: true,
                        startTime: true,
                        endTime: true
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                }
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
            where: {
                userId: tutorId,
            },
            include: {
                user: true
            },

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