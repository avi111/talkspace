import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cron from 'node-cron';
import {CONFIG, DATABASE_CONFIG, LOG_MESSAGES, MESSAGES, PATHS, UPLOADS_DIR} from "./consts";
import { router } from './routes';
import {cleanupExpiredImages} from "./controllers/imageController";

const app = express();
const {serverPort: port} = CONFIG;

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/' + PATHS.uploadsDirectory, express.static(UPLOADS_DIR));
app.use('/api', router);

// Basic error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({error: MESSAGES.errors.genericError});
});

if(process.env.NODE_ENV !== 'test') {
// Connect to MongoDB
    mongoose
        .connect(DATABASE_CONFIG.mongoUri)
        .then(() => {
            console.log(LOG_MESSAGES.mongoConnected);
            app.listen(port, () => {
                console.log(LOG_MESSAGES.serverRunning(port));
            });
        })
        .catch((error) => {
            console.error(LOG_MESSAGES.mongoConnectionError, error);
        });
}

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

// Schedule the cron job to run every minute
cron.schedule('* * * * *', async () => {
    console.log('Running cleanup job:', new Date().toISOString());
    await cleanupExpiredImages();
});

export default app;