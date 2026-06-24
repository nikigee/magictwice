import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', () => {
    function create(message, type = "primary") {
        const alertElement = document.getElementById('playerAlert')
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        if (alertElement) {
            alertElement.append(wrapper);
            
            // Set tabindex and focus wrapper for accessibility, removing outline to prevent visual distraction
            wrapper.setAttribute('tabindex', '-1');
            wrapper.style.outline = 'none';
            wrapper.focus({ preventScroll: true });

            // Scroll the wrapper into view smoothly
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    return { create }
})
