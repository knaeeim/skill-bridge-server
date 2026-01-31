import { prisma } from "../../lib/prisma"

const createStudentProfile = async (studentInfo: { userId: string, bio?: string }) => {
    const result = await prisma.studentProfile.create({
        data: {
            userId: studentInfo.userId,
            bio: studentInfo.bio ? studentInfo.bio : ""
        },
        include: {
            user: true
        }
    })

    return result;
}

export const studentService = {
    createStudentProfile
}