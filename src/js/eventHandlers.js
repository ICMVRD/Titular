import { updateTotal } from './calculator.js';
import { navigateToSection } from './navigation.js';

export function setupInputListeners(container, activities) {
    activities.forEach(activity => {
        const input = container.querySelector(`#qtd${activity.id}`);
        if (input) {
            input.addEventListener('input', () => {
                updateTotal(activity.id, activity.baseScore);
            });

            // Initialize with stored value if exists
            const storedValue = localStorage.getItem(`qtd${activity.id}`);
            if (storedValue) {
                input.value = storedValue;
                updateTotal(activity.id, activity.baseScore);
            }
        }
    });
}

export function setupNavigationHandlers(section) {
    const sections = ['ensino', 'pesquisa', 'extensao', 'gestao'];
    const currentIndex = sections.indexOf(section);
    
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const backToMenu = document.getElementById('backToMenu');
    
    if (prevButton) {
        prevButton.onclick = () => {
            if (currentIndex > 0) {
                navigateToSection(sections[currentIndex - 1]);
            }
        };
        prevButton.disabled = currentIndex === 0;
    }
    
    if (nextButton) {
        nextButton.onclick = () => {
            if (currentIndex < sections.length - 1) {
                navigateToSection(sections[currentIndex + 1]);
            }
        };
        nextButton.disabled = currentIndex === sections.length - 1;
    }
    
    if (backToMenu) {
        backToMenu.onclick = () => {
            const mainContent = document.getElementById('mainContent');
            const menuScreen = document.getElementById('menuScreen');
            if (mainContent && menuScreen) {
                mainContent.innerHTML = '';
                menuScreen.classList.remove('hidden');
            }
        };
    }
}