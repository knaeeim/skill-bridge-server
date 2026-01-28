import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node"
import { TutorServices } from './modules/tutor/tutor.service';
import { tutorRouter } from './modules/tutor/tutor.routes';
import { studentRoutes } from './modules/student/student.routes';
import { registerRouter } from './modules/register/register.routes';

const app: Application = express();
app.use(express.json());

app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth))

app.get("/", (req: Request, res: Response) => {
    res.send("Skill Bridge Server is running");
})

app.use('/user', registerRouter)

app.use("/tutor", tutorRouter);

app.use("/student", studentRoutes);


export default app;