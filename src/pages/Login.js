// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import { APIUrl, handleError, handleSuccess } from '../utils';

// function Login() {
//   const [loginInfo, setLoginInfo] = useState({
//     email: '',
//     password: '',
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginInfo((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const { email, password } = loginInfo;
//     if (!email || !password) {
//       return handleError('Email and password are required');
//     }

//     try {
//       const res = await fetch(`${APIUrl}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(loginInfo),
//       });

//       const result = await res.json();

//       // ✅ IMPORTANT: use `token`, not `jwtToken`
//       const { success, message, token, name } = result;

//       if (!success) {
//         return handleError(message || 'Login failed');
//       }

//       // ✅ store ONLY the token string
//       localStorage.setItem('token', token);
//       localStorage.setItem('loggedInUser', name);

//       handleSuccess(message);

//       setTimeout(() => {
//         navigate('/home');
//       }, 800);
//     } catch (err) {
//       handleError(err.message || 'Something went wrong');
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Login</h1>

//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             value={loginInfo.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//           />
//         </div>

//         <div>
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             value={loginInfo.password}
//             onChange={handleChange}
//             placeholder="Enter your password"
//           />
//         </div>

//         <button type="submit">Login</button>

//         <span>
//           Don&apos;t have an account? <Link to="/signup">Signup</Link>
//         </span>
//       </form>

//       <ToastContainer />
//     </div>
//   );
// }

// export default Login;


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,               // ✅ IMPORTANT: key name = token
      name: user.name,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { login };
