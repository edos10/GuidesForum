import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from 'react-hook-form';

const Register = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [show, setShow] = useState(false)
    const [serverResponse, setServerResponse] = useState('')
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [err, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const username = inputs.username;
    async function register_to(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", inputs);
            if (response.status === 200) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("username", username);
                console.log(response.token);
                localStorage.setItem("token", response.token);
                localStorage.setItem("username", username);
                reset()
                navigate("/");
            } else if (response.status === 201) {
                alert("Пользователь уже существует!")
            } else {
            }
        } catch (error) {
            console.log("Error: ", error);
            alert("Wrong credentials");
        }
    }

    return (
        <div className="auth" onSubmit={register_to}>
            <h1>Register</h1>
            <form>
                <input
                    required
                    type="text"
                    placeholder="Никнейм"
                    name="username"
                    onChange={handleChange}
                />
                <input
                    required
                    type="email"
                    placeholder="email"
                    name="email"
                    onChange={handleChange}
                />
                <input
                    required
                    type="password"
                    placeholder="Пароль"
                    name="password"
                    onChange={handleChange}
                />
                <button>Зарегистрироваться</button>
                {err && <p>{err}</p>}
                <span>
                    Уже есть аккаунт? <Link to="/login">Войти в аккаунт</Link>
                </span>
            </form>
        </div>
    );
};

export default Register;