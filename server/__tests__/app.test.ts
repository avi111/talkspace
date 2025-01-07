import {PATHS, STATUS_CODES} from '../consts';
import app from '../index';
import path from "path";
import * as fs from "node:fs";
import request from 'supertest';

describe('App Paths', () => {
    beforeAll(() => {
        // Create the uploads directory if it doesn't exist
        const uploadsPath = path.join(process.cwd(), PATHS.uploadsDirectory);
        if (!fs.existsSync(uploadsPath)) {
            fs.mkdirSync(uploadsPath);
        }
    });

    afterAll(() => {
        // Optionally clean up test files or the uploads directory
        const uploadsPath = path.join(process.cwd(), PATHS.uploadsDirectory);
        if (fs.existsSync(uploadsPath)) {
            fs.rmdirSync(uploadsPath, {recursive: true});
        }
    });

    describe(`GET /${PATHS.uploadsDirectory}`, () => {
        it('should serve files from the uploads directory', async () => {
            const uploadsPath = path.join(process.cwd(), PATHS.uploadsDirectory);
            const testFilePath = path.join(uploadsPath, 'test.txt');

            // Create a test file in the uploads directory
            fs.writeFileSync(testFilePath, 'Test content');

            const response = await request(app).get(`/${PATHS.uploadsDirectory}/test.txt`);

            expect(response.status).toBe(200);
            expect(response.text).toBe('Test content');

            // Clean up the test file
            fs.unlinkSync(testFilePath);
        });

        it('should return 404 for non-existent files', async () => {
            const response = await request(app).get(`/${PATHS.uploadsDirectory}/non-existent.txt`);
            expect(response.status).toBe(STATUS_CODES.notFound);
        });
    });

    describe('Error Handling', () => {
        it('should return a generic error for unhandled routes', async () => {
            const response = await request(app).get('/non-existent-route');
            expect(response.status).toBe(STATUS_CODES.notFound);
        });

        it('should return a generic error for unhandled errors', async () => {
            // Mock an error in the app
            app.get('/error', () => {
                throw new Error('Test error');
            });

            const response = await request(app).get('/error');
            expect(response.status).toBe(STATUS_CODES.internalServerError);
        });
    });
});