import { GoogleGenerativeAI } from "@google/generative-ai";
import { useCallback, useState } from "react";
import "./App.css";

enum EnumGeminiModel {
  PRO = "gemini-pro",
  PRO_VISION = "gemini-pro-vision",
}
const genAI = new GoogleGenerativeAI("AIzaSyDdOL_BYcJDX35p8CqAj3-WQhxykNC1Ac4");
const model = genAI.getGenerativeModel({ model: EnumGeminiModel.PRO });

const App = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<string[]>([]);

  const chat = model.startChat({
    generationConfig: {
      maxOutputTokens: 4096,
    },
  });

  const generateContent = useCallback(
    async (message: string) => {
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();
      setResponses((prev) => [...prev, text]);
    },
    [chat]
  );

  const onClickSend = async () => {
    if (!message) {
      return;
    }
    setResponses((prev) => [...prev, message]);
    generateContent(message);
    setMessage("");
  };

  return (
    <div className="chat-container">
      {responses.length > 0 && (
        <>
          {responses.map((response, index) => (
            <ul key={index} className="chat-messages">
              <li
                className={`message ${
                  index % 2 !== 0 ? "other-message" : "user-message"
                }`}
              >
                <pre>{response}</pre>
              </li>
            </ul>
          ))}
        </>
      )}

      <div className="input-container">
        <input
          type="text"
          className="input-box"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-button" onClick={onClickSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
