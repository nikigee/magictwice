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
        }
    }

    return { create }
})