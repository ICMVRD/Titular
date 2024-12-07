export function calculateScore(baseScore, quantity) {
    return parseFloat((baseScore * quantity).toFixed(2));
}

export function updateTotal(id, baseScore) {
    const quantityInput = document.getElementById(`qtd${id}`);
    const totalElement = document.getElementById(`total${id}`);
    
    if (!quantityInput || !totalElement) return;
    
    const quantity = parseFloat(quantityInput.value) || 0;
    const total = calculateScore(baseScore, quantity);
    
    // Store value in localStorage
    localStorage.setItem(`qtd${id}`, quantity.toString());
    totalElement.textContent = total.toFixed(2);
    
    // Update section totals after each change
    updateSectionTotals();
}

function calculateSectionTotal(section) {
    const sectionElement = document.querySelector(`[data-section="${section}"]`);
    if (!sectionElement) return 0;

    const totalElements = sectionElement.querySelectorAll('[id^="total"]');
    let sectionTotal = 0;

    totalElements.forEach(element => {
        const value = parseFloat(element.textContent) || 0;
        sectionTotal += value;
    });

    return sectionTotal;
}

export function updateSectionTotals() {
    const sections = ['ensino', 'pesquisa', 'extensao', 'gestao'];
    const totals = {};

    // Calculate current section total
    const currentSection = sections.find(section => 
        document.querySelector(`[data-section="${section}"]`)
    );

    if (currentSection) {
        totals[currentSection] = calculateSectionTotal(currentSection);
        
        // Store the new total for current section
        localStorage.setItem(`total_${currentSection}`, totals[currentSection].toString());
    }

    // Load stored totals for other sections
    sections.forEach(section => {
        if (section !== currentSection) {
            const storedTotal = localStorage.getItem(`total_${section}`);
            totals[section] = storedTotal ? parseFloat(storedTotal) : 0;
        }
    });

    // Update all total displays in the summary
    sections.forEach(section => {
        const totalElement = document.querySelector(`[data-section-total="${section}"]`);
        if (totalElement) {
            totalElement.textContent = totals[section].toFixed(2);
        }
    });

    // Store all totals
    localStorage.setItem('sectionTotals', JSON.stringify(totals));
}

export function initializeTotals() {
    const storedTotals = localStorage.getItem('sectionTotals');
    if (storedTotals) {
        const totals = JSON.parse(storedTotals);
        Object.entries(totals).forEach(([section, total]) => {
            const totalElement = document.querySelector(`[data-section-total="${section}"]`);
            if (totalElement) {
                totalElement.textContent = parseFloat(total).toFixed(2);
            }
        });
    } else {
        // Initialize with zeros if no stored totals
        const sections = ['ensino', 'pesquisa', 'extensao', 'gestao'];
        const initialTotals = {};
        sections.forEach(section => {
            initialTotals[section] = 0;
        });
        localStorage.setItem('sectionTotals', JSON.stringify(initialTotals));
    }
}

export function loadStoredValues() {
    const inputs = document.querySelectorAll('input[id^="qtd"]');
    inputs.forEach(input => {
        const id = input.id.replace('qtd', '');
        const storedValue = localStorage.getItem(`qtd${id}`);
        if (storedValue) {
            input.value = storedValue;
            const baseScoreElement = input.closest('tr').querySelector('td:nth-child(3)');
            if (baseScoreElement) {
                const baseScore = parseFloat(baseScoreElement.textContent);
                updateTotal(id, baseScore);
            }
        }
    });
}