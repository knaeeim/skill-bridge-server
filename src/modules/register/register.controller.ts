import { Request, Response } from "express";
import { registrationServices } from "./register.service";
import { TutorServices } from "../tutor/tutor.service";
import { UserRole } from "../../middleware/auth";
import { studentService } from "../student/student.service";

interface StudentProfile {
    userId : string;
    bio?: string[];
}

interface TutorProfile {
    userId : string;
    bio? : string[];
    experienceYears : number;
    hourlyRate : number;
    category : string[];
    availability : string[]
}

const register = async (req: Request, res: Response) => {
    try {
        const { Profile, ...userData } = req.body;
        const result = await registrationServices.register({ email: userData.email, password: userData.password, name: userData.name, role: userData.role });
        
        if(!result){
            throw new Error("Registration failed");
        }

        console.log(Profile);
        
        const userId = result.id; 

        if(userData.role === UserRole.TUTOR){
            await TutorServices.createTutorProfile({
                userId, 
                experienceYears: Profile.experienceYears,
                hourlyRate : Profile.hourlyRate
            })
        }

        if(userData.role === UserRole.STUDENT){
            await studentService.createStudentProfile({
                userId,
                ...Profile
            })
        }

        res.status(201).json({ message: "Registration successful", user: result });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const registerController = {
    register
}