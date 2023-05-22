import React, { useState, useEffect } from 'react';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
import "./GuidePage.css";
import axios from 'axios';
import moment from "moment";

const GuidePage = () => {
  const location = useLocation();
  const [commentsVisible, setCommentsVisible] = useState(false);
  const postId = location.pathname.split("/")[2];
  const [guideData, setGuideData] = useState(null);
  const [comment, setComment] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.put(`http://localhost:5000/api/get_guide/${postId}`);
      setGuideData(response.data);
    };
    fetchData();
  }, [postId]);

  const seeComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  const increaseRating = async (tagName) => {
    const data = { guideId: postId, tagName, username: localStorage.getItem("username") };
    const response = await axios.post('http://localhost:5000/api/increase_rating', data);
    //setGuideData(response.data);
  };

  const decreaseRating = async (tagName) => {
    const data = { guideId: postId, tagName, username: localStorage.getItem("username") };
    const response = await axios.post('http://localhost:5000/api/decrease_rating', data);
    //setGuideData(response.data);
  };

  console.log(guideData);

  if (!guideData) {
    return <div>Loading...</div>;
  }
  const sendComment = async () => {
    const data = {
      guideId: postId,
      commentText: comment,
      author: localStorage.getItem('username'),
      date: moment(Date.now()).format("YYYY-MM-DD HH:MM"),
    };
    await axios.post('http://localhost:5000/api/send_comment', data);
    setComment('');
    redirect(`/guide/${postId}`);
  };

  return (
    !guideData.message ?
      <div className='guide-wrapper'>
        <h1 className='guide-title'>{guideData.title}</h1>
        <ul>
          {guideData.tags.map(tag => (
            <ul className="tag-style" key={tag.name} style={{ color: 'black', backgroundColor: tag.rating >= 0 ? 'green' : 'red', width: 100, borderRadius: 10, padding: 10 }}>
              <span>{tag.name} </span>
              <span>{tag.rating}</span>
              <button onClick={() => increaseRating(tag.name)}>+</button>
              <button onClick={() => decreaseRating(tag.name)}>-</button>
            </ul>
          ))}
        </ul>
        {guideData.text}
        <p className='release-date'>Время выхода гайда: {new Date(guideData.releaseDate).toLocaleString()}</p>
        <button onClick={seeComments} className='buttons'><h1>Комментарии</h1></button>
        {commentsVisible && (
          <div className='comments-wrapper'>
            <h1>Всего комментариев к посту: {guideData.comments.length}</h1>
            {guideData.comments.map(comment => (
              <div key={comment.text} className="comment">
                <p className="comment-author">{comment.author}</p>
                <p сlassName="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
        {localStorage.getItem("username") && (
  <div>
  <textarea
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendComment();
      }
      }}
      placeholder="Введите комментарий"
      style={{
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        width: '300px',
        resize: 'vertical'
      }}
    />
    <button
      onClick={sendComment}
      style={{
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
      }}
      >
        Отправить
      </button>
    </div>
    )}
    </div>
    : <div><h1>NULL, Server Error</h1></div>
  );
};

export default GuidePage;
