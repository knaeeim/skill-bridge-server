import { prisma } from "../../lib/prisma";


export interface ReviewData {
    bookingId: string;
    studentId: string;
    tutorId: string;
    rating: number;
    comment?: string;
}

const createReview = async (reviewData: ReviewData) => {
    try {
        return await prisma.$transaction(async (tx) => {

            const existingReview = await tx.review.findUnique({
                where: {
                    bookingId: reviewData.bookingId // Ensure your interface has this
                }
            });

            if (existingReview) {
                throw new Error("You have already reviewed this booking!");
            }

            const newReview = await tx.review.create({
                data: {
                    ...reviewData
                }
            })

            // Calculate new Stats 
            const aggregations = await tx.review.aggregate({
                where: {
                    tutorId: reviewData.tutorId
                },
                _count: {
                    rating: true
                },
                _avg: {
                    rating: true
                }
            })

            const totalReviews = aggregations._count.rating;
            const averageRatings = aggregations._avg.rating || 0;

            // Update Tutor Profile 
            await tx.tutorProfile.update({
                where: {
                    id: reviewData.tutorId
                },
                data: {
                    totalReviews: totalReviews,
                    rating: parseFloat(averageRatings.toFixed(2))
                }
            })

            return newReview;
        },
            {
                maxWait: 5000,
                timeout: 10000
            })
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Creating review failed");
    }
}

export const reviewServices = {
    createReview
}