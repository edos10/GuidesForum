import React, { useState, useEffect } from 'react';

function HomePage() {
    const [guides, setGuides] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/guides')
            .then((response) => response.json())
            .then((data) => setGuides(data));
    }, []);

    return (
        <div>
            <h1>Guides</h1>
            <ul>
                {guides.map((guide) => (
                    <li key={guide.id}>
                        <h2>{guide.title}</h2>
                        <p>{guide.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HomePage;
