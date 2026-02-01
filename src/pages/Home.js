import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';

import './Home.css';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [incomeAmt, setIncomeAmt] = useState(0);
  const [expenseAmt, setExpenseAmt] = useState(0);

  const navigate = useNavigate();

  // 🔐 helper to get auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // 📥 Fetch expenses
  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch(`${APIUrl}/expenses`, {
        headers: getAuthHeader(),
      });

      if (res.status === 403) {
        handleError('Session expired. Please login again.');
        return navigate('/login');
      }

      const result = await res.json();
      setExpenses(result.data || []);
    } catch (err) {
      handleError(err.message || 'Failed to fetch expenses');
    }
  }, [navigate]);

  // 👤 Load user + expenses on mount
  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      navigate('/login');
    } else {
      setLoggedInUser(user);
      fetchExpenses();
    }
  }, [fetchExpenses, navigate]);

  // 💰 Calculate income & expense
  useEffect(() => {
    const amounts = expenses.map((item) => item.amount);
    const income = amounts.filter((a) => a > 0).reduce((a, b) => a + b, 0);
    const expense =
      amounts.filter((a) => a < 0).reduce((a, b) => a + b, 0) * -1;

    setIncomeAmt(income);
    setExpenseAmt(expense);
  }, [expenses]);

  // ➕ Add expense
  const addTransaction = async (data) => {
    try {
      const res = await fetch(`${APIUrl}/expenses`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return handleError(result.message || 'Failed to add expense');
      }

      handleSuccess(result.message);
      setExpenses(result.data);
    } catch (err) {
      handleError(err.message || 'Something went wrong');
    }
  };

  // ❌ Delete expense
  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`${APIUrl}/expenses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      const result = await res.json();

      if (!res.ok) {
        return handleError(result.message || 'Failed to delete expense');
      }

      handleSuccess(result.message);
      setExpenses(result.data);
    } catch (err) {
      handleError(err.message || 'Something went wrong');
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('Logged out successfully');
    setTimeout(() => navigate('/login'), 800);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h2>
          Hello, <span>{loggedInUser}</span> 👋
        </h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />

      <div className="home-grid">
        <ExpenseForm addTransaction={addTransaction} />
        <ExpenseTable
          expenses={expenses}
          deleteExpens={deleteExpense}
        />
      </div>

      <ToastContainer />
    </div>
  );
}

export default Home;
