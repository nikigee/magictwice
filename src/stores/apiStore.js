import { defineStore } from 'pinia'

export const useAPIStore = defineStore('api', () => {
    const url = process.env.VUE_APP_API;

    // Log session data to the backend
    function log_session(post_data){
        const cached_session = sessionStorage.getItem('session_logged');
        if (cached_session) return; // Prevent duplicate logging in the same session

        fetch(`${url}/session`, { method: 'POST', body: JSON.stringify(post_data), headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(data => {
                console.log('session: ', data.message);
                sessionStorage.setItem('session_logged', 'true');
            })
            .catch(error => {
                console.error('Error logging session:', error);
            });
    }

    async function sendPrompt(prompt, context) {
        try {
            const response = await fetch(`${url}/ai`, {
                method: 'POST',
                body: JSON.stringify({ prompt, context }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            return data.message;
        } catch (error) {
            console.error('Error sending prompt:', error);
            throw error;
        }
    }

    // Returns the public/cached CDN URL for any uploaded fileKey
    function getImageUrl(fileKey) {
        if (!fileKey) return '';
        // If it's already a full URL, return as is
        if (fileKey.startsWith('http://') || fileKey.startsWith('https://')) return fileKey;
        return `${url}/images/${encodeURIComponent(fileKey)}`;
    }

    // Handles the two-step direct upload to S3/Railway Bucket
    async function uploadImage(file) {
        try {
            // 1. Ask your backend for a presigned upload URL
            const ticketResponse = await fetch(`${url}/api/get-upload-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentType: file.type || 'image/jpeg' })
            });

            const ticketData = await ticketResponse.json();
            if (!ticketResponse.ok || ticketData.error) {
                throw new Error(ticketData.error || 'Failed to get upload ticket');
            }

            const { uploadUrl, fileKey } = ticketData;

            // 2. Upload file directly to the S3 bucket using PUT
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type || 'image/jpeg'
                },
                body: file
            });

            if (!uploadResponse.ok) {
                throw new Error(`Direct upload failed with status ${uploadResponse.status}`);
            }

            // Return both the key (to save in your DB/state) and the display URL
            return {
                fileKey,
                imageUrl: getImageUrl(fileKey)
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    return { 
        log_session, 
        sendPrompt, 
        uploadImage, 
        getImageUrl 
    }
})