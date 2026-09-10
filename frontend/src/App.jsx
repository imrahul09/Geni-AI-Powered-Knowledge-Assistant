import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/sidebar";
import { MyContext } from "./context/MyContext";
import { v1 as uuidv1 } from "uuid";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); // store all chats of our threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const ProviderValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  }; //passing values

  return (
    <Routes>
      {/* public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MyContext.Provider value={ProviderValues}>
              <div className="flex bg-[#212121]">
                <Sidebar />
                <ChatWindow />
              </div>
            </MyContext.Provider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
