import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 4000;

async function main() {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error starting the server:", error.message);
        }
    }
}

main(); 

