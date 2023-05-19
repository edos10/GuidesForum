import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import { useNavigate } from 'react-router-dom';

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://127.0.0.1:5000/api/register', { username, password })
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                navigate("/");
                console.error(error);
            });
    };

    return (
        <div className="container">
            <form className="registration-form" onSubmit={handleSubmit}>
                <h1 className="title">Registration</h1>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit" className="submit-button">Register</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default RegistrationPage;
