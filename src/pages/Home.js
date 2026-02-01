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

  // 🔐 Auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // 📥 Fetch expenses (single source of truth)
  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch(`${APIUrl}/expenses`, {
        headers: getAuthHeader(),
      });

      if (res.status === 403) {
        handleError('Session expired. Please login again.');
        localStorage.clear();
        return navigate('/login');
      }

      const result = await res.json();
      setExpenses(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      handleError('Failed to fetch expenses');
      setExpenses([]);
    }
  }, [navigate]);

  // 👤 On mount
  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    const token = localStorage.getItem('token');

    if (!user || !token) {
      navigate('/login');
    } else {
      setLoggedInUser(user);
      fetchExpenses();
    }
  }, [fetchExpenses, navigate]);

  // 💰 Calculate totals
  useEffect(() => {
    const amounts = expenses.map((e) => Number(e.amount) || 0);

    const income = amounts
      .filter((a) => a > 0)
      .reduce((a, b) => a + b, 0);

    const expense =
      amounts
        .filter((a) => a < 0)
        .reduce((a, b) => a + b, 0) * -1;

    setIncomeAmt(income);
    setExpenseAmt(expense);
  }, [expenses]);

  // ➕ Add expense (IMPORTANT FIX HERE)
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

      // ✅ REFRESH LIST AFTER ADD
      fetchExpenses();
    } catch (err) {
      handleError('Something went wrong');
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

      // ✅ REFRESH LIST AFTER DELETE
      fetchExpenses();
    } catch (err) {
      handleError('Something went wrong');
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
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
