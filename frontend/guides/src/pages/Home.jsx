import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./Home.css"


const Home = () => {
    const [guides, setGuides] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/get_top10");
                setGuides(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);
    const getText = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }
    const HelloStr = `WikiGuides - это своеобразный StackOverflow, только на всевозможные темы!
    Здесь вы можете не только задать свой вопрос на любую тему и получить ответ на него в комментариях,
    но и сделать гайд на определенную тему, что может помочь множеству людей решить их проблему!`
    return (
        <div className="home">
            <h1 className="main-text">{HelloStr}</h1>
            <div>
                <h1>Топ 10 гайдов по просмотрам</h1>
                <div className="guide-list">
                    {guides.map((guide, index) => (
                        <div className="guide-card" key={index}>
                            <div className="guide-header">
                                <h2>{guide.title}</h2>
                                <p>{guide.author} - {guide.releaseDate} - {guide.views}</p>
                            </div>
                            <div className="guide-body">
                                <p>{guide.text.substring(0, 20)}...</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;