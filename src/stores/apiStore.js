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

    return { log_session }
})