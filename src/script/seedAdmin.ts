import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";
import { registrationServices } from "../modules/register/register.service";

async function seedAdmin() {
    try {
        console.log("Seeding Admin.....");
        const adminData = {
            name: "admin",
            email: "admin@gmail.com",
            password: "12345678",
            role: UserRole.ADMIN
        }

        // Now checking the user is exist or not 
        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })

        if (existingAdmin) {
            throw new Error("Admin user already exists");
        }

        const newAdmin = await auth.api.signUpEmail({
            body: {
                ...adminData
            }
        });

        if (newAdmin.user) {
            console.log("Admin user seeded successfully");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error seeding admin user:", error.message);
        } else {
            console.error("Unknown error seeding admin user");
        }
    }
}

seedAdmin();