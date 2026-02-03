import { auth as betterAuth } from "../lib/auth"
import { NextFunction, Request, Response } from "express"

export enum UserRole {
    ADMIN = "ADMIN",
    TUTOR = "TUTOR",
    STUDENT = "STUDENT"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                email: string,
                name: string,
                role: string
            }
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            });

            if (!session) {
                return res.status(401).json({ success: false, message: "You are not authenticated, You need to login First" })
            }

            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role
            }

            if (roles.length && !roles.includes(req.user.role as UserRole)) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized to access this resource"
                })
            }

            next();

        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(401).json({ message: error.message });
            }
            return res.status(401).json({ message: "Unauthorized" });
        }
    }
}

export default auth;