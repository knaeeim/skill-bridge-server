import { Availability, Category } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


const createTutorProfile = async (tutorData: { userId: string, experienceYears: number, hourlyRate: number }) => {
    try {
        console.log("from tutor Service", tutorData.userId);
        console.log(tutorData.experienceYears);
        console.log(tutorData.hourlyRate);
        const result = await prisma.tutorProfile.create({
            data : {
                userId: tutorData.userId,
                experienceYears: tutorData.experienceYears,
                hourlyRate: tutorData.hourlyRate,
            }
        })

        return result;
;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Creating tutor profile failed");
    }
}


export const TutorServices = {
    createTutorProfile
}