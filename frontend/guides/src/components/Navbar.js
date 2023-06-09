import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import BASE_URL from "../App";
import axios from "axios";

const Navbar = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [isAuth, setIsAuth] = useState(false);

    function logout() {
        localStorage.removeItem("token", null);
        localStorage.removeItem("username", null);
        console.log("exit");
        window.location.reload();
    }

    useEffect(() => {
        async function checkAuthentication() {
            try {
                const response = await axios.post(`http://localhost:5000/api/check_auth`, {
                    token: localStorage.getItem("token")
                });

                if (response.data.isAuth) {
                    setIsAuth(true);
                } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    console.log(response);
                }
            } catch (error) {
                console.log(error);
            }
        }
        checkAuthentication();
    }, []);
    const userInfo = localStorage.getItem("username");
    const currentUser = userInfo;

    console.log("current name is", currentUser);
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                WikiGuides
            </Link>
            <Link to="/search" className="navbar-link">
                Поиск по тегам
            </Link>
            <div className="navbar-links">
                <div className="navbar-link-container">
                    <Link to="/" className="navbar-link">
                        Главная
                    </Link>
                </div>
                <div className="navbar-link-container">
                    <Link to="/guide/1" className="navbar-link">
                        Случайный гайд
                    </Link>
                </div>
                {isAuth ? (
                    <>
                        <div className="navbar-link-container">
                            <Link to="/my_profile" className="navbar-link">
                                Мой профиль
                            </Link>
                        </div>
                        <div className="navbar-link-container">
                            <Link to="/create_guide" className="navbar-link">
                                Создать новый гайд
                            </Link>
                        </div>
                        <div className="navbar-button-container">
                            <button className="navbar-button" onClick={logout}>
                                Выйти из аккаунта
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="navbar-link-container">
                            <Link to="/login" className="navbar-link">
                                Авторизация
                            </Link>
                        </div>
                        <div className="navbar-link-container">
                            <Link to="/register" className="navbar-link">
                                Регистрация
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
