import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError('Email and password are required');
    }

    try {
      const res = await fetch(`${APIUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await res.json();
      console.log('LOGIN RESPONSE:', result);
      const { success, message, token, name } = result;

      if (!success) {
        return handleError(message || 'Login failed');
      }

      // ✅ store token returned by backend
      localStorage.setItem('token', result.token);
      localStorage.setItem('loggedInUser', result.name);

     console.log('SAVED TOKEN:', localStorage.getItem('token'));

      handleSuccess(result.message);
      setTimeout(() => navigate('/home'), 800);
    } catch (err) {
      handleError('Server error');
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={loginInfo.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={loginInfo.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Login</button>

        <span>
          Don&apos;t have an account? <Link to="/signup">Signup</Link>
        </span>
      </form>

      <ToastContainer />
    </div>
  );
}

export default Login;
