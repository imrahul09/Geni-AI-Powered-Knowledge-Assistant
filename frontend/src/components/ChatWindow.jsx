import { useContext, useState, useEffect } from "react";
import { MyContext } from "../context/MyContext";
import { Bars } from "react-loader-spinner";
import Chat from "./Chat";
import { useAuth } from "../context/AuthContext.jsx";

function ChatWindow({ onOpenSidebar }) {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);
  const { token, logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        options,
      );
      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //append new chat to prevchats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistence",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setPrompt(transcript);
    };

    recognition.onerror = (event) => {
      console.log("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        alert(
          "Microphone permission was denied. Please allow microphone access for localhost.",
        );
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };
  return (
    <div className="bg-[#212121] h-screen flex-1 min-w-0 flex flex-col justify-between items-center text-center text-[#ececec] py-4">
      <div className="w-full flex justify-between items-center px-4 md:px-0">
        <div className="flex items-center gap-2 ">
          <button
            onClick={onOpenSidebar}
            className="md:hidden text-[#ececec] text-xl p-2"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <span className="hidden md:flex justify-center items-center gap-1 text-[#ececec] ">
            Geni <i className="fa-solid fa-chevron-down flex"></i>{" "}
          </span>
        </div>

        <div className="mx-6 mr-15" onClick={handleProfileClick}>
          <span className="bg-[#339cff] h-6 w-6 border rounded-[50%] flex items-center justify-center cursor-pointer  text-[#ececec]">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-12 right-10 w-38 bg-[#323232] px-2 py-1 text-left rounded-md z-1000 text-[#ececec]">
          <div className="text-[14px] my-[0.3rem] px-[0.2rem] py-2 hover:bg-[rgba(180,180,180,0.1)] rounded-md">
            <i className="fa-solid fa-cloud-arrow-up "></i>Upgrade Plan
          </div>
          <div className="text-[14px] my-[0.3rem] px-[0.2rem] py-2  hover:bg-[rgba(180,180,180,0.1)] rounded-md">
            <i className="fa-solid fa-gear"></i>Setting
          </div>
          <div
            onClick={logout}
            className="text-[14px] my-[0.3rem] px-[0.2rem] py-2  hover:bg-[rgba(180,180,180,0.1)] rounded-md"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>Log out
          </div>
        </div>
      )}

      <Chat />
      <Bars color="white" visible={loading} height="20" width="20" />
      <div className="w-full flex flex-col justify-center items-center ">
        <div className="w-full relative max-w-175 px-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Ask anything"
            className="w-full focus:outline-0 bg-[rgba(255,255,255,0.05)] p-4 md:p-5 text-base rounded-[14px]  text-[#ececec]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          />
          <div
            className={`cursor-pointer h-7 w-7 text-[17px] absolute right-12 flex justify-center items-center ${
              isListening ? "text-red-500" : ""
            }`}
            onClick={startListening}
          >
            <i className="fa-solid fa-microphone  text-[#ececec]"></i>
          </div>
          <div
            className="cursor-pointer h-7 w-7 text-[17px] absolute right-4  flex justify-center items-center"
            onClick={getReply}
          >
            <i className="fa-solid fa-paper-plane  text-[#ececec]"></i>
          </div>
        </div>
        <p className="text-[14px] p-2 text-[#b4b4b4]">
          Geni can make mistake, Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
