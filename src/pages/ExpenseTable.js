const ExpenseTable = ({ expenses = [], deleteExpens }) => {
  // 🛡️ safety check (extra protection)
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return (
      <div className="expense-list">
        <p style={{ textAlign: 'center', color: '#777' }}>
          No expenses found
        </p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div key={expense._id} className="expense-item">
          <button
            className="delete-button"
            onClick={() => deleteExpens(expense._id)}
          >
            X
          </button>

          <div className="expense-description">
            {expense.text}
          </div>

          <div
            className="expense-amount"
            style={{
              color: expense.amount > 0 ? '#27ae60' : '#c0392b',
            }}
          >
            ₹{expense.amount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseTable;
