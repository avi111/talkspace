import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import {CONFIG, DATABASE_CONFIG, LOG_MESSAGES, MESSAGES, PATHS} from "./consts.ts";

const app = express();
const { serverPort: port } = CONFIG;

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/' + PATHS.uploadsDirectory, express.static(path.join(process.cwd(), PATHS.uploadsDirectory)));

// Basic error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: MESSAGES.errors.genericError });
});

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