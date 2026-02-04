import { User } from "better-auth/types";
import { UserRole } from "../../middleware/auth";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tutorServices } from "../tutor/tutor.service";
import { Subjects } from "../../generated/prisma/enums";
import { studentService } from "../student/student.service";
import { Availability } from "../../generated/prisma/client";

interface StudentProfile {
    bio?: string;
}

interface TutorProfile {
    bio?: string;
    experienceYears: number;
    hourlyRate: number;
    category: string[];
    availabilities: Availability[]
    subjects: Subjects[];
}

const register = async (userData: { email: string, password: string, name: string, role: UserRole, profile: TutorProfile | StudentProfile }) => {
    let userId: string | null = null;
    try {

        const { profile, ...registerData } = userData;

        const isExistingUser = await prisma.user.findUnique({
            where: { email: registerData.email }
        })

        if (isExistingUser) {
            throw new Error("User with this email already exists");
        }

        const result = await auth.api.signUpEmail({
            body: {
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
                role: registerData.role
            }
        })

        if (!result.user) {
            throw new Error("Registration failed");
        }

        userId = result.user.id;

        let response = null;

        if (userData.role === UserRole.TUTOR) {
            response = await tutorServices.createTutorProfile({
                userId,
                ...(profile as TutorProfile)
            })
        }

        if (userData.role === UserRole.STUDENT) {
            response = await studentService.createStudentProfile({
                userId,
                ...(profile as StudentProfile)
            })
        }
        return response;

    } catch (error: unknown) {

        if (userId) {
            try {
                await prisma.user.delete({
                    where: { id: userId }
                })
            } catch (deleteError) {
                throw new Error("Registration failed. Additionally, failed to clean up user data.");
            }
        }

        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Registration failed");
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


export const registrationServices = {
    register,
    getCurrentUser,
}