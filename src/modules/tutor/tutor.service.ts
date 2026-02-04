import { Availability, Category, dayOfWeek, Subjects } from "../../generated/prisma/client";
import { TutorProfileWhereInput, UserOrderByWithRelationInput } from "../../generated/prisma/models";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
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

interface tutorInfoUpdate {
    name?: string,
    image?: string,
    hourlyRate?: number,
    bio?: string
    subjects?: Subjects[],
    availabilities?: Availability[]
    category?: string[]
}

const getAllTutors = async (queries: { subject?: Subjects, experienceYears?: number, hourlyRate?: number, sortOrder?: string, page?: number, limit?: number, sortBy?: string, isFeatured?: string, isApproved?: string }) => {
    try {
        const andConditions: TutorProfileWhereInput[] = [];

        const { page, skip, limit, sortBy, sortOrder } = paginationSortingHelper(queries)

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

        if (sortBy) {
            orderbyConditions.tutorProfile = {
                [sortBy]: sortOrder
            }
        }

        if (queries.isFeatured) {
            const isFeaturedBool = queries.isFeatured === 'true' ? true : false;
            andConditions.push({
                isFeatured: isFeaturedBool
            })
        }

        if (queries.isApproved) {
            const isApprovedBool = queries.isApproved === "true" ? true : false;
            andConditions.push({
                isApproved: isApprovedBool
            })
        }

        console.log(queries.isFeatured);

        return await prisma.user.findMany({
            skip,
            take: limit,
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

        const formattedAvailabilities = [];

        if (availabilities && Array.isArray(availabilities)) {
            for (const slot of availabilities) {
                if (slot.dayOfWeek && Array.isArray(slot.dayOfWeek)) {
                    formattedAvailabilities.push({
                        dayOfWeek: slot.dayOfWeek,
                        startTime: slot.startTime,
                        endTime: slot.endTime
                    })
                }
            }
        }

        const result = await prisma.tutorProfile.create({
            data: {
                ...rest,
                ...(category && {
                    category: {
                        connect: category.map((catId: string) => ({ id: catId }))
                    }
                }),
                ...(formattedAvailabilities.length > 0 && {
                    availabilities: {
                        create: formattedAvailabilities
                    }
                })
            },
            include: {
                user: true,
                availabilities: true,
                category: true,
                reviews: true
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

const updateTutorProfileAvailability = async (userId: string, tutorData: tutorInfoUpdate) => {
    try {
        const { category, availabilities, name, image, ...rest } = tutorData;
        const formattedAvailabilities = [];

        if (availabilities && Array.isArray(availabilities)) {
            for (const slot of availabilities) {
                if (slot.dayOfWeek && Array.isArray(slot.dayOfWeek)) {
                    formattedAvailabilities.push({
                        dayOfWeek: slot.dayOfWeek,
                        startTime: slot.startTime,
                        endTime: slot.endTime
                    })
                }
            }
        }
        const result = await prisma.tutorProfile.update({
            where: { userId },
            data: {
                ...rest,
                ...(category && {
                    category: {
                        set: category.map((catId: string) => ({ id: catId }))
                    }
                }),
                ...(formattedAvailabilities && {
                    availabilities: {
                        deleteMany: {},
                        create: formattedAvailabilities
                    }
                }),
                ...(name || image) && {
                    user: {
                        update: {
                            ...(name && { name }),
                            ...(image && { image })
                        }
                    }
                }
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
                },
                user: {
                    select: {
                        name: true,
                        image: true,
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

const updateTutorProfile = async (userId: string, tutorData: { name?: string, image?: string, hourlyRate?: number, bio?: string }) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const { name, image, hourlyRate, bio } = tutorData;
            if (name || image) {
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        ...(name && { name }),
                        ...(image && { image })
                    }
                })
            }

            if (hourlyRate || bio) {
                await tx.tutorProfile.update({
                    where: { userId },
                    data: {
                        ...(bio && { bio }),
                        ...(hourlyRate && { hourlyRate })
                    }
                })
            }
            const updatedData = await tx.user.findUnique({
                where: { id: userId },
                include: {
                    tutorProfile: true
                }
            })
            return updatedData;
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
                user: true,
                availabilities: true,
                category: true,
                reviews: true
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

const getTutorStats = async (tutorId: string) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const totalBooking = await tx.booking.count({
                where: {
                    tutorId
                },
            })

            const totalRevenueAgg = await tx.booking.aggregate({
                where: {
                    tutorId
                },
                _sum: {
                    price: true
                }
            })

            const totalReview = await tx.review.count({
                where: { tutorId }
            })

            return {
                totalBooking,
                totalRevenue: totalRevenueAgg._sum.price,
                totalReview
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
        throw new Error("Fetching tutor stats failed");
    }
}


export const tutorServices = {
    createTutorProfile,
    updateTutorProfileAvailability,
    updateTutorProfile,
    seeRatingAndReviews,
    getAllTutors,
    getTutorProfile,
    getTutorStats
}