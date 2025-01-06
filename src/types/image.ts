export type ImageUpload = {
    file: File;
    expiresAt?: Date;
}

export type UploadResponse = {
    url: string;
    expiryDate: Date;
    message: string;
}

export type APIError = {
    message: string;
    code?: string;
}