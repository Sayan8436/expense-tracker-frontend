// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { APIUrl, handleError, handleSuccess } from '../utils';
// import { ToastContainer } from 'react-toastify';
// import ExpenseTable from './ExpenseTable';
// import ExpenseDetails from './ExpenseDetails';
// import ExpenseForm from './ExpenseForm';

// function Home() {
//     const [loggedInUser, setLoggedInUser] = useState('');
//     const [expenses, setExpenses] = useState([]);
//     const [incomeAmt, setIncomeAmt] = useState(0);
//     const [expenseAmt, setExpenseAmt] = useState(0);

//     const navigate = useNavigate();

//     useEffect(() => {
//         setLoggedInUser(localStorage.getItem('loggedInUser'))
//     }, [])

//     const handleLogout = (e) => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('loggedInUser');
//         handleSuccess('User Loggedout');
//         setTimeout(() => {
//             navigate('/login');
//         }, 1000)
//     }
//     useEffect(() => {
//         const amounts = expenses.map(item => item.amount);
//         const income = amounts.filter(item => item > 0)
//             .reduce((acc, item) => (acc += item), 0);
//         const exp = amounts.filter(item => item < 0)
//             .reduce((acc, item) => (acc += item), 0) * -1;
//         setIncomeAmt(income);
//         setExpenseAmt(exp);
//     }, [expenses])

//     const deleteExpens = async (id) => {
//         try {
//             const url = `${APIUrl}/expenses/${id}`;
//             const headers = {
//                 headers: {
//                     'Authorization': localStorage.getItem('token')
//                 },
//                 method: "DELETE"
//             }
//             const response = await fetch(url, headers);
//             if (response.status === 403) {
//                 localStorage.removeItem('token');
//                 navigate('/login');
//                 return
//             }
//             const result = await response.json();
//             handleSuccess(result?.message)
//             console.log('--result', result.data);
//             setExpenses(result.data);
//         } catch (err) {
//             handleError(err);
//         }
//     }

//     const fetchExpenses = async () => {
//         try {
//             const url = `${APIUrl}/expenses`;
//             const headers = {
//                 headers: {
//                     'Authorization': localStorage.getItem('token')
//                 }
//             }
//             const response = await fetch(url, headers);
//             if (response.status === 403) {
//                 localStorage.removeItem('token');
//                 navigate('/login');
//                 return
//             }
//             const result = await response.json();
//             console.log('--result', result.data);
//             setExpenses(result.data);
//         } catch (err) {
//             handleError(err);
//         }
//     }



//     const addTransaction = async (data) => {
//         try {
//             const url = `${APIUrl}/expenses`;
//             const headers = {
//                 headers: {
//                     'Authorization': localStorage.getItem('token'),
//                     'Content-Type': 'application/json'
//                 },
//                 method: "POST",
//                 body: JSON.stringify(data)
//             }
//             const response = await fetch(url, headers);
//             if (response.status === 403) {
//                 localStorage.removeItem('token');
//                 navigate('/login');
//                 return
//             }
//             const result = await response.json();
//             handleSuccess(result?.message)
//             console.log('--result', result.data);
//             setExpenses(result.data);
//         } catch (err) {
//             handleError(err);
//         }
//     }

//     useEffect(() => {
//         fetchExpenses()
//     }, [])

//     return (
//         <div>
//             <div className='user-section'>
//                 <h1>Welcome {loggedInUser}</h1>
//                 <button onClick={handleLogout}>Logout</button>
//             </div>
//             <ExpenseDetails
//                 incomeAmt={incomeAmt}
//                 expenseAmt={expenseAmt}
//             />

//             <ExpenseForm
//                 addTransaction={addTransaction} />

//             <ExpenseTable
//                 expenses={expenses}
//                 deleteExpens={deleteExpens}
//             />
//             <ToastContainer />
//         </div>
//     )
// }

// export default Home



import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APIUrl, handleError, handleSuccess } from '../utils'
import { ToastContainer } from 'react-toastify'
import ExpenseTable from './ExpenseTable'
import ExpenseDetails from './ExpenseDetails'
import ExpenseForm from './ExpenseForm'
import './Home.css'

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('')
    const [expenses, setExpenses] = useState([])
    const [incomeAmt, setIncomeAmt] = useState(0)
    const [expenseAmt, setExpenseAmt] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
        fetchExpenses()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('loggedInUser')
        handleSuccess('User Logged out')
        setTimeout(() => navigate('/login'), 1000)
    }

    useEffect(() => {
        const amounts = expenses.map(item => item.amount)
        const income = amounts.filter(i => i > 0).reduce((a, i) => a + i, 0)
        const exp = amounts.filter(i => i < 0).reduce((a, i) => a + i, 0) * -1
        setIncomeAmt(income)
        setExpenseAmt(exp)
    }, [expenses])

    const fetchExpenses = async () => {
        try {
            const res = await fetch(`${APIUrl}/expenses`, {
                headers: { Authorization: localStorage.getItem('token') }
            })
            if (res.status === 403) return navigate('/login')
            const result = await res.json()
            setExpenses(result.data)
        } catch (err) {
            handleError(err)
        }
    }

    const deleteExpens = async (id) => {
        try {
            const res = await fetch(`${APIUrl}/expenses/${id}`, {
                method: 'DELETE',
                headers: { Authorization: localStorage.getItem('token') }
            })
            const result = await res.json()
            handleSuccess(result.message)
            setExpenses(result.data)
        } catch (err) {
            handleError(err)
        }
    }

    const addTransaction = async (data) => {
        try {
            const res = await fetch(`${APIUrl}/expenses`, {
                method: 'POST',
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const result = await res.json()
            handleSuccess(result.message)
            setExpenses(result.data)
        } catch (err) {
            handleError(err)
        }
    }

    return (
        <div className="home-container">
            <header className="home-header">
                <h2>Hello, <span>{loggedInUser}</span> 👋</h2>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </header>

            <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />

            <div className="home-grid">
                <ExpenseForm addTransaction={addTransaction} />
                <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />
            </div>

            <ToastContainer />
        </div>
    )
}

export default Home
