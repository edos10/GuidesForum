import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyProfile.css";
import BASE_URL from "../App.js"
import { useNavigate } from "react-router-dom";


const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [guides, setGuides] = useState([]);
  const userName = localStorage.getItem("username");
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/get_user_guides", {userName});
        setGuides(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchGuides();
  }, []);
  const navigate = useNavigate();
  const handleEditGuide = (guideId) => {
    navigate(`/edit_guide/${guideId}`);
  };

  const handleDeleteGuide = async (guideId) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete_guide/${guideId}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };


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
              <div className="guide-actions">
                <button onClick={() => handleEditGuide(guide.id)}>Edit</button>
                <button onClick={() => handleDeleteGuide(guide.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyProfile;
