import { useContext, useState } from "react";
import {Navigate, Link, useNavigate} from "react-router-dom";
import axios from "axios";

import "./Login.scss"

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    
    async function login(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { username, password });
            console.log("HHHHHHHUi");
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("username", username);
                setRedirect(true);
            } else if (response.status === 401) {
                alert(response.data.message)
            } else {
                alert("Ошибка ответа сервера, попробуйте позже.")
            }
        } catch (error) {
            console.log("Error: ", error);
            alert("Wrong credentials");
        }
    }
    const nav = useNavigate();
    if (redirect) {
        window.location.reload();
        nav("/");
        return <Navigate to={"/"} />;
    }

    return (
        <div className="auth" onSubmit={login}>
            <h1>Вход</h1>
            <form>
                <input
                    required
                    type="text"
                    placeholder="Никнейм"
                    name="username"
                    onChange={(ev) => setUsername(ev.target.value)}
                />
                <input
                    required
                    type="password"
                    placeholder="Пароль"
                    name="password"
                    onChange={(ev) => setPassword(ev.target.value)}
                />
                <button>Войти</button>
                <span>
                    У вас еще нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </span>
            </form>
        </div>
    );
}