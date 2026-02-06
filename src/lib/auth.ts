import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }), 
    trustedOrigins : [process.env.APP_URL!, "https://skill-bridge-client-taupe.vercel.app"],
    user : {
        additionalFields : {
            role : {
                type : "string",
                required : true
            }, 
            phone : {
                type : "string",
                required : false
            },
            status : {
                type : "string",
                required : false
            }
        }
    },
    emailAndPassword : {
        enabled: true
    }
});