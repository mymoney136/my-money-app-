// Function to create a simple budget app
function createBudgetApp() {
    // State variables
    let transactions = [];
    let balance = 0;
    let totalIncome = 0;
    let totalExpenses = 0;
    let dailyBudget = 0;
    let dailyBudgetPeriod = 30; // Default to 30 days
    let dailyBudgetAmount = 0;
    let currencySymbol = '₪';

    // DOM elements
    const root = document.getElementById('root');
    
    // Initial render
    renderApp();

    function renderApp() {
        root.innerHTML = `
            <h1>מנהל תקציב אישי</h1>

            <div class="budget-summary">
                <div class="summary-card">
                    <h3>יתרה נוכחית</h3>
                    <p id="balance-display">${balance} ${currencySymbol}</p>
                </div>
                <div class="summary-card">
                    <h3>הכנסות</h3>
                    <p id="income-display" class="income">${totalIncome} ${currencySymbol}</p>
                </div>
                <div class="summary-card">
                    <h3>הוצאות</h3>
                    <p id="expenses-display" class="expense">${totalExpenses} ${currencySymbol}</p>
                </div>
                <div class="summary-card">
                    <h3>תקציב יומי</h3>
                    <p id="daily-budget-display">${dailyBudget} ${currencySymbol}</p>
                </div>
            </div>

            <form id="add-transaction-form" class="add-transaction-form">
                <input type="text" id="transaction-description" placeholder="תיאור" required>
                <input type="number" id="transaction-amount" placeholder="סכום" required>
                <select id="transaction-type">
                    <option value="income">הכנסה</option>
                    <option value="expense">הוצאה</option>
                </select>
                <button type="submit">הוסף עסקה</button>
            </form>

            <div class="settings-and-reports">
                <button id="show-settings">הגדרות</button>
                <button id="generate-report">צור דוח</button>
            </div>

            <div id="settings-modal" class="modal">
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <h2>הגדרות</h2>
                    <label for="daily-budget-amount">סכום לתקציב יומי:</label>
                    <input type="number" id="daily-budget-amount" value="${dailyBudgetAmount}">
                    <label for="daily-budget-period">תקופת התקציב (ימים):</label>
                    <input type="number" id="daily-budget-period" value="${dailyBudgetPeriod}">
                    <button id="save-settings">שמור הגדרות</button>
                </div>
            </div>

            <div id="report-modal" class="modal">
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <h2>דוח תקציב</h2>
                    <p id="report-text"></p>
                </div>
            </div>

            <h2>היסטוריית עסקאות</h2>
            <ul id="transaction-list" class="transaction-list"></ul>
        `;

        // Add event listeners
        document.getElementById('add-transaction-form').addEventListener('submit', handleAddTransaction);
        document.getElementById('show-settings').addEventListener('click', showSettingsModal);
        document.getElementById('generate-report').addEventListener('click', generateReport);
        document.getElementById('save-settings').addEventListener('click', saveSettings);
        
        // Close modal listeners
        document.querySelectorAll('.close-button').forEach(button => {
            button.addEventListener('click', () => {
                document.getElementById('settings-modal').style.display = 'none';
                document.getElementById('report-modal').style.display = 'none';
            });
        });
        
        window.addEventListener('click', (event) => {
            if (event.target == document.getElementById('settings-modal')) {
                document.getElementById('settings-modal').style.display = 'none';
            }
            if (event.target == document.getElementById('report-modal')) {
                document.getElementById('report-modal').style.display = 'none';
            }
        });

        updateTotals();
        renderTransactions();
    }

    function handleAddTransaction(event) {
        event.preventDefault();
        
        const description = document.getElementById('transaction-description').value;
        const amount = parseFloat(document.getElementById('transaction-amount').value);
        const type = document.getElementById('transaction-type').value;

        if (!description || isNaN(amount) || amount <= 0) {
            alert('אנא הזן תיאור וסכום תקינים.');
            return;
        }

        const newTransaction = {
            id: Date.now(),
            description,
            amount,
            type
        };

        transactions.push(newTransaction);
        updateTotals();
        renderTransactions();
        
        // Reset the form
        document.getElementById('transaction-description').value = '';
        document.getElementById('transaction-amount').value = '';
    }

    function updateTotals() {
        totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        balance = totalIncome - totalExpenses;
        dailyBudget = (dailyBudgetAmount > 0 && dailyBudgetPeriod > 0) ? (dailyBudgetAmount / dailyBudgetPeriod).toFixed(2) : 0;

        document.getElementById('balance-display').textContent = `${balance} ${currencySymbol}`;
        document.getElementById('income-display').textContent = `${totalIncome} ${currencySymbol}`;
        document.getElementById('expenses-display').textContent = `${totalExpenses} ${currencySymbol}`;
        document.getElementById('daily-budget-display').textContent = `${dailyBudget} ${currencySymbol}`;
    }

    function renderTransactions() {
        const list = document.getElementById('transaction-list');
        list.innerHTML = '';
        
        transactions.forEach(t => {
            const listItem = document.createElement('li');
            listItem.className = 'transaction-list-item';
            listItem.innerHTML = `
                <span>${t.description}</span>
                <span class="transaction-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${t.amount} ${currencySymbol}</span>
                <button onclick="removeTransaction(${t.id})">מחק</button>
            `;
            list.appendChild(listItem);
        });
    }
    
    function showSettingsModal() {
        document.getElementById('settings-modal').style.display = 'block';
    }

    function saveSettings() {
        dailyBudgetAmount = parseFloat(document.getElementById('daily-budget-amount').value) || 0;
        dailyBudgetPeriod = parseInt(document.getElementById('daily-budget-period').value) || 30;
        updateTotals();
        document.getElementById('settings-modal').style.display = 'none';
    }

    function generateReport() {
        const reportText = document.getElementById('report-text');
        reportText.innerHTML = `
            <h3>דוח תקציב</h3>
            <p><strong>יתרה נוכחית:</strong> ${balance} ${currencySymbol}</p>
            <p><strong>הכנסות כוללות:</strong> ${totalIncome} ${currencySymbol}</p>
            <p><strong>הוצאות כוללות:</strong> ${totalExpenses} ${currencySymbol}</p>
            <p><strong>התקציב היומי שהוגדר:</strong> ${dailyBudget} ${currencySymbol}</p>
            ${balance >= 0 ? '<p style="color: green;">כל הכבוד! נשארת במסגרת התקציב.</p>' : '<p style="color: red;">שים לב! חרגת מהתקציב.</p>'}
        `;
        document.getElementById('report-modal').style.display = 'block';
    }

    window.removeTransaction = function(id) {
        transactions = transactions.filter(t => t.id !== id);
        updateTotals();
        renderTransactions();
    }
}

// Initialize the app
createBudgetApp();