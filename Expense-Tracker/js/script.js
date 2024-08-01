let currentEditId = null;

document.addEventListener('DOMContentLoaded', () => {
    renderTransactionList();
    handleTransactionTypeChange(); // Initialize category visibility

    // Event listeners
    document.getElementById('transactionForm').addEventListener('submit', saveTransaction);
    document.getElementById('search').addEventListener('input', searchTransactions);
    document.getElementById('showMonthlySummary').addEventListener('click', toggleMonthlySummary);
    document.getElementById('hideMonthlySummary').addEventListener('click', toggleMonthlySummary);
    document.querySelectorAll('input[name="transactionType"]').forEach(radio => {
        radio.addEventListener('change', handleTransactionTypeChange);
    });
});

function saveTransaction(e) {
    e.preventDefault();

    const transactionName = document.getElementById('transactionName').value.trim();
    const transactionAmount = parseFloat(document.getElementById('transactionAmount').value);
    const transactionDate = document.getElementById('transactionDate').value;
    const transactionCategory = document.getElementById('transactionCategory') ? document.getElementById('transactionCategory').value.trim() : '';
    const transactionType = document.querySelector('input[name="transactionType"]:checked').value;

    if (!transactionName || isNaN(transactionAmount) || !transactionDate) {
        alert('Please fill in all fields correctly.');
        return;
    }

    if (transactionType === 'expense' && !transactionCategory) {
        alert('Please select a category for expenses.');
        return;
    }

    if (currentEditId === null) {
        addTransaction(transactionName, transactionAmount, transactionDate, transactionCategory, transactionType);
    } else {
        updateTransaction(currentEditId, transactionName, transactionAmount, transactionDate, transactionCategory, transactionType);
    }

    document.getElementById('transactionForm').reset();
    document.querySelector('input[name="transactionType"][value="expense"]').checked = true; // Reset to default type
    handleTransactionTypeChange(); // Update category visibility
    currentEditId = null;
}

function addTransaction(name, amount, date, category, type) {
    const transactionList = getTransactions();
    const transactionId = new Date().getTime();
    transactionList.push({ id: transactionId, name, amount, date, category, type });
    localStorage.setItem('transactions', JSON.stringify(transactionList));
    renderTransactionList();
}

function updateTransaction(id, name, amount, date, category, type) {
    const transactionList = getTransactions();
    const transactionIndex = transactionList.findIndex(transaction => transaction.id === id);
    transactionList[transactionIndex] = { id, name, amount, date, category, type };
    localStorage.setItem('transactions', JSON.stringify(transactionList));
    renderTransactionList();
}

function deleteTransaction(id) {
    const transactionList = getTransactions();
    const newTransactionList = transactionList.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(newTransactionList));
    renderTransactionList();
}

function editTransaction(id) {
    const transactionList = getTransactions();
    const transaction = transactionList.find(transaction => transaction.id === id);

    document.getElementById('transactionName').value = transaction.name;
    document.getElementById('transactionAmount').value = transaction.amount;
    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('transactionCategory').value = transaction.category;
    document.querySelector(`input[name="transactionType"][value="${transaction.type}"]`).checked = true;

    handleTransactionTypeChange(); // Update category visibility
    currentEditId = id;
}

function searchTransactions() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const transactionList = getTransactions();
    const filteredTransactions = transactionList.filter(transaction =>
        transaction.name.toLowerCase().includes(searchTerm) ||
        (transaction.type === 'expense' && transaction.category.toLowerCase().includes(searchTerm))
    );
    renderTransactionList(filteredTransactions);
}

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
}

