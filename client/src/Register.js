import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        confirmpassword: ''
    });

    // Function to handle input changes
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/register', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(res => alert(res.data))
        .catch(err => {
          if (err.response) {
            // Server responded with a status code
            console.error('Error response:', err.response.data);
            alert(`Error: ${err.response.data}`);
          } else if (err.request) {
            // Request was made but no response was received
            console.error('Error request:', err.request);
            alert('No response from server');
          } else {
            // Something happened in setting up the request
            console.error('Error', err.message);
            alert('Error setting up request');
          }
        });
      };
      

    return (
        <div>
            <center>
                <form onSubmit={handleSubmit}>
                    <h3>Register</h3>
                    <input
                        type="text"
                        name="username"
                        placeholder="User Name"
                        value={data.username}
                        onChange={handleChange}
                    /><br />
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
                    <input
                        type="password"
                        name="confirmpassword"
                        placeholder="Confirm Password"
                        value={data.confirmpassword}
                        onChange={handleChange}
                    /><br />
                    <button type="submit">Register</button>
                </form>
            </center>
        </div>
    );
};

export default Register;
