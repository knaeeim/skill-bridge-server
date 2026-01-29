import { User } from "better-auth/types";
import { UserRole } from "../../middleware/auth";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

const register = async (userData: { email: string, password: string, name: string, role: UserRole }) => {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role
            }
        })
        return response.user as User;
    } catch (error: unknown) {
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
    getCurrentUser
}