function renderTransactionList(filteredTransactions = null) {
    const transactionList = filteredTransactions || getTransactions();
    const transactionListUl = document.getElementById('transactionList');
    const monthlySummaryUl = document.getElementById('monthlySummary');
    const showMonthlySummaryButton = document.getElementById('showMonthlySummary');
    const monthlySummaryContainer = document.getElementById('monthlySummaryContainer');

    transactionListUl.innerHTML = '';
    monthlySummaryUl.innerHTML = '';

    let totalIncome = 0;
    let totalExpense = 0;
    let monthlySummary = {};
    let currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

    if (transactionList.length === 0) {
        const noTransactionsLi = document.createElement('li');
        noTransactionsLi.innerText = 'No transactions added yet';
        noTransactionsLi.style.textAlign = 'center';
        transactionListUl.appendChild(noTransactionsLi);

        const noDataLi = document.createElement('li');
        noDataLi.innerText = 'No transaction data available';
        noDataLi.style.textAlign = 'center';
        monthlySummaryUl.appendChild(noDataLi);

        showMonthlySummaryButton.disabled = true;
        monthlySummaryContainer.style.display = 'none';
        document.getElementById('totalIncome').innerText = '0.00';
        document.getElementById('totalExpense').innerText = '0.00';
        return;
    }

    transactionList.forEach(transaction => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>Name: ${transaction.name} | NPR ${transaction.amount} | Date: ${transaction.date} ${transaction.type === 'expense' ? '| Category: ' + transaction.category : ''} | Type: ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
            <div>
                <button onclick="editTransaction(${transaction.id})">Edit</button>
                <button onclick="deleteTransaction(${transaction.id})">Delete</button>
            </div>
        `;
        transactionListUl.appendChild(li);

        // Update total income and expense
        if (transaction.type === 'income') {
            totalIncome += parseFloat(transaction.amount);
        } else if (transaction.type === 'expense') {
            totalExpense += parseFloat(transaction.amount);
        }

        // Update monthly summary
        const month = transaction.date.slice(0, 7);
        if (!monthlySummary[month]) {
            monthlySummary[month] = { income: 0, expense: 0 };
        }
        if (transaction.type === 'income') {
            monthlySummary[month].income += parseFloat(transaction.amount);
        } else if (transaction.type === 'expense') {
            monthlySummary[month].expense += parseFloat(transaction.amount);
        }
    });

    document.getElementById('totalIncome').innerText = totalIncome.toFixed(2);
    document.getElementById('totalExpense').innerText = totalExpense.toFixed(2);

    let hasTransactionForCurrentMonth = false;
    for (const [month, amounts] of Object.entries(monthlySummary)) {
        if (month === currentMonth && (amounts.income !== 0 || amounts.expense !== 0)) {
            hasTransactionForCurrentMonth = true;
        }

        const li = document.createElement('li');
        li.innerText = `${month} | Total Income: NPR ${amounts.income.toFixed(2)} | Total Expense: NPR ${amounts.expense.toFixed(2)}`;
        monthlySummaryUl.appendChild(li);
    }

    if (!hasTransactionForCurrentMonth) {
        const noTransactionLi = document.createElement('li');
        noTransactionLi.innerText = 'No transaction this month';
        noTransactionLi.style.textAlign = 'center';
        monthlySummaryUl.appendChild(noTransactionLi);
    }

    showMonthlySummaryButton.disabled = false;
}

function toggleMonthlySummary() {
    const monthlySummaryContainer = document.getElementById('monthlySummaryContainer');
    const showButton = document.getElementById('showMonthlySummary');

    if (monthlySummaryContainer.style.display === 'none' || monthlySummaryContainer.style.display === '') {
        monthlySummaryContainer.style.display = 'block';
        showButton.disabled = true; // Disable the show button
    } else {
        monthlySummaryContainer.style.display = 'none';
        showButton.disabled = false; // Enable the show button
    }
}

function handleTransactionTypeChange() {
    const categoryContainer = document.getElementById('categoryContainer');
    const transactionType = document.querySelector('input[name="transactionType"]:checked').value;

    if (transactionType === 'income') {
        categoryContainer.style.display = 'none';
        document.getElementById('transactionCategory').removeAttribute('required');
    } else {
        categoryContainer.style.display = 'block';
        document.getElementById('transactionCategory').setAttribute('required', 'required');
    }
}
