import 'dotenv/config';
import express, { Request, Response } from 'express';
import { Env } from './config/env.config';
import cors from 'cors';
import { asyncHandler } from './middlewares/asyncHandler.middleware';
import { HTTP_STATUS_CODE } from './config/http.config';
import connectDB from './config/database.config';
import { errorHandler } from './middlewares/errorHandler.middleware';
import routes from './routes';
import { generateSlotsForNextFiveDays } from './scripts/generateSlots';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: Env.FRONTEND_URL,
    credentials: true
}))


app.get('/health', asyncHandler(async (req: Request, res: Response) => {
    return res.status(HTTP_STATUS_CODE.OK).json({ message: 'Server is healthy.' });
}));


app.use('/api', routes);

app.use(errorHandler);


const startServer = async () => {
    try {
        await connectDB();
        await generateSlotsForNextFiveDays();
        app.listen(Env.PORT, () => {
            console.log(`✅ Server is running on port ${Env.PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();