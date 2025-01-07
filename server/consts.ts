export const MESSAGES = {
    errors: {
        noImageUploaded: 'No image uploaded',
        uploadFailed: 'Failed to upload image',
        imageNotFound: 'Image not found',
        imageExpired: 'Image has expired',
        serveFailed: 'Failed to serve image',
        invalidImageId: 'Invalid image ID',
        invalidFileType: 'Invalid file type. Only JPEG, PNG and GIF are allowed.',
        genericError: 'Something went wrong!',
    },
    success: {
        imageUploaded: 'Image uploaded successfully',
    },
};

export const CONFIG = {
    serverPort: process.env.PORT || 3000,
    uploadMaxFileSize: 5 * 1024 * 1024, // 5MB
    uploadAllowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
};

export const DATABASE_CONFIG = {
    mongoUri: 'mongodb://localhost:27017/image-share',
};

export const PATHS = {
    uploadsDirectory: 'uploads',
};

export const LOG_MESSAGES = {
    mongoConnected: 'Connected to MongoDB',
    serverRunning: (port: number | string) => `Server running on port ${port}`,
    mongoConnectionError: 'MongoDB connection error:',
};

export const RANDOM_SUFFIX_CONFIG = {
    randomMultiplier: 1e9, // Multiplier for generating a random number
};

export const STATUS_CODES = {
    badRequest: 400,
    notFound: 404,
    gone: 410,
    internalServerError: 500,
    created: 201,
};

export const DEFAULT_EXPIRY_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours