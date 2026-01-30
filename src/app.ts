import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node"
import { tutorRouter } from './modules/tutor/tutor.routes';
import { studentRoutes } from './modules/student/student.routes';
import { registerRouter } from './modules/register/register.routes';
import { adminRouter } from './modules/admin/admin.routes';
import { bookingRouter } from './modules/booking/booking.routes';
import { reviewRouter } from './modules/review/review.routes';

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

app.use("/admin", adminRouter)

app.use("/booking", bookingRouter);

app.use("/review", reviewRouter);


export default app;