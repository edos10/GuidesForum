import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "./GuideCreate.scss";

const EditGuide = () => {
    const state = useLocation().state;
    const [guideData, setGuideData] = useState(null);
    const [value, setValue] = useState(state?.title ||  "");
    const [title, setTitle] = useState(state?.desc ||  "");
    const [file, setFile] = useState(null);
    const [tags, setTags] = useState([]);
    const location = useLocation();
    const PostId = location.pathname.split("/")[2];
    useEffect(() => {
        const fetchData = async () => {
          const response = await axios.get(`http://localhost:5000/api/get_guide/${PostId}`);
          console.log(response);
          setGuideData(response.data);
          setValue(response.data.text);
          setTitle(response.data.title);
          setTags(response.data.tags);
          console.log();
        };
        fetchData();
      }, [PostId]);

    const navigate = useNavigate();
    if (!localStorage.getItem('token')) {
    }
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/edit_guide/${PostId}`, {
                title,
                desc: value,
                tags,
                date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                author: localStorage.getItem('username'),
            });
            console.log(response)
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };
    const handleAddTag = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const handleRemoveTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
    };

    return (
        localStorage.getItem('token') ?
        <div className="add">
            <div className="content">
                <input
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <div className="editorContainer" style={{ wordWrap: 'break-word' }}>
                    <ReactQuill
                        className="editor"
                        theme="snow"
                        value={value}
                        onChange={setValue}
                    />
                </div>
            </div>
            <div className="menu">
                <div className="item">
                    <h1>Готово!</h1>
                    <div className="buttons">
                        <button onClick={handleClick}>Опубликовать</button>
                    </div>
                </div>
                <div className="item">
                    <h1>Tags</h1>
                    <div className="tags">
                        {tags.map((tag) => (
                            <div key={tag} className="tag">
                                {tag}
                                <button onClick={() => handleRemoveTag(tag)}>x</button>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Add tag"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleAddTag(e.target.value);
                                e.target.value = "";
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    : <h1>Вам надо авторизоваться, чтобы что-то написать!</h1>);
};

export default EditGuide;