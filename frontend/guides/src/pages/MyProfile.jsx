import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyProfile.css";
import BASE_URL from "../App.js"


const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user");
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchGuides = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/guides");
        setGuides(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
    fetchGuides();
  }, []);

  return (
    <div className="my-profile">
      {user && (
        <div className="user-info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
        </div>
      )}

      <div className="guides-list">
        <h2>Мои гайды</h2>
        <ul>
          {guides.map((guide) => (
            <li key={guide.id}>
              <a href={`/guide/${guide.id}`} className="guide-link">
                {guide.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyProfile;
