document.getElementById('expenseForm').addEventListener('submit', saveExpense);
document.getElementById('search').addEventListener('input', searchExpenses);
document.getElementById('showMonthlySummary').addEventListener('click', toggleMonthlySummary);
document.getElementById('hideMonthlySummary').addEventListener('click', toggleMonthlySummary);

let currentEditId = null;

function saveExpense(e) {
    e.preventDefault();

    const expenseName = document.getElementById('expenseName').value;
    const expenseAmount = document.getElementById('expenseAmount').value;
    const expenseDate = document.getElementById('expenseDate').value;
    const expenseCategory = document.getElementById('expenseCategory').value;

    if (currentEditId === null) {
        addExpense(expenseName, expenseAmount, expenseDate, expenseCategory);
    } else {
        updateExpense(currentEditId, expenseName, expenseAmount, expenseDate, expenseCategory);
    }

    document.getElementById('expenseForm').reset();
    currentEditId = null;
}

function addExpense(name, amount, date, category) {
    const expenseList = getExpenses();
    const expenseId = new Date().getTime();
    expenseList.push({ id: expenseId, name, amount, date, category });
    localStorage.setItem('expenses', JSON.stringify(expenseList));
    renderExpenseList();
}

function updateExpense(id, name, amount, date, category) {
    const expenseList = getExpenses();
    const expenseIndex = expenseList.findIndex(expense => expense.id === id);
    expenseList[expenseIndex] = { id, name, amount, date, category };
    localStorage.setItem('expenses', JSON.stringify(expenseList));
    renderExpenseList();
}

function deleteExpense(id) {
    const expenseList = getExpenses();
    const newExpenseList = expenseList.filter(expense => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(newExpenseList));
    renderExpenseList();
}

function editExpense(id) {
    const expenseList = getExpenses();
    const expense = expenseList.find(expense => expense.id === id);

    document.getElementById('expenseName').value = expense.name;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseDate').value = expense.date;
    document.getElementById('expenseCategory').value = expense.category;

    currentEditId = id;
}

function searchExpenses() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const expenseList = getExpenses();
    const filteredExpenses = expenseList.filter(expense =>
        expense.name.toLowerCase().includes(searchTerm) ||
        expense.category.toLowerCase().includes(searchTerm)
    );
    renderExpenseList(filteredExpenses);
}

function getExpenses() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}

function renderExpenseList(filteredExpenses = null) {
    const expenseList = filteredExpenses || getExpenses();
    const expenseListUl = document.getElementById('expenseList');
    const monthlySummaryUl = document.getElementById('monthlySummary');
    const showMonthlySummaryButton = document.getElementById('showMonthlySummary');
    const monthlySummaryContainer = document.getElementById('monthlySummaryContainer');

    expenseListUl.innerHTML = '';
    monthlySummaryUl.innerHTML = '';

    let totalAmount = 0;
    let monthlySummary = {};
    let currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

    if (expenseList.length === 0) {
        const noExpensesLi = document.createElement('li');
        noExpensesLi.innerText = `No expenses added yet`;
        noExpensesLi.style.textAlign = 'center';
        expenseListUl.appendChild(noExpensesLi);

        const noDataLi = document.createElement('li');
        noDataLi.innerText = `No expense data available`;
        noDataLi.style.textAlign = 'center';
        monthlySummaryUl.appendChild(noDataLi);

        showMonthlySummaryButton.disabled = true;
        monthlySummaryContainer.style.display = 'none';
        document.getElementById('totalAmount').innerText = '0.00';
        return;
    }

    expenseList.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>Name: ${expense.name} | NPR ${expense.amount} | Date: ${expense.date} | Category: ${expense.category}</span>
            <div>
                <button onclick="editExpense(${expense.id})">Edit</button>
                <button onclick="deleteExpense(${expense.id})">Delete</button>
            </div>
        `;
        expenseListUl.appendChild(li);
        totalAmount += parseFloat(expense.amount);

        const month = expense.date.slice(0, 7);
        if (!monthlySummary[month]) {
            monthlySummary[month] = 0;
        }
        monthlySummary[month] += parseFloat(expense.amount);
    });

    document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);

    let hasExpenseForCurrentMonth = false;
    for (const [month, amount] of Object.entries(monthlySummary)) {
        if (month === currentMonth && amount > 0) {
            hasExpenseForCurrentMonth = true;
        }

        const li = document.createElement('li');
        li.innerText = `${month} | NPR ${amount.toFixed(2)}`;
        monthlySummaryUl.appendChild(li);
    }

    if (!hasExpenseForCurrentMonth) {
        const noExpenseLi = document.createElement('li');
        noExpenseLi.innerText = `No expense this month`;
        noExpenseLi.style.textAlign = 'center';
        monthlySummaryUl.appendChild(noExpenseLi);
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

// Render the expense list when the page loads
document.addEventListener('DOMContentLoaded', renderExpenseList);
