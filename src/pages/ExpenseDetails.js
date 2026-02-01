function ExpenseDetails({ incomeAmt, expenseAmt }) {
  const balance = incomeAmt - expenseAmt;

  return (
    <div className="balance-wrapper">
      {/* Balance Card */}
      <div className="balance-card">
        <p className="balance-title">Your Balance</p>
        <h1 className="balance-amount">₹ {balance}</h1>
      </div>

      {/* Income & Expense Cards */}
      <div className="stats-card">
        <div className="stat income">
          <span>Income</span>
          <p>₹ {incomeAmt}</p>
        </div>

        <div className="divider" />

        <div className="stat expense">
          <span>Expense</span>
          <p>₹ {expenseAmt}</p>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetails;
