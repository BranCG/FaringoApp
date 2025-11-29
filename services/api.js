import axios from 'axios';
import * as FileSystem from 'expo-file-system';

// Helper to construct base URL
const getBaseUrl = (input) => {
    if (input.startsWith('http://') || input.startsWith('https://')) {
        return input.replace(/\/$/, ''); // Remove trailing slash if present
    }
    return `http://${input}:5000`;
};

export const uploadVideo = async (serverAddress, videoUri, linesData, mode) => {
    try {
        const baseUrl = getBaseUrl(serverAddress);

        // Create FormData
        const formData = new FormData();

        // Add video file
        const videoFile = {
            uri: videoUri,
            type: 'video/mp4',
            name: 'video.mp4'
        };
        formData.append('video', videoFile);

        // Add lines data
        formData.append('lines', JSON.stringify(linesData));

        // Make request
        const response = await axios.post(
            `${baseUrl}/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 300000 // 5 minutes timeout
            }
        );

        return response;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

export const checkHealth = async (serverAddress) => {
    try {
        const baseUrl = getBaseUrl(serverAddress);
        const response = await axios.get(`${baseUrl}/health`, {
            timeout: 5000
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
};
