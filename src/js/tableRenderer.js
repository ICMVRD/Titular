export function renderTable(activities, tableId, title) {
    return `
        <div class="table-container">
            <h3>${title}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Atividade</th>
                        <th>Pontuação</th>
                        <th>Número</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${activities.map(activity => `
                        <tr>
                            <td>${activity.name}</td>
                            <td>${activity.description}</td>
                            <td>${activity.baseScore}</td>
                            <td><input type="number" min="0" id="qtd${activity.id}" class="quantity-input" placeholder="Quantidade"></td>
                            <td><span id="total${activity.id}">0.00</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}