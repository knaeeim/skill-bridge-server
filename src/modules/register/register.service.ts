import { User } from "better-auth/types";
import { UserRole } from "../../middleware/auth";
import { auth } from "../../lib/auth";

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


export const registrationServices = {
    register
}