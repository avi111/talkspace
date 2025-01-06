import {useMutation} from '@tanstack/react-query';
import {APIError, ImageUpload, UploadResponse} from "../types/image.ts";
import {uploadImage} from "./imageApi.ts";

// Hook to provide API methods
export const useApi = () => {
    return {
        imageUpload: () =>
            useMutation<UploadResponse, APIError, ImageUpload>({
                mutationFn: uploadImage,
            }),
    };
};