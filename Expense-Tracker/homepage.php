<?php
session_start();

include ("connection.php");
include ("functions.php");

$user_data = check_login($con);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Tracker</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="shortcut icon" href="images/Logo.jpeg" type="image/x-icon">
</head>
<body>
    <br>
    <div class="container">
        <div id="welcome">Hello, <?php echo $user_data['user_name']; ?></div>
        <a id="logout" href="logout.php">Logout</a>
        <h1>Expense Tracker</h1>
        <div class="content">
            <div class="transaction-form">
                <h2>Add/Edit Transaction</h2>
                <form id="transactionForm">
                    <label>
                        <input type="radio" name="transactionType" value="expense" checked> Expense
                    </label>
                    <label>
                        <input type="radio" name="transactionType" value="income"> Income
                    </label>
                    <input type="text" id="transactionName" placeholder="Transaction Name" required>
                    <input type="number" id="transactionAmount" placeholder="Amount" min="0" step="0.01" required>
                    <input type="date" id="transactionDate" required>
                    <div id="categoryContainer">
                        <select id="transactionCategory" required>
                            <option value="" disabled selected>Select Category</option>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <button type="submit">Save Transaction</button>
                </form>
            </div>
            <div class="transaction-list">
                <h2>Transaction List</h2>
                <input type="text" id="search" placeholder="Search...">
                <ul id="transactionList"></ul>
            </div>
        </div>
        <div class="total-transaction">
            <div class="total-section">
                <h2>Total Income: NPR <span id="totalIncome">0</span></h2>
                <h2>Total Expense: NPR <span id="totalExpense">0</span></h2>
            </div>
            <button id="showMonthlySummary">Show Monthly Summary</button>
            <div id="monthlySummaryContainer" class="monthly-summary">
                <h2>Monthly Summary</h2>
                <ul id="monthlySummary"></ul>
                <button id="hideMonthlySummary">Hide</button>
            </div>
        </div>
    </div>
    <script src="js/script.js"></script>
</body>
</html>

