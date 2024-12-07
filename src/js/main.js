import { initializeNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeNavigation();
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});