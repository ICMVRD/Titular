import { teachingActivities } from './data/teachingActivities.js';
import { extensionActivities } from './data/extensionActivities.js';
import { researchActivities } from './data/researchActivities.js';
import { managementActivities } from './data/managementActivities.js';
import { renderTable } from './tableRenderer.js';
import { updateSectionTotals, initializeTotals, loadStoredValues } from './calculator.js';
import { setupInputListeners, setupNavigationHandlers } from './eventHandlers.js';

function renderSectionSummary() {
    const storedTotals = JSON.parse(localStorage.getItem('sectionTotals') || '{}');
    
    return `
        <div class="section-summary">
            <div class="section-total">
                <span>Ensino:</span>
                <span class="total-value" data-section-total="ensino">${(storedTotals.ensino || 0).toFixed(2)}</span>
            </div>
            <div class="section-total">
                <span>Pesquisa:</span>
                <span class="total-value" data-section-total="pesquisa">${(storedTotals.pesquisa || 0).toFixed(2)}</span>
            </div>
            <div class="section-total">
                <span>Extensão:</span>
                <span class="total-value" data-section-total="extensao">${(storedTotals.extensao || 0).toFixed(2)}</span>
            </div>
            <div class="section-total">
                <span>Gestão:</span>
                <span class="total-value" data-section-total="gestao">${(storedTotals.gestao || 0).toFixed(2)}</span>
            </div>
        </div>
    `;
}

function renderNavigationButtons() {
    return `
        <div class="section-navigation">
            <button class="nav-button" id="prevButton">Anterior</button>
            <button class="nav-button" id="backToMenu">Voltar ao Menu</button>
            <button class="nav-button" id="nextButton">Próximo</button>
        </div>
    `;
}

export function navigateToSection(section) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    const menuScreen = document.getElementById('menuScreen');
    if (menuScreen) {
        menuScreen.classList.add('hidden');
    }
    
    let content = '';
    content += renderSectionSummary();
    
    switch (section) {
        case 'ensino':
            content += `
                <div data-section="ensino">
                    <h2>Ensino</h2>
                    ${renderTable(teachingActivities.normalizedTeaching, 'teachingTable', 'Atividades de Ensino')}
                    ${renderTable(teachingActivities.orientationActivities, 'orientationTable', 'Atividades de Orientação')}
                </div>
            `;
            break;
        case 'pesquisa':
            content += `
                <div data-section="pesquisa">
                    <h2>Pesquisa</h2>
                    ${renderTable(researchActivities.publications, 'publicationsTable', 'Publicações')}
                    ${renderTable(researchActivities.projectsAndResearch, 'projectsTable', 'Projetos e Pesquisa')}
                    ${renderTable(researchActivities.eventsAndOtherActivities, 'eventsTable', 'Eventos e Outras Atividades')}
                </div>
            `;
            break;
        case 'extensao':
            content += `
                <div data-section="extensao">
                    <h2>Extensão</h2>
                    ${renderTable(extensionActivities.participationAndOrganization, 'participationTable', 'Participação e Organização')}
                    ${renderTable(extensionActivities.projectsAndCoordination, 'coordinationTable', 'Projetos e Coordenação')}
                </div>
            `;
            break;
        case 'gestao':
            content += `
                <div data-section="gestao">
                    <h2>Gestão</h2>
                    ${renderTable(managementActivities.administrativeAndAcademic, 'administrativeTable', 'Gestão Administrativa e Acadêmica')}
                    ${renderTable(managementActivities.coursesAndPrograms, 'programsTable', 'Gestão de Cursos e Programas')}
                </div>
            `;
            break;
    }
    
    content += renderNavigationButtons();
    mainContent.innerHTML = content;
    
    setupNavigationHandlers(section);
    setupInputListenersForSection(section);
    loadStoredValues();
    updateSectionTotals();
}

function setupInputListenersForSection(section) {
    const container = document.querySelector(`[data-section="${section}"]`);
    if (!container) return;
    
    switch (section) {
        case 'ensino':
            setupInputListeners(container, [...teachingActivities.normalizedTeaching, ...teachingActivities.orientationActivities]);
            break;
        case 'pesquisa':
            setupInputListeners(container, [...researchActivities.publications, ...researchActivities.projectsAndResearch, ...researchActivities.eventsAndOtherActivities]);
            break;
        case 'extensao':
            setupInputListeners(container, [...extensionActivities.participationAndOrganization, ...extensionActivities.projectsAndCoordination]);
            break;
        case 'gestao':
            setupInputListeners(container, [...managementActivities.administrativeAndAcademic, ...managementActivities.coursesAndPrograms]);
            break;
    }
}

export function initializeNavigation() {
    const enterButton = document.getElementById('enterButton');
    const menuScreen = document.getElementById('menuScreen');
    const welcomeScreen = document.getElementById('welcomeScreen');

    if (enterButton) {
        enterButton.addEventListener('click', () => {
            if (welcomeScreen) welcomeScreen.classList.add('hidden');
            if (menuScreen) menuScreen.classList.remove('hidden');
            initializeTotals();
        });
    }

    const menuButtons = document.querySelectorAll('.menu-button');
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.getAttribute('data-section');
            if (section) {
                navigateToSection(section);
            }
        });
    });

    window.navigateToSection = navigateToSection;
}