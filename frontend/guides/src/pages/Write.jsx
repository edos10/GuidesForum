import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "./GuideCreate.scss";

const GuideForm = () => {
    const state = useLocation().state;
    const [value, setValue] = useState(state?.title ||  "");
    const [title, setTitle] = useState(state?.desc ||  "");
    const [tags, setTags] = useState([]);

    const navigate = useNavigate();
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/new_post", {
                title,
                desc: value,
                tags,
                date: moment(Date.now()).format("YYYY-MM-DD"),
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
        localStorage.getItem("token") ?
        <div className="add">
            <div className="content">
                <input
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
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
                <div className="item">
                    <h1>Готово!</h1>
                    <div className="buttons">
                        <button onClick={handleClick}>Опубликовать</button>
                    </div>
                </div>
            </div>
        </div>
    : <h1>Вам надо авторизоваться, чтобы что-то написать!</h1>
    );
};

export default GuideForm;