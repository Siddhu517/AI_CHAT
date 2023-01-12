import React, { useState, useEffect } from "react";
import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
import "./style.css";
import imgSend from "./assets/send.svg";

const Chat = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const chatContainer = document.querySelector("#chat_container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const uniqueId = generateUniqueId();
    setMessages([
      ...messages,
      { isAi: false, value: formData.prompt, uniqueId },
    ]);

    //fetch data from server
    const response = await fetch("http://localhost:5000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formData.prompt,
      }),
    });

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      //console.log(data);
      const parsedData = data.bot.trim();
      setMessages([...messages, { isAi: true, value: parsedData, uniqueId }]);
    } else {
      const err = await response.text();
      setMessages([
        ...messages,
        { isAi: true, value: "Something went wrong", uniqueId },
      ]);
      alert(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };

  const chatStripe = (isAi, value, uniqueId) => (
    <div className={`wrapper ${isAi && "ai"}`}>
      <div className="chat">
        <div className="profile">
          <img src={isAi ? bot : user} alt={isAi ? "bot" : "user"} />
        </div>
        <div className="message" id={uniqueId}>
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          name="prompt"
          rows="1"
          cols="1"
          onChange={handleChange}
          placeholder="Ask Codex..."
        ></textarea>
        <button type="submit">
          <img src={imgSend} alt="imgSend" />
        </button>
      </form>
      <div id="chat_container">
        {messages.map(({ isAi, value, uniqueId }) =>
          chatStripe(isAi, value, uniqueId)
        )}
        {loading && <div>Loading...</div>}
      </div>
    </>
  );
};

export default Chat;
