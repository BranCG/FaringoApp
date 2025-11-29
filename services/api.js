import axios from 'axios';
import * as FileSystem from 'expo-file-system';

export const uploadVideo = async (serverIP, videoUri, linesData, mode) => {
    try {
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
            `http://${serverIP}:5000/upload`,
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

export const checkHealth = async (serverIP) => {
    try {
        const response = await axios.get(`http://${serverIP}:5000/health`, {
            timeout: 5000
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
};
