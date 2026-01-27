import express, { Application } from 'express';
import cors from 'cors'; 

const app: Application = express();

app.use(cors({
    origin : process.env.APP_URL, 
    credentials : true
}))



export default app;