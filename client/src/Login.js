import React, { useState, useContext } from 'react';
import axios from 'axios';
import { store } from './App';
import { Navigate } from 'react-router-dom'; // Use Navigate instead of Redirect

const Login = () => {
  const [token, setToken] = useContext(store);
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/Login', data).then(
      res => setToken(res.data.token)
    );
    console.log(data);
  };

  if (token) {
    return <Navigate to='/myprofile' />; // Use Navigate instead of Redirect
  }

  return (
    <div>
      <center>
        <form onSubmit={handleSubmit} autocomplete="off">
          <h3>Login</h3>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
          /><br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
          /><br />
          <button type="submit">Login</button>
        </form>
      </center>
    </div>
  );
};

export default Login;
