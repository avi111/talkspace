import axios from 'axios';
import {ImageUpload, UploadResponse} from "../types/image.ts";

const API_URL = 'http://localhost:3000/api/v1';

export const uploadImage = async ({file, expiresAt}: ImageUpload): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    if(expiresAt) {
        formData.append('expiresAt', expiresAt.toISOString());
    }

    const {data} = await axios.post<UploadResponse>(`${API_URL}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return data;
